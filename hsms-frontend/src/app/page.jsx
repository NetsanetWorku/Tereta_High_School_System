'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/lib/store'

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case 'admin':
          router.push('/admin')
          break
        case 'teacher':
          router.push('/teacher')
          break
        case 'student':
          router.push('/student')
          break
        case 'parent':
          router.push('/parent')
          break
        default:
          router.push('/login')
      }
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section - Add padding top for fixed navbar with background image */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 pt-16 overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('./background.png')",
          }}
        ></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Tereta High School Management System
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Streamline your school operations with our comprehensive management platform designed for modern education at Tereta High School.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Login to Dashboard
              </Link>
              <Link
                href="/register/student"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete School Management Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your school efficiently in one integrated platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Admin Features */}
            {/* <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Portal</h3>
              <p className="text-gray-600 mb-4">Complete administrative control with user management, reporting, and system configuration.</p>
              <Link href="/register/admin" className="text-red-600 hover:text-red-500 font-medium">
                Register as Admin →
              </Link>
            </div> */}

            {/* Teacher Features */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👩‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Teacher Dashboard</h3>
              <p className="text-gray-600 mb-4">Manage classes, track attendance, grade assignments, and communicate with students.</p>
              <Link href="/register/teacher" className="text-blue-600 hover:text-blue-500 font-medium">
                Register as Teacher →
              </Link>
            </div>

            {/* Student Features */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👨‍🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Portal</h3>
              <p className="text-gray-600 mb-4">Access grades, attendance records, assignments, and communicate with teachers.</p>
              <Link href="/register/student" className="text-green-600 hover:text-green-500 font-medium">
                Register as Student →
              </Link>
            </div>

            {/* Parent Features */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Parent Access</h3>
              <p className="text-gray-600 mb-4">Monitor your child's progress, attendance, and stay connected with teachers.</p>
              <Link href="/register/parent" className="text-purple-600 hover:text-purple-500 font-medium">
                Register as Parent →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">Get instant insights into student performance, attendance trends, and school metrics.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-green-600 text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Responsive</h3>
              <p className="text-gray-600">Access the platform from any device - desktop, tablet, or smartphone.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-purple-600 text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Advanced security measures to protect sensitive student and school data.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-red-600 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Performance</h3>
              <p className="text-gray-600">Lightning-fast loading times and smooth user experience across all features.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-yellow-600 text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">Intuitive interface designed for users of all technical skill levels.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-indigo-600 text-3xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Regular Updates</h3>
              <p className="text-gray-600">Continuous improvements and new features based on user feedback.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl font-bold">Tereta HSMS</span>
              </div>
              <p className="text-gray-600">
                Comprehensive school management system for Tereta High School.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link></li>
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Registration</h3>
              <ul className="space-y-2">
                <li><Link href="/register/admin" className="text-gray-600 hover:text-gray-900">Admin</Link></li>
                <li><Link href="/register/teacher" className="text-gray-600 hover:text-gray-900">Teacher</Link></li>
                <li><Link href="/register/student" className="text-gray-600 hover:text-gray-900">Student</Link></li>
                <li><Link href="/register/parent" className="text-gray-600 hover:text-gray-900">Parent</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-600">Email: support@teretahigh.edu</span></li>
                <li><span className="text-gray-600">Phone: +1 (555) 123-4567</span></li>
                <li><span className="text-gray-600">Hours: 8AM - 6PM</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-300 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2026 High School Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}