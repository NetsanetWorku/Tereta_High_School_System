'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSuccess('Thank you for your message! We will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Tereta High School</h1>
            <p className="text-xl text-gray-600">Get in touch with our support team</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="text-blue-600 text-2xl">📧</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@teretahigh.edu</p>
                    <p className="text-gray-600">admin@teretahigh.edu</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="text-green-600 text-2xl">📞</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 123-4568 (Emergency)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="text-red-600 text-2xl">📍</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      123 Education Street<br />
                      Learning City, LC 12345<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="text-purple-600 text-2xl">🕒</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Office Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Support</h3>
                <div className="space-y-2">
                  <a href="/login" className="block text-blue-600 hover:text-blue-500">
                    → Login Issues
                  </a>
                  <a href="/register" className="block text-blue-600 hover:text-blue-500">
                    → Registration Help
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="account-issues">Account Issues</option>
                    <option value="registration-help">Registration Help</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="bug-report">Bug Report</option>
                    <option value="general-inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please describe your inquiry or issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I register for an account?</h3>
                <p className="text-gray-600">
                  Choose your role (Admin, Teacher, Student, or Parent) from our registration page and fill out the appropriate form. 
                  Your registration will be reviewed by the administration before approval.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">I forgot my password. How can I reset it?</h3>
                <p className="text-gray-600">
                  Click on the "Forgot Password" link on the login page and enter your email address. 
                  You will receive instructions to reset your password.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is the platform mobile-friendly?</h3>
                <p className="text-gray-600">
                  Yes! Our platform is fully responsive and works seamlessly on desktop, tablet, and mobile devices. 
                  Check our device compatibility page for more details.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How long does registration approval take?</h3>
                <p className="text-gray-600">
                  Registration approval typically takes 1-2 business days. You will receive an email notification 
                  once your account has been approved and activated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}