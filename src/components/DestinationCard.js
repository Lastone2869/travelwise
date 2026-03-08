import { useNavigate } from 'react-router-dom';

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="destination-card" 
      onClick={() => navigate(`/destinations/${destination.id}`)}
    >
      <h3>{destination.name}</h3>
    </div>
  );
};

export default DestinationCard;