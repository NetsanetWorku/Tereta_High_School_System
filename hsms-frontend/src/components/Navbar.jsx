'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-600 text-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-blue-600">T</span>
              </div>
              <span className="text-xl font-bold">Tereta HSMS</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <Link href="/" className="hover:text-blue-200 transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-blue-200 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-200 transition">
              Contact
            </Link>
            
            {/* Auth Section */}
            {isAuthenticated && user ? (
              <>
                <span className="text-blue-200">|</span>
                <Link href={`/${user.role}`} className="hover:text-blue-200">
                  Dashboard
                </Link>
                <span className="text-blue-200">|</span>
                <span className="text-sm">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className="text-blue-200">|</span>
                <Link href="/login" className="hover:text-blue-200">
                  Login
                </Link>
                <span className="text-blue-200">|</span>
                <Link href="/register" className="hover:text-blue-200">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md hover:bg-blue-800 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md hover:bg-blue-800 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md hover:bg-blue-800 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="border-t border-blue-600 my-2"></div>
            
            {isAuthenticated && user ? (
              <>
                <Link
                  href={`/${user.role}`}
                  className="block px-3 py-2 rounded-md hover:bg-blue-800 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-3 py-2 text-sm text-blue-200">
                  {user.name} ({user.role})
                </div>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-blue-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md hover:bg-blue-800 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
