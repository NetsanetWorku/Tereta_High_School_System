'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { assignmentAPI, classAPI, subjectAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function AssignmentsPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterSubject, setFilterSubject] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [assignmentsRes, classesRes, subjectsRes] = await Promise.all([
        assignmentAPI.getAll(),
        classAPI.getAll(),
        subjectAPI.getAll()
      ])
      
      const assignmentsData = Array.isArray(assignmentsRes.data) ? assignmentsRes.data : 
                             Array.isArray(assignmentsRes.data?.data) ? assignmentsRes.data.data : []
      const classesData = Array.isArray(classesRes.data) ? classesRes.data : 
                         Array.isArray(classesRes.data?.data) ? classesRes.data.data : []
      const subjectsData = Array.isArray(subjectsRes.data) ? subjectsRes.data : 
                          Array.isArray(subjectsRes.data?.data) ? subjectsRes.data.data : []
      
      setAssignments(assignmentsData)
      setClasses(classesData)
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to fetch assignments')
      setAssignments([])
      setClasses([])
      setSubjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAssignments = Array.isArray(assignments) ? assignments.filter(assignment => {
    const matchesSearch = assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = !filterClass || assignment.class_id == filterClass
    const matchesSubject = !filterSubject || assignment.subject_id == filterSubject
    return matchesSearch && matchesClass && matchesSubject
  }) : []



  const getStatusBadge = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    
    if (due < now) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>
    } else if ((due - now) / (1000 * 60 * 60 * 24) <= 3) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Due Soon</span>
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Assignments Overview</h1>
          <div className="text-sm text-gray-600">
            View all assignments created by teachers
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name} - {cls.section}</option>
            ))}
          </select>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Assignments" value={assignments.length} icon="📝" color="blue" />
          <StatsCard 
            title="Active" 
            value={assignments.filter(a => new Date(a.due_date) >= new Date()).length} 
            icon="✅" 
            color="green" 
          />
          <StatsCard 
            title="Overdue" 
            value={assignments.filter(a => new Date(a.due_date) < new Date()).length} 
            icon="⚠️" 
            color="red" 
          />
          <StatsCard 
            title="This Week" 
            value={assignments.filter(a => {
              const due = new Date(a.due_date)
              const now = new Date()
              const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
              return due >= now && due <= weekFromNow
            }).length} 
            icon="📅" 
            color="yellow" 
          />
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{assignment.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{assignment.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assignment.teacher?.name || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {assignment.teacher?.subject_specialization || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assignment.class_room?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assignment.subject?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(assignment.due_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {assignment.submissions_count || 0} / {assignment.total_students || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/assignments/${assignment.id}/submissions`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No assignments found</p>
              <p className="text-gray-400 text-sm mt-2">Teachers will create assignments for their classes</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
