import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Destinations API - Read only
export const destinationsAPI = {
  getAll: () => api.get('/destinations'),
  getById: (id) => api.get(`/destinations/${id}`),
  getSubdestinations: (destinationId) => api.get(`/destinations/${destinationId}/subdestinations`)
}

// Itineraries API
export const itinerariesAPI = {
  generateItinerary: (data) => api.post('/itineraries/generate-itinerary', data),
  getById: (id) => api.get(`/itineraries/${id}`)
}

// Preferences API
export const preferencesAPI = {
  get: (userId = 'default') => api.get(`/preferences?userId=${userId}`),
  update: (preferences, userId = 'default') => api.post('/preferences', {
    userId,
    preferences: preferences
  })
}

export default api

