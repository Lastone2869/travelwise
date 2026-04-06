import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { itinerariesAPI, destinationsAPI, preferencesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import DestinationCard from '../components/DestinationCard'
import './Itineraries.css'

function Itineraries() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [planningMode, setPlanningMode] = useState(null) // 'destination' or 'mood'
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [places, setPlaces] = useState([])
  const [loadingDestinations, setLoadingDestinations] = useState(false)
  const [loadingPlaces, setLoadingPlaces] = useState(false)
  const [formData, setFormData] = useState({
    tripType: '',
    durationValue: '',
    durationUnit: 'days',
    travelGroup: 'group',
    mood: 'energetic',
    budget: '',
    foodPreference: 'normal'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generatedItinerary, setGeneratedItinerary] = useState(null)

  const tripTypes = [
    { value: 'heritage', label: 'Heritage' },
    { value: 'art', label: 'Art and Cultural' },
    { value: 'party', label: 'Party' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'beach', label: 'Beach Trip' },
    { value: 'mountain', label: 'Mountain Trip' },
    { value: 'spiritual', label: 'Spiritual' },
    { value: 'relaxation', label: 'Relaxation' }
  ]

  const travelGroups = [
    { value: 'group', label: 'Group/Family' },
    { value: 'solo-woman', label: 'Solo Woman' },
    { value: 'solo', label: 'Solo Traveler' }
  ]

  const moods = [
    { value: 'energetic', label: 'Energetic' },
    { value: 'calm', label: 'Calm' },
    { value: 'tired', label: 'Tired/Low Energy' },
    { value: 'adventurous', label: 'Adventurous' }
  ]

  const foodPreferences = [
    { value: 'normal', label: 'Normal' },
    { value: 'light', label: 'Light/Simple' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'local', label: 'Local Cuisine' }
  ]

  // Load destinations when "By Destination" is selected
  const handlePlanningModeChange = async (mode) => {
    setPlanningMode(mode)
    setSelectedDestination(null)
    setSelectedPlace(null)
    setPlaces([])
    setGeneratedItinerary(null)
    setError(null)
    
    if (mode === 'destination') {
      setLoadingDestinations(true)
      try {
        const response = await destinationsAPI.getAll()
        setDestinations(response.data)
      } catch (err) {
        setError('Failed to load destinations')
        console.error(err)
      } finally {
        setLoadingDestinations(false)
      }
    }
  }

  const handleDestinationSelect = async (destination) => {
    setSelectedDestination(destination)
    setSelectedPlace(null)
    setGeneratedItinerary(null)
    setError(null)
    
    // Load subdestinations for the selected destination
    setLoadingPlaces(true)
    try {
      const response = await destinationsAPI.getSubdestinations(destination.id)
      setPlaces(response.data)
    } catch (err) {
      setError('Failed to load subdestinations')
      console.error(err)
    } finally {
      setLoadingPlaces(false)
    }
  }

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place)
    setGeneratedItinerary(null)
    setError(null)
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    
    // Validate: If planning by destination, a place must be selected
    if (planningMode === 'destination' && !selectedPlace) {
      setError('Please select a place first')
      return
    }
    
    // Validate budget
    if (!formData.budget || parseFloat(formData.budget) < 1000) {
      setError('Please enter a valid budget (minimum ₹1,000)')
      return
    }

    // Validate duration
    if (!formData.durationValue || parseFloat(formData.durationValue) <= 0) {
      setError('Please enter a valid duration')
      return
    }
    
    // Convert duration to days for backend
    let durationInDays = parseFloat(formData.durationValue)
    if (formData.durationUnit === 'hours') {
      durationInDays = durationInDays / 24 // Convert hours to days (e.g., 12 hours = 0.5 days)
    }
    
    setLoading(true)
    setError(null)
    setGeneratedItinerary(null)

    // Validate trip type for mood-based planning
    if (planningMode === 'mood' && !formData.tripType) {
      setError('Please select a Trip Type')
      return
    }
    
    try {
      const submitData = {
        tripType: planningMode === 'mood' ? formData.tripType : 'any',
        duration: durationInDays.toString(),
        travelGroup: formData.travelGroup,
        mood: formData.mood,
        budget: formData.budget,
        foodPreference: formData.foodPreference
      }
      
      // If subdestination is selected, include destinationId filter
      if (selectedPlace) {
        submitData.region = selectedPlace.destinationId
      }
      
      const response = await itinerariesAPI.generateItinerary(submitData)
      
      // Filter results by selected place if planning by destination
      let filteredDestinations = response.data.destinations
      if (planningMode === 'destination' && selectedPlace) {
        filteredDestinations = response.data.destinations.filter(
          dest => dest.destinationId === selectedPlace.destinationId || dest.id === selectedPlace.id
        )
      }
      
      setGeneratedItinerary({
        ...response.data,
        destinations: filteredDestinations
      })
      
      // Auto-save preferences if logged in
      if (currentUser) {
        try {
          await preferencesAPI.update({
            budgetMin: 0,
            budgetMax: formData.budget,
            travelAnxietyLevel: formData.mood === 'tired' ? 'low' : formData.mood === 'anxious' ? 'high' : 'medium',
            foodSensitivity: formData.foodPreference === 'local' ? false : true,
            lastUpdated: new Date().toISOString()
          }, currentUser.uid);
        } catch (e) {
          console.error("Failed to auto-save preferences", e);
        }
      }
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.')
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

  // Determine if form should be shown
  const shouldShowForm = planningMode === 'mood' || (planningMode === 'destination' && selectedPlace)

  return (
    <div className="itineraries-page">
      {/* Welcome Message */}
      <div className="welcome-section">
        <p className="welcome-message">Plan safe, thoughtful trips tailored to your mood, time, and comfort.</p>
      </div>

      {/* Planning Mode Selection */}
      <div className="planning-mode-section">
        <h3 className="planning-mode-question">How do you want to plan your trip?</h3>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="planningMode"
              value="destination"
              checked={planningMode === 'destination'}
              onChange={(e) => handlePlanningModeChange('destination')}
            />
            <span>By Destination</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="planningMode"
              value="mood"
              checked={planningMode === 'mood'}
              onChange={(e) => handlePlanningModeChange('mood')}
            />
            <span>By Trip Mood</span>
          </label>
        </div>
      </div>

      {/* Destination Cards - Show destinations first */}
      {planningMode === 'destination' && !selectedDestination && (
        <div className="destinations-selection">
          {loadingDestinations ? (
            <div className="loading">Loading destinations...</div>
          ) : (
            <>
              <h3>Select a Destination</h3>
              <div className="destinations-grid">
                {destinations.map(destination => (
                  <div
                    key={destination.id}
                    className="destination-card-wrapper"
                    onClick={() => handleDestinationSelect(destination)}
                  >
                    <DestinationCard destination={destination} isDestination={true} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Subdestinations Selection - Show subdestinations when destination is selected */}
      {planningMode === 'destination' && selectedDestination && !selectedPlace && (
        <div className="places-selection">
          <div className="selected-destination-header">
            <button 
              className="btn btn-back"
              onClick={() => {
                setSelectedDestination(null)
                setPlaces([])
                setGeneratedItinerary(null)
              }}
            >
              ← Back to Destinations
            </button>
            <h3>Subdestinations in {selectedDestination.name}</h3>
            <p className="destination-description">{selectedDestination.description}</p>
          </div>
          {loadingPlaces ? (
            <div className="loading">Loading subdestinations...</div>
          ) : (
            <div className="destinations-grid">
              {places.map(place => (
                <div
                  key={place.id}
                  className="destination-card-wrapper"
                  onClick={() => handlePlaceSelect(place)}
                >
                  <DestinationCard destination={place} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Subdestination Display */}
      {planningMode === 'destination' && selectedPlace && (
        <div className="selected-destination-info">
          <p>Selected: <strong>{selectedPlace.name}</strong> in {selectedDestination.name}</p>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSelectedPlace(null)
              setGeneratedItinerary(null)
            }}
          >
            Change Subdestination
          </button>
        </div>
      )}

      {/* Form - Only show when appropriate conditions are met */}
      {shouldShowForm && (
        <>
          {error && <div className="error-message">{error}</div>}

          <div className="itinerary-generator">
            <form onSubmit={handleGenerate} className="generator-form">
              {planningMode === 'mood' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Trip Type *</label>
                    <select
                      value={formData.tripType}
                      onChange={(e) => handleChange('tripType', e.target.value)}
                      required
                    >
                      <option value="">Select Trip Type</option>
                      {tripTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <p className="field-hint">Required for mood-based planning</p>
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <div className="duration-input-group">
                    <input
                      type="number"
                      value={formData.durationValue}
                      onChange={(e) => handleChange('durationValue', e.target.value)}
                      placeholder="Enter duration"
                      min="1"
                      required
                      className="duration-value-input"
                    />
                    <select
                      value={formData.durationUnit}
                      onChange={(e) => handleChange('durationUnit', e.target.value)}
                      className="duration-unit-select"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Travel Group</label>
                  <select
                    value={formData.travelGroup}
                    onChange={(e) => handleChange('travelGroup', e.target.value)}
                    required
                  >
                    {travelGroups.map(group => (
                      <option key={group.value} value={group.value}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Mood</label>
                  <select
                    value={formData.mood}
                    onChange={(e) => handleChange('mood', e.target.value)}
                    required
                  >
                    {moods.map(mood => (
                      <option key={mood.value} value={mood.value}>
                        {mood.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Budget (INR)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    placeholder="Enter your budget in INR"
                    min="1000"
                    required
                  />
                  <p className="field-hint">Enter your total trip budget in Indian Rupees</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Food Preference</label>
                  <select
                    value={formData.foodPreference}
                    onChange={(e) => handleChange('foodPreference', e.target.value)}
                    required
                  >
                    {foodPreferences.map(food => (
                      <option key={food.value} value={food.value}>
                        {food.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Itinerary'}
              </button>
            </form>

            {generatedItinerary && generatedItinerary.destinations.length > 0 && (
              <div className="generated-itinerary">
                <div className="itinerary-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2>Your Personalized Itinerary</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const id = await itinerariesAPI.saveToFirestore(generatedItinerary, currentUser.uid);
                        navigate(`/itinerary/${id}`);
                      } catch (err) {
                        setError('Failed to save itinerary');
                        setLoading(false);
                      }
                    }}
                  >
                    Save & View Details →
                  </button>
                </div>
                <div className="itinerary-meta">
                  <span>Duration: {generatedItinerary.duration} day(s)</span>
                  <span>Trip Type: {generatedItinerary.tripType}</span>
                  <span>Budget: ₹{generatedItinerary.budget?.toLocaleString('en-IN')}</span>
                  <span>Destinations: {generatedItinerary.destinations.length}</span>
                </div>
                <div className="itinerary-destinations">
                  {generatedItinerary.dayWiseItinerary ? (
                    generatedItinerary.dayWiseItinerary.map((dayBlock) => (
                      <div key={`day-${dayBlock.day}`} className="day-block" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--primary-color, #1a2a40)', borderBottom: '2px solid #eaeaea', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                          Day {dayBlock.day}
                        </h3>
                        {dayBlock.places.map((dest, index) => (
                          <div key={`${dayBlock.day}-${dest.id}`} className="itinerary-destination-item">
                            <div className="destination-number">{index + 1}</div>
                            <div className="destination-info">
                              <h3>{dest.name}</h3>
                              {dest.region && <p className="region">{dest.region}</p>}
                              {dest.description && <p className="description">{dest.description}</p>}
                              <div className="destination-tags">
                                {dest.category && <span className="tag category">{dest.category}</span>}
                                {dest.safetyRating && <span className="tag safety">Safety: {dest.safetyRating}/5</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    generatedItinerary.destinations.map((dest, index) => (
                      <div key={dest.id} className="itinerary-destination-item">
                        <div className="destination-number">{index + 1}</div>
                        <div className="destination-info">
                          <h3>{dest.name}</h3>
                          {dest.region && <p className="region">{dest.region}</p>}
                          {dest.description && <p className="description">{dest.description}</p>}
                          <div className="destination-tags">
                            {dest.category && <span className="tag category">{dest.category}</span>}
                            {dest.safetyRating && <span className="tag safety">Safety: {dest.safetyRating}/5</span>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {generatedItinerary && generatedItinerary.destinations.length === 0 && (
              <div className="no-results">
                <p>No destinations found matching your criteria. Please try different filters.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Itineraries
