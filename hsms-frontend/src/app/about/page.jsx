'use client'

import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Tereta HSMS</h1>
            <p className="text-xl text-gray-600">Learn more about our Tereta High School Management System</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                The Tereta High School Management System (HSMS) is designed to streamline educational processes and enhance 
                communication between students, teachers, parents, and administrators at Tereta High School. Our comprehensive platform 
                provides tools for academic management, attendance tracking, grade reporting, and much more.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-600 text-xl">📊</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Academic Management</h3>
                      <p className="text-gray-600 text-sm">Comprehensive grade tracking and academic progress monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-600 text-xl">✅</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Attendance Tracking</h3>
                      <p className="text-gray-600 text-sm">Real-time attendance monitoring and reporting</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-600 text-xl">👥</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">User Management</h3>
                      <p className="text-gray-600 text-sm">Role-based access control for all stakeholders</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-red-600 text-xl">📱</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Mobile Responsive</h3>
                      <p className="text-gray-600 text-sm">Access from any device, anywhere, anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-600 text-xl">🔒</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Secure Platform</h3>
                      <p className="text-gray-600 text-sm">Advanced security measures to protect sensitive data</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-indigo-600 text-xl">📈</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analytics & Reports</h3>
                      <p className="text-gray-600 text-sm">Detailed insights and customizable reports</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">For Different Users</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <span className="text-3xl mb-2 block">👨‍💼</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Administrators</h3>
                  <p className="text-gray-600 text-sm">Complete system control and management capabilities</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <span className="text-3xl mb-2 block">👩‍🏫</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Teachers</h3>
                  <p className="text-gray-600 text-sm">Class management, grading, and student communication</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <span className="text-3xl mb-2 block">👨‍🎓</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Students</h3>
                  <p className="text-gray-600 text-sm">Access to grades, assignments, and academic resources</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <span className="text-3xl mb-2 block">👨‍👩‍👧‍👦</span>
                  <h3 className="font-semibold text-gray-900 mb-2">Parents</h3>
                  <p className="text-gray-600 text-sm">Monitor child's progress and stay connected with school</p>
                </div>
              </div>
            </section>

            {/* <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Frontend</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Next.js 14 with React</li>
                      <li>• Tailwind CSS for styling</li>
                      <li>• Responsive design</li>
                      <li>• Modern JavaScript (ES6+)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Backend</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Laravel 11 PHP Framework</li>
                      <li>• SQLite Database</li>
                      <li>• RESTful API Architecture</li>
                      <li>• Sanctum Authentication</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section> */}
          </div>
        </div>
      </div>
    </div>
  )
}