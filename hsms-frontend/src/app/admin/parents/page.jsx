'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { parentAPI, studentAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function ParentsPage() {
  const router = useRouter()
  const [parents, setParents] = useState([])
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedParentId, setSelectedParentId] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [newParentData, setNewParentData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    occupation: '',
    address: '',
    emergency_contact: '',
  })

  useEffect(() => {
    fetchParents()
    fetchStudents()
  }, [])

  const fetchParents = async () => {
    try {
      const response = await parentAPI.getAll()
      const parentsData = Array.isArray(response.data) ? response.data : 
                         Array.isArray(response.data?.data) ? response.data.data : []
      setParents(parentsData)
    } catch (error) {
      console.error('Failed to fetch parents:', error)
      toast.error('Failed to fetch parents')
      setParents([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll()
      const studentsData = Array.isArray(response.data) ? response.data : (response.data.data || [])
      setStudents(studentsData)
    } catch (error) {
      console.error('Failed to fetch students:', error)
    }
  }

  const filteredParents = Array.isArray(parents) ? parents.filter(parent =>
    parent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this parent?')) return
    
    try {
      await parentAPI.delete(id)
      toast.success('Parent deleted successfully')
      setParents(parents.filter(p => p.id !== id))
    } catch (error) {
      toast.error('Failed to delete parent')
    }
  }

  const handleAddParent = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await parentAPI.create(newParentData)
      toast.success('Parent created successfully')
      setShowAddModal(false)
      setNewParentData({
        name: '',
        email: '',
        password: '',
        phone: '',
        occupation: '',
        address: '',
        emergency_contact: '',
      })
      fetchParents()
    } catch (error) {
      console.error('Create error:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        Object.keys(errors).forEach(key => {
          errors[key].forEach(msg => toast.error(msg))
        })
      } else {
        toast.error(error.response?.data?.message || 'Failed to create parent')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssignStudent = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await parentAPI.assignStudent({
        parent_id: selectedParentId,
        student_id: selectedStudentId
      })
      toast.success('Student assigned to parent successfully')
      setShowAssignModal(false)
      setSelectedParentId('')
      setSelectedStudentId('')
      fetchParents()
    } catch (error) {
      console.error('Assign error:', error)
      toast.error(error.response?.data?.message || 'Failed to assign student')
    } finally {
      setIsSubmitting(false)
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
          <h1 className="text-3xl font-bold text-gray-900">Parents Management</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Assign Student
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Add New Parent
            </button>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search parents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Parents" value={parents.length} icon="👨‍👩‍👧‍👦" color="purple" />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Children</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParents.map((parent) => (
                <tr key={parent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{parent.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{parent.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{parent.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{parent.occupation || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {parent.students && parent.students.length > 0 ? (
                      <div className="text-sm text-gray-900">
                        {parent.students.map((student, index) => (
                          <div key={student.id} className="mb-1">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-gray-500 text-xs ml-2">
                              ({student.class_name || 'No class'})
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">No children assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/parents/edit/${parent.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(parent.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredParents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No parents found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
              >
                Add your first parent
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Parent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Parent</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAddParent} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    required
                    value={newParentData.name}
                    onChange={(e) => setNewParentData({...newParentData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    value={newParentData.email}
                    onChange={(e) => setNewParentData({...newParentData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    required
                    type="password"
                    minLength="6"
                    value={newParentData.password}
                    onChange={(e) => setNewParentData({...newParentData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    required
                    value={newParentData.phone}
                    onChange={(e) => setNewParentData({...newParentData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    value={newParentData.occupation}
                    onChange={(e) => setNewParentData({...newParentData, occupation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  <input
                    value={newParentData.emergency_contact}
                    onChange={(e) => setNewParentData({...newParentData, emergency_contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    rows="3"
                    value={newParentData.address}
                    onChange={(e) => setNewParentData({...newParentData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Parent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Assign Student to Parent</h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleAssignStudent} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Parent *</label>
                  <select
                    required
                    value={selectedParentId}
                    onChange={(e) => setSelectedParentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Choose a parent...</option>
                    {parents.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name} ({parent.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
                  <select
                    required
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Choose a student...</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.student_code} ({student.class_name || 'No class'})
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
                  {isSubmitting ? 'Assigning...' : 'Assign Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
