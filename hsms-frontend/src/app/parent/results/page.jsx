'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { resultAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function ParentResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChildResults()
  }, [])

  const fetchChildResults = async () => {
    try {
      const response = await resultAPI.getChildResults()
      // Ensure we always have an array
      const data = Array.isArray(response.data) ? response.data : 
                   Array.isArray(response.data?.data) ? response.data.data : []
      setResults(data)
    } catch (error) {
      console.error('Failed to fetch results:', error)
      toast.error('Failed to fetch results')
      setAttendance([])
      setResults([])
      setChildren([])
    } finally {
      setIsLoading(false)
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Child's Results</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard title="Total Subjects" value={results.length} icon="📚" color="blue" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{result.subject?.name || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{result.score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{result.grade || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(result.created_at).toLocaleDateString()}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No results found</p>
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
  )
}


