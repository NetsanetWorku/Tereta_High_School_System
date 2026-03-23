'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { studentAPI, classAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedClassId, setSelectedClassId] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        studentAPI.getAll(),
        classAPI.getAll()
      ])
      
      const studentsData = Array.isArray(studentsRes.data) ? studentsRes.data : 
                          Array.isArray(studentsRes.data?.data) ? studentsRes.data.data : []
      const classesData = Array.isArray(classesRes.data) ? classesRes.data : 
                         Array.isArray(classesRes.data?.data) ? classesRes.data.data : []
      
      setStudents(studentsData)
      setClasses(classesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to fetch data')
      setStudents([])
      setClasses([])
    } finally {
      setIsLoading(false)
    }
  }

  const openAssignModal = (student) => {
    setSelectedStudent(student)
    setSelectedClassId(student.class_id || '')
    setShowAssignModal(true)
  }

  const handleAssignClass = async () => {
    if (!selectedClassId) {
      toast.error('Please select a class')
      return
    }

    setIsAssigning(true)
    try {
      await studentAPI.update(selectedStudent.id, {
        ...selectedStudent,
        class_id: selectedClassId
      })
      
      toast.success('Class assigned successfully')
      setShowAssignModal(false)
      fetchData() // Refresh the list
    } catch (error) {
      console.error('Failed to assign class:', error)
      toast.error('Failed to assign class')
    } finally {
      setIsAssigning(false)
    }
  }

  const filteredStudents = Array.isArray(students) ? students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_code?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    try {
      await studentAPI.delete(id)
      toast.success('Student deleted successfully')
      setStudents(students.filter(s => s.id !== id))
    } catch (error) {
      toast.error('Failed to delete student')
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
        <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
        <button
          onClick={() => router.push('/admin/students/add')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students by name, email, or student code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Students" value={students.length} icon="👨‍🎓" color="green" />
        <StatsCard 
          title="Assigned to Class" 
          value={students.filter(s => s.class_id).length} 
          icon="🏫" 
          color="blue" 
        />
        <StatsCard 
          title="Unassigned" 
          value={students.filter(s => !s.class_id).length} 
          icon="⚠️" 
          color="yellow" 
        />
        <StatsCard 
          title="Total Classes" 
          value={classes.length} 
          icon="📚" 
          color="purple" 
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className={!student.class_id ? 'bg-yellow-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.student_code || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.class ? (
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{student.class.name}</span>
                      {student.class.section && <span className="text-gray-500"> - {student.class.section}</span>}
                    </div>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                      Not Assigned
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.grade || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openAssignModal(student)}
                    className="text-green-600 hover:text-green-900 mr-3"
                    title="Assign Class"
                  >
                    🏫 Assign
                  </button>
                  <button
                    onClick={() => router.push(`/admin/students/edit/${student.id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No students found</p>
          </div>
        )}
      </div>

      {/* Assign Class Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Assign Class</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Student</p>
              <p className="font-medium">{selectedStudent?.name}</p>
              <p className="text-sm text-gray-500">{selectedStudent?.student_code}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} {cls.section ? `- ${cls.section}` : ''} (Grade {cls.grade})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isAssigning}
              >
                Cancel
              </button>
              <button
                onClick={handleAssignClass}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isAssigning}
              >
                {isAssigning ? 'Assigning...' : 'Assign Class'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  )
}
