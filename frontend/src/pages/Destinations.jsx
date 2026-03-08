import React, { useState, useEffect } from 'react'
import { destinationsAPI } from '../services/api'
import DestinationCard from '../components/DestinationCard'
import './Destinations.css'

function Destinations() {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadDestinations()
  }, [])

  const loadDestinations = async () => {
    try {
      setLoading(true)
      const response = await destinationsAPI.getAll()
      setDestinations(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load destinations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = filter === 'all' 
    ? destinations 
    : destinations.filter(d => d.category === filter)

  const categories = ['all', ...new Set(destinations.map(d => d.category))]

  if (loading) {
    return <div className="loading">Loading destinations...</div>
  }

  return (
    <div className="destinations-page">
      <div className="page-header">
        <h1>Available Destinations</h1>
        <p className="page-subtitle">Browse our curated list of destinations</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-bar">
        <label>Filter by category: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="destinations-grid">
        {filteredDestinations.length === 0 ? (
          <div className="empty-state">
            No destinations found.
          </div>
        ) : (
          filteredDestinations.map(destination => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Destinations
