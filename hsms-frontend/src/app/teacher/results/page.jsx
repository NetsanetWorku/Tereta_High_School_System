'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/DashboardLayout'
import { resultAPI } from '@/lib/api'
import StatsCard from '@/components/StatsCard'

export default function TeacherResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.error('Fetch timeout - forcing stop')
        setIsLoading(false)
        toast.error('Request timed out. Please refresh the page.')
      }
    }, 10000) // 10 second timeout

    fetchResults()

    return () => clearTimeout(timeout)
  }, [])

  const fetchResults = async () => {
    try {
      console.log('Fetching results...')
      const response = await resultAPI.getAll()
      console.log('Results response:', response)
      
      // Ensure we always have an array
      const resultsData = Array.isArray(response.data) ? response.data : 
                         Array.isArray(response.data?.data) ? response.data.data : []
      
      console.log('Results data:', resultsData)
      setResults(resultsData)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to fetch results:', error)
      console.error('Error details:', error.response?.data)
      
      // Show specific error message
      if (error.response?.status === 404) {
        toast.error('Teacher profile not found')
      } else if (error.response?.status === 403) {
        toast.error('Access denied')
      } else {
        toast.error('Failed to fetch results')
      }
      
      setResults([])
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
          <button
            onClick={() => router.push('/teacher/results/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Enter Results
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard title="Total Results" value={results.length} icon="📊" color="blue" />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
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
                    <div className="text-sm font-medium text-gray-900">{result.student?.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{result.subject?.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.score}</div>
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
