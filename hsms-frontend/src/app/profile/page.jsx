'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '@/components/DashboardLayout'
import { profileAPI } from '@/lib/api'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')
  const [isClient, setIsClient] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm()

  useEffect(() => {
    setIsClient(true)
    fetchProfile()
  }, [])

  const showError = (message) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const showSuccess = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 5000)
  }

  const fetchProfile = async () => {
    try {
      setLoading(true)
      // Get user from localStorage for now
      if (typeof window !== 'undefined') {
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        setUser(userData)
        reset({
          name: userData.name,
          email: userData.email,
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      showError('Error fetching profile data')
    } finally {
      setLoading(false)
    }
  }

  const onSubmitProfile = async (data) => {
    if (!isClient) return
    
    try {
      await profileAPI.updateProfile(data)
      showSuccess('Profile updated successfully')
      
      // Update localStorage
      const updatedUser = { ...user, ...data }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
    } catch (error) {
      showError(error.response?.data?.message || 'Error updating profile')
    }
  }

  const onSubmitPassword = async (data) => {
    if (data.new_password !== data.confirm_password) {
      showError('New passwords do not match')
      return
    }

    try {
      await profileAPI.updateProfile({
        current_password: data.current_password,
        password: data.new_password,
        password_confirmation: data.confirm_password,
      })
      showSuccess('Password updated successfully')
      resetPassword()
    } catch (error) {
      showError(error.response?.data?.message || 'Error updating password')
    }
  }

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('File size must be less than 2MB')
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      showError('Only JPEG, PNG, JPG, and GIF images are allowed')
      return
    }

    const formData = new FormData()
    formData.append('profile_picture', file)

    try {
      const response = await profileAPI.uploadPicture(formData)
      
      if (response.data.success) {
        showSuccess('Profile picture updated successfully')
        
        // Construct the full URL for the profile picture
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost'
        const pictureUrl = response.data.profile_picture_url.startsWith('http') 
          ? response.data.profile_picture_url 
          : `${baseUrl}${response.data.profile_picture_url}`
        
        // Update user in localStorage and state
        const updatedUser = { 
          ...user, 
          profile_picture: response.data.profile_picture,
          profile_picture_url: pictureUrl
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        
        // Dispatch event to update navbar without reload
        window.dispatchEvent(new Event('userUpdated'))
      } else {
        showError(response.data.message || 'Error uploading profile picture')
      }
    } catch (error) {
      console.error('Upload error:', error)
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.values(errors).flat()
        showError(errorMessages.join(', '))
      } else {
        showError(error.response?.data?.message || 'Error uploading profile picture')
      }
    }
  }

  if (loading || !isClient) {
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
            <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preferences
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div className="shrink-0">
                    {user?.profile_picture_url ? (
                      <img 
                        src={user.profile_picture_url} 
                        alt="Profile" 
                        className="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-2xl font-medium text-gray-600">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Picture
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureUpload}
                        className="hidden"
                        id="picture-upload"
                      />
                      <label
                        htmlFor="picture-upload"
                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Change Picture
                      </label>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        type="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <input
                      value={user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1) || 'N/A'}
                      disabled
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Update your password to keep your account secure
                  </p>
                </div>

                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      {...registerPassword('current_password', {
                        required: 'Current password is required',
                      })}
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter current password"
                    />
                    {passwordErrors.current_password && (
                      <p className="text-red-500 text-sm mt-1">
                        {passwordErrors.current_password.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        {...registerPassword('new_password', {
                          required: 'New password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Enter new password"
                      />
                      {passwordErrors.new_password && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordErrors.new_password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        {...registerPassword('confirm_password', {
                          required: 'Please confirm your new password',
                        })}
                        type="password"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Confirm new password"
                      />
                      {passwordErrors.confirm_password && (
                        <p className="text-red-500 text-sm mt-1">
                          {passwordErrors.confirm_password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Customize your experience
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive email updates about your account</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive text message alerts</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                      <p className="text-sm text-gray-600">Use dark theme</p>
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      role="switch"
                      aria-checked="false"
                    >
                      <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}