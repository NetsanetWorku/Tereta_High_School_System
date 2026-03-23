'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { assignmentAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function TeacherAssignmentsPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await assignmentAPI.getTeacherAssignments()
      
      const assignmentsData = Array.isArray(response.data) ? response.data : 
                             Array.isArray(response.data?.data) ? response.data.data : []
      
      setAssignments(assignmentsData)
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
      
      if (error.response?.status === 404) {
        toast.error('Assignments table not found. Please contact administrator.')
      } else if (error.response?.status === 500) {
        toast.error('Server error. The assignments table may not exist.')
      } else {
        toast.error('Failed to fetch assignments')
      }
      setAssignments([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAssignments = Array.isArray(assignments) ? assignments.filter(assignment =>
    assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return
    
    try {
      await assignmentAPI.delete(id)
      toast.success('Assignment deleted successfully')
      setAssignments(assignments.filter(a => a.id !== id))
    } catch (error) {
      toast.error('Failed to delete assignment')
    }
  }

  const getStatusBadge = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    
    if (due < now) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>
    } else if ((due - now) / (1000 * 60 * 60 * 24) <= 3) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Due Soon</span>
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <button
            onClick={() => router.push('/teacher/assignments/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Assignment
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Assignments" value={assignments.length} icon="📝" color="blue" />
          <StatsCard 
            title="Active" 
            value={assignments.filter(a => new Date(a.due_date) >= new Date()).length} 
            icon="✅" 
            color="green" 
          />
          <StatsCard 
            title="Overdue" 
            value={assignments.filter(a => new Date(a.due_date) < new Date()).length} 
            icon="⚠️" 
            color="red" 
          />
          <StatsCard 
            title="Pending Review" 
            value={assignments.reduce((sum, a) => sum + (a.pending_submissions || 0), 0)} 
            icon="📋" 
            color="yellow" 
          />
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{assignment.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assignment.class_room?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assignment.subject?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(assignment.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(assignment.due_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assignment.submissions_count || 0} / {assignment.total_students || 0}
                    </div>
                    {assignment.pending_submissions > 0 && (
                      <div className="text-xs text-yellow-600">
                        {assignment.pending_submissions} pending review
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/teacher/assignments/${assignment.id}/submissions`)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Grade
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/assignments/edit/${assignment.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No assignments found</p>
              <button
                onClick={() => router.push('/teacher/assignments/add')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Create your first assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
