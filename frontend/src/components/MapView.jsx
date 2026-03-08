import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function RouteLine({ destinations }) {
  const [routeCoordinates, setRouteCoordinates] = useState([])

  useEffect(() => {
    if (!destinations || destinations.length < 2) {
      setRouteCoordinates([])
      return
    }

    // Fetch route from OSRM routing service
    const fetchRoute = async () => {
      try {
        const coordinates = destinations.map(d => 
          `${d.coordinates.lng},${d.coordinates.lat}`
        ).join(';')
        
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // Convert GeoJSON coordinates to Leaflet format [lat, lng]
            const coordinates = data.routes[0].geometry.coordinates.map(
              coord => [coord[1], coord[0]]
            )
            setRouteCoordinates(coordinates)
          } else {
            // Fallback to direct line if routing fails
            const directCoords = destinations.map(d => 
              [d.coordinates.lat, d.coordinates.lng]
            )
            setRouteCoordinates(directCoords)
          }
        } else {
          // Fallback to direct line if API call fails
          const directCoords = destinations.map(d => 
            [d.coordinates.lat, d.coordinates.lng]
          )
          setRouteCoordinates(directCoords)
        }
      } catch (error) {
        console.error('Error fetching route:', error)
        // Fallback to direct line
        const directCoords = destinations.map(d => 
          [d.coordinates.lat, d.coordinates.lng]
        )
        setRouteCoordinates(directCoords)
      }
    }

    fetchRoute()
  }, [destinations])

  if (routeCoordinates.length === 0) {
    return null
  }

  return (
    <Polyline
      positions={routeCoordinates}
      pathOptions={{
        color: '#667eea',
        weight: 5,
        opacity: 0.8
      }}
    />
  )
}

function MapView({ destinations }) {
  if (!destinations || destinations.length === 0) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f0f0f0',
        color: '#999'
      }}>
        No destinations to display
      </div>
    )
  }

  // Calculate center point
  const center = destinations.length > 0
    ? [
        destinations.reduce((sum, d) => sum + d.coordinates.lat, 0) / destinations.length,
        destinations.reduce((sum, d) => sum + d.coordinates.lng, 0) / destinations.length
      ]
    : [0, 0]

  return (
    <MapContainer
      center={center}
      zoom={destinations.length === 1 ? 10 : 5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {destinations.map((destination, index) => (
        <Marker
          key={destination.id}
          position={[destination.coordinates.lat, destination.coordinates.lng]}
        >
          <Popup>
            <div>
              <strong>{index + 1}. {destination.name}</strong>
              {destination.description && <p>{destination.description}</p>}
              {destination.category && (
                <span style={{ 
                  display: 'inline-block',
                  background: '#667eea',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '5px',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }}>
                  {destination.category}
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      <RouteLine destinations={destinations} />
    </MapContainer>
  )
}

export default MapView

