import React from 'react'
import './DestinationCard.css'

function DestinationCard({ destination, isDestination = false }) {
  return (
    <div className="destination-card">
      <div className="card-header">
        <h3>{destination.name}</h3>
        {destination.region && <span className="region">{destination.region}</span>}
        {isDestination && destination.subdestinations && (
          <span className="region">
            {destination.subdestinations.length} {destination.subdestinations.length === 1 ? 'subdestination' : 'subdestinations'}
          </span>
        )}
      </div>
      <div className="card-body">
        <p className="description">{destination.description || 'No description available'}</p>
        <div className="card-meta">
          {destination.category && (
            <span className="category">{destination.category}</span>
          )}
          {destination.tripType && destination.tripType.length > 0 && (
            <span className="trip-type">
              {destination.tripType.map((type, idx) => (
                <span key={idx}>{type}{idx < destination.tripType.length - 1 ? ', ' : ''}</span>
              ))}
            </span>
          )}
        </div>
        {destination.safetyRating && (
          <div className="safety-info">
            <span className="safety-label">Safety:</span>
            <span className={`safety-rating safety-${destination.safetyRating >= 4 ? 'high' : destination.safetyRating >= 3 ? 'medium' : 'low'}`}>
              {destination.safetyRating}/5
            </span>
            {destination.safetyRatingSoloWoman && (
              <span className="safety-solo">
                (Solo: {destination.safetyRatingSoloWoman}/5)
              </span>
            )}
          </div>
        )}
        {destination.estimatedDays && (
          <div className="days-info">
            Estimated: {destination.estimatedDays} day{destination.estimatedDays !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export default DestinationCard
