'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { teacherAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function TeacherClassesPage() {
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMyClasses()
  }, [])

  const fetchMyClasses = async () => {
    try {
      const response = await teacherAPI.getMyClasses()
      const classesData = Array.isArray(response.data?.data) ? response.data.data :
                         Array.isArray(response.data) ? response.data : []
      setClasses(classesData)
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      toast.error('Failed to fetch classes')
      setClasses([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Classes</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Classes" value={classes.length} icon="🏫" color="blue" />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cls.class?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {cls.class?.section || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{cls.subject?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{cls.subject?.code || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {cls.students?.length || 0} students
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => router.push(`/teacher/classes/${cls.class?.id}/students`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/classes/${cls.class?.id}/students`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {classes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">No classes assigned yet</p>
              <p className="text-gray-400 text-sm mt-2">Contact the administrator to get classes assigned to you</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}