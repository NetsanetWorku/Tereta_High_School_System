'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { subjectAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function SubjectsPage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await subjectAPI.getAll()
      const subjectsData = Array.isArray(response.data) ? response.data : 
                          Array.isArray(response.data?.data) ? response.data.data : []
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Failed to fetch subjects:', error)
      toast.error('Failed to fetch subjects')
      setSubjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSubjects = Array.isArray(subjects) ? subjects.filter(subject =>
    subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return
    
    try {
      await subjectAPI.delete(id)
      toast.success('Subject deleted successfully')
      setSubjects(subjects.filter(s => s.id !== id))
    } catch (error) {
      toast.error('Failed to delete subject')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Subjects Management</h1>
        <button
          onClick={() => router.push('/admin/subjects/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Subject
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Subjects" value={subjects.length} icon="📚" color="green" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubjects.map((subject) => (
              <tr key={subject.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{subject.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{subject.credits || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => router.push(`/admin/subjects/edit/${subject.id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No subjects found</p>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  )
}
