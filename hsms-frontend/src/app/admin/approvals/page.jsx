'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function ApprovalsPage() {
  const router = useRouter()
  const [pendingUsers, setPendingUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    fetchPending()
  }, [])

  const fetchPending = async () => {
    try {
      const response = await adminAPI.getPendingUsers()
      const data = Array.isArray(response.data?.data) ? response.data.data :
                   Array.isArray(response.data) ? response.data : []
      setPendingUsers(data)
    } catch (error) {
      console.error('Failed to fetch pending users:', error)
      toast.error('Failed to load pending approvals')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id) => {
    setProcessingId(id)
    try {
      await adminAPI.approveUser(id)
      toast.success('User approved successfully')
      setPendingUsers(prev => prev.filter(u => u.id !== id))
    } catch (error) {
      toast.error('Failed to approve user')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this user?')) return
    setProcessingId(id)
    try {
      await adminAPI.rejectUser(id)
      toast.success('User rejected')
      setPendingUsers(prev => prev.filter(u => u.id !== id))
    } catch (error) {
      toast.error('Failed to reject user')
    } finally {
      setProcessingId(null)
    }
  }

  const getRoleBadge = (role) => {
    const colors = {
      teacher: 'bg-green-100 text-green-800',
      student: 'bg-blue-100 text-blue-800',
      parent: 'bg-purple-100 text-purple-800',
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
            <p className="text-gray-600 mt-1">{pendingUsers.length} user(s) waiting for approval</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h2>
            <p className="text-gray-600">No pending approvals at this time.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(user.id)}
                          disabled={processingId === user.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm font-medium"
                        >
                          {processingId === user.id ? '...' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(user.id)}
                          disabled={processingId === user.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm font-medium"
                        >
                          {processingId === user.id ? '...' : '✗ Reject'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}