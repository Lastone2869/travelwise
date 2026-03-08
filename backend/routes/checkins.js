const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ruleEngine = require('../engine/ruleEngine');

const dataDir = path.join(__dirname, '..', 'data');
const checkinsFile = path.join(dataDir, 'checkins.json');
const itinerariesFile = path.join(dataDir, 'itineraries.json');

// Helper function to read check-ins
const readCheckins = async () => {
  try {
    const data = await fs.readFile(checkinsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading check-ins:', error);
    return [];
  }
};

// Helper function to write check-ins
const writeCheckins = async (checkins) => {
  try {
    await fs.writeFile(checkinsFile, JSON.stringify(checkins, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing check-ins:', error);
    return false;
  }
};

// Helper function to read itineraries
const readItineraries = async () => {
  try {
    const data = await fs.readFile(itinerariesFile, 'utf8');
    return JSON.parse(data);
    } catch (error) {
    console.error('Error reading itineraries:', error);
    return [];
  }
};

// Helper function to write itineraries
const writeItineraries = async (itineraries) => {
  try {
    await fs.writeFile(itinerariesFile, JSON.stringify(itineraries, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing itineraries:', error);
    return false;
  }
};

// POST create emotional check-in
router.post('/', async (req, res) => {
  try {
    const { itineraryId, userId, mood, energyLevel, stressLevel, notes } = req.body;

    // Validation
    if (!itineraryId || !mood) {
      return res.status(400).json({ error: 'Itinerary ID and mood are required' });
    }

    const checkins = await readCheckins();
    const newCheckin = {
      id: uuidv4(),
      itineraryId,
      userId: userId || 'default',
      mood, // 'happy', 'anxious', 'tired', 'energetic', 'stressed', 'calm'
      energyLevel: energyLevel || 'medium', // 'low', 'medium', 'high'
      stressLevel: stressLevel || 'medium', // 'low', 'medium', 'high'
      notes: notes || '',
      timestamp: new Date().toISOString()
    };

    checkins.push(newCheckin);

    // Get itinerary and adjust based on mood
    const itineraries = await readItineraries();
    const itinerary = itineraries.find(i => i.id === itineraryId);

    if (itinerary) {
      // Apply rule-based adjustment
      const adjustedPlan = ruleEngine.adjustItineraryForMood(
        { destinations: itinerary.destinations },
        newCheckin
      );

      // Update itinerary with recommendations
      itinerary.moodAdjustments = adjustedPlan.recommendations;
      itinerary.lastCheckin = newCheckin.timestamp;
      await writeItineraries(itineraries);
    }

    const success = await writeCheckins(checkins);

    if (success) {
      const response = {
        checkin: newCheckin,
        recommendations: itinerary ? itinerary.moodAdjustments : null
      };
      res.status(201).json(response);
    } else {
      res.status(500).json({ error: 'Failed to create check-in' });
    }
  } catch (error) {
    console.error('Error creating check-in:', error);
    res.status(500).json({ error: 'Failed to create check-in' });
  }
});

// GET check-ins for an itinerary
router.get('/itinerary/:itineraryId', async (req, res) => {
  try {
    const checkins = await readCheckins();
    const itineraryCheckins = checkins.filter(
      c => c.itineraryId === req.params.itineraryId
    );
    res.json(itineraryCheckins.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    ));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch check-ins' });
  }
});

// GET all check-ins for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const checkins = await readCheckins();
    const userCheckins = checkins.filter(
      c => c.userId === req.params.userId
    );
    res.json(userCheckins.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    ));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch check-ins' });
  }
});

module.exports = router;

