import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { preferencesAPI, itinerariesAPI } from '../services/api';
import './Profile.css';

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Load preferences
        const prefRes = await preferencesAPI.get(currentUser.uid);
        if (prefRes.data) {
          setPreferences(prefRes.data);
        }

        // Load travel history
        const historyRes = await itinerariesAPI.getByUserId(currentUser.uid);
        setHistory(historyRes);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="loading" style={{ marginTop: '100px', textAlign: 'center' }}>Loading your profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Your Profile</h2>
        <p>Manage your account, view preferences, and check your travel history.</p>
      </div>

      <div className="profile-content">
        {/* User Info Card */}
        <div className="profile-section card">
          <h3>User Information</h3>
          <div className="info-item">
            <span className="label">Email:</span>
            <span className="value">{currentUser.email}</span>
          </div>
          <div className="info-item">
            <span className="label">Account ID:</span>
            <span className="value">{currentUser.uid}</span>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="profile-section card">
          <div className="section-header">
            <h3>Saved Preferences</h3>
            <button className="btn btn-secondary small" onClick={() => navigate('/preferences')}>
              Edit
            </button>
          </div>
          {preferences && Object.keys(preferences).length > 0 ? (
            <div className="preferences-grid">
              <div className="pref-item">
                <span className="label">Budget Range</span>
                <span className="value">₹{preferences.budgetMin || 0} - ₹{preferences.budgetMax || 'Any'}</span>
              </div>
              <div className="pref-item">
                <span className="label">Safety Priority</span>
                <span className="value">{preferences.safetyImportance || 'Not set'} / 5</span>
              </div>
              <div className="pref-item">
                <span className="label">Anxiety Level</span>
                <span className="value">{preferences.travelAnxietyLevel || 'Not set'}</span>
              </div>
              <div className="pref-item">
                <span className="label">Dietary Preference</span>
                <span className="value">{preferences.foodSensitivity ? 'Sensitive (Gluten/Dairy free etc)' : 'Standard'}</span>
              </div>
            </div>
          ) : (
            <p className="empty-text">No preferences saved yet. Generate an itinerary to save them automatically, or edit them manually.</p>
          )}
        </div>

        {/* Travel History Card */}
        <div className="profile-section card history-card">
          <h3>Travel History</h3>
          {history.length > 0 ? (
            <div className="history-list">
              {history.map((trip) => (
                <div key={trip.id} className="history-item">
                  <div className="trip-info">
                    <h4>{trip.duration} Day Trip ({trip.tripType})</h4>
                    <p className="trip-date">
                      Created on: {trip.createdAt ? new Date(trip.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown date'}
                    </p>
                    <p className="trip-destinations">
                      {trip.destinations?.length || 0} destinations included
                    </p>
                  </div>
                  <div className="trip-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate(`/itinerary/${trip.id}`, { state: { itinerary: trip } })}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">You haven't generated any itineraries yet. Head over to <b>Plan Trip</b> to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
