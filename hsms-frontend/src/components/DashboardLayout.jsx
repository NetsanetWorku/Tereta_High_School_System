'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import { messageAPI } from '@/lib/api'
import { getTheme } from '@/lib/useTheme'

export default function DashboardLayout({ children, requiredRole }) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuthStore()
  const [currentUser, setCurrentUser] = useState(null)
  const [isChecking, setIsChecking] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Simple auth check - no delays, no race conditions
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    console.log('DashboardLayout: Auth check', { 
      path: pathname,
      hasToken: !!token, 
      hasUser: !!storedUser 
    })
    
    if (!token || !storedUser) {
      console.log('DashboardLayout: No auth, redirecting to login')
      setIsChecking(false)
      router.replace('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      console.log('DashboardLayout: User found:', parsedUser.name, 'Role:', parsedUser.role)
      
      // Check role requirement
      if (requiredRole && parsedUser.role !== requiredRole) {
        console.log(`DashboardLayout: Wrong role. Need ${requiredRole}, got ${parsedUser.role}`)
        setIsChecking(false)
        router.replace(`/${parsedUser.role}`)
        return
      }
      
      setCurrentUser(parsedUser)
      setIsChecking(false)
      setTheme(getTheme())
    } catch (error) {
      console.error('DashboardLayout: Parse error:', error)
      setIsChecking(false)
      router.replace('/login')
    }
  }, [pathname, requiredRole, router])

  // Re-read user from localStorage when profile is updated
  useEffect(() => {
    const handleUserUpdated = () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) setCurrentUser(JSON.parse(storedUser))
      } catch (e) {}
    }
    const handleSettingsUpdated = () => setTheme(getTheme())
    window.addEventListener('userUpdated', handleUserUpdated)
    window.addEventListener('settingsUpdated', handleSettingsUpdated)
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdated)
      window.removeEventListener('settingsUpdated', handleSettingsUpdated)
    }
  }, [])

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  // Fetch unread message count for teacher/parent
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await messageAPI.getConversations()
      const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      const total = data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0)
      setUnreadCount(total)
    } catch (e) {}
  }, [])

  useEffect(() => {
    if (!currentUser) return
    if (currentUser.role === 'teacher' || currentUser.role === 'parent') {
      fetchUnreadCount()
      // Poll every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [currentUser, fetchUnreadCount])

  // Reset unread count when on messages page
  useEffect(() => {
    if (pathname.endsWith('/messages')) {
      setUnreadCount(0)
    }
  }, [pathname])

  // Show loading while checking
  if (isChecking || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const roleColors = {
    admin: 'bg-red-600',
    teacher: 'bg-blue-600',
    student: 'bg-green-600',
    parent: 'bg-purple-600'
  }

  const roleLinks = {
    admin: [
      { href: '/admin', label: 'Dashboard', icon: '' },
      { href: '/admin/students', label: 'Students', icon: '' },
      { href: '/admin/teachers', label: 'Teachers', icon: '' },
      { href: '/admin/parents', label: 'Parents', icon: '' },
      { href: '/admin/classes', label: 'Classes', icon: '' },
      { href: '/admin/subjects', label: 'Subjects', icon: '' },
      { href: '/admin/assignments', label: 'Assignments', icon: '' },
    ],
    teacher: [
      { href: '/teacher', label: 'Dashboard', icon: '' },
      { href: '/teacher/classes', label: 'My Classes', icon: '' },
      { href: '/teacher/assignments', label: 'Assignments', icon: '' },
      { href: '/teacher/attendance', label: 'Attendance', icon: '' },
      { href: '/teacher/results', label: 'Results', icon: '' },
      { href: '/teacher/messages', label: 'Messages', icon: '💬' },
    ],
    student: [
      { href: '/student', label: 'Dashboard', icon: '' },
      { href: '/student/attendance', label: 'My Attendance', icon: '' },
      { href: '/student/results', label: 'My Results', icon: '' },
    ],
    parent: [
      { href: '/parent', label: 'Dashboard', icon: '' },
      { href: '/parent/children', label: 'My Children', icon: '' },
      { href: '/parent/attendance', label: 'Attendance', icon: '' },
      { href: '/parent/results', label: 'Results', icon: '' },
      { href: '/parent/messages', label: 'Messages', icon: '💬' },
    ]
  }

  const commonLinks = [
    { href: '/profile', label: 'Profile', icon: '👤' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
    { href: '/help', label: 'Help & Support', icon: '❓' },
  ]

  const links = roleLinks[currentUser.role] || []
  const bgColor = roleColors[currentUser.role] || 'bg-gray-600'

  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation - Fixed */}
      <nav className={`${bgColor} text-white shadow-lg fixed top-0 left-0 right-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href={`/${currentUser.role}`} className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-2xl font-bold text-blue-600">T</span>
                </div>
                <span className="text-xl font-bold">Tereta HSMS</span>
              </Link>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </span>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-1">
                <Link 
                  href="/" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-10 transition"
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-10 transition"
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white hover:bg-opacity-10 transition"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="flex items-center space-x-3 hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition">
                {currentUser.profile_picture_url ? (
                  <img 
                    src={currentUser.profile_picture_url} 
                    alt="Profile" 
                    className="h-9 w-9 rounded-full object-cover border-2 border-white border-opacity-30"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-2 border-white border-opacity-30">
                    <span className="text-sm font-semibold">
                      {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">{currentUser.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area with Top Padding */}
      <div className="flex pt-16">
        {/* Side Navigation - Fixed */}
        <aside className="w-64 bg-gray-800 shadow-lg fixed left-0 top-16 bottom-0 overflow-y-auto border-r border-gray-700">
          <nav className="p-4 space-y-2">
            {/* Role-specific links */}
            {links.map((link) => {
              const isMessages = link.href.endsWith('/messages')
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-700 transition text-gray-100 ${isActive ? 'bg-gray-700' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </div>
                  {isMessages && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
            
            {/* Divider */}
            <div className="border-t border-gray-600 my-4"></div>
            
            {/* Common links for all users */}
            {commonLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition text-gray-100"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content - With Left Margin */}
        <main className={`flex-1 ml-64 min-h-screen ${isDark ? 'content-dark' : 'bg-white text-gray-900'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
