'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { authAPI } from '@/lib/api'

export default function ParentRegistration() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', relationship: 'father', password: '', password_confirmation: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authAPI.register({ ...formData, role: 'parent' })
      setSuccess('Registration successful! Please wait for approval and child linking from the administration.')
      setTimeout(() => router.push('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Parent Registration</h2>
              <p className="text-gray-600 mt-2">Connect with your child's education</p>
            </div>

            {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"><p className="text-red-600 text-sm">{error}</p></div>}
            {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md"><p className="text-green-600 text-sm">{success}</p></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="parent@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>

              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                <select id="relationship" name="relationship" value={formData.relationship} onChange={handleChange} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength={8}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input type="password" id="password_confirmation" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required minLength={8}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2">
                {loading ? 'Registering...' : 'Register as Parent'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Already have an account?{' '}
                <Link href="/login" className="text-purple-600 hover:text-purple-500 font-medium">Sign in here</Link>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Register as:{' '}
                {/* <Link href="/register/admin" className="text-red-600 hover:text-red-500">Admin</Link>{' | '} */}
                <Link href="/register/teacher" className="text-blue-600 hover:text-blue-500">Teacher</Link>{' | '}
                <Link href="/register/student" className="text-green-600 hover:text-green-500">Student</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
