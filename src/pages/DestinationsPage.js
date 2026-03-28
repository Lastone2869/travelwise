import React, { useEffect, useState } from "react";

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/destinations")
      .then(res => res.json())
      .then(data => setDestinations(data))
      .catch(err => console.error("Failed to load destinations", err));
  }, []);

  return (
    <div style={{display:"flex", gap:"20px", padding:"40px", flexWrap:"wrap"}}>
      {destinations.map((d) => (
        <div key={d.id} style={{
          border:"1px solid #ccc",
          padding:"20px",
          borderRadius:"10px",
          width:"220px",
          background:"#fff"
        }}>
          <h3>{d.name}</h3>

          <p>{d.description}</p>

          <p>
            <strong>{d.subdestinations?.length || 0} locations</strong>
          </p>

          <p>Estimated: {d.estimatedDays} days</p>

        </div>
      ))}
    </div>
  );
};

export default DestinationsPage;