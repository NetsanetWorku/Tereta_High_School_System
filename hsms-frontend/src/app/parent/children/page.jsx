'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { parentAPI, attendanceAPI, resultAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function ParentChildrenPage() {
  const router = useRouter()
  const [children, setChildren] = useState([])
  const [childrenData, setChildrenData] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMyChildren()
  }, [])

  const fetchMyChildren = async () => {
    try {
      const response = await parentAPI.getMyChildren()
      const data = Array.isArray(response.data) ? response.data : 
                   Array.isArray(response.data?.data) ? response.data.data : []
      setChildren(data)
      
      // Fetch data for each child
      if (data.length > 0) {
        await fetchChildrenData(data)
      }
    } catch (error) {
      console.error('Failed to fetch children:', error)
      toast.error('Failed to fetch children')
      setChildren([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChildrenData = async (childrenList) => {
    try {
      const [attendanceRes, resultsRes] = await Promise.all([
        attendanceAPI.getChildAttendance().catch(() => ({ data: [] })),
        resultAPI.getChildResults().catch(() => ({ data: [] }))
      ])

      const attendance = Array.isArray(attendanceRes.data) ? attendanceRes.data : []
      const results = Array.isArray(resultsRes.data) ? resultsRes.data : []

      // Calculate stats for each child
      const dataMap = {}
      childrenList.forEach(child => {
        const childAttendance = attendance.filter(a => a.student_id === child.id)
        const childResults = results.filter(r => r.student_id === child.id)

        const totalAttendance = childAttendance.length
        const presentCount = childAttendance.filter(a => a.status === 'present').length
        const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0

        const totalMarks = childResults.reduce((sum, r) => sum + (parseFloat(r.marks) || 0), 0)
        const averageScore = childResults.length > 0 ? Math.round(totalMarks / childResults.length) : 0

        dataMap[child.id] = {
          attendanceRate,
          averageScore,
          totalResults: childResults.length,
          recentAttendance: childAttendance.slice(-7)
        }
      })

      setChildrenData(dataMap)
    } catch (error) {
      console.error('Failed to fetch children data:', error)
    }
  }

  const viewChildDetails = (childId) => {
    router.push(`/parent?child=${childId}`)
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

  if (children.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Children</h1>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Children Assigned</h2>
            <p className="text-gray-600 mb-6">
              Please contact the school administrator to link your children to your account.
            </p>
            <button
              onClick={() => router.push('/parent')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
          <button
            onClick={() => router.push('/parent')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Children" 
            value={children.length} 
            icon="👨‍👩‍👧‍👦" 
            color="purple" 
          />
          <StatsCard 
            title="Average Attendance" 
            value={`${Math.round(Object.values(childrenData).reduce((sum, d) => sum + d.attendanceRate, 0) / (Object.keys(childrenData).length || 1))}%`}
            icon="📊" 
            color="green" 
          />
          <StatsCard 
            title="Average Score" 
            value={`${Math.round(Object.values(childrenData).reduce((sum, d) => sum + d.averageScore, 0) / (Object.keys(childrenData).length || 1))}%`}
            icon="📈" 
            color="blue" 
          />
        </div>

        {/* Children Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children.map((child) => {
            const data = childrenData[child.id] || { attendanceRate: 0, averageScore: 0, totalResults: 0, recentAttendance: [] }
            
            return (
              <div key={child.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg">
                      {child.user?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">{child.user?.name || 'Student'}</h2>
                      <p className="text-blue-100 text-sm">Student ID: {child.student_code}</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Class Info */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Class</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {child.class?.name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Section</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {child.class?.section || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Grade</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {child.class?.grade || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {child.user?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-2xl font-bold text-green-600">{data.attendanceRate}%</p>
                      <p className="text-xs text-green-700 font-medium">Attendance</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">{data.averageScore}%</p>
                      <p className="text-xs text-blue-700 font-medium">Avg Score</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-2xl font-bold text-purple-600">{data.totalResults}</p>
                      <p className="text-xs text-purple-700 font-medium">Results</p>
                    </div>
                  </div>

                  {/* Recent Attendance */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Last 7 Days Attendance</p>
                    <div className="flex gap-2">
                      {data.recentAttendance.length > 0 ? (
                        data.recentAttendance.map((record, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-semibold ${
                              record.status === 'present' ? 'bg-green-500 text-white' :
                              record.status === 'absent' ? 'bg-red-500 text-white' :
                              'bg-yellow-500 text-white'
                            }`}
                            title={`${new Date(record.date).toLocaleDateString()} - ${record.status}`}
                          >
                            {record.status === 'present' ? '✓' :
                             record.status === 'absent' ? '✗' : '!'}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center w-full py-2">No attendance records</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => viewChildDetails(child.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      View Dashboard
                    </button>
                    <button
                      onClick={() => router.push(`/parent/results?child=${child.id}`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      📊 Results
                    </button>
                    <button
                      onClick={() => router.push(`/parent/attendance?child=${child.id}`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      📅 Attendance
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
