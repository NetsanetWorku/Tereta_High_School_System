'use client'

import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { messageAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function TeacherMessages() {
  const [conversations, setConversations] = useState([])
  const [parents, setParents] = useState([])
  const [selectedConv, setSelectedConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showNewConv, setShowNewConv] = useState(false)
  const [newConvForm, setNewConvForm] = useState({ parent_id: '', subject: '', message: '' })
  const messagesEndRef = useRef(null)
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {}

  useEffect(() => {
    fetchConversations()
    fetchParents()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await messageAPI.getConversations()
      const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      setConversations(data)
    } catch (e) {
      toast.error('Failed to load conversations')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchParents = async () => {
    try {
      const res = await messageAPI.getAvailableParents()
      const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      setParents(data)
    } catch (e) {}
  }

  const openConversation = async (conv) => {
    setSelectedConv(conv)
    try {
      const res = await messageAPI.getMessages(conv.id)
      const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      setMessages(data)
      fetchConversations()
    } catch (e) {
      toast.error('Failed to load messages')
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConv) return
    setIsSending(true)
    try {
      const res = await messageAPI.sendMessage(selectedConv.id, { message: newMessage })
      const msg = res.data?.data || res.data
      setMessages(prev => [...prev, msg])
      setNewMessage('')
      fetchConversations()
    } catch (e) {
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const startConversation = async (e) => {
    e.preventDefault()
    if (!newConvForm.parent_id || !newConvForm.subject || !newConvForm.message) return
    try {
      const res = await messageAPI.startConversation(newConvForm)
      const conv = res.data?.conversation || res.data
      toast.success('Conversation started')
      setShowNewConv(false)
      setNewConvForm({ parent_id: '', subject: '', message: '' })
      await fetchConversations()
      if (conv?.id) openConversation(conv)
    } catch (e) {
      toast.error('Failed to start conversation')
    }
  }

  const closeConversation = async () => {
    if (!selectedConv) return
    try {
      await messageAPI.closeConversation(selectedConv.id)
      toast.success('Conversation closed')
      setSelectedConv(prev => ({ ...prev, status: 'closed' }))
      fetchConversations()
    } catch (e) {
      toast.error('Failed to close conversation')
    }
  }

  const reopenConversation = async () => {
    if (!selectedConv) return
    try {
      await messageAPI.reopenConversation(selectedConv.id)
      toast.success('Conversation reopened')
      setSelectedConv(prev => ({ ...prev, status: 'open' }))
      fetchConversations()
    } catch (e) {
      toast.error('Failed to reopen conversation')
    }
  }

  const formatTime = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const today = new Date()
    if (d.toDateString() === today.toDateString()) return 'Today'
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowNewConv(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
            >
              + New
            </button>
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-500 text-sm">No conversations yet</p>
              <button
                onClick={() => setShowNewConv(true)}
                className="mt-3 text-blue-600 text-sm hover:underline"
              >
                Message a parent
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedConv?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900 text-sm truncate">
                      {conv.parent?.user?.name || 'Parent'}
                    </span>
                    <span className="text-xs text-gray-400 ml-2 shrink-0">
                      {conv.latest_message ? formatDate(conv.latest_message.created_at) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{conv.subject}</p>
                  {conv.latest_message && (
                    <p className="text-xs text-gray-400 truncate mt-1">{conv.latest_message.message}</p>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      conv.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {conv.status}
                    </span>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConv.parent?.user?.name || 'Parent'}</h3>
                  <p className="text-sm text-gray-500">{selectedConv.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    selectedConv.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {selectedConv.status}
                  </span>
                  {selectedConv.status === 'open' ? (
                    <button
                      onClick={closeConversation}
                      className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={reopenConversation}
                      className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 shadow-sm rounded-bl-sm'
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {selectedConv.status === 'open' ? (
                <form onSubmit={sendMessage} className="bg-white border-t border-gray-200 p-4 flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              ) : (
                <div className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
                  This conversation is closed.
                  <button onClick={reopenConversation} className="ml-2 text-blue-600 hover:underline">Reopen?</button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Or start a new one to message a parent</p>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewConv && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">New Conversation</h3>
            <form onSubmit={startConversation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
                <select
                  value={newConvForm.parent_id}
                  onChange={(e) => setNewConvForm(p => ({ ...p, parent_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a parent...</option>
                  {parents.map(p => (
                    <option key={p.id} value={p.id}>{p.user?.name || 'Parent'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newConvForm.subject}
                  onChange={(e) => setNewConvForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="e.g. Student progress update"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={newConvForm.message}
                  onChange={(e) => setNewConvForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Write your message..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewConv(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}