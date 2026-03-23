'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '@/components/DashboardLayout'

export default function HelpPage() {
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('faq')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [isClient, setIsClient] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    // Set client-side flag and load user data
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setUser(userData)
    }
  }, [])

  const showSuccess = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 5000)
  }

  const showError = (message) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const onSubmitTicket = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccess('Support ticket submitted successfully! We will get back to you soon.')
      reset()
    } catch (error) {
      showError('Error submitting support ticket. Please try again.')
    }
  }

  const faqData = [
    {
      category: 'General',
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'Go to Profile Settings > Security tab and use the "Change Password" form. You will need your current password to set a new one.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Navigate to Profile Settings and update your information in the "Profile Information" tab. Click "Save Changes" to apply updates.'
        },
        {
          question: 'Can I change my email address?',
          answer: 'Yes, you can update your email address in the Profile Settings. Make sure to use a valid email address as it will be used for important notifications.'
        }
      ]
    },
    {
      category: 'For Students',
      questions: [
        {
          question: 'How do I view my grades?',
          answer: 'Go to the Results section in your dashboard to view all your exam results and grades organized by subject and date.'
        },
        {
          question: 'Where can I see my attendance?',
          answer: 'Your attendance records are available in the Attendance section, showing your presence/absence for each subject and date.'
        },
        {
          question: 'How do I submit assignments?',
          answer: 'Navigate to the Assignments section where you can view pending assignments and submit your work before the deadline.'
        }
      ]
    },
    {
      category: 'For Teachers',
      questions: [
        {
          question: 'How do I mark attendance?',
          answer: 'Go to the Attendance section, select your class and subject, then mark students as present or absent for the current date.'
        },
        {
          question: 'How do I enter student grades?',
          answer: 'Navigate to Results section, select the exam and subject, then enter grades for each student in your class.'
        },
        {
          question: 'How do I create assignments?',
          answer: 'Use the Assignments section to create new assignments, set deadlines, and manage submissions from your students.'
        }
      ]
    },
    {
      category: 'For Parents',
      questions: [
        {
          question: 'How do I view my child\'s progress?',
          answer: 'Your dashboard shows an overview of your child\'s performance. Use the Results and Attendance sections for detailed information.'
        },
        {
          question: 'How do I communicate with teachers?',
          answer: 'Use the Messages section to send messages to your child\'s teachers and receive updates about their progress.'
        },
        {
          question: 'Can I see my child\'s timetable?',
          answer: 'Yes, the Timetable section shows your child\'s class schedule including subjects, timings, and assigned teachers.'
        }
      ]
    },
    {
      category: 'For Administrators',
      questions: [
        {
          question: 'How do I add new users?',
          answer: 'Use the respective management sections (Students, Teachers, Parents) to add new users. Each section has an "Add" button to create new accounts.'
        },
        {
          question: 'How do I manage classes and subjects?',
          answer: 'Navigate to Classes and Subjects sections to create, edit, or delete classes and subjects. You can also assign teachers to subjects.'
        },
        {
          question: 'How do I generate reports?',
          answer: 'Use the Reports section to generate various reports including attendance, performance, and system usage statistics.'
        }
      ]
    }
  ]

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  // Show loading state during hydration
  if (!isClient) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Help & Support</h1>
            <p className="mt-1 text-sm text-gray-600">
              Find answers to common questions or get help from our support team
            </p>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveSection('faq')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'faq'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 FAQ
              </button>
              <button
                onClick={() => setActiveSection('contact')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'contact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📞 Contact Support
              </button>
              <button
                onClick={() => setActiveSection('guides')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === 'guides'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📖 User Guides
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeSection === 'faq' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Frequently Asked Questions</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Find quick answers to the most common questions
                  </p>
                </div>

                {faqData.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-4">
                    <h4 className="text-md font-medium text-gray-800 border-b border-gray-200 pb-2">
                      {category.category}
                    </h4>
                    <div className="space-y-2">
                      {category.questions.map((faq, faqIndex) => {
                        const globalIndex = `${categoryIndex}-${faqIndex}`
                        return (
                          <div key={faqIndex} className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => toggleFaq(globalIndex)}
                              className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                            >
                              <span className="font-medium text-gray-900">{faq.question}</span>
                              <span className="text-gray-500">
                                {expandedFaq === globalIndex ? '−' : '+'}
                              </span>
                            </button>
                            {expandedFaq === globalIndex && (
                              <div className="px-4 pb-3 text-gray-600 border-t border-gray-200">
                                <p className="pt-3">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Can't find what you're looking for? Send us a message and we'll help you out.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">📧</div>
                    <h4 className="font-medium text-gray-900">Email Support</h4>
                    <p className="text-sm text-gray-600 mt-1">support@school.com</p>
                    <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">📞</div>
                    <h4 className="font-medium text-gray-900">Phone Support</h4>
                    <p className="text-sm text-gray-600 mt-1">+1 (555) 123-4567</p>
                    <p className="text-xs text-gray-500 mt-1">Mon-Fri 9AM-5PM</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="font-medium text-gray-900">Live Chat</h4>
                    <p className="text-sm text-gray-600 mt-1">Available now</p>
                    <p className="text-xs text-gray-500 mt-1">Average response: 5 min</p>
                  </div>
                </div>

                {/* Support Ticket Form */}
                <form onSubmit={handleSubmit(onSubmitTicket)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <input
                        {...register('subject', { required: 'Subject is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Brief description of your issue"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        {...register('priority', { required: 'Priority is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      {errors.priority && (
                        <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Category</option>
                      <option value="technical">Technical Issue</option>
                      <option value="account">Account Problem</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows="6"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Please provide detailed information about your issue..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'guides' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">User Guides</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Step-by-step guides to help you make the most of the system
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-4">🎓</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Student Guide</h4>
                    <p className="text-gray-600 mb-4">
                      Learn how to view grades, check attendance, submit assignments, and communicate with teachers.
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Read Guide →
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-4">👨‍🏫</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Teacher Guide</h4>
                    <p className="text-gray-600 mb-4">
                      Discover how to manage classes, mark attendance, enter grades, and create assignments.
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Read Guide →
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-4">👨‍👩‍👧‍👦</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Parent Guide</h4>
                    <p className="text-gray-600 mb-4">
                      Monitor your child's progress, communicate with teachers, and stay updated on school activities.
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Read Guide →
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="text-3xl mb-4">⚙️</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Admin Guide</h4>
                    <p className="text-gray-600 mb-4">
                      Complete system administration including user management, reports, and system configuration.
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Read Guide →
                    </button>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-blue-900 mb-4">💡 Quick Tips</h4>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Use the search function to quickly find students, teachers, or classes</li>
                    <li>• Check the notification bell for important updates and messages</li>
                    <li>• Your dashboard shows the most important information at a glance</li>
                    <li>• Use filters in data tables to find specific information quickly</li>
                    <li>• Keep your profile information up to date for better communication</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}