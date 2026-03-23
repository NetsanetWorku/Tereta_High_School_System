'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function RegisterPage() {

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-gray-50 pt-20 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/background.png)' }}
      >
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Join Tereta High School</h1>
            <p className="text-xl text-white drop-shadow-md">Select the appropriate registration form based on your role at Tereta High School</p>
          </div>

          {/* Registration Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Teacher Registration */}
            <Link href="/register/teacher" className="group">
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Teacher</h3>
                <p className="text-gray-600 mb-4">
                  Join our teaching faculty and manage your classes, students, and academic activities.
                </p>
                <div className="text-blue-600 font-semibold group-hover:text-blue-700">
                  Register as Teacher →
                </div>
              </div>
            </Link>

            {/* Student Registration */}
            <Link href="/register/student" className="group">
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Student</h3>
                <p className="text-gray-600 mb-4">
                  Join our school community and access your academic records, assignments, and more.
                </p>
                <div className="text-green-600 font-semibold group-hover:text-green-700">
                  Register as Student →
                </div>
              </div>
            </Link>

            {/* Parent Registration */}
            <Link href="/register/parent" className="group">
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Parent</h3>
                <p className="text-gray-600 mb-4">
                  Stay connected with your child's education and monitor their academic progress.
                </p>
                <div className="text-purple-600 font-semibold group-hover:text-purple-700">
                  Register as Parent →
                </div>
              </div>
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-16 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Registration Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fill Form</h3>
                <p className="text-gray-600 text-sm">Complete registration with your details</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Admin Approval</h3>
                <p className="text-gray-600 text-sm">Wait for administration review</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Login & Access</h3>
                <p className="text-gray-600 text-sm">Access your dashboard once approved</p>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-12 text-center">
            <p className="text-white drop-shadow-md">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-300 hover:text-blue-200 font-medium underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}