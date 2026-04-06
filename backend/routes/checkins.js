const express = require('express');
const router = express.Router();
const ruleEngine = require('../engine/ruleEngine');

// POST adjust itinerary based on mood (stateless)
router.post('/adjust', (req, res) => {
  try {
    const { itinerary, checkin } = req.body;

    if (!itinerary || !checkin || !checkin.mood) {
      return res.status(400).json({ error: 'Itinerary and valid checkin data are required' });
    }

    // Apply rule-based adjustment
    const adjustedPlan = ruleEngine.adjustItineraryForMood(
      { destinations: itinerary.destinations || [] },
      checkin
    );

    res.json({
      recommendations: adjustedPlan.recommendations
    });
  } catch (error) {
    console.error('Error adjusting itinerary:', error);
    res.status(500).json({ error: 'Failed to adjust itinerary' });
  }
});

module.exports = router;

