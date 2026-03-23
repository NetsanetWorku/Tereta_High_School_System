'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { assignmentAPI } from '@/lib/api'

export default function EditAssignmentPage() {
  const router = useRouter()
  const params = useParams()
  const assignmentId = params.id

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    due_time: '',
    total_marks: 100,
    attachment_url: ''
  })
  const [assignmentInfo, setAssignmentInfo] = useState(null)

  useEffect(() => {
    fetchAssignment()
  }, [assignmentId])

  const fetchAssignment = async () => {
    try {
      // Load from teacher's assignments list to find this one
      const res = await assignmentAPI.getTeacherAssignments()
      const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      const assignment = list.find(a => String(a.id) === String(assignmentId))

      if (!assignment) {
        toast.error('Assignment not found')
        router.push('/teacher/assignments')
        return
      }

      setAssignmentInfo(assignment)

      // Parse due_date and due_time from due_date field
      const due = assignment.due_date ? new Date(assignment.due_date) : null
      const dateStr = due ? due.toISOString().split('T')[0] : ''
      const timeStr = due
        ? due.toTimeString().slice(0, 5)
        : ''

      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        due_date: dateStr,
        due_time: timeStr,
        total_marks: assignment.total_marks || 100,
        attachment_url: assignment.attachment_url || ''
      })
    } catch (e) {
      toast.error('Failed to load assignment')
      router.push('/teacher/assignments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const dueDateTime = `${formData.due_date} ${formData.due_time || '23:59'}:00`
      await assignmentAPI.update(assignmentId, {
        title: formData.title,
        description: formData.description,
        due_date: dueDateTime,
        total_marks: parseInt(formData.total_marks),
        attachment_url: formData.attachment_url || null
      })
      toast.success('Assignment updated')
      router.push('/teacher/assignments')
    } catch (e) {
      toast.error('Failed to update assignment')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="teacher">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/teacher/assignments')}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
          >
            ← Back to Assignments
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Assignment</h1>
          {assignmentInfo && (
            <p className="text-gray-500 mt-1">
              {assignmentInfo.class_room?.name || assignmentInfo.class?.name || ''} &bull; {assignmentInfo.subject?.name || ''}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={formData.due_date}
                onChange={(e) => setFormData(p => ({ ...p, due_date: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Time</label>
              <input
                type="time"
                value={formData.due_time}
                onChange={(e) => setFormData(p => ({ ...p, due_time: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks *</label>
            <input
              type="number"
              required
              min="1"
              value={formData.total_marks}
              onChange={(e) => setFormData(p => ({ ...p, total_marks: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachment URL</label>
            <input
              type="url"
              value={formData.attachment_url}
              onChange={(e) => setFormData(p => ({ ...p, attachment_url: e.target.value }))}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/teacher/assignments')}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
