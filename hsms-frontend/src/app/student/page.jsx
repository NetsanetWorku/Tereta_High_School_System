'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { resultAPI, attendanceAPI, assignmentAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function StudentDashboard() {
  const router = useRouter()
  const [results, setResults] = useState([])
  const [attendance, setAttendance] = useState([])
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [resultsRes, attendanceRes, assignmentsRes] = await Promise.all([
        resultAPI.getMyResults().catch(() => ({ data: [] })),
        attendanceAPI.getMyAttendance().catch(() => ({ data: [] })),
        assignmentAPI.getMyAssignments().catch(() => ({ data: [] }))
      ])

      setResults(Array.isArray(resultsRes.data) ? resultsRes.data : [])
      setAttendance(Array.isArray(attendanceRes.data) ? attendanceRes.data : [])
      setAssignments(Array.isArray(assignmentsRes.data) ? assignmentsRes.data : [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate statistics
  const calculateStats = () => {
    // Attendance rate
    const totalAttendance = attendance.length
    const presentCount = attendance.filter(a => a.status === 'present').length
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0

    // Average score
    const totalMarks = results.reduce((sum, r) => sum + (parseFloat(r.marks) || 0), 0)
    const averageScore = results.length > 0 ? Math.round(totalMarks / results.length) : 0

    // Pending assignments
    const pendingAssignments = assignments.filter(a => !a.submission || a.submission.status === 'pending').length

    // Results by type
    const assignmentResults = results.filter(r => r.exam_type === 'assignment')
    const testResults = results.filter(r => r.exam_type === 'test')
    const midtermResults = results.filter(r => r.exam_type === 'midterm')
    const finalResults = results.filter(r => r.exam_type === 'final')

    const avgAssignment = assignmentResults.length > 0 
      ? Math.round(assignmentResults.reduce((sum, r) => sum + parseFloat(r.marks), 0) / assignmentResults.length) 
      : 0
    const avgTest = testResults.length > 0 
      ? Math.round(testResults.reduce((sum, r) => sum + parseFloat(r.marks), 0) / testResults.length) 
      : 0
    const avgMidterm = midtermResults.length > 0 
      ? Math.round(midtermResults.reduce((sum, r) => sum + parseFloat(r.marks), 0) / midtermResults.length) 
      : 0
    const avgFinal = finalResults.length > 0 
      ? Math.round(finalResults.reduce((sum, r) => sum + parseFloat(r.marks), 0) / finalResults.length) 
      : 0

    return {
      attendanceRate,
      averageScore,
      pendingAssignments,
      avgAssignment,
      avgTest,
      avgMidterm,
      avgFinal
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="student">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const stats = calculateStats()

  return (
    <DashboardLayout requiredRole="student">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
        
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
            title="Total Results" 
            value={results.length} 
            icon="🎯" 
            color="purple" 
          />
        </div>

        {/* Results by Type */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance by Assessment Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-900">Assignments</h3>
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.avgAssignment}%</p>
              <p className="text-sm text-blue-700 mt-1">
                {results.filter(r => r.exam_type === 'assignment').length} completed
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-900">Tests</h3>
                <span className="text-2xl">📄</span>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.avgTest}%</p>
              <p className="text-sm text-green-700 mt-1">
                {results.filter(r => r.exam_type === 'test').length} completed
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-yellow-900">Midterms</h3>
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{stats.avgMidterm}%</p>
              <p className="text-sm text-yellow-700 mt-1">
                {results.filter(r => r.exam_type === 'midterm').length} completed
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-purple-900">Finals</h3>
                <span className="text-2xl">🎓</span>
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.avgFinal}%</p>
              <p className="text-sm text-purple-700 mt-1">
                {results.filter(r => r.exam_type === 'final').length} completed
              </p>
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Results</h2>
            <button
              onClick={() => router.push('/student/results')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </button>
          </div>
          {results.length > 0 ? (
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
                  {results.slice(0, 5).map((result) => (
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/student/attendance')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📅 View Attendance</h3>
            <p className="text-gray-600">Check your attendance records</p>
          </button>
          <button
            onClick={() => router.push('/student/results')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 View All Results</h3>
            <p className="text-gray-600">See detailed results breakdown</p>
          </button>
          <button
            onClick={() => router.push('/student/assignments')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Assignments</h3>
            <p className="text-gray-600">View and submit assignments</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
