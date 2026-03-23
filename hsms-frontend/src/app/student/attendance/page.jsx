'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { attendanceAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function StudentAttendancePage() {
  const router = useRouter()
  const [attendance, setAttendance] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMyAttendance()
  }, [])

  const fetchMyAttendance = async () => {
    try {
      const response = await attendanceAPI.getMyAttendance()
      // Ensure we always have an array
      const data = Array.isArray(response.data) ? response.data : 
                   Array.isArray(response.data?.data) ? response.data.data : []
      setAttendance(data)
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
      toast.error('Failed to fetch attendance')
      setAttendance([])
      setResults([])
      setChildren([])
    } finally {
      setIsLoading(false)
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Attendance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Days" value={attendance.length} icon="📅" color="blue" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendance.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    record.status === 'present' ? 'bg-green-100 text-green-800' :
                    record.status === 'absent' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{record.notes || '-'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {attendance.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No attendance records found</p>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  )
}


