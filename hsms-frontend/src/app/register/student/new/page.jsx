'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { authAPI } from '@/lib/api'

export default function NewStudentRegistration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    address: '',
    previous_school: '',
    grade_8_result: '',
    preferred_stream: '',
    completion_year: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    parent_relationship: '',
    email: '',
    password: ''
  })
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const showError = (message) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const showSuccess = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 3000)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'student',
        registration_type: 'new',
        grade: '9',
        gender: formData.gender,
        previous_school: formData.previous_school,
        grade_8_result: formData.grade_8_result,
        grade_8_evaluation: 'percentage', // Default to percentage
        verification_method: 'email' // Default to email verification
      }

      await authAPI.register(registrationData)
      showSuccess('Registration submitted successfully! Please wait for admin approval.')
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      showError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white">🎓</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            New Student Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            For students entering Tereta High School from Grade 8
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              href="/register/student"
              className="text-green-600 hover:text-green-500 text-sm font-medium"
            >
              ← Back to registration options
            </Link>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white shadow-xl rounded-lg p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth *
                  </label>
                  <input
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    type="date"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Previous School Name *
                  </label>
                  <input
                    name="previous_school"
                    value={formData.previous_school}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Name of your Grade 8 school"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grade 8 Final Grade/Percentage *
                  </label>
                  <input
                    name="grade_8_result"
                    value={formData.grade_8_result}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="e.g., 85% or A grade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Preferred Class/Stream
                  </label>
                  <select
                    name="preferred_stream"
                    value={formData.preferred_stream}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select Stream (if applicable)</option>
                    <option value="science">Science</option>
                    <option value="commerce">Commerce</option>
                    <option value="arts">Arts/Humanities</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year of Grade 8 Completion *
                  </label>
                  <select
                    name="completion_year"
                    value={formData.completion_year}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select Year</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Parent/Guardian Name *
                  </label>
                  <input
                    name="parent_name"
                    value={formData.parent_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Full name of parent/guardian"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Parent/Guardian Phone *
                  </label>
                  <input
                    name="parent_phone"
                    value={formData.parent_phone}
                    onChange={handleChange}
                    required
                    type="tel"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Parent/Guardian contact number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Parent/Guardian Email
                  </label>
                  <input
                    name="parent_email"
                    value={formData.parent_email}
                    onChange={handleChange}
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="parent@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Relationship
                  </label>
                  <select
                    name="parent_relationship"
                    value={formData.parent_relationship}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select Relationship</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    type="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    type="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Create a password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Registration...
                  </div>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}