'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { resultAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'
import StatsCard from '@/components/StatsCard'

export default function StudentResultsPage() {
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    fetchMyResults()
  }, [])

  const fetchMyResults = async () => {
    try {
      const response = await resultAPI.getMyResults()
      const data = Array.isArray(response.data) ? response.data : 
                   Array.isArray(response.data?.data) ? response.data.data : []
      setResults(data)
    } catch (error) {
      console.error('Failed to fetch results:', error)
      toast.error('Failed to fetch results')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterResults = () => {
    if (selectedType === 'all') return results
    return results.filter(r => r.exam_type === selectedType)
  }

  const calculateAverage = (type) => {
    const filtered = type === 'all' ? results : results.filter(r => r.exam_type === type)
    if (filtered.length === 0) return 0
    const total = filtered.reduce((sum, r) => sum + parseFloat(r.marks || 0), 0)
    return Math.round(total / filtered.length)
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

  const filteredResults = filterResults()

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Results</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatsCard 
            title="Overall Average" 
            value={`${calculateAverage('all')}%`} 
            icon="📊" 
            color="blue" 
          />
          <StatsCard 
            title="Assignments" 
            value={`${calculateAverage('assignment')}%`} 
            icon="📝" 
            color="green" 
          />
          <StatsCard 
            title="Tests" 
            value={`${calculateAverage('test')}%`} 
            icon="📄" 
            color="yellow" 
          />
          <StatsCard 
            title="Midterms" 
            value={`${calculateAverage('midterm')}%`} 
            icon="📋" 
            color="orange" 
          />
          <StatsCard 
            title="Finals" 
            value={`${calculateAverage('final')}%`} 
            icon="🎓" 
            color="purple" 
          />
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { key: 'all', label: 'All Results', count: results.length },
                { key: 'assignment', label: 'Assignments', count: results.filter(r => r.exam_type === 'assignment').length },
                { key: 'test', label: 'Tests', count: results.filter(r => r.exam_type === 'test').length },
                { key: 'midterm', label: 'Midterms', count: results.filter(r => r.exam_type === 'midterm').length },
                { key: 'final', label: 'Finals', count: results.filter(r => r.exam_type === 'final').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedType(tab.key)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                    selectedType === tab.key
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

        {/* Results Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{result.subject?.name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      result.exam_type === 'assignment' ? 'bg-green-100 text-green-800' :
                      result.exam_type === 'test' ? 'bg-yellow-100 text-yellow-800' :
                      result.exam_type === 'midterm' ? 'bg-orange-100 text-orange-800' :
                      result.exam_type === 'final' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.exam_type ? result.exam_type.charAt(0).toUpperCase() + result.exam_type.slice(1) : 'Test'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{result.exam_name || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{result.marks}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{result.grade || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(result.created_at).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No results found</p>
              <p className="text-gray-400 text-sm mt-2">
                {selectedType !== 'all' 
                  ? `No ${selectedType} results available yet` 
                  : 'Your results will appear here once teachers enter them'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
