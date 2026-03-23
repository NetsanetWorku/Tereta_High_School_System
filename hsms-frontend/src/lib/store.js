import { create } from 'zustand'
import { authAPI } from './api'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Initialize auth state from localStorage
  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({ isLoading: false })
      }
    }
  },

  // Login
  login: async (credentials) => {
    try {
      console.log('Store: Calling login API...')
      const response = await authAPI.login(credentials)
      console.log('Store: Login API response:', response.data)
      
      const { user, token } = response.data
      
      console.log('Store: Saving to localStorage...')
      console.log('Store: Token:', token?.substring(0, 20) + '...')
      console.log('Store: User:', user)
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Verify it was saved
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      console.log('Store: Verification - Token saved:', !!savedToken)
      console.log('Store: Verification - User saved:', !!savedUser)
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
      
      console.log('Store: Login successful, state updated')
      return { success: true, user }
    } catch (error) {
      console.error('Store: Login error:', error)
      set({ isLoading: false })
      
      // Handle validation errors (422) or other errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        return {
          success: false,
          errors: error.response.data.errors,
          error: 'Validation failed'
        }
      }
      
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  },

  // Logout
  logout: async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await authAPI.register(userData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await authAPI.me()
      const user = response.data
      
      localStorage.setItem('user', JSON.stringify(user))
      set({ user })
      
      return user
    } catch (error) {
      get().logout()
      throw error
    }
  },
}))

// Initialize auth on app start
if (typeof window !== 'undefined') {
  useAuthStore.getState().initAuth()
}