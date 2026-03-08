const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const destinationsRoutes = require('./routes/destinations');
const preferencesRoutes = require('./routes/preferences');
const itinerariesRoutes = require('./routes/itineraries');
const checkinsRoutes = require('./routes/checkins');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize data directories
const dataDir = path.join(__dirname, 'data');
const initDataDir = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    
    // Initialize destinations.json with subdestinations array
    const destinationsFile = path.join(dataDir, 'destinations.json');
    try {
      await fs.access(destinationsFile);
    } catch {
      const defaultDestinations = [
        {
          id: "rajasthan",
          name: "Rajasthan",
          description: "Land of kings with palaces, forts, and rich cultural heritage",
          coordinates: { lat: 26.9124, lng: 75.7873 },
          category: "heritage",
          tripType: ["heritage", "romantic", "cultural"],
          safetyRating: 4,
          safetyRatingSoloWoman: 3,
          estimatedDays: 4,
          subdestinations: [
            {
              id: "rajasthan-jaipur",
              name: "Jaipur",
              description: "Pink City with palaces, forts, and rich heritage",
              coordinates: { lat: 26.9124, lng: 75.7873 },
              category: "heritage",
              tripType: ["heritage"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "high",
              ambiance: "moderate",
              estimatedDays: 3
            },
            {
              id: "rajasthan-udaipur",
              name: "Udaipur",
              description: "City of Lakes, romantic destination with palaces",
              coordinates: { lat: 24.5854, lng: 73.7125 },
              category: "heritage",
              tripType: ["romantic", "heritage"],
              safetyRating: 4,
              safetyRatingSoloWoman: 4,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "rajasthan-pushkar",
              name: "Pushkar",
              description: "Sacred town known for art, culture, and Pushkar Lake",
              coordinates: { lat: 26.4897, lng: 74.5511 },
              category: "cultural",
              tripType: ["art", "cultural", "religious"],
              safetyRating: 4,
              safetyRatingSoloWoman: 4,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            }
          ]
        },
        {
          id: "kashmir",
          name: "Kashmir",
          description: "Paradise on Earth with stunning landscapes, lakes, and valleys",
          coordinates: { lat: 34.0837, lng: 74.7973 },
          category: "nature",
          tripType: ["nature", "romantic", "calm"],
          safetyRating: 4,
          safetyRatingSoloWoman: 3,
          estimatedDays: 5,
          subdestinations: [
            {
              id: "kashmir-vaishno-devi",
              name: "Vaishno Devi",
              description: "Sacred Hindu temple dedicated to Goddess Vaishno Devi",
              coordinates: { lat: 33.0294, lng: 74.9483 },
              category: "religious",
              tripType: ["spiritual", "religious"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "high",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "kashmir-dal-lake",
              name: "Dal Lake",
              description: "Famous lake with houseboats and shikara rides",
              coordinates: { lat: 34.1233, lng: 74.8667 },
              category: "nature",
              tripType: ["nature", "romantic", "calm"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 1
            },
            {
              id: "kashmir-gulmarg",
              name: "Gulmarg",
              description: "Scenic hill station and popular skiing destination",
              coordinates: { lat: 34.0489, lng: 74.3803 },
              category: "nature",
              tripType: ["adventure", "nature"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "kashmir-amarnath",
              name: "Shri Amarnath Cave Temple",
              description: "Sacred cave temple dedicated to Lord Shiva",
              coordinates: { lat: 33.7300, lng: 75.5000 },
              category: "religious",
              tripType: ["spiritual", "religious"],
              safetyRating: 3,
              safetyRatingSoloWoman: 2,
              crowdLevel: "high",
              ambiance: "calm",
              estimatedDays: 3,
              physicalDemand: "high"
            },
            {
              id: "kashmir-hajan",
              name: "Hajan Valley",
              description: "Picturesque valley with meadows and streams",
              coordinates: { lat: 34.0167, lng: 74.3833 },
              category: "nature",
              tripType: ["nature", "calm"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "low",
              ambiance: "calm",
              estimatedDays: 1
            },
            {
              id: "kashmir-pahalgam",
              name: "Pahalgam",
              description: "Beautiful hill station known as the Valley of Shepherds",
              coordinates: { lat: 34.0167, lng: 75.3167 },
              category: "nature",
              tripType: ["nature", "calm", "romantic"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            }
          ]
        },
        {
          id: "goa",
          name: "Goa",
          description: "Tropical paradise with pristine beaches, Portuguese heritage, and vibrant culture",
          coordinates: { lat: 15.2993, lng: 74.1240 },
          category: "beach",
          tripType: ["beach", "party", "heritage", "calm"],
          safetyRating: 4,
          safetyRatingSoloWoman: 4,
          estimatedDays: 3,
          subdestinations: [
            {
              id: "goa-anjuna",
              name: "Anjuna Flea Market",
              description: "Famous weekly market with vibrant shopping and food",
              coordinates: { lat: 15.5862, lng: 73.7490 },
              category: "shopping",
              tripType: ["party"],
              safetyRating: 3,
              safetyRatingSoloWoman: 3,
              crowdLevel: "high",
              ambiance: "loud",
              estimatedDays: 0.5
            },
            {
              id: "goa-baga",
              name: "Baga Beach",
              description: "Popular beach known for parties and water sports",
              coordinates: { lat: 15.5595, lng: 73.7505 },
              category: "beach",
              tripType: ["party"],
              safetyRating: 3,
              safetyRatingSoloWoman: 3,
              crowdLevel: "high",
              ambiance: "loud",
              estimatedDays: 1
            },
            {
              id: "goa-aguada",
              name: "Fort Aguada",
              description: "17th-century Portuguese fort with stunning sea views",
              coordinates: { lat: 15.4926, lng: 73.7732 },
              category: "heritage",
              tripType: ["heritage"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 0.5
            },
            {
              id: "goa-basilica",
              name: "Basilica of Bom Jesus",
              description: "UNESCO World Heritage Site, ancient Catholic church",
              coordinates: { lat: 15.4996, lng: 73.9112 },
              category: "heritage",
              tripType: ["heritage", "religious"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 0.5
            },
            {
              id: "goa-candolim",
              name: "Candolim Beach",
              description: "Calm and peaceful beach perfect for relaxation",
              coordinates: { lat: 15.5233, lng: 73.7623 },
              category: "beach",
              tripType: ["calm"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 1
            }
          ]
        },
        {
          id: "andaman",
          name: "Andaman and Nicobar Islands",
          description: "Tropical paradise with pristine beaches, coral reefs, and peaceful atmosphere",
          coordinates: { lat: 11.7401, lng: 92.6586 },
          category: "beach",
          tripType: ["beach", "nature", "meditation"],
          safetyRating: 5,
          safetyRatingSoloWoman: 5,
          estimatedDays: 5,
          subdestinations: [
            {
              id: "andaman-cellular-jail",
              name: "Cellular Jail",
              description: "Historic prison and national memorial",
              coordinates: { lat: 11.6670, lng: 92.7450 },
              category: "heritage",
              tripType: ["heritage"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 0.5
            },
            {
              id: "andaman-chidiya-tapu",
              name: "Chidiya Tapu Beach",
              description: "Sunset point with diverse birdlife",
              coordinates: { lat: 11.5167, lng: 92.7167 },
              category: "beach",
              tripType: ["beach", "nature"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "low",
              ambiance: "calm",
              estimatedDays: 0.5
            },
            {
              id: "andaman-samudrika",
              name: "Samudrika Marine Museum",
              description: "Marine museum showcasing Andaman's ecosystem",
              coordinates: { lat: 11.6670, lng: 92.7450 },
              category: "cultural",
              tripType: ["art", "cultural"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 0.5
            },
            {
              id: "andaman-elephant-beach",
              name: "Elephant Beach",
              description: "Pristine beach perfect for snorkeling and water sports",
              coordinates: { lat: 11.7000, lng: 92.7500 },
              category: "beach",
              tripType: ["beach", "adventure"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 1
            },
            {
              id: "andaman-kala-pathar",
              name: "Kala Pathar Beach",
              description: "Secluded black sand beach with crystal clear waters",
              coordinates: { lat: 11.6833, lng: 92.7500 },
              category: "beach",
              tripType: ["beach", "calm"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "low",
              ambiance: "calm",
              estimatedDays: 1
            },
            {
              id: "andaman-swaraj-dweep",
              name: "Swaraj Dweep",
              description: "Island paradise with white sand beaches and coral reefs",
              coordinates: { lat: 11.9500, lng: 93.0167 },
              category: "beach",
              tripType: ["beach", "nature"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "andaman-jolly-buoy",
              name: "Jolly Buoy Island",
              description: "Protected island with vibrant coral reefs and marine life",
              coordinates: { lat: 11.9500, lng: 93.0167 },
              category: "beach",
              tripType: ["beach", "nature", "adventure"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "low",
              ambiance: "calm",
              estimatedDays: 1
            },
            {
              id: "andaman-netaji",
              name: "Netaji Subhas Chandra Bose Island",
              description: "Historic island with lighthouse and scenic views",
              coordinates: { lat: 11.7000, lng: 92.7500 },
              category: "heritage",
              tripType: ["heritage", "nature"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "low",
              ambiance: "calm",
              estimatedDays: 1
            }
          ]
        },
        {
          id: "uttar-pradesh",
          name: "Uttar Pradesh",
          description: "State rich in history, spirituality, and cultural heritage",
          coordinates: { lat: 26.8467, lng: 80.9462 },
          category: "heritage",
          tripType: ["heritage", "spiritual", "religious"],
          safetyRating: 4,
          safetyRatingSoloWoman: 3,
          estimatedDays: 4,
          subdestinations: [
            {
              id: "up-varanasi",
              name: "Varanasi",
              description: "One of the world's oldest continually inhabited cities and spiritual capital of India, also known as Kashi or Benaras",
              coordinates: { lat: 25.3176, lng: 82.9739 },
              category: "religious",
              tripType: ["spiritual", "religious"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "high",
              ambiance: "calm",
              estimatedDays: 2,
              moodTag: ["calm", "reflective"]
            },
            {
              id: "up-ayodhya",
              name: "Ayodhya",
              description: "Ancient city and birthplace of Lord Rama",
              coordinates: { lat: 26.7920, lng: 82.1990 },
              category: "religious",
              tripType: ["spiritual", "religious"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "high",
              ambiance: "calm",
              estimatedDays: 1
            },
            {
              id: "up-mathura",
              name: "Mathura",
              description: "Birthplace of Lord Krishna, sacred pilgrimage site",
              coordinates: { lat: 27.4924, lng: 77.6737 },
              category: "religious",
              tripType: ["spiritual", "religious"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "high",
              ambiance: "calm",
              estimatedDays: 1
            },
            {
              id: "up-vrindavan",
              name: "Vrindavan",
              description: "Sacred town associated with Lord Krishna's childhood",
              coordinates: { lat: 27.5806, lng: 77.7000 },
              category: "religious",
              tripType: ["spiritual", "religious"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "high",
              ambiance: "calm",
              estimatedDays: 1
            }
          ]
        },
        {
          id: "himachal-pradesh",
          name: "Himachal Pradesh",
          description: "Mountain state with scenic valleys, adventure sports, and spiritual sites",
          coordinates: { lat: 31.1048, lng: 77.1734 },
          category: "nature",
          tripType: ["nature", "adventure", "spiritual"],
          safetyRating: 4,
          safetyRatingSoloWoman: 3,
          estimatedDays: 5,
          subdestinations: [
            {
              id: "hp-spiti",
              name: "Spiti Valley",
              description: "High-altitude desert valley, adventure destination with monasteries",
              coordinates: { lat: 32.2451, lng: 78.0662 },
              category: "adventure",
              tripType: ["adventure"],
              safetyRating: 3,
              safetyRatingSoloWoman: 2,
              crowdLevel: "low",
              ambiance: "calm",
              estimatedDays: 5,
              physicalDemand: "high",
              highAltitude: true
            },
            {
              id: "hp-rohtang",
              name: "Rohtang La",
              description: "High mountain pass with stunning views and adventure activities",
              coordinates: { lat: 32.3667, lng: 77.2500 },
              category: "adventure",
              tripType: ["adventure", "nature"],
              safetyRating: 3,
              safetyRatingSoloWoman: 2,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 1,
              physicalDemand: "high",
              highAltitude: true
            }
          ]
        },
        {
          id: "uttarakhand",
          name: "Uttarakhand",
          description: "Devbhoomi - Land of Gods with mountains, rivers, and spiritual sites",
          coordinates: { lat: 30.0668, lng: 79.0193 },
          category: "nature",
          tripType: ["nature", "spiritual", "adventure"],
          safetyRating: 4,
          safetyRatingSoloWoman: 3,
          estimatedDays: 5,
          subdestinations: [
            {
              id: "uk-rishikesh",
              name: "Rishikesh",
              description: "Yoga capital of the world, spiritual town on the banks of Ganges",
              coordinates: { lat: 30.0869, lng: 78.2676 },
              category: "spiritual",
              tripType: ["spiritual", "relaxation"],
              safetyRating: 4,
              safetyRatingSoloWoman: 4,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "uk-mcleod",
              name: "McLeod Ganj",
              description: "Home of the Dalai Lama, Tibetan culture and spirituality",
              coordinates: { lat: 32.2386, lng: 76.3208 },
              category: "spiritual",
              tripType: ["spiritual", "cultural"],
              safetyRating: 4,
              safetyRatingSoloWoman: 4,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "uk-nainital",
              name: "Nainital",
              description: "Picturesque hill station with beautiful lake and mountains",
              coordinates: { lat: 29.3919, lng: 79.4542 },
              category: "nature",
              tripType: ["nature", "relaxation"],
              safetyRating: 4,
              safetyRatingSoloWoman: 4,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "uk-badrinath",
              name: "Badrinath",
              description: "Sacred Hindu temple dedicated to Lord Vishnu",
              coordinates: { lat: 30.7444, lng: 79.4942 },
              category: "religious",
              tripType: ["spiritual", "religious"],
              safetyRating: 3,
              safetyRatingSoloWoman: 2,
              crowdLevel: "high",
              ambiance: "calm",
              estimatedDays: 2,
              physicalDemand: "medium",
              highAltitude: true
            },
            {
              id: "uk-kedarnath",
              name: "Kedarnath",
              description: "Sacred Hindu temple dedicated to Lord Shiva",
              coordinates: { lat: 30.7352, lng: 79.0669 },
              category: "religious",
              tripType: ["spiritual", "religious"],
              safetyRating: 3,
              safetyRatingSoloWoman: 2,
              crowdLevel: "high",
              ambiance: "calm",
              estimatedDays: 2,
              physicalDemand: "high",
              highAltitude: true
            },
            {
              id: "uk-haridwar",
              name: "Haridwar",
              description: "Sacred city on the banks of Ganges, gateway to Char Dham",
              coordinates: { lat: 29.9457, lng: 78.1642 },
              category: "religious",
              tripType: ["spiritual", "religious"],
              safetyRating: 4,
              safetyRatingSoloWoman: 3,
              crowdLevel: "high",
              ambiance: "calm",
              estimatedDays: 1
            }
          ]
        },
        {
          id: "kerala",
          name: "Kerala",
          description: "God's Own Country with backwaters, tea plantations, and serene beaches",
          coordinates: { lat: 10.8505, lng: 76.2711 },
          category: "nature",
          tripType: ["nature", "calm", "romantic"],
          safetyRating: 5,
          safetyRatingSoloWoman: 5,
          estimatedDays: 4,
          subdestinations: [
            {
              id: "kerala-alleppey",
              name: "Alleppey",
              description: "Backwater paradise with houseboats and serene canals",
              coordinates: { lat: 9.4981, lng: 76.3388 },
              category: "nature",
              tripType: ["nature", "calm", "romantic"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "kerala-munnar",
              name: "Munnar",
              description: "Hill station with tea plantations and misty mountains",
              coordinates: { lat: 10.0889, lng: 77.0595 },
              category: "nature",
              tripType: ["nature", "calm"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "low",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "kerala-varkala",
              name: "Varkala",
              description: "Clifftop beach town with spiritual vibes and stunning views",
              coordinates: { lat: 8.7372, lng: 76.7167 },
              category: "beach",
              tripType: ["beach", "spiritual", "relaxation"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "calm",
              estimatedDays: 2
            },
            {
              id: "kerala-kochi",
              name: "Kochi",
              description: "Historic port city with colonial architecture and spice markets",
              coordinates: { lat: 9.9312, lng: 76.2673 },
              category: "heritage",
              tripType: ["heritage", "cultural"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "moderate",
              estimatedDays: 2
            },
            {
              id: "kerala-trivandrum",
              name: "Trivandrum",
              description: "Capital city with temples, beaches, and cultural heritage",
              coordinates: { lat: 8.5244, lng: 76.9366 },
              category: "heritage",
              tripType: ["heritage", "cultural"],
              safetyRating: 5,
              safetyRatingSoloWoman: 5,
              crowdLevel: "medium",
              ambiance: "moderate",
              estimatedDays: 2
            }
          ]
        }
      ];
      await fs.writeFile(destinationsFile, JSON.stringify(defaultDestinations, null, 2));
    }

    // Initialize preferences.json if it doesn't exist
    const preferencesFile = path.join(dataDir, 'preferences.json');
    try {
      await fs.access(preferencesFile);
    } catch {
      await fs.writeFile(preferencesFile, JSON.stringify({}, null, 2));
    }

    // Initialize itineraries.json if it doesn't exist
    const itinerariesFile = path.join(dataDir, 'itineraries.json');
    try {
      await fs.access(itinerariesFile);
    } catch {
      await fs.writeFile(itinerariesFile, JSON.stringify([], null, 2));
    }

    // Initialize checkins.json if it doesn't exist
    const checkinsFile = path.join(dataDir, 'checkins.json');
    try {
      await fs.access(checkinsFile);
    } catch {
      await fs.writeFile(checkinsFile, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error initializing data directory:', error);
  }
};

// Routes
app.use('/api/destinations', destinationsRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/itineraries', itinerariesRoutes);
app.use('/api/checkins', checkinsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TravelWise API is running' });
});

// Start server
initDataDir().then(() => {
  app.listen(PORT, () => {
    console.log(`TravelWise API server running on http://localhost:${PORT}`);
  });
});

module.exports = app;

