'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { classAPI } from '@/lib/api'

export default function EditClassPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    grade: '9',
    section: 'A',
    capacity: '40',
  })

  useEffect(() => {
    fetchClass()
  }, [params.id])

  const fetchClass = async () => {
    try {
      console.log('Fetching class with ID:', params.id)
      const response = await classAPI.getById(params.id)
      console.log('Class data response:', response.data)
      
      // Handle different response structures
      const classData = response.data.data || response.data
      console.log('Extracted class data:', classData)
      
      setFormData({
        name: classData.name || '',
        grade: classData.grade || '9',
        section: classData.section || 'A',
        capacity: classData.capacity || '40',
      })
    } catch (error) {
      console.error('Failed to fetch class:', error)
      toast.error('Failed to fetch class')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Updating class with data:', formData)
      const response = await classAPI.update(params.id, formData)
      console.log('Update response:', response)
      toast.success('Class updated successfully')
      router.push('/admin/classes')
    } catch (error) {
      console.error('Update error:', error)
      console.error('Error response:', error.response?.data)
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        Object.keys(errors).forEach(key => {
          errors[key].forEach(msg => toast.error(msg))
        })
      } else {
        toast.error(error.response?.data?.message || 'Failed to update class')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Class</h1>
      
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Class Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Grade 9 - A"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grade</label>
              <select
                required
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <input
                required
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g., A, B, C"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                required
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/classes')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Class'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
