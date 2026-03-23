'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { parentAPI, attendanceAPI, resultAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'
import StatsCard from '@/components/StatsCard'

export default function ParentDashboard() {
  const router = useRouter()
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [childAttendance, setChildAttendance] = useState([])
  const [childResults, setChildResults] = useState([])
  const [childAssignments, setChildAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChildren()
  }, [])

  useEffect(() => {
    if (selectedChild) {
      fetchChildData(selectedChild.id)
    }
  }, [selectedChild])

  const fetchChildren = async () => {
    try {
      const response = await parentAPI.getMyChildren()
      const childrenData = Array.isArray(response.data?.data) ? response.data.data :
                         Array.isArray(response.data) ? response.data : []
      setChildren(childrenData)
      
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0])
      }
    } catch (error) {
      console.error('Failed to fetch children:', error)
      toast.error('Failed to load children data')
      setChildren([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChildData = async (studentId) => {
    try {
      const [attendanceRes, resultsRes, assignmentsRes] = await Promise.all([
        attendanceAPI.getChildAttendance().catch(() => ({ data: [] })),
        resultAPI.getChildResults().catch(() => ({ data: [] })),
        parentAPI.getChildAssignments(studentId).catch(() => ({ data: [] }))
      ])

      // Filter data for selected child
      const attendance = Array.isArray(attendanceRes.data) ? attendanceRes.data : []
      const results = Array.isArray(resultsRes.data) ? resultsRes.data : []
      const assignments = Array.isArray(assignmentsRes.data) ? assignmentsRes.data : []

      setChildAttendance(attendance.filter(a => a.student_id === studentId))
      setChildResults(results.filter(r => r.student_id === studentId))
      setChildAssignments(assignments)
    } catch (error) {
      console.error('Failed to fetch child data:', error)
    }
  }

  const calculateStats = () => {
    if (!selectedChild) {
      return {
        attendanceRate: 0,
        averageScore: 0,
        pendingAssignments: 0,
        totalAssignments: 0
      }
    }

    // Attendance rate
    const totalAttendance = childAttendance.length
    const presentCount = childAttendance.filter(a => a.status === 'present').length
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0

    // Average score
    const totalMarks = childResults.reduce((sum, r) => sum + (parseFloat(r.marks) || 0), 0)
    const averageScore = childResults.length > 0 ? Math.round(totalMarks / childResults.length) : 0

    // Assignments
    const pendingAssignments = childAssignments.filter(a => 
      !a.submission || a.submission.status === 'pending'
    ).length
    const totalAssignments = childAssignments.length

    return {
      attendanceRate,
      averageScore,
      pendingAssignments,
      totalAssignments
    }
  }

  const getPerformanceByType = () => {
    const types = ['assignment', 'test', 'midterm', 'final']
    return types.map(type => {
      const filtered = childResults.filter(r => r.exam_type === type)
      const avg = filtered.length > 0 
        ? Math.round(filtered.reduce((sum, r) => sum + parseFloat(r.marks), 0) / filtered.length)
        : 0
      return { type, average: avg, count: filtered.length }
    })
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="parent">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (children.length === 0) {
    return (
      <DashboardLayout requiredRole="parent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Parent Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Children Assigned</h2>
            <p className="text-gray-600 mb-6">
              Please contact the school administrator to link your children to your account.
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const stats = calculateStats()
  const performanceByType = getPerformanceByType()

  return (
    <DashboardLayout requiredRole="parent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <button
            onClick={() => router.push('/parent/children')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View All Children
          </button>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Child to View Details:
            </label>
            <div className="flex flex-wrap gap-3">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    selectedChild?.id === child.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {child.user?.name || 'Student'}
                  <span className="ml-2 text-sm opacity-75">
                    ({child.class?.name} - {child.class?.section})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Child Info */}
        {selectedChild && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 mb-6 border border-blue-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedChild.user?.name?.charAt(0) || 'S'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{selectedChild.user?.name}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Student ID:</span> {selectedChild.student_code}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Class:</span> {selectedChild.class?.name} - {selectedChild.class?.section}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium">Grade:</span> {selectedChild.class?.grade}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Attendance Rate" 
            value={`${stats.attendanceRate}%`} 
            icon="📊" 
            color="green" 
          />
          <StatsCard 
            title="Overall Average" 
            value={`${stats.averageScore}%`} 
            icon="📈" 
            color="blue" 
          />
          <StatsCard 
            title="Pending Assignments" 
            value={stats.pendingAssignments} 
            icon="📝" 
            color="yellow" 
          />
          <StatsCard 
            title="Total Assignments" 
            value={stats.totalAssignments} 
            icon="📚" 
            color="purple" 
          />
        </div>

        {/* Performance by Assessment Type */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Academic Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceByType.map((item) => (
              <div 
                key={item.type}
                className={`p-6 rounded-lg shadow border ${
                  item.type === 'assignment' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' :
                  item.type === 'test' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' :
                  item.type === 'midterm' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' :
                  'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-semibold ${
                    item.type === 'assignment' ? 'text-blue-900' :
                    item.type === 'test' ? 'text-green-900' :
                    item.type === 'midterm' ? 'text-yellow-900' :
                    'text-purple-900'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}s
                  </h3>
                  <span className="text-2xl">
                    {item.type === 'assignment' ? '📝' :
                     item.type === 'test' ? '📄' :
                     item.type === 'midterm' ? '📋' : '🎓'}
                  </span>
                </div>
                <p className={`text-3xl font-bold ${
                  item.type === 'assignment' ? 'text-blue-600' :
                  item.type === 'test' ? 'text-green-600' :
                  item.type === 'midterm' ? 'text-yellow-600' :
                  'text-purple-600'
                }`}>
                  {item.average}%
                </p>
                <p className={`text-sm mt-1 ${
                  item.type === 'assignment' ? 'text-blue-700' :
                  item.type === 'test' ? 'text-green-700' :
                  item.type === 'midterm' ? 'text-yellow-700' :
                  'text-purple-700'
                }`}>
                  {item.count} completed
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Results</h2>
            <button
              onClick={() => router.push('/parent/results')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </button>
          </div>
          {childResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {childResults.slice(0, 5).map((result) => (
                    <tr key={result.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{result.subject?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.exam_type === 'assignment' ? 'bg-blue-100 text-blue-800' :
                          result.exam_type === 'test' ? 'bg-green-100 text-green-800' :
                          result.exam_type === 'midterm' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {result.exam_type || 'test'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{result.exam_name || '-'}</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">{result.marks}%</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{result.grade || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No results available yet</p>
          )}
        </div>

        {/* Recent Attendance */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Attendance</h2>
            <button
              onClick={() => router.push('/parent/attendance')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </button>
          </div>
          {childAttendance.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {childAttendance.slice(0, 14).reverse().map((record) => (
                <div
                  key={record.id}
                  className={`p-3 rounded-lg text-center ${
                    record.status === 'present' ? 'bg-green-100 border border-green-300' :
                    record.status === 'absent' ? 'bg-red-100 border border-red-300' :
                    'bg-yellow-100 border border-yellow-300'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {record.status === 'present' ? '✅' :
                     record.status === 'absent' ? '❌' : '⚠️'}
                  </div>
                  <div className="text-xs font-medium text-gray-700">
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className={`text-xs font-semibold mt-1 ${
                    record.status === 'present' ? 'text-green-700' :
                    record.status === 'absent' ? 'text-red-700' :
                    'text-yellow-700'
                  }`}>
                    {record.status}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">No attendance records yet</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/parent/attendance')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📅 View Attendance</h3>
            <p className="text-gray-600">Check detailed attendance records</p>
          </button>
          <button
            onClick={() => router.push('/parent/results')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 View Results</h3>
            <p className="text-gray-600">See all academic results</p>
          </button>
          <button
            onClick={() => router.push('/parent/children')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">👨‍👩‍👧 My Children</h3>
            <p className="text-gray-600">View all children details</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
