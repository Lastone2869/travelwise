import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import RequireAuth from './components/RequireAuth'
import Destinations from './pages/Destinations'
import Itineraries from './pages/Itineraries'
import ItineraryDetail from './pages/ItineraryDetail'
import Preferences from './pages/Preferences'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'
import './components/common.css'

function Navigation() {
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          ✈️ TravelWise
        </Link>
        <div className="navbar-links">
          {currentUser && (
            <>
              <Link 
                to="/destinations" 
                className={location.pathname.startsWith('/destinations') ? 'active' : ''}
              >
                Destinations
              </Link>
              <Link 
                to="/itineraries" 
                className={location.pathname === '/itineraries' ? 'active' : ''}
              >
                Plan Trip
              </Link>
              <Link 
                to="/preferences" 
                className={location.pathname.startsWith('/preferences') ? 'active' : ''}
              >
                Preferences
              </Link>
              <Link 
                to="/profile" 
                className={location.pathname === '/profile' ? 'active' : ''}
              >
                Profile
              </Link>
              <button className="btn btn-secondary" onClick={() => logout()} style={{ marginLeft: '1rem', padding: '0.4rem 0.8rem' }}>
                Logout
              </button>
            </>
          )}
          {!currentUser && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ color: 'white', border: 'none' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function MainContent() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route path="/" element={<RequireAuth><Destinations /></RequireAuth>} />
      <Route path="/destinations" element={<RequireAuth><Destinations /></RequireAuth>} />
      <Route path="/itineraries" element={<RequireAuth><Itineraries /></RequireAuth>} />
      <Route path="/itinerary/:id" element={<RequireAuth><ItineraryDetail /></RequireAuth>} />
      <Route path="/preferences" element={<RequireAuth><Preferences /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <MainContent />
        </main>
      </div>
    </AuthProvider>
  )
}

export default App

