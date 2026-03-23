'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { attendanceAPI, teacherAPI } from '@/lib/api'

export default function MarkAttendancePage() {
  const router = useRouter()
  const [myClasses, setMyClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [notes, setNotes] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchMyClasses()
  }, [])

  const fetchMyClasses = async () => {
    setIsLoading(true)
    try {
      const response = await teacherAPI.getMyClasses()
      const classes = Array.isArray(response.data?.data) ? response.data.data : []
      setMyClasses(classes)
      if (classes.length === 0) {
        toast.error('No classes assigned. Please contact admin to assign you to classes.')
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      toast.error('Failed to load classes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClassChange = (e) => {
    const classId = e.target.value
    const selected = myClasses.find(c => c.class?.id == classId)
    setSelectedClass(selected)
    setStudents(selected?.students || [])
    const initialAttendance = {}
    const initialNotes = {}
    selected?.students?.forEach(student => {
      initialAttendance[student.id] = 'present'
      initialNotes[student.id] = ''
    })
    setAttendance(initialAttendance)
    setNotes(initialNotes)
  }

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedClass) { toast.error('Please select a class'); return }
    if (students.length === 0) { toast.error('No students in this class'); return }
    setIsSaving(true)
    try {
      const promises = students.map(student =>
        attendanceAPI.create({
          student_id: student.id,
          class_id: selectedClass.class.id,
          date: selectedDate,
          status: attendance[student.id] || 'present',
          notes: notes[student.id] || null
        })
      )
      await Promise.all(promises)
      toast.success('Attendance marked successfully')
      router.push('/teacher/attendance')
    } catch (error) {
      console.error('Failed to mark attendance:', error)
      toast.error(error.response?.data?.message || 'Failed to mark attendance')
    } finally {
      setIsSaving(false)
    }
  }

  const statusOptions = [
    { value: 'present', label: 'Present', color: 'text-green-600' },
    { value: 'absent',  label: 'Absent',  color: 'text-red-600'   },
    { value: 'late',    label: 'Late',    color: 'text-yellow-600' },
    { value: 'excused', label: 'Excused', color: 'text-blue-600'  },
  ]

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/teacher/attendance')}
            className="text-blue-600 hover:text-blue-800 mb-4 block"
          >
            ← Back to Attendance
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : myClasses.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-yellow-600 text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-yellow-900 mb-2">No Classes Assigned</h3>
            <p className="text-yellow-700">
              You haven't been assigned to any classes yet. Please contact the administrator.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Class *</label>
                <select
                  required
                  value={selectedClass?.class?.id || ''}
                  onChange={handleClassChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a class</option>
                  {myClasses.map(cls => (
                    <option key={cls.id} value={cls.class?.id}>
                      {cls.class?.name} - {cls.class?.section} ({cls.subject?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {students.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Students ({students.length})</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student, index) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.student_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-3">
                              {statusOptions.map(({ value, label, color }) => (
                                <label key={value} className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`attendance-${student.id}`}
                                    value={value}
                                    checked={attendance[student.id] === value}
                                    onChange={() => handleAttendanceChange(student.id, value)}
                                    className={`form-radio h-4 w-4 ${color}`}
                                  />
                                  <span className={`ml-1 text-sm ${color}`}>{label}</span>
                                </label>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              placeholder="Optional note..."
                              value={notes[student.id] || ''}
                              onChange={(e) => setNotes(prev => ({ ...prev, [student.id]: e.target.value }))}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {students.length > 0 && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/teacher/attendance')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Mark Attendance'}
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}