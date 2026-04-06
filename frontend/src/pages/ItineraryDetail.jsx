import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { itinerariesAPI } from '../services/api'
import MapView from '../components/MapView'
import MoodCheckIn from '../components/MoodCheckIn'
import './ItineraryDetail.css'

function ItineraryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadItinerary()
  }, [id])

  const loadItinerary = async () => {
    try {
      setLoading(true)
      const response = await itinerariesAPI.getById(id)
      setItinerary(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load itinerary')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckInComplete = async (updatedItinerary) => {
    // Reload itinerary to get updated recommendations
    if (updatedItinerary) {
      setItinerary(updatedItinerary)
    } else {
      loadItinerary()
    }
  }

  if (loading) {
    return <div className="loading">Loading itinerary...</div>
  }

  if (error || !itinerary) {
    return (
      <div className="error-container">
        <div className="error-message">{error || 'Itinerary not found'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/itineraries')}>
          Back to Itineraries
        </button>
      </div>
    )
  }

  return (
    <div className="itinerary-detail-page">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate('/itineraries')}>
          ← Back
        </button>
        <div>
          <h1>{itinerary.name}</h1>
          {itinerary.description && <p className="itinerary-description">{itinerary.description}</p>}
        </div>
      </div>

      {/* Mood Adjustments Banner */}
      {itinerary.moodAdjustments && (
        <div className="mood-adjustments-banner">
          <h4>✨ Personalized Recommendations</h4>
          <p>{itinerary.moodAdjustments.message}</p>
          {itinerary.moodAdjustments.suggestedChanges && itinerary.moodAdjustments.suggestedChanges.length > 0 && (
            <ul>
              {itinerary.moodAdjustments.suggestedChanges.map((change, idx) => (
                <li key={idx}>{change}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mood Check-in */}
      <MoodCheckIn 
        itinerary={itinerary} 
        userId={itinerary.userId || 'default'}
        onCheckInComplete={handleCheckInComplete}
      />

      <div className="detail-content">
        <div className="map-container">
          <MapView destinations={itinerary.destinations} />
        </div>

        <div className="destinations-list">
          <h2>Route ({itinerary.destinations.length} stops)</h2>
          <div className="route-list">
            {itinerary.dayWiseItinerary ? (
              itinerary.dayWiseItinerary.map((dayBlock) => (
                <div key={`day-${dayBlock.day}`} className="day-block" style={{ marginBottom: '2rem' }}>
                  <h3 style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Day {dayBlock.day}</h3>
                  {dayBlock.places.map((dest, index) => {
                    const dayType = 'travel'; // simplify for layout purposes
                    return (
                      <div key={dest.id} className="route-item">
                        <div className="route-number">{index + 1}</div>
                        <div className="route-details">
                          <h3>{dest.name}</h3>
                          {dest.description && <p>{dest.description}</p>}
                          <div className="route-meta">
                            <span className="category">{dest.category}</span>
                            <span className="days">{dest.estimatedDays} day{dest.estimatedDays !== 1 ? 's' : ''}</span>
                            {dest.safetyRating && <span className="safety-rating">🛡️ Safety: {dest.safetyRating}/5</span>}
                          </div>
                          {dest.foodRecommendations && dest.foodRecommendations.length > 0 && (
                            <div className="food-recommendations">
                              <strong>🍽️ Food Recommendations:</strong>
                              {dest.foodRecommendations.map((rec, recIdx) => (
                                <div key={recIdx} className="food-rec">
                                  <p className="food-reasoning">{rec.reasoning}</p>
                                  {rec.suggestions && rec.suggestions.length > 0 && <div><strong>Suggested:</strong> {rec.suggestions.join(', ')}</div>}
                                  {rec.avoid && rec.avoid.length > 0 && <div className="food-avoid"><strong>Avoid:</strong> {rec.avoid.join(', ')}</div>}
                                </div>
                              ))}
                            </div>
                          )}
                          {dest.transportSuggestion && (
                            <div className="transport-suggestion">
                              <strong>🚗 Transport Suggestion:</strong>
                              <p>{dest.transportSuggestion.reasoning}</p>
                              <span className="transport-mode">Mode: {dest.transportSuggestion.mode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                            </div>
                          )}
                          {dest.attractions && dest.attractions.length > 0 && (
                            <div className="attractions"><strong>Attractions:</strong> {dest.attractions.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))
            ) : (
              itinerary.destinations.map((dest, index) => {
                const dayType = index === 0 || index === itinerary.destinations.length - 1 ? 'travel' : 'rest'
                return (
                  <div key={dest.id} className="route-item">
                    <div className="route-number">{index + 1}</div>
                    <div className="route-details">
                      <h3>{dest.name}</h3>
                      {dest.description && <p>{dest.description}</p>}
                      <div className="route-meta">
                        <span className="category">{dest.category}</span>
                        <span className="days">{dest.estimatedDays} day{dest.estimatedDays !== 1 ? 's' : ''}</span>
                        {dest.safetyRating && (
                          <span className="safety-rating">
                            🛡️ Safety: {dest.safetyRating}/5
                          </span>
                        )}
                      </div>
  
                      {/* Food Recommendations */}
                      {dest.foodRecommendations && dest.foodRecommendations.length > 0 && (
                        <div className="food-recommendations">
                          <strong>🍽️ Food Recommendations ({dayType === 'travel' ? 'Travel Day' : 'Rest Day'}):</strong>
                          {dest.foodRecommendations.map((rec, recIdx) => (
                            <div key={recIdx} className="food-rec">
                              <p className="food-reasoning">{rec.reasoning}</p>
                              {rec.suggestions && rec.suggestions.length > 0 && (
                                <div>
                                  <strong>Suggested:</strong> {rec.suggestions.join(', ')}
                                </div>
                              )}
                              {rec.avoid && rec.avoid.length > 0 && (
                                <div className="food-avoid">
                                  <strong>Avoid:</strong> {rec.avoid.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
  
                      {/* Transport Suggestion */}
                      {dest.transportSuggestion && (
                        <div className="transport-suggestion">
                          <strong>🚗 Transport Suggestion:</strong>
                          <p>{dest.transportSuggestion.reasoning}</p>
                          <span className="transport-mode">
                            Mode: {dest.transportSuggestion.mode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      )}
  
                      {dest.attractions && dest.attractions.length > 0 && (
                        <div className="attractions">
                          <strong>Attractions:</strong> {dest.attractions.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItineraryDetail
