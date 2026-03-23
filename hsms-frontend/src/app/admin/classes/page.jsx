'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { classAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function ClassesPage() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await classAPI.getAll()
      const classesData = Array.isArray(response.data) ? response.data : 
                         Array.isArray(response.data?.data) ? response.data.data : []
      setClasses(classesData)
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      toast.error('Failed to fetch classes')
      setClasses([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredClasses = Array.isArray(classes) ? classes.filter(cls =>
    cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.section?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    
    try {
      await classAPI.delete(id)
      toast.success('Class deleted successfully')
      setClasses(classes.filter(c => c.id !== id))
    } catch (error) {
      toast.error('Failed to delete class')
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
          <h1 className="text-3xl font-bold text-gray-900">Classes Management</h1>
        <button
          onClick={() => router.push('/admin/classes/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Class
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Classes" value={classes.length} icon="🏫" color="red" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClasses.map((cls) => (
              <tr key={cls.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{cls.section}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{cls.capacity || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => router.push(`/admin/classes/edit/${cls.id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No classes found</p>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  )
}
