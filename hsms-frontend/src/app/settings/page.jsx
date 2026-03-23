'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '@/components/DashboardLayout'
import { getSettingsKey } from '@/lib/useTheme'

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('general')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [isClient, setIsClient] = useState(false)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      attendance: true,
      grades: true,
      assignments: true,
      announcements: true,
    },
    privacy: {
      profileVisibility: 'school',
      showEmail: false,
      showPhone: false,
      allowMessages: true,
    },
    appearance: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
    },
    system: {
      autoLogout: 30,
      sessionTimeout: 60,
      twoFactorAuth: false,
      loginAlerts: true,
    }
  })

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
      
      // Load settings from localStorage using user-specific key
      const savedSettings = localStorage.getItem(getSettingsKey())
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
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

  const saveSettings = () => {
    if (!isClient) return
    
    try {
      localStorage.setItem(getSettingsKey(), JSON.stringify(settings))
      window.dispatchEvent(new Event('settingsUpdated'))
      showSuccess('Settings saved successfully!')
    } catch (error) {
      showError('Error saving settings. Please try again.')
    }
  }

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }))
  }

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        notifications: {
          email: true,
          sms: false,
          push: true,
          attendance: true,
          grades: true,
          assignments: true,
          announcements: true,
        },
        privacy: {
          profileVisibility: 'school',
          showEmail: false,
          showPhone: false,
          allowMessages: true,
        },
        appearance: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '12h',
        },
        system: {
          autoLogout: 30,
          sessionTimeout: 60,
          twoFactorAuth: false,
          loginAlerts: true,
        }
      })
      showSuccess('Settings reset to defaults!')
    }
  }

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )

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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your application preferences and system settings
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={resetToDefaults}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={saveSettings}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ⚙️ General
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔔 Notifications
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'privacy'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔒 Privacy
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appearance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🎨 Appearance
              </button>
              {(user?.role === 'admin' || user?.role === 'teacher') && (
                <button
                  onClick={() => setActiveTab('system')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'system'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🛡️ Security
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Basic application preferences and account settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Dashboard View
                    </label>
                    <select
                      value={settings.general?.defaultView || 'overview'}
                      onChange={(e) => updateSetting('general', 'defaultView', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="overview">Overview</option>
                      <option value="calendar">Calendar</option>
                      <option value="recent">Recent Activity</option>
                      <option value="stats">Statistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Items per Page
                    </label>
                    <select
                      value={settings.general?.itemsPerPage || 10}
                      onChange={(e) => updateSetting('general', 'itemsPerPage', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>

                  <ToggleSwitch
                    checked={settings.general?.autoRefresh || false}
                    onChange={(value) => updateSetting('general', 'autoRefresh', value)}
                    label="Auto-refresh Data"
                    description="Automatically refresh data every 5 minutes"
                  />

                  <ToggleSwitch
                    checked={settings.general?.showTips || true}
                    onChange={(value) => updateSetting('general', 'showTips', value)}
                    label="Show Helpful Tips"
                    description="Display helpful tips and tutorials"
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Choose how you want to be notified about important events
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">Delivery Methods</h4>
                    <div className="space-y-2">
                      <ToggleSwitch
                        checked={settings.notifications.email}
                        onChange={(value) => updateSetting('notifications', 'email', value)}
                        label="Email Notifications"
                        description="Receive notifications via email"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.sms}
                        onChange={(value) => updateSetting('notifications', 'sms', value)}
                        label="SMS Notifications"
                        description="Receive notifications via text message"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.push}
                        onChange={(value) => updateSetting('notifications', 'push', value)}
                        label="Push Notifications"
                        description="Receive browser push notifications"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">Notification Types</h4>
                    <div className="space-y-2">
                      <ToggleSwitch
                        checked={settings.notifications.attendance}
                        onChange={(value) => updateSetting('notifications', 'attendance', value)}
                        label="Attendance Updates"
                        description="Get notified about attendance changes"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.grades}
                        onChange={(value) => updateSetting('notifications', 'grades', value)}
                        label="Grade Updates"
                        description="Get notified when new grades are posted"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.assignments}
                        onChange={(value) => updateSetting('notifications', 'assignments', value)}
                        label="Assignment Reminders"
                        description="Get reminders about upcoming assignments"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.announcements}
                        onChange={(value) => updateSetting('notifications', 'announcements', value)}
                        label="School Announcements"
                        description="Get notified about school-wide announcements"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Control who can see your information and how you can be contacted
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Visibility
                    </label>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="public">Public (Everyone)</option>
                      <option value="school">School Only</option>
                      <option value="class">Class Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <ToggleSwitch
                    checked={settings.privacy.showEmail}
                    onChange={(value) => updateSetting('privacy', 'showEmail', value)}
                    label="Show Email Address"
                    description="Allow others to see your email address"
                  />

                  <ToggleSwitch
                    checked={settings.privacy.showPhone}
                    onChange={(value) => updateSetting('privacy', 'showPhone', value)}
                    label="Show Phone Number"
                    description="Allow others to see your phone number"
                  />

                  <ToggleSwitch
                    checked={settings.privacy.allowMessages}
                    onChange={(value) => updateSetting('privacy', 'allowMessages', value)}
                    label="Allow Messages"
                    description="Allow other users to send you messages"
                  />
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Appearance Settings</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Customize the look and feel of your interface
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="light">☀️ Light</option>
                      <option value="dark">🌙 Dark</option>
                      <option value="auto">💻 Auto (System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.appearance.timezone}
                      onChange={(e) => updateSetting('appearance', 'timezone', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select
                        value={settings.appearance.dateFormat}
                        onChange={(e) => updateSetting('appearance', 'dateFormat', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Format
                      </label>
                      <select
                        value={settings.appearance.timeFormat}
                        onChange={(e) => updateSetting('appearance', 'timeFormat', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="12h">12 Hour</option>
                        <option value="24h">24 Hour</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (user?.role === 'admin' || user?.role === 'teacher') && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Advanced security and system preferences
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto Logout (minutes)
                    </label>
                    <select
                      value={settings.system.autoLogout}
                      onChange={(e) => updateSetting('system', 'autoLogout', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={settings.system.sessionTimeout}
                      onChange={(e) => updateSetting('system', 'sessionTimeout', parseInt(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={240}>4 hours</option>
                      <option value={480}>8 hours</option>
                    </select>
                  </div>

                  <ToggleSwitch
                    checked={settings.system.twoFactorAuth}
                    onChange={(value) => updateSetting('system', 'twoFactorAuth', value)}
                    label="Two-Factor Authentication"
                    description="Require additional verification when logging in"
                  />

                  <ToggleSwitch
                    checked={settings.system.loginAlerts}
                    onChange={(value) => updateSetting('system', 'loginAlerts', value)}
                    label="Login Alerts"
                    description="Get notified of new login attempts"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}