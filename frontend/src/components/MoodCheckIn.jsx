import React, { useState } from 'react'
import './MoodCheckIn.css'

function MoodCheckIn({ itineraryId, userId, onCheckInComplete }) {
  const [formData, setFormData] = useState({
    mood: '',
    energyLevel: 'medium',
    stressLevel: 'medium',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [recommendations, setRecommendations] = useState(null)

  const moods = [
    { value: 'happy', label: '😊 Happy', color: '#4CAF50' },
    { value: 'calm', label: '😌 Calm', color: '#2196F3' },
    { value: 'tired', label: '😴 Tired', color: '#FF9800' },
    { value: 'anxious', label: '😰 Anxious', color: '#F44336' },
    { value: 'energetic', label: '⚡ Energetic', color: '#9C27B0' },
    { value: 'stressed', label: '😓 Stressed', color: '#E91E63' }
  ]

  const levels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.mood) {
      setMessage({ type: 'error', text: 'Please select your current mood' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // TEMP: simulate successful mood check-in
        setRecommendations([
        'Start your day with calm, low-effort places',
        'Avoid crowded areas today',
        'Choose cafes, parks, or beaches'
         ])

      setMessage({ type: 'success', text: 'Check-in saved! Recommendations updated.' })

      setMessage({ type: 'success', text: 'Check-in saved! Here are personalized recommendations.' })
      
      if (onCheckInComplete) {
        onCheckInComplete(response.data.checkin)
      }

      // Reset form after delay
      setTimeout(() => {
        setFormData({
          mood: '',
          energyLevel: 'medium',
          stressLevel: 'medium',
          notes: ''
        })
      }, 3000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save check-in' })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="mood-checkin">
      <h3>Daily Emotional Check-in</h3>
      <p className="checkin-description">
        Share how you're feeling today. TravelWise will adjust your itinerary accordingly.
      </p>

      <form onSubmit={handleSubmit} className="checkin-form">
        <div className="form-group">
          <label>How are you feeling? *</label>
          <div className="mood-grid">
            {moods.map(mood => (
              <button
                key={mood.value}
                type="button"
                className={`mood-button ${formData.mood === mood.value ? 'selected' : ''}`}
                onClick={() => handleChange('mood', mood.value)}
                style={{
                  borderColor: formData.mood === mood.value ? mood.color : '#ddd',
                  backgroundColor: formData.mood === mood.value ? `${mood.color}15` : 'white'
                }}
              >
                <span className="mood-emoji">{mood.label.split(' ')[0]}</span>
                <span>{mood.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Energy Level</label>
            <select
              value={formData.energyLevel}
              onChange={(e) => handleChange('energyLevel', e.target.value)}
            >
              {levels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Stress Level</label>
            <select
              value={formData.stressLevel}
              onChange={(e) => handleChange('stressLevel', e.target.value)}
            >
              {levels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Additional Notes (optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows="3"
            placeholder="Any specific concerns or feelings you'd like to share?"
          />
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {recommendations && (
          <div className="recommendations-box">
            <h4>✨ Personalized Recommendations</h4>
            <p className="recommendation-message">{recommendations.message}</p>
            {recommendations.suggestedChanges && recommendations.suggestedChanges.length > 0 && (
              <ul className="recommendation-list">
                {recommendations.suggestedChanges.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading || !formData.mood}>
          {loading ? 'Saving...' : 'Submit Check-in'}
        </button>
      </form>
    </div>
  )
}

export default MoodCheckIn

