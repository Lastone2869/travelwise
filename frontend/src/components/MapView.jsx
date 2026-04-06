import React, { useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '100%'
}

// Temporary fallback center
const fallbackCenter = {
  lat: 20.5937,
  lng: 78.9629
}

function MapView({ destinations }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyB3lbHA0ljwRctOF1nMMh0UR4TovQ77eU4"
  })

  const [directionsResponse, setDirectionsResponse] = useState(null)

  useEffect(() => {
    if (!destinations || destinations.length < 2 || !isLoaded) {
      setDirectionsResponse(null)
      return
    }

    const calculateRoute = async () => {
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService()
      
      const origin = destinations[0].coordinates
      const destination = destinations[destinations.length - 1].coordinates
      
      const waypoints = destinations.slice(1, destinations.length - 1).map(d => ({
        location: d.coordinates,
        stopover: true
      }))

      try {
        const results = await directionsService.route({
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING
        })
        setDirectionsResponse(results)
      } catch (error) {
        console.error('Error fetching directions:', error)
      }
    }

    calculateRoute()
  }, [destinations, isLoaded])

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

  const center = destinations.length > 0
    ? {
        lat: destinations.reduce((sum, d) => sum + d.coordinates.lat, 0) / destinations.length,
        lng: destinations.reduce((sum, d) => sum + d.coordinates.lng, 0) / destinations.length
      }
    : fallbackCenter

  if (!isLoaded) {
    return <div>Loading Map...</div>
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={destinations.length === 1 ? 10 : 5}
    >
      {/* If there's no calculated route, just render markers */}
      {!directionsResponse && destinations.map((destination, index) => (
        <Marker 
          key={destination.id} 
          position={destination.coordinates} 
          label={(index + 1).toString()} 
        />
      ))}

      {/* If directions are loaded, DirectionsRenderer handles route AND markers */}
      {directionsResponse && (
        <DirectionsRenderer 
          directions={directionsResponse} 
          options={{
            suppressMarkers: false
          }}
        />
      )}
    </GoogleMap>
  )
}

export default React.memo(MapView)
