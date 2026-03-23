'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { assignmentAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function StudentAssignmentsPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [submissionData, setSubmissionData] = useState({
    submission_text: '',
    attachment_url: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await assignmentAPI.getStudentAssignments()
      const data = Array.isArray(response.data) ? response.data : []
      setAssignments(data)
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
      toast.error('Failed to fetch assignments')
      setAssignments([])
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (assignment) => {
    const now = new Date()
    const dueDate = new Date(assignment.due_date)
    const submission = assignment.submission

    if (submission && submission.status === 'graded') {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Graded</span>
    }
    if (submission && (submission.status === 'submitted' || submission.status === 'late')) {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Submitted</span>
    }
    if (dueDate < now) {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>
    }
    if ((dueDate - now) / (1000 * 60 * 60 * 24) <= 3) {
      return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Due Soon</span>
    }
    return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Pending</span>
  }

  const getStatusCategory = (assignment) => {
    const submission = assignment.submission
    if (submission && submission.status === 'graded') return 'graded'
    if (submission && (submission.status === 'submitted' || submission.status === 'late')) return 'submitted'
    if (assignment.is_overdue) return 'overdue'
    return 'pending'
  }

  const filterAssignments = () => {
    if (selectedStatus === 'all') return assignments
    return assignments.filter(a => getStatusCategory(a) === selectedStatus)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await assignmentAPI.submitAssignment(selectedAssignment.id, submissionData)
      toast.success('Assignment submitted successfully!')
      setShowSubmitModal(false)
      setSubmissionData({ submission_text: '', attachment_url: '' })
      fetchAssignments() // Refresh the list
    } catch (error) {
      console.error('Failed to submit assignment:', error)
      toast.error(error.response?.data?.message || 'Failed to submit assignment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment)
    setShowSubmitModal(true)
    // Pre-fill if already submitted
    if (assignment.submission) {
      setSubmissionData({
        submission_text: assignment.submission.submission_text || '',
        attachment_url: assignment.submission.attachment_url || ''
      })
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

  const filteredAssignments = filterAssignments()
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => getStatusCategory(a) === 'pending').length,
    submitted: assignments.filter(a => getStatusCategory(a) === 'submitted').length,
    graded: assignments.filter(a => getStatusCategory(a) === 'graded').length,
    overdue: assignments.filter(a => getStatusCategory(a) === 'overdue').length
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Assignments</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <StatsCard title="Total" value={stats.total} icon="📚" color="blue" />
          <StatsCard title="Pending" value={stats.pending} icon="⏳" color="gray" />
          <StatsCard title="Submitted" value={stats.submitted} icon="✅" color="green" />
          <StatsCard title="Graded" value={stats.graded} icon="🎯" color="purple" />
          <StatsCard title="Overdue" value={stats.overdue} icon="⚠️" color="red" />
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'all', label: 'All', count: stats.total },
                { key: 'pending', label: 'Pending', count: stats.pending },
                { key: 'submitted', label: 'Submitted', count: stats.submitted },
                { key: 'graded', label: 'Graded', count: stats.graded },
                { key: 'overdue', label: 'Overdue', count: stats.overdue }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                    selectedStatus === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                    {getStatusBadge(assignment)}
                  </div>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Subject:</span> {assignment.subject?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Teacher:</span> {assignment.teacher?.user?.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Total Marks:</span> {assignment.total_marks}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Due:</span> 
                      <span className={assignment.is_overdue ? 'text-red-600 font-semibold' : ''}>
                        {new Date(assignment.due_date).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Submission Info */}
              {assignment.submission && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Your Submission</h4>
                  {assignment.submission.submission_text && (
                    <p className="text-gray-700 mb-2">{assignment.submission.submission_text}</p>
                  )}
                  {assignment.submission.attachment_url && (
                    <a 
                      href={assignment.submission.attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      📎 View Attachment
                    </a>
                  )}
                  {assignment.submission.submitted_at && (
                    <p className="text-sm text-gray-500 mt-2">
                      Submitted: {new Date(assignment.submission.submitted_at).toLocaleString()}
                    </p>
                  )}
                  {assignment.submission.status === 'graded' && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-green-600">
                          Score: {assignment.submission.marks_obtained}/{assignment.total_marks}
                        </span>
                        {assignment.submission.feedback && (
                          <span className="text-sm text-gray-600">
                            Feedback: {assignment.submission.feedback}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {assignment.attachment_url && (
                  <a
                    href={assignment.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    📄 View Instructions
                  </a>
                )}
                {(!assignment.submission || assignment.submission.status === 'pending') && (
                  <button
                    onClick={() => openSubmitModal(assignment)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {assignment.submission ? 'Update Submission' : 'Submit Assignment'}
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredAssignments.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No assignments found</p>
              <p className="text-gray-400 text-sm mt-2">
                {selectedStatus !== 'all' 
                  ? `No ${selectedStatus} assignments` 
                  : 'Your assignments will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Submit Assignment: {selectedAssignment?.title}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Text *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={submissionData.submission_text}
                    onChange={(e) => setSubmissionData({ ...submissionData, submission_text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your submission text here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={submissionData.attachment_url}
                    onChange={(e) => setSubmissionData({ ...submissionData, attachment_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/your-file.pdf"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload your file to a cloud service and paste the link here
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> {selectedAssignment?.is_overdue 
                      ? 'This assignment is overdue. Your submission will be marked as late.' 
                      : 'Make sure to submit before the due date.'}
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubmitModal(false)
                      setSubmissionData({ submission_text: '', attachment_url: '' })
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
