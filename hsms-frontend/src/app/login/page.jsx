'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/lib/store'
import Link from 'next/link'

const roles = [
  { label: 'Admin',   icon: '🛡️', color: 'bg-red-100 text-red-700 border-red-200',     desc: 'Full system access' },
  { label: 'Teacher', icon: '📚', color: 'bg-blue-100 text-blue-700 border-blue-200',   desc: 'Classes & grades' },
  { label: 'Student', icon: '🎓', color: 'bg-green-100 text-green-700 border-green-200', desc: 'Academics & results' },
  { label: 'Parent',  icon: '�', color: 'bg-purple-100 text-purple-700 border-purple-200', desc: 'Monitor progress' },
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await login(data)
      if (result.success) {
        toast.success('Welcome back!')
        const redirectPath = {
          admin: '/admin',
          teacher: '/teacher',
          student: '/student',
          parent: '/parent',
        }[result.user.role] || '/'
        router.replace(redirectPath)
      } else {
        toast.error(result.error || 'Login failed. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      toast.error(!error.response ? 'Cannot connect to server.' : 'Login failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-8"
      style={{
        backgroundImage: 'url(/background.png)',
        minHeight: '100dvh',
      }}
    >
      {/* Overlay — solid enough for all browsers, no backdrop-filter */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.75) 0%, rgba(0,0,0,0.65) 100%)' }} />

      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden">

        {/* Left panel — hidden on mobile */}
        <div className="hidden md:flex flex-col justify-between w-5/12 p-10 text-white" style={{ background: 'linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%)' }}>
          <div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-6" style={{ background: 'rgba(255,255,255,0.15)' }}>
              🏫
            </div>
            <h1 className="text-2xl font-bold leading-tight mb-1">Tereta High School</h1>
            <p className="text-sm" style={{ color: '#bfdbfe' }}>Management System</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#93c5fd' }}>Who can log in</p>
            {roles.map((r) => (
              <div key={r.label} className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <span className="text-xl leading-none">{r.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{r.label}</p>
                  <p className="text-xs" style={{ color: '#bfdbfe' }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs" style={{ color: '#93c5fd' }}>© {new Date().getFullYear()} Tereta High School</p>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 bg-white flex flex-col justify-center px-6 py-10 sm:px-10">

          {/* Mobile school header */}
          <div className="md:hidden text-center mb-6">
            <span className="text-4xl">🏫</span>
            <h1 className="text-xl font-bold text-gray-900 mt-2">Tereta High School</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                })}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors"
                style={{
                  borderColor: errors.email ? '#f87171' : '#d1d5db',
                  boxShadow: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                onBlur={e => (e.target.style.borderColor = errors.email ? '#f87171' : '#d1d5db')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors pr-12"
                  style={{
                    borderColor: errors.password ? '#f87171' : '#d1d5db',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#3b82f6')}
                  onBlur={e => (e.target.style.borderColor = errors.password ? '#f87171' : '#d1d5db')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-0 bottom-0 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Role badges — mobile only */}
          <div className="mt-6 md:hidden">
            <p className="text-xs text-gray-400 mb-3 text-center">Available for</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {roles.map((r) => (
                <span key={r.label} className={`text-xs px-3 py-1 rounded-full border font-medium ${r.color}`}>
                  {r.icon} {r.label}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
