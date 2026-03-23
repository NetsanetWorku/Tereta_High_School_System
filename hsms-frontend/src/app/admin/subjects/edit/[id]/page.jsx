'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { subjectAPI } from '@/lib/api'

export default function EditSubjectPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '3',
  })

  useEffect(() => {
    fetchSubject()
  }, [params.id])

  const fetchSubject = async () => {
    try {
      console.log('Fetching subject with ID:', params.id)
      const response = await subjectAPI.getById(params.id)
      console.log('Subject data response:', response.data)
      
      // Handle different response structures
      const subjectData = response.data.data || response.data
      console.log('Extracted subject data:', subjectData)
      
      setFormData({
        name: subjectData.name || '',
        code: subjectData.code || '',
        credits: subjectData.credits || '3',
      })
    } catch (error) {
      console.error('Failed to fetch subject:', error)
      toast.error('Failed to fetch subject')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await subjectAPI.update(params.id, formData)
      toast.success('Subject updated successfully')
      router.push('/admin/subjects')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update subject')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Subject</h1>
      
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
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              required
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Credits</label>
            <input
              required
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/subjects')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Subject'}
          </button>
        </div>
      </form>
      </div>
    </DashboardLayout>
  )
}
