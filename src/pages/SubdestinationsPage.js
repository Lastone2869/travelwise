import React from 'react';
import { useParams } from 'react-router-dom';
import SubdestinationCard from '../components/SubdestinationCard';
import destinations from '../data/destinations';

const SubdestinationsPage = () => {
  const { destinationId } = useParams();
  const destination = destinations.find((d) => d.id === destinationId);

  if (!destination) {
    return <div>Destination not found!</div>;
  }

  return (
    <div className="subdestinations-grid">
      {destination.subdestinations.map((subdestination) => (
        <SubdestinationCard key={subdestination.id} subdestination={subdestination} />
      ))}
    </div>
  );
};

export default SubdestinationsPage;