const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const destinationsFile = path.join(dataDir, 'destinations.json');

// Helper function to read destinations
const readDestinations = async () => {
  try {
    const data = await fs.readFile(destinationsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading destinations:', error);
    return [];
  }
};

// Helper function to get all subdestinations from all destinations
const getAllSubdestinations = async () => {
  try {
    const destinations = await readDestinations();
    const allSubdestinations = [];
    destinations.forEach(dest => {
      if (dest.subdestinations && Array.isArray(dest.subdestinations)) {
        dest.subdestinations.forEach(sub => {
          allSubdestinations.push({
            ...sub,
            destinationId: dest.id,
            destinationName: dest.name
          });
        });
      }
    });
    return allSubdestinations;
  } catch (error) {
    console.error('Error reading subdestinations:', error);
    return [];
  }
};

// Map numeric budget to budget category
const getBudgetCategory = (budget) => {
  const budgetNum = parseFloat(budget);
  if (budgetNum >= 5000 && budgetNum < 15000) {
    return 'low';
  } else if (budgetNum >= 15000 && budgetNum < 40000) {
    return 'mid';
  } else if (budgetNum >= 40000) {
    return 'high';
  }
  return 'low'; // Default to low for budgets below 5000
};

// Map destinations to budget categories
const getDestinationBudgetCategory = (destinationId) => {
  // Low budget destinations
  const lowBudgetIds = ['rajasthan-pushkar', 'up-varanasi', 'rajasthan-jaipur'];
  
  // Mid budget destinations
  const midBudgetIds = [
    'goa-baga', 'goa-candolim', 'goa-aguada', 'goa-basilica', 'goa-anjuna', // All Goa
    'rajasthan-udaipur', 'kashmir-dal-lake', 'kashmir-gulmarg'
  ];
  
  // High budget destinations
  const highBudgetIds = ['andaman-swaraj-dweep', 'hp-spiti'];
  
  if (lowBudgetIds.includes(destinationId)) {
    return 'low';
  } else if (midBudgetIds.includes(destinationId)) {
    return 'mid';
  } else if (highBudgetIds.includes(destinationId)) {
    return 'high';
  }
  
  // Default to mid if not specified
  return 'mid';
};

// Simple itinerary generation logic
const generateItinerary = (destinations, tripType, duration, travelGroup, mood, budget, foodPreference, region) => {
  let filtered = [...destinations];

  // Filter by destinationId if specified (for destination-based planning)
  if (region) {
    filtered = filtered.filter(dest => dest.destinationId === region);
  }

  // Filter by budget category
  if (budget) {
    const budgetCategory = getBudgetCategory(budget);
    filtered = filtered.filter(dest => {
      const destBudgetCategory = getDestinationBudgetCategory(dest.id);
      // For high budget, allow high, mid, low. For mid, allow mid, low.
      if (budgetCategory === 'high') return true;
      if (budgetCategory === 'mid') return destBudgetCategory !== 'high';
      return destBudgetCategory === 'low';
    });
  }

  // Filter by trip type
  if (tripType && tripType !== 'any') {
    filtered = filtered.filter(dest => {
      if (!dest.tripType) return false;
      const tripTypeMap = {
        'heritage': ['heritage'],
        'art': ['art', 'cultural'],
        'party': ['party'],
        'adventure': ['adventure'],
        'beach': ['beach'],
        'mountain': ['nature', 'adventure'],
        'spiritual': ['spiritual', 'religious'],
        'relaxation': ['calm', 'relaxation', 'meditation']
      };
      
      const matchingTypes = tripTypeMap[tripType] || [tripType];
      return matchingTypes.some(type => dest.tripType.includes(type));
    });
  }

  // Filter by safety for solo woman
  if (travelGroup === 'solo-woman') {
    filtered = filtered.filter(dest => {
      const safetyRating = dest.safetyRatingSoloWoman || dest.safetyRating || 0;
      return safetyRating >= 3;
    });
  }

  // Cache fallback state before heavy strict filtering
  const fallbackDestinations = [...filtered];

  // Filter by mood (if tired/low energy, prefer calm places)
  if (mood === 'tired' || mood === 'low') {
    filtered = filtered.filter(dest => {
      return !dest.ambiance || dest.ambiance === 'calm' || (dest.moodTag && dest.moodTag.includes('calm'));
    });
    // Filter out physically demanding
    filtered = filtered.filter(dest => !dest.physicalDemand || dest.physicalDemand !== 'high');
  } else if (tripType !== 'adventure' && tripType !== 'any') {
    filtered = filtered.filter(dest => !dest.physicalDemand || dest.physicalDemand !== 'high');
  }

  // If overly strict emotion/physical filters wipe out array, revert to fallback
  if (filtered.length === 0 && fallbackDestinations.length > 0) {
    filtered = fallbackDestinations;
  }

  // Filter by duration
  const totalDays = parseFloat(duration) || 1;
  if (totalDays <= 0.5) {
    filtered = filtered
      .filter(dest => (dest.estimatedDays || 1) <= 1)
      .sort((a, b) => (a.estimatedDays || 1) - (b.estimatedDays || 1))
      .slice(0, 3);
  } else if (totalDays <= 2) {
    filtered = filtered
      .filter(dest => (dest.estimatedDays || 1) <= 2)
      .slice(0, 4);
  } else {
    filtered = filtered.slice(0, 8);
  }

  // Simple route ordering (by estimated days or alphabetically)
  filtered.sort((a, b) => {
    if (a.estimatedDays && b.estimatedDays) {
      return a.estimatedDays - b.estimatedDays;
    }
    return a.name.localeCompare(b.name);
  });

  // Final fallback if duration filter wiped out results
  if (filtered.length === 0 && fallbackDestinations.length > 0) {
    return fallbackDestinations.slice(0, 4);
  }

  return filtered;
};

// Helper to split destinations into daily groups
const splitIntoDays = (destinations, durationStr) => {
  const daysCount = parseInt(durationStr, 10) || 1;
  const structured = [];
  const totalPlaces = destinations.length;
  const basePlacesPerDay = Math.floor(totalPlaces / daysCount);
  let extraPlaces = totalPlaces % daysCount;
  
  let destIndex = 0;
  for (let i = 1; i <= daysCount; i++) {
    // If there's extra places, distribute them 1 per day until exhausted
    const placesForToday = basePlacesPerDay + (extraPlaces > 0 ? 1 : 0);
    if (extraPlaces > 0) extraPlaces--;
    
    const dayPlaces = [];
    for (let j = 0; j < placesForToday; j++) {
      if (destIndex < totalPlaces) {
        dayPlaces.push(destinations[destIndex]);
        destIndex++;
      }
    }
    
    if (dayPlaces.length > 0) {
      structured.push({
        day: i,
        places: dayPlaces
      });
    }
  }
  return structured;
};

// POST generate-itinerary
router.post('/generate-itinerary', async (req, res) => {
  try {
    const { tripType, duration, travelGroup, mood, budget, foodPreference } = req.body;

    // Validation
    if (!duration) {
      return res.status(400).json({ error: 'Duration is required' });
    }

    if (!budget || parseFloat(budget) < 1000) {
      return res.status(400).json({ error: 'Valid budget (minimum ₹1,000) is required' });
    }

    // Read all subdestinations (for itinerary generation, we use subdestinations)
    const allDestinations = await getAllSubdestinations();

    // Generate itinerary based on criteria
    const itineraryDestinations = generateItinerary(
      allDestinations,
      tripType,
      duration,
      travelGroup,
      mood,
      budget,
      foodPreference,
      req.body.region // Optional region filter for destination-based planning
    );

    if (itineraryDestinations.length === 0) {
      return res.status(404).json({ error: 'No destinations found matching your criteria' });
    }

    // Get budget category for response
    const budgetCategory = getBudgetCategory(budget);

    // Group the locations linearly by duration
    const dayWiseItinerary = splitIntoDays(itineraryDestinations, duration);

    // Return generated itinerary
    res.json({
      destinations: itineraryDestinations,
      dayWiseItinerary,
      tripType,
      duration,
      travelGroup,
      mood,
      budget: parseFloat(budget),
      budgetCategory,
      foodPreference,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

module.exports = router;
