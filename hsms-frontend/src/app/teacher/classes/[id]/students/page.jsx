'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { teacherAPI } from '@/lib/api'

export default function ClassStudentsPage() {
  const router = useRouter()
  const params = useParams()
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchClassStudents()
  }, [])

  const fetchClassStudents = async () => {
    try {
      const response = await teacherAPI.getMyClasses()
      const classes = Array.isArray(response.data?.data) ? response.data.data : []

      // Match by class.id (the classroom ID used in the URL)
      const targetClass = classes.find(c => c.class?.id == params.id)

      if (targetClass) {
        setClassInfo(targetClass)
        setStudents(targetClass.students || [])
      } else {
        toast.error('Class not found')
        router.push('/teacher/classes')
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
      toast.error('Failed to load students')
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
        <div className="mb-6">
          <button
            onClick={() => router.push('/teacher/classes')}
            className="text-blue-600 hover:text-blue-800 mb-4 block"
          >
            ← Back to Classes
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {classInfo?.class?.name} {classInfo?.class?.section && `- ${classInfo.class.section}`}
          </h1>
          <p className="text-gray-600 mt-1">
            Subject: {classInfo?.subject?.name} {classInfo?.subject?.code && `(${classInfo.subject.code})`}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {students.length} student{students.length !== 1 ? 's' : ''} enrolled
          </p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.student_id || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                    <button
                      onClick={() => router.push(`/teacher/attendance?student=${student.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Attendance
                    </button>
                    <button
                      onClick={() => router.push(`/teacher/results?student=${student.id}`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-5xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">No students in this class yet</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
