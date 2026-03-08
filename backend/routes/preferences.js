const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const preferencesFile = path.join(dataDir, 'preferences.json');

// Helper function to read preferences
const readPreferences = async () => {
  try {
    const data = await fs.readFile(preferencesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading preferences:', error);
    return {};
  }
};

// Helper function to write preferences
const writePreferences = async (preferences) => {
  try {
    await fs.writeFile(preferencesFile, JSON.stringify(preferences, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing preferences:', error);
    return false;
  }
};

// GET user preferences (using a default user ID for simplicity)
router.get('/', async (req, res) => {
  try {
    const preferences = await readPreferences();
    const userId = req.query.userId || 'default';
    const userPrefs = preferences[userId] || {};
    
    // Return with default structure if empty
    const defaultPreferences = {
      travelAnxiety: false,
      travelAnxietyLevel: 'moderate', // 'low', 'moderate', 'high'
      womensSafety: false,
      safetyConcerns: false,
      avoidNightTravel: false,
      foodSensitivity: false,
      overstimulationConcern: false,
      silentTravelMode: false,
      avoidTrekking: false,
      preferredCategories: [],
      budgetRange: '',
      travelStyle: 'moderate', // 'relaxed', 'moderate', 'fast-paced'
      maxTripDuration: 14,
      ...userPrefs
    };
    
    res.json(defaultPreferences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// POST/PUT update preferences
router.post('/', async (req, res) => {
  try {
    const preferences = await readPreferences();
    const userId = req.body.userId || 'default';
    
    preferences[userId] = {
      ...preferences[userId],
      ...req.body.preferences,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writePreferences(preferences);
    
    if (success) {
      res.json(preferences[userId]);
    } else {
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// PUT update preferences (alternative endpoint)
router.put('/', async (req, res) => {
  try {
    const preferences = await readPreferences();
    const userId = req.body.userId || 'default';
    
    preferences[userId] = {
      ...preferences[userId],
      ...req.body.preferences,
      updatedAt: new Date().toISOString()
    };
    
    const success = await writePreferences(preferences);
    
    if (success) {
      res.json(preferences[userId]);
    } else {
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

module.exports = router;

