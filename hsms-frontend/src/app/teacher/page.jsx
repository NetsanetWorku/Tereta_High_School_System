'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { teacherAPI, assignmentAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'
import StatsCard from '@/components/StatsCard'

export default function TeacherDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    pendingSubmissions: 0
  })
  const [myClasses, setMyClasses] = useState([])
  const [recentAssignments, setRecentAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch teacher's classes
      const classesRes = await teacherAPI.getMyClasses().catch(() => ({ data: [] }))
      const classes = Array.isArray(classesRes.data) ? classesRes.data : 
                     Array.isArray(classesRes.data?.data) ? classesRes.data.data : []
      
      setMyClasses(classes)

      // Fetch teacher's assignments
      const assignmentsRes = await assignmentAPI.getTeacherAssignments().catch(() => ({ data: [] }))
      const assignments = Array.isArray(assignmentsRes.data) ? assignmentsRes.data : 
                         Array.isArray(assignmentsRes.data?.data) ? assignmentsRes.data.data : []
      
      setRecentAssignments(assignments.slice(0, 5))

      // Calculate total students across all classes
      const totalStudents = classes.reduce((sum, cls) => {
        return sum + (cls.students_count || cls.students?.length || 0)
      }, 0)

      // Calculate pending submissions
      const pendingSubmissions = assignments.reduce((sum, assignment) => {
        return sum + (assignment.pending_submissions || 0)
      }, 0)

      setStats({
        totalClasses: classes.length,
        totalStudents: totalStudents,
        totalAssignments: assignments.length,
        pendingSubmissions: pendingSubmissions
      })

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="My Classes" 
            value={stats.totalClasses} 
            icon="🏫" 
            color="blue" 
          />
          <StatsCard 
            title="Total Students" 
            value={stats.totalStudents} 
            icon="👨‍🎓" 
            color="green" 
          />
          <StatsCard 
            title="My Assignments" 
            value={stats.totalAssignments} 
            icon="📝" 
            color="purple" 
          />
          <StatsCard 
            title="Pending Submissions" 
            value={stats.pendingSubmissions} 
            icon="⏳" 
            color="yellow" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* My Classes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">My Classes</h2>
                <button
                  onClick={() => router.push('/teacher/classes')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              {myClasses.length > 0 ? (
                <div className="space-y-4">
                  {myClasses.slice(0, 5).map((cls) => (
                    <div 
                      key={cls.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => router.push(`/teacher/classes/${cls.id}/students`)}
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {cls.class_name || cls.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {cls.subject_name || cls.subject?.name || 'Subject'} • Grade {cls.grade || cls.class_grade || '-'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {cls.students_count || cls.students?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500">Students</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No classes assigned yet</p>
                  <p className="text-sm text-gray-400">Contact admin to assign you to classes</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Assignments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Assignments</h2>
                <button
                  onClick={() => router.push('/teacher/assignments')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All →
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentAssignments.length > 0 ? (
                <div className="space-y-4">
                  {recentAssignments.map((assignment) => (
                    <div 
                      key={assignment.id} 
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {assignment.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          new Date(assignment.due_date) < new Date() 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {new Date(assignment.due_date) < new Date() ? 'Overdue' : 'Active'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {assignment.class_room?.name || assignment.class_name || 'Class'}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                          <span className="ml-3">{assignment.submissions_count || 0} submissions</span>
                          {assignment.pending_submissions > 0 && (
                            <span className="ml-2 text-yellow-600 font-medium">{assignment.pending_submissions} to grade</span>
                          )}
                        </div>
                        <button
                          onClick={() => router.push(`/teacher/assignments/${assignment.id}/submissions`)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          ✏️ Grade
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No assignments yet</p>
                  <button
                    onClick={() => router.push('/teacher/assignments/add')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Create your first assignment →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/teacher/assignments/add')}
              className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition text-left"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-semibold">Create Assignment</div>
              <div className="text-sm opacity-90">Add new assignment</div>
            </button>
            <button
              onClick={() => router.push('/teacher/attendance')}
              className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition text-left"
            >
              <div className="text-2xl mb-2">📅</div>
              <div className="font-semibold">Mark Attendance</div>
              <div className="text-sm opacity-90">Take class attendance</div>
            </button>
            <button
              onClick={() => router.push('/teacher/results')}
              className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition text-left"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Enter Results</div>
              <div className="text-sm opacity-90">Add student results</div>
            </button>
            <button
              onClick={() => router.push('/teacher/classes')}
              className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition text-left"
            >
              <div className="text-2xl mb-2">🏫</div>
              <div className="font-semibold">View Classes</div>
              <div className="text-sm opacity-90">See all my classes</div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
