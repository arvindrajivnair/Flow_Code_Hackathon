import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth } from '../utils/auth'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = auth.isAuthenticated()

  const handleLogout = () => {
    auth.removeToken()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Enhanced Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-gold/30 py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo with glow effect */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="text-4xl font-black text-gold mr-3 group-hover:animate-pulse">⚡</div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              SeedIt
            </h1>
          </div>

          {/* Enhanced Navigation */}
          {isAuthenticated && location.pathname !== '/login' && (
            <nav className="flex gap-3 items-center">
              <button 
                onClick={() => navigate('/create-tournament')}
                className="px-6 py-2.5 bg-gradient-to-r from-gold to-gold-light text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 transform hover:scale-105"
              >
                ⚡ Create Tournament
              </button>
              <button 
                onClick={handleLogout}
                className="px-6 py-2.5 border-2 border-gold/60 text-gold rounded-lg hover:bg-gold hover:text-black transition-all duration-300"
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content with improved spacing */}
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-80px)]">
        {children}
      </main>
    </div>
  )
}

export default Layout
