import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-logout on 401 if the error message indicates token is invalid/expired
    // Don't auto-logout for other 401 errors (like wrong credentials during login)
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || ''
      const isTokenError = message.toLowerCase().includes('unauthenticated') || 
                          message.toLowerCase().includes('token') ||
                          message.toLowerCase().includes('expired')
      
      // Only clear auth and redirect if it's a token-related error
      // and we're not on the login page
      if (isTokenError && !window.location.pathname.includes('/login')) {
        console.log('Token expired or invalid, logging out')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ===== AUTHENTICATION API =====
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
  ping: () => api.get('/ping'),
}

// ===== ADMIN APIs =====
export const adminAPI = {
  // User Management
  getPendingUsers: () => api.get('/users/pending'),
  getApprovedUsers: () => api.get('/users/approved'),
  approveUser: (id) => api.post(`/users/${id}/approve`),
  rejectUser: (id) => api.delete(`/users/${id}/reject`),
  
  // Teacher Assignments
  getTeacherAssignments: () => api.get('/assign-teacher'),
  assignTeacher: (data) => api.post('/assign-teacher', data),
  removeTeacherAssignment: (id) => api.delete(`/assign-teacher/${id}`),
  
  // Parent Management
  assignStudentToParent: (data) => api.post('/parents/assign-student', data),
}

// ===== CLASSES API =====
export const classAPI = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
}

// ===== STUDENTS API =====
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
}

// ===== TEACHERS API =====
export const teacherAPI = {
  getAll: () => api.get('/teachers'),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`),
  getMyClasses: () => api.get('/my-classes'),
  getMyTimetable: () => api.get('/teacher/my-timetable'),
  getMyExamSchedules: () => api.get('/teacher/my-exam-schedules'),
  getMyAssignments: () => api.get('/teacher/my-assignments'),
}

// ===== SUBJECTS API =====
export const subjectAPI = {
  getAll: () => api.get('/subjects'),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
}

// ===== ATTENDANCE API =====
export const attendanceAPI = {
  // Teacher routes
  getAll: () => api.get('/attendance'),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  
  // Student routes
  getMyAttendance: () => api.get('/my-attendance'),
  
  // Parent routes
  getChildAttendance: () => api.get('/child-attendance'),
}

// ===== RESULTS API =====
export const resultAPI = {
  // Teacher routes
  getAll: () => api.get('/results'),
  create: (data) => api.post('/results', data),
  update: (id, data) => api.put(`/results/${id}`, data),
  
  // Student routes
  getMyResults: () => api.get('/my-results'),
  
  // Parent routes
  getChildResults: () => api.get('/child-results'),
}

// ===== PARENTS API =====
export const parentAPI = {
  getAll: () => api.get('/parents'),
  getById: (id) => api.get(`/parents/${id}`),
  create: (data) => api.post('/parents', data),
  update: (id, data) => api.put(`/parents/${id}`, data),
  delete: (id) => api.delete(`/parents/${id}`),
  assignStudent: (data) => api.post('/parents/assign-student', data),
  getMyChildren: () => api.get('/parent/children'),
  getChildExamSchedules: (studentId) => api.get(`/child-exam-schedules/${studentId}`),
  getChildExamResults: (studentId) => api.get(`/child-exam-results/${studentId}`),
  getChildAssignments: (studentId) => api.get(`/child-assignments/${studentId}`),
}

// ===== TIMETABLE API =====
export const timetableAPI = {
  // Admin routes
  getAll: () => api.get('/timetables'),
  create: (data) => api.post('/timetables', data),
  update: (id, data) => api.put(`/timetables/${id}`, data),
  delete: (id) => api.delete(`/timetables/${id}`),
  getByClass: (classId) => api.get(`/timetables/class/${classId}`),
  
  // Student routes
  getMyTimetable: () => api.get('/my-timetable'),
}

// ===== EXAMS API =====
export const examAPI = {
  // Admin routes
  getAll: () => api.get('/exams'),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
  getSchedules: (examId) => api.get(`/exams/${examId}/schedules`),
  
  // Schedule management
  createSchedule: (data) => api.post('/exam-schedules', data),
  updateSchedule: (id, data) => api.put(`/exam-schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/exam-schedules/${id}`),
  getScheduleStudents: (scheduleId) => api.get(`/exam-schedules/${scheduleId}/students`),
  
  // Results
  storeResult: (data) => api.post('/exam-results', data),
  
  // Student routes
  getMySchedules: () => api.get('/my-exam-schedules'),
  getMyResults: () => api.get('/my-exam-results'),
}

// ===== ASSIGNMENTS API =====
export const assignmentAPI = {
  // Admin routes
  getAll: () => api.get('/assignments'),
  
  // Teacher routes
  getTeacherAssignments: () => api.get('/teacher/my-assignments'),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  getSubmissions: (id) => api.get(`/assignments/${id}/submissions`),
  gradeSubmission: (id, data) => api.post(`/assignment-submissions/${id}/grade`, data),
  
  // Student routes
  getStudentAssignments: () => api.get('/my-assignments'),
  submitAssignment: (id, data) => api.post(`/assignments/${id}/submit`, data),
}

// ===== MESSAGING API =====
export const messageAPI = {
  getConversations: () => api.get('/conversations'),
  getMessages: (id) => api.get(`/conversations/${id}/messages`),
  sendMessage: (id, data) => api.post(`/conversations/${id}/messages`, data),
  startConversation: (data) => api.post('/conversations', data),
  closeConversation: (id) => api.put(`/conversations/${id}/close`),
  reopenConversation: (id) => api.put(`/conversations/${id}/reopen`),
  
  // Contact lists
  getAvailableTeachers: () => api.get('/available-teachers'),
  getAvailableParents: () => api.get('/available-parents'),
}

// ===== REPORTS API =====
export const reportAPI = {
  getDashboardStats: () => api.get('/reports/dashboard-stats'),
  getStudentPerformance: (studentId) => api.get(`/reports/student/${studentId}`),
  getClassPerformance: (classId) => api.get(`/reports/class/${classId}`),
  getAttendanceReport: () => api.get('/reports/attendance'),
  getResultsReport: () => api.get('/reports/results'),
  getTeacherPerformance: (teacherId) => api.get(`/reports/teacher/${teacherId}`),
}

// ===== PROFILE API =====
export const profileAPI = {
  updateProfile: (data) => api.put('/profile', data),
  uploadPicture: (formData) => api.post('/profile/upload-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getPicture: () => api.get('/profile/picture'),
  deletePicture: () => api.delete('/profile/picture'),
  changePassword: (data) => api.put('/profile/password', data),
}

export default api