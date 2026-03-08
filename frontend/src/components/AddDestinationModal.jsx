import React, { useState } from 'react'
import { destinationsAPI } from '../services/api'
import './AddDestinationModal.css'

function AddDestinationModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lat: '',
    lng: '',
    category: 'city',
    attractions: '',
    estimatedDays: 1
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.lat || !formData.lng) {
      setError('Name, latitude, and longitude are required')
      return
    }

    const lat = parseFloat(formData.lat)
    const lng = parseFloat(formData.lng)

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180')
      return
    }

    setLoading(true)

    try {
      const attractions = formData.attractions
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0)

      await destinationsAPI.create({
        name: formData.name,
        description: formData.description,
        coordinates: { lat, lng },
        category: formData.category,
        attractions,
        estimatedDays: parseInt(formData.estimatedDays) || 1
      })

      onSuccess()
    } catch (err) {
      setError('Failed to create destination')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Destination</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude *</label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                step="any"
                required
              />
            </div>

            <div className="form-group">
              <label>Longitude *</label>
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                step="any"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="city">City</option>
                <option value="beach">Beach</option>
                <option value="mountain">Mountain</option>
                <option value="historical">Historical</option>
                <option value="nature">Nature</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Estimated Days</label>
              <input
                type="number"
                name="estimatedDays"
                value={formData.estimatedDays}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Attractions (comma-separated)</label>
            <input
              type="text"
              name="attractions"
              value={formData.attractions}
              onChange={handleChange}
              placeholder="Eiffel Tower, Louvre Museum, Notre-Dame"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDestinationModal

