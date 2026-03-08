import React, { useState, useEffect } from 'react'
import { preferencesAPI } from '../services/api'
import './Preferences.css'

function Preferences() {
  const [preferences, setPreferences] = useState({
    travelAnxiety: false,
    travelAnxietyLevel: 'moderate',
    womensSafety: false,
    safetyConcerns: false,
    avoidNightTravel: false,
    foodSensitivity: false,
    overstimulationConcern: false,
    silentTravelMode: false,
    avoidTrekking: false,
    preferredCategories: [],
    budgetRange: '',
    travelStyle: 'moderate',
    maxTripDuration: 14
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const categories = ['city', 'beach', 'mountain', 'historical', 'nature', 'other']
  const anxietyLevels = [
    { value: 'low', label: 'Low' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'high', label: 'High' }
  ]
  const travelStyles = [
    { value: 'relaxed', label: 'Relaxed - Slow pace, lots of rest' },
    { value: 'moderate', label: 'Moderate - Balanced activities' },
    { value: 'fast-paced', label: 'Fast-paced - Maximize activities' }
  ]

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      setLoading(true)
      const response = await preferencesAPI.get()
      if (response.data && Object.keys(response.data).length > 0) {
        setPreferences({ ...preferences, ...response.data })
      }
    } catch (err) {
      console.error('Failed to load preferences:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      await preferencesAPI.update(preferences)
      setMessage({ type: 'success', text: 'Preferences saved successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save preferences' })
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const toggleCategory = (category) => {
    setPreferences(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter(c => c !== category)
        : [...prev.preferredCategories, category]
    }))
  }

  const handleChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return <div className="loading">Loading preferences...</div>
  }

  return (
    <div className="preferences-page">
      <div className="page-header">
        <h1>Travel Preferences</h1>
        <p className="page-subtitle">
          Help TravelWise understand your needs for safe, comfortable, and personalized travel planning
        </p>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="preferences-form">
        {/* Travel Anxiety Section */}
        <div className="form-section">
          <h2>Travel Anxiety</h2>
          <p className="section-description">
            Help us create calmer, more predictable travel experiences
          </p>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.travelAnxiety}
                onChange={(e) => handleChange('travelAnxiety', e.target.checked)}
              />
              <span>I experience travel anxiety</span>
            </label>
          </div>
          {preferences.travelAnxiety && (
            <div className="form-group">
              <label>Anxiety Level</label>
              <select
                value={preferences.travelAnxietyLevel}
                onChange={(e) => handleChange('travelAnxietyLevel', e.target.value)}
              >
                {anxietyLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <p className="field-hint">
                Higher anxiety levels will prioritize direct routes and avoid crowded areas
              </p>
            </div>
          )}
        </div>

        {/* Safety Section */}
        <div className="form-section">
          <h2>Safety & Security</h2>
          <p className="section-description">
            Prioritize safer routes and verified transport options
          </p>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.womensSafety}
                onChange={(e) => handleChange('womensSafety', e.target.checked)}
              />
              <span>Women's safety priority</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.safetyConcerns}
                onChange={(e) => handleChange('safetyConcerns', e.target.checked)}
              />
              <span>General safety concerns</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.avoidNightTravel}
                onChange={(e) => handleChange('avoidNightTravel', e.target.checked)}
              />
              <span>Avoid night travel (8 PM - 6 AM)</span>
            </label>
          </div>
        </div>

        {/* Food & Health Section */}
        <div className="form-section">
          <h2>Food & Health</h2>
          <p className="section-description">
            Get recommendations for comfortable, digestible meals during travel
          </p>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.foodSensitivity}
                onChange={(e) => handleChange('foodSensitivity', e.target.checked)}
              />
              <span>Food sensitivity or stomach issues</span>
            </label>
            <p className="field-hint">
              We'll suggest light meals on travel days and avoid risky foods during journeys
            </p>
          </div>
        </div>

        {/* Overstimulation Section */}
        <div className="form-section">
          <h2>Overstimulation & Burnout</h2>
          <p className="section-description">
            Prevent travel burnout with calmer, slower-paced itineraries
          </p>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.overstimulationConcern}
                onChange={(e) => handleChange('overstimulationConcern', e.target.checked)}
              />
              <span>Concerned about overstimulation</span>
            </label>
            {preferences.overstimulationConcern && (
              <>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={preferences.silentTravelMode}
                    onChange={(e) => handleChange('silentTravelMode', e.target.checked)}
                  />
                  <span>Silent travel mode (prefer calm, quiet locations)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={preferences.avoidTrekking}
                    onChange={(e) => handleChange('avoidTrekking', e.target.checked)}
                  />
                  <span>Avoid physically demanding activities (trekking, hiking)</span>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Preferred Categories */}
        <div className="form-section">
          <h2>Preferred Categories</h2>
          <p className="section-description">Select the types of destinations you're interested in</p>
          <div className="categories-grid">
            {categories.map(category => (
              <label key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={preferences.preferredCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Travel Style & Duration */}
        <div className="form-section">
          <h2>Travel Style & Duration</h2>
          <div className="form-group">
            <label>Travel Style</label>
            <select
              value={preferences.travelStyle}
              onChange={(e) => handleChange('travelStyle', e.target.value)}
            >
              {travelStyles.map(style => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Maximum Trip Duration (days)</label>
            <input
              type="number"
              min="1"
              max="365"
              value={preferences.maxTripDuration}
              onChange={(e) => handleChange('maxTripDuration', parseInt(e.target.value) || 14)}
            />
          </div>

          <div className="form-group">
            <label>Budget Range</label>
            <select
              value={preferences.budgetRange}
              onChange={(e) => handleChange('budgetRange', e.target.value)}
            >
              <option value="">Not specified</option>
              <option value="budget">Budget ($)</option>
              <option value="moderate">Moderate ($$)</option>
              <option value="luxury">Luxury ($$$)</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Preferences
