'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { parentAPI } from '@/lib/api'

export default function EditParentPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    occupation: '',
    address: '',
  })

  useEffect(() => {
    fetchParent()
  }, [params.id])

  const fetchParent = async () => {
    try {
      console.log('Fetching parent with ID:', params.id)
      const response = await parentAPI.getById(params.id)
      console.log('Parent data response:', response.data)
      
      // Handle different response structures
      const parentData = response.data.data || response.data
      console.log('Extracted parent data:', parentData)
      
      // Extract name and email from user relationship if it exists
      const name = parentData.user?.name || parentData.name || ''
      const email = parentData.user?.email || parentData.email || ''
      
      setFormData({
        name: name,
        email: email,
        phone: parentData.phone || '',
        occupation: parentData.occupation || '',
        address: parentData.address || '',
      })
    } catch (error) {
      console.error('Failed to fetch parent:', error)
      toast.error('Failed to fetch parent')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Updating parent with data:', formData)
      const response = await parentAPI.update(params.id, formData)
      console.log('Update response:', response)
      toast.success('Parent updated successfully')
      router.push('/admin/parents')
    } catch (error) {
      console.error('Update error:', error)
      console.error('Error response:', error.response?.data)
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        Object.keys(errors).forEach(key => {
          errors[key].forEach(msg => toast.error(msg))
        })
      } else {
        toast.error(error.response?.data?.message || 'Failed to update parent')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Parent</h1>
      
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
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Occupation</label>
              <input
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/parents')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Parent'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
