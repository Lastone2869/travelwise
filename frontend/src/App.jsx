import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Destinations from './pages/Destinations'
import Itineraries from './pages/Itineraries'
import './App.css'
import './components/common.css'

function App() {
  const location = useLocation()

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            ✈️ TravelWise
          </Link>
          <div className="navbar-links">
            <Link 
              to="/destinations" 
              className={location.pathname.startsWith('/destinations') ? 'active' : ''}
            >
              Destinations
            </Link>
            <Link 
              to="/itineraries" 
              className={location.pathname.startsWith('/itineraries') ? 'active' : ''}
            >
              Generate Itinerary
            </Link>
          </div>
        </div>
      </nav>

      <main className="main-content">
      <Routes>
  <Route path="/" element={<Itineraries />} />
  <Route path="/destinations" element={<Destinations />} />
  <Route path="/itineraries" element={<Itineraries />} />
</Routes>
      </main>
    </div>
  )
}

export default App

