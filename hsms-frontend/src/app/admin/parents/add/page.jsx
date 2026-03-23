'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { parentAPI, studentAPI } from '@/lib/api'

export default function AddParentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    occupation: '',
    address: '',
    emergency_contact: '',
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll()
      const studentsData = Array.isArray(response.data) ? response.data : (response.data.data || [])
      setStudents(studentsData)
    } catch (error) {
      console.error('Failed to fetch students:', error)
      toast.error('Failed to load students')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId)
      } else {
        return [...prev, studentId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Creating parent with data:', formData)
      
      // Create parent
      const response = await parentAPI.create(formData)
      console.log('Create response:', response)
      
      const parentId = response.data.data?.id || response.data.id
      
      // Assign selected students to parent
      if (selectedStudents.length > 0 && parentId) {
        console.log('Assigning students:', selectedStudents)
        for (const studentId of selectedStudents) {
          try {
            await parentAPI.assignStudent({
              parent_id: parentId,
              student_id: studentId
            })
          } catch (error) {
            console.error(`Failed to assign student ${studentId}:`, error)
          }
        }
        toast.success(`Parent created and ${selectedStudents.length} student(s) assigned successfully`)
      } else {
        toast.success('Parent created successfully')
      }
      
      router.push('/admin/parents')
    } catch (error) {
      console.error('Create error:', error)
      console.error('Error response:', error.response?.data)
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        Object.keys(errors).forEach(key => {
          errors[key].forEach(msg => toast.error(msg))
        })
      } else {
        toast.error(error.response?.data?.message || 'Failed to create parent')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Parent</h1>
      
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parent Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Parent Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="parent@example.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  minLength="6"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                <input
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                <input
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g., Engineer, Teacher"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Full address"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Assign Students */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assign Students (Optional)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select the students that this parent is responsible for. You can also assign students later.
            </p>
            
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No students available</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Select
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr 
                        key={student.id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedStudents.includes(student.id) ? 'bg-purple-50' : ''
                        }`}
                        onClick={() => handleStudentToggle(student.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentToggle(student.id)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.student_code || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.class_name || 'Not assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.grade || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {selectedStudents.length > 0 && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <p className="text-sm text-purple-800">
                  <span className="font-semibold">{selectedStudents.length}</span> student(s) selected
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/parents')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {isLoading ? 'Creating...' : 'Create Parent'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
