import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { auth } from '../utils/auth'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('viewer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated()) {
      navigate('/create-tournament')
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const response = await api.login(email, password)
        auth.setToken(response.data.access_token)
        navigate('/create-tournament')
      } else {
        await api.register(email, password, role)
        const loginResponse = await api.login(email, password)
        auth.setToken(loginResponse.data.access_token)
        navigate('/create-tournament')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-4xl font-black text-gold mb-2">
            {isLogin ? 'Welcome Back' : 'Join SeedIt'}
          </h2>
          <p className="text-gray-400">
            {isLogin ? 'Sign in to manage your tournaments' : 'Create your account to get started'}
          </p>
        </div>

        {/* Enhanced Form Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gold/20 shadow-2xl hover:shadow-gold/10 transition-all duration-300">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Role Selection for Register */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gold mb-2">
                  Account Type
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-gray-600 rounded-lg text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all duration-300"
                >
                  <option value="viewer">👀 Viewer (Watch tournaments)</option>
                  <option value="host">👑 Host (Create & manage tournaments)</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-gold to-gold-light text-black font-bold text-lg rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/30 border-t-black mr-2"></div>
                  Processing...
                </div>
              ) : (
                isLogin ? '🚀 Sign In' : '✨ Create Account'
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="text-center mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold hover:text-gold-light transition-colors font-medium"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
