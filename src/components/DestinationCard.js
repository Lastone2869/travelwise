import { useNavigate } from 'react-router-dom';

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();

  const locationCount = destination.subdestinations?.length || 0;

  return (
    <div 
      className="destination-card"
      onClick={() => navigate(`/destinations/${destination.id}`)}
    >
      {destination.image && (
        <img
          src={destination.image}
          alt={destination.name}
          className="destination-image"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      <div className="destination-content">
        <h3>{destination.name}</h3>

        <span className="location-badge">
          {locationCount} {locationCount === 1 ? "location" : "locations"}
        </span>

      </div>
    </div>
  );
};

export default DestinationCard;