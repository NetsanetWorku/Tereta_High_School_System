'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { teacherAPI, classAPI, subjectAPI, adminAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function TeachersPage() {
  const router = useRouter()
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [assignmentData, setAssignmentData] = useState({
    teacher_id: '',
    class_id: '',
    subject_id: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [teachersRes, classesRes, subjectsRes, assignmentsRes] = await Promise.all([
        teacherAPI.getAll(),
        classAPI.getAll(),
        subjectAPI.getAll(),
        adminAPI.getTeacherAssignments()
      ])
      
      const teachersData = Array.isArray(teachersRes.data) ? teachersRes.data : 
                          Array.isArray(teachersRes.data?.data) ? teachersRes.data.data : []
      const classesData = Array.isArray(classesRes.data) ? classesRes.data : 
                         Array.isArray(classesRes.data?.data) ? classesRes.data.data : []
      const subjectsData = Array.isArray(subjectsRes.data) ? subjectsRes.data : 
                          Array.isArray(subjectsRes.data?.data) ? subjectsRes.data.data : []
      const assignmentsData = Array.isArray(assignmentsRes.data) ? assignmentsRes.data : 
                             Array.isArray(assignmentsRes.data?.data) ? assignmentsRes.data.data : []
      
      setTeachers(teachersData)
      setClasses(classesData)
      setSubjects(subjectsData)
      setAssignments(assignmentsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to fetch data')
      setTeachers([])
      setClasses([])
      setSubjects([])
      setAssignments([])
    } finally {
      setIsLoading(false)
    }
  }

  const getTeacherAssignments = (teacherId) => {
    return assignments.filter(a => a.teacher_id === teacherId)
  }

  const filteredTeachers = Array.isArray(teachers) ? teachers.filter(teacher =>
    teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return
    
    try {
      await teacherAPI.delete(id)
      toast.success('Teacher deleted successfully')
      setTeachers(teachers.filter(t => t.id !== id))
    } catch (error) {
      toast.error('Failed to delete teacher')
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await adminAPI.assignTeacher(assignmentData)
      toast.success('Teacher assigned successfully')
      setShowAssignModal(false)
      setAssignmentData({ teacher_id: '', class_id: '', subject_id: '' })
      fetchData()
    } catch (error) {
      console.error('Assign error:', error)
      toast.error(error.response?.data?.message || 'Failed to assign teacher')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveAssignment = async (assignmentId) => {
    if (!confirm('Remove this assignment?')) return
    
    try {
      await adminAPI.removeTeacherAssignment(assignmentId)
      toast.success('Assignment removed successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to remove assignment')
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teachers Management</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Assign to Class
            </button>
            <button
              onClick={() => router.push('/admin/teachers/add')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Teacher
            </button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Teachers" value={teachers.length} icon="👩‍🏫" color="blue" />
          <StatsCard title="Total Assignments" value={assignments.length} icon="📋" color="green" />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Classes</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => {
                const teacherAssignments = getTeacherAssignments(teacher.id)
                return (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{teacher.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{teacher.subject_specialization || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {teacherAssignments.length > 0 ? (
                        <div className="text-sm">
                          {teacherAssignments.map((assignment) => (
                            <div key={assignment.id} className="mb-1 flex items-center justify-between bg-blue-50 px-2 py-1 rounded">
                              <span>
                                <span className="font-medium text-blue-900">{assignment.subject?.name}</span>
                                <span className="text-blue-600 text-xs ml-2">
                                  ({assignment.class_room?.name})
                                </span>
                              </span>
                              <button
                                onClick={() => handleRemoveAssignment(assignment.id)}
                                className="text-red-500 hover:text-red-700 ml-2"
                                title="Remove assignment"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No assignments</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/teachers/edit/${teacher.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredTeachers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No teachers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Teacher Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Assign Teacher to Class</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAssign} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Teacher *</label>
                  <select
                    required
                    value={assignmentData.teacher_id}
                    onChange={(e) => setAssignmentData({...assignmentData, teacher_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Choose a teacher...</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.subject_specialization || 'No specialization'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Class *</label>
                  <select
                    required
                    value={assignmentData.class_id}
                    onChange={(e) => setAssignmentData({...assignmentData, class_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Choose a class...</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject *</label>
                  <select
                    required
                    value={assignmentData.subject_id}
                    onChange={(e) => setAssignmentData({...assignmentData, subject_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Choose a subject...</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
