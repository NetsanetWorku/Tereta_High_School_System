'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function StudentRegistration() {
  const router = useRouter()

  const handleRegistrationType = (type) => {
    if (type === 'new') {
      router.push('/register/student/new')
    } else if (type === 'transfer') {
      router.push('/register/student/transfer')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">👨‍🎓</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Registration</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your registration type to get started with your application to Tereta High School
            </p>
          </div>

          {/* Registration Type Selection */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* New Student Registration */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4">
                  <span className="text-2xl text-white">🎓</span>
                </div>
                <h2 className="text-2xl font-bold text-white text-center">New Student</h2>
                <p className="text-green-100 text-center mt-2">Entering high school from Grade 8</p>
              </div>
              
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="ml-3 text-gray-700">Fresh start in high school</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="ml-3 text-gray-700">Coming from Grade 8 or equivalent</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="ml-3 text-gray-700">First time in Tereta High School system</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="ml-3 text-gray-700">Stream selection available</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRegistrationType('new')}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Register as New Student
                </button>
              </div>
            </div>

            {/* Transfer Student Registration */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4">
                  <span className="text-2xl text-white">🔄</span>
                </div>
                <h2 className="text-2xl font-bold text-white text-center">Transfer Student</h2>
                <p className="text-blue-100 text-center mt-2">Moving from another high school</p>
              </div>
              
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <p className="ml-3 text-gray-700">Already in high school</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <p className="ml-3 text-gray-700">Transferring from another school</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <p className="ml-3 text-gray-700">Credit transfer evaluation</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 text-sm">✓</span>
                    </div>
                    <p className="ml-3 text-gray-700">Previous academic records required</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleRegistrationType('transfer')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                >
                  Register as Transfer Student
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Already have an account?{' '}
              <Link href="/login" className="text-green-600 hover:text-green-500 font-medium">
                Sign in here
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Register as:{' '}
              <Link href="/register/teacher" className="text-blue-600 hover:text-blue-500">Teacher</Link>
              {' | '}
              <Link href="/register/parent" className="text-purple-600 hover:text-purple-500">Parent</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}