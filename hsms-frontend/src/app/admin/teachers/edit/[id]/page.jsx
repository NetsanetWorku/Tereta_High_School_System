'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { teacherAPI } from '@/lib/api'

export default function EditTeacherPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject_specialization: '',
    qualification: '',
    experience_years: '',
    hire_date: '',
  })

  useEffect(() => {
    fetchTeacher()
  }, [params.id])

  const fetchTeacher = async () => {
    try {
      console.log('Fetching teacher with ID:', params.id)
      const response = await teacherAPI.getById(params.id)
      console.log('Teacher data response:', response.data)
      
      // Handle different response structures
      const teacherData = response.data.data || response.data
      console.log('Extracted teacher data:', teacherData)
      
      // Extract name and email from user relationship if it exists
      const name = teacherData.user?.name || teacherData.name || ''
      const email = teacherData.user?.email || teacherData.email || ''
      
      setFormData({
        name: name,
        email: email,
        subject_specialization: teacherData.subject_specialization || '',
        qualification: teacherData.qualification || '',
        experience_years: teacherData.experience_years || '',
        hire_date: teacherData.hire_date || '',
      })
    } catch (error) {
      console.error('Failed to fetch teacher:', error)
      toast.error('Failed to fetch teacher')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await teacherAPI.update(params.id, formData)
      toast.success('Teacher updated successfully')
      router.push('/admin/teachers')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update teacher')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Teacher</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              required
              name="subject_specialization"
              value={formData.subject_specialization}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Qualification</label>
            <input
              required
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
            <input
              required
              type="number"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hire Date</label>
            <input
              required
              type="date"
              name="hire_date"
              value={formData.hire_date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/teachers')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Teacher'}
          </button>
        </div>
      </form>
      </div>
    </DashboardLayout>
  )
}
