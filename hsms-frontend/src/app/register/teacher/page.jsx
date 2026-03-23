'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { authAPI } from '@/lib/api'

export default function TeacherRegistration() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
    subject_specialization: '', qualification: '', experience_years: ''
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
      await authAPI.register({ ...formData, role: 'teacher' })
      setSuccess('Registration successful! Please wait for approval from the administration.')
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👩‍🏫</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Teacher Registration</h2>
              <p className="text-gray-600 mt-2">Join our teaching faculty</p>
            </div>

            {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"><p className="text-red-600 text-sm">{error}</p></div>}
            {success && <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md"><p className="text-green-600 text-sm">{success}</p></div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'teacher@school.com' },
                { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 123-4567' },
                { id: 'subject_specialization', label: 'Subject Specialization', type: 'text', placeholder: 'e.g., Mathematics, English, Science' },
                { id: 'qualification', label: 'Qualification', type: 'text', placeholder: 'e.g., B.Ed, M.Sc, PhD' },
                { id: 'experience_years', label: 'Years of Experience', type: 'number', placeholder: 'e.g., 5', required: false },
                { id: 'password', label: 'Password', type: 'password', placeholder: 'Minimum 8 characters', minLength: 8 },
                { id: 'password_confirmation', label: 'Confirm Password', type: 'password', placeholder: 'Confirm your password', minLength: 8 },
              ].map(({ id, label, type, placeholder, minLength, required = true }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required ? '*' : ''}</label>
                  <input
                    type={type} id={id} name={id} value={formData[id]}
                    onChange={handleChange} required={required} minLength={minLength}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2">
                {loading ? 'Registering...' : 'Register as Teacher'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">Sign in here</Link>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Register as:{' '}
                {/* <Link href="/register/admin" className="text-red-600 hover:text-red-500">Admin</Link>{' | '} */}
                <Link href="/register/student" className="text-green-600 hover:text-green-500">Student</Link>{' | '}
                <Link href="/register/parent" className="text-purple-600 hover:text-purple-500">Parent</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
