'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { teacherAPI, resultAPI } from '@/lib/api'

export default function AddResultsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [classes, setClasses] = useState([])
  const [allAssignments, setAllAssignments] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [examType, setExamType] = useState('assignment')

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  useEffect(() => { fetchTeacherData() }, [])

  // When class changes, update students and filter subjects for that class
  useEffect(() => {
    if (!selectedClass || allAssignments.length === 0) {
      setStudents([])
      return
    }
    // Find the assignment entry for this class to get its students
    const assignment = allAssignments.find(a => String(a.class?.id) === String(selectedClass))
    if (assignment) {
      setStudents(assignment.students || [])
      // Filter subjects available for this class
      const classSubjects = allAssignments
        .filter(a => String(a.class?.id) === String(selectedClass))
        .map(a => a.subject)
        .filter(Boolean)
      const unique = []
      const seen = new Set()
      classSubjects.forEach(s => { if (!seen.has(s.id)) { seen.add(s.id); unique.push(s) } })
      setSubjects(unique)
      if (unique.length > 0) setSelectedSubject(String(unique[0].id))
    }
  }, [selectedClass, allAssignments])

  const fetchTeacherData = async () => {
    try {
      const res = await teacherAPI.getMyClasses()
      const teacherClasses = Array.isArray(res.data?.data) ? res.data.data :
                             Array.isArray(res.data) ? res.data : []

      if (teacherClasses.length === 0) {
        toast.error('No classes assigned. Contact admin to assign you to classes.')
        return
      }

      setAllAssignments(teacherClasses)

      // Unique classes
      const uniqueClasses = []
      const classIds = new Set()
      teacherClasses.forEach(a => {
        if (a.class?.id && !classIds.has(a.class.id)) {
          classIds.add(a.class.id)
          uniqueClasses.push(a.class)
        }
      })
      setClasses(uniqueClasses)

      // Set first class
      if (uniqueClasses.length > 0) setSelectedClass(String(uniqueClasses[0].id))
    } catch (error) {
      console.error('fetchTeacherData error:', error.response?.status, error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to load classes. Please try again.')
    }
  }

  const calculateGrade = (marks) => {
    const m = parseFloat(marks)
    if (m >= 90) return 'A'
    if (m >= 80) return 'B'
    if (m >= 70) return 'C'
    if (m >= 60) return 'D'
    if (m >= 50) return 'E'
    return 'F'
  }

  const onSubmit = async (data) => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select a class and subject')
      return
    }
    const toSubmit = students.filter(s => data[`marks_${s.id}`] !== undefined && data[`marks_${s.id}`] !== '')
    if (toSubmit.length === 0) {
      toast.error('Enter marks for at least one student')
      return
    }
    setIsLoading(true)
    try {
      for (const student of toSubmit) {
        const marks = data[`marks_${student.id}`]
        await resultAPI.create({
          student_id: student.id,
          subject_id: parseInt(selectedSubject),
          exam_type: examType,
          marks: parseFloat(marks),
          grade: calculateGrade(marks)
        })
      }
      toast.success('Results saved successfully')
      router.push('/teacher/results')
    } catch (error) {
      console.error('onSubmit error:', error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Failed to save results')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button onClick={() => router.push('/teacher/results')} className="text-sm text-gray-500 hover:text-gray-700 mb-2">
            ← Back to Results
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Enter Results</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} {cls.section || ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="assignment">Assignment</option>
                  <option value="test">Test</option>
                  <option value="midterm">Midterm</option>
                  <option value="final">Final Exam</option>
                </select>
              </div>
            </div>

            {selectedClass && students.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks (0-100)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          {student.name || 'Student'}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">{student.student_id}</td>
                        <td className="px-6 py-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            {...register(`marks_${student.id}`, {
                              min: { value: 0, message: 'Min 0' },
                              max: { value: 100, message: 'Max 100' }
                            })}
                            className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0-100"
                          />
                          {errors[`marks_${student.id}`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`marks_${student.id}`]?.message}</p>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          {watch(`marks_${student.id}`) !== undefined && watch(`marks_${student.id}`) !== '' ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {calculateGrade(watch(`marks_${student.id}`))}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedClass && students.length === 0 && (
              <p className="text-center text-gray-500 py-8">No students found in this class</p>
            )}

            {!selectedClass && (
              <p className="text-center text-gray-400 py-8">Select a class to see students</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push('/teacher/results')}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !selectedClass || !selectedSubject || students.length === 0}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Results'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}