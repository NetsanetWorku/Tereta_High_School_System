'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { studentAPI, teacherAPI, parentAPI, classAPI, subjectAPI, adminAPI, assignmentAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'
import StatsCard from '@/components/StatsCard'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
    classes: 0,
    subjects: 0,
    pendingApprovals: 0,
    assignments: 0
  })
  const [recentStudents, setRecentStudents] = useState([])
  const [recentTeachers, setRecentTeachers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [
        studentsRes,
        teachersRes,
        parentsRes,
        classesRes,
        subjectsRes,
        pendingRes,
        assignmentsRes
      ] = await Promise.all([
        studentAPI.getAll().catch(() => ({ data: [] })),
        teacherAPI.getAll().catch(() => ({ data: [] })),
        parentAPI.getAll().catch(() => ({ data: [] })),
        classAPI.getAll().catch(() => ({ data: [] })),
        subjectAPI.getAll().catch(() => ({ data: [] })),
        adminAPI.getPendingUsers().catch(() => ({ data: [] })),
        assignmentAPI.getAll().catch(() => ({ data: [] }))
      ])

      const students = Array.isArray(studentsRes.data) ? studentsRes.data : 
                      Array.isArray(studentsRes.data?.data) ? studentsRes.data.data : []
      const teachers = Array.isArray(teachersRes.data) ? teachersRes.data : 
                      Array.isArray(teachersRes.data?.data) ? teachersRes.data.data : []
      const parents = Array.isArray(parentsRes.data) ? parentsRes.data : 
                     Array.isArray(parentsRes.data?.data) ? parentsRes.data.data : []
      const classes = Array.isArray(classesRes.data) ? classesRes.data : 
                     Array.isArray(classesRes.data?.data) ? classesRes.data.data : []
      const subjects = Array.isArray(subjectsRes.data) ? subjectsRes.data : 
                      Array.isArray(subjectsRes.data?.data) ? subjectsRes.data.data : []
      const pending = Array.isArray(pendingRes.data) ? pendingRes.data : 
                     Array.isArray(pendingRes.data?.data) ? pendingRes.data.data : []
      const assignments = Array.isArray(assignmentsRes.data) ? assignmentsRes.data : 
                         Array.isArray(assignmentsRes.data?.data) ? assignmentsRes.data.data : []

      setStats({
        students: students.length,
        teachers: teachers.length,
        parents: parents.length,
        classes: classes.length,
        subjects: subjects.length,
        pendingApprovals: pending.length,
        assignments: assignments.length
      })

      // Get recent additions (last 5)
      setRecentStudents(students.slice(-5).reverse())
      setRecentTeachers(teachers.slice(-5).reverse())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => fetchDashboardData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            🔄 Refresh
          </button>
        </div>
        
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Students" 
            value={stats.students} 
            icon="👨‍🎓" 
            color="blue" 
          />
          <StatsCard 
            title="Total Teachers" 
            value={stats.teachers} 
            icon="👨‍🏫" 
            color="green" 
          />
          <StatsCard 
            title="Total Parents" 
            value={stats.parents} 
            icon="👨‍👩‍👧" 
            color="purple" 
          />
          <div onClick={() => router.push('/admin/approvals')} className="cursor-pointer">
            <StatsCard 
              title="Pending Approvals" 
              value={stats.pendingApprovals} 
              icon="⏳" 
              color="yellow" 
            />
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Total Classes" 
            value={stats.classes} 
            icon="🏫" 
            color="indigo" 
          />
          <StatsCard 
            title="Total Subjects" 
            value={stats.subjects} 
            icon="📚" 
            color="pink" 
          />
          <StatsCard 
            title="Total Assignments" 
            value={stats.assignments} 
            icon="📝" 
            color="orange" 
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/admin/students/add')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
            >
              <div className="text-3xl mb-2">➕</div>
              <h3 className="text-lg font-semibold">Add Student</h3>
              <p className="text-sm text-blue-100">Register new student</p>
            </button>
            <button
              onClick={() => router.push('/admin/teachers/add')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
            >
              <div className="text-3xl mb-2">➕</div>
              <h3 className="text-lg font-semibold">Add Teacher</h3>
              <p className="text-sm text-green-100">Register new teacher</p>
            </button>
            <button
              onClick={() => router.push('/admin/classes/add')}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
            >
              <div className="text-3xl mb-2">➕</div>
              <h3 className="text-lg font-semibold">Add Class</h3>
              <p className="text-sm text-purple-100">Create new class</p>
            </button>
            <button
              onClick={() => router.push('/admin/subjects/add')}
              className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
            >
              <div className="text-3xl mb-2">➕</div>
              <h3 className="text-lg font-semibold">Add Subject</h3>
              <p className="text-sm text-pink-100">Create new subject</p>
            </button>
            <button
              onClick={() => router.push('/admin/approvals')}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
            >
              <div className="text-3xl mb-2">⏳</div>
              <h3 className="text-lg font-semibold">Manage Approvals</h3>
              <p className="text-sm text-yellow-100">{stats.pendingApprovals} pending</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Students */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Students</h2>
              <button
                onClick={() => router.push('/admin/students')}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View All →
              </button>
            </div>
            {recentStudents.length > 0 ? (
              <div className="space-y-3">
                {recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {student.user?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.user?.name || 'Student'}</p>
                      <p className="text-sm text-gray-500">{student.class?.name} - {student.class?.section}</p>
                    </div>
                    <button
                      onClick={() => router.push(`/admin/students/edit/${student.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No students yet</p>
            )}
          </div>

          {/* Recent Teachers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Teachers</h2>
              <button
                onClick={() => router.push('/admin/teachers')}
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                View All →
              </button>
            </div>
            {recentTeachers.length > 0 ? (
              <div className="space-y-3">
                {recentTeachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {teacher.name?.charAt(0) || 'T'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{teacher.name || 'Teacher'}</p>
                      <p className="text-sm text-gray-500">{teacher.subject_specialization || 'No specialization'}</p>
                    </div>
                    <button
                      onClick={() => router.push(`/admin/teachers`)}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No teachers yet</p>
            )}
          </div>
        </div>

        {/* Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/admin/students')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">👨‍🎓 Manage Students</h3>
            <p className="text-gray-600">View, edit, and manage all students</p>
            <p className="text-2xl font-bold text-blue-600 mt-3">{stats.students}</p>
          </button>
          <button
            onClick={() => router.push('/admin/teachers')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">👨‍🏫 Manage Teachers</h3>
            <p className="text-gray-600">View, edit, and assign teachers</p>
            <p className="text-2xl font-bold text-green-600 mt-3">{stats.teachers}</p>
          </button>
          <button
            onClick={() => router.push('/admin/parents')}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">👨‍👩‍👧 Manage Parents</h3>
            <p className="text-gray-600">View and link parents to students</p>
            <p className="text-2xl font-bold text-purple-600 mt-3">{stats.parents}</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
