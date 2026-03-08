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

// GET all destinations (top-level destinations like Goa, Kashmir)
router.get('/', async (req, res) => {
  try {
    const destinations = await readDestinations();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destinations = await readDestinations();
    const destination = destinations.find(d => d.id === req.params.id);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// GET subdestinations for a destination
router.get('/:id/subdestinations', async (req, res) => {
  try {
    const destinations = await readDestinations();
    const destination = destinations.find(d => d.id === req.params.id);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destination.subdestinations || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subdestinations' });
  }
});

// Destinations are developer-managed only - no POST/PUT/DELETE endpoints

module.exports = router;

