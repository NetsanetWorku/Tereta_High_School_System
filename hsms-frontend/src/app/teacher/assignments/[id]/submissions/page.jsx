'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { assignmentAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function SubmissionsPage() {
  const router = useRouter()
  const params = useParams()
  const assignmentId = params.id

  const [assignment, setAssignment] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [gradingId, setGradingId] = useState(null)
  const [gradeForm, setGradeForm] = useState({ marks_obtained: '', feedback: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [assignmentId])

  const fetchSubmissions = async () => {
    try {
      const res = await assignmentAPI.getSubmissions(assignmentId)
      setAssignment(res.data?.assignment || null)
      const subs = Array.isArray(res.data?.submissions) ? res.data.submissions : []
      setSubmissions(subs)
    } catch (e) {
      toast.error('Failed to load submissions')
    } finally {
      setIsLoading(false)
    }
  }

  const openGrade = (sub) => {
    setGradingId(sub.id)
    setGradeForm({ marks_obtained: sub.marks_obtained ?? '', feedback: sub.feedback ?? '' })
  }

  const submitGrade = async (e) => {
    e.preventDefault()
    if (gradeForm.marks_obtained === '') return
    if (assignment && parseInt(gradeForm.marks_obtained) > assignment.total_marks) {
      toast.error(`Marks cannot exceed ${assignment.total_marks}`)
      return
    }
    setSaving(true)
    try {
      await assignmentAPI.gradeSubmission(gradingId, {
        marks_obtained: parseInt(gradeForm.marks_obtained),
        feedback: gradeForm.feedback
      })
      toast.success('Graded successfully')
      setGradingId(null)
      fetchSubmissions()
    } catch (e) {
      toast.error('Failed to save grade')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (sub) => {
    if (sub.graded_at) return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">Graded</span>
    if (sub.submitted_at && sub.status === 'late') return <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 font-medium">Late</span>
    if (sub.submitted_at) return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">Submitted</span>
    return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">Pending</span>
  }

  const graded = submissions.filter(s => s.graded_at).length
  const submitted = submissions.filter(s => s.submitted_at && !s.graded_at).length
  const pending = submissions.filter(s => !s.submitted_at).length

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <button
              onClick={() => router.push('/teacher/assignments')}
              className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1"
            >
              ← Back to Assignments
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{assignment?.title || 'Assignment'}</h1>
            <p className="text-gray-500 mt-1">
              {assignment?.class_room?.name || assignment?.class?.name || ''} &bull; {assignment?.subject?.name || ''} &bull; Max: {assignment?.total_marks || 100} marks
            </p>
          </div>
          <div className="text-right text-sm text-gray-500">
            Due: {assignment?.due_date ? new Date(assignment.due_date).toLocaleDateString() : '-'}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{graded}</p>
            <p className="text-sm text-green-600">Graded</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{submitted}</p>
            <p className="text-sm text-blue-600">Needs Grading</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-700">{pending}</p>
            <p className="text-sm text-gray-600">Not Submitted</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {sub.student?.user?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{sub.student?.user?.name || 'Student'}</p>
                        <p className="text-xs text-gray-500">{sub.student?.student_code || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {sub.submitted_at
                      ? new Date(sub.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(sub)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {sub.marks_obtained != null
                      ? `${sub.marks_obtained} / ${assignment?.total_marks || 100}`
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {sub.feedback || <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {sub.submitted_at ? (
                      <button
                        onClick={() => openGrade(sub)}
                        className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                          sub.graded_at
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {sub.graded_at ? 'Re-grade' : 'Grade'}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Not submitted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {submissions.length === 0 && (
            <div className="text-center py-12 text-gray-500">No submissions yet</div>
          )}
        </div>
      </div>

      {/* Grade Modal */}
      {gradingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Grade Submission</h3>
            <form onSubmit={submitGrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marks (out of {assignment?.total_marks || 100})
                </label>
                <input
                  type="number"
                  min="0"
                  max={assignment?.total_marks || 100}
                  value={gradeForm.marks_obtained}
                  onChange={(e) => setGradeForm(p => ({ ...p, marks_obtained: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback (optional)</label>
                <textarea
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm(p => ({ ...p, feedback: e.target.value }))}
                  rows={3}
                  placeholder="Write feedback for the student..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setGradingId(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
