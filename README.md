# TravelWise - Emotion-Aware, Safe, and Health-Centric Travel Planning System

TravelWise is a smart travel companion that understands how a person feels while traveling and adapts the journey accordingly. Instead of forcing users to follow rigid itineraries, TravelWise creates calm, safe, and health-aware travel plans that evolve during the trip.

## 🌟 Key Features

### Emotion-Aware Planning
- **Daily Emotional Check-ins**: Share your mood and energy level; TravelWise adjusts your itinerary in real-time
- **Dynamic Plan Adjustment**: Plans adapt based on your emotional feedback (tired, anxious, energetic, etc.)
- **Travel Anxiety Management**: Avoids crowded routes and multiple transport changes; prefers direct, predictable journeys

### Safety & Security
- **Women's Safety Priority**: Prioritizes safer routes, verified transport options, and safer time windows
- **Night Travel Avoidance**: Automatically filters out unsafe routes during night hours (8 PM - 6 AM)
- **Safety Ratings**: Each destination includes safety ratings for informed decision-making

### Health & Well-being
- **Food Sensitivity Support**: Light, easily digestible meals suggested on travel days; heavy meals only on rest days
- **Overstimulation Prevention**: Silent travel mode for calm locations; option to avoid physically demanding activities
- **Burnout Prevention**: Slow-paced itineraries with fewer locations to prevent travel fatigue

### Budget Planning
- **Budget Breakdown**: Supports total budget or detailed breakdown (transport, food, activities)
- **Smart Transport Suggestions**: Recommends transport modes based on budget and safety preferences
- **Cost-Aware Recommendations**: Suggests budget-friendly options while respecting your preferences

### Flexible Trip Support
- **Short Trips**: Supports trips as short as 4 hours (half-day trips, single-day plans)
- **Multi-day Trips**: Full support for extended travel itineraries
- **Rule-Based Logic**: Transparent, explainable decision-making using IF-THEN rules

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **JSON-based storage** (easily migratable to database/Firestore)
- **Rule-Based Logic Engine** for personalized recommendations
- RESTful API architecture

### Frontend
- **React 18** with React Router
- **Vite** for fast development and builds
- **Leaflet** for map visualization
- **OpenStreetMap** for map tiles (no API key required)
- **OSRM Routing** for route visualization

## 📁 Project Structure

```
travelwise/
├── backend/
│   ├── engine/
│   │   └── ruleEngine.js      # Rule-based logic engine
│   ├── routes/
│   │   ├── destinations.js    # Destination CRUD APIs
│   │   ├── preferences.js     # User preferences API
│   │   ├── itineraries.js     # Itinerary management API
│   │   └── checkins.js        # Emotional check-in API
│   ├── data/                  # JSON data files (auto-created)
│   ├── server.js              # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.jsx    # Map with routing
│   │   │   └── MoodCheckIn.jsx # Daily emotional check-in
│   │   ├── pages/
│   │   │   ├── Destinations.jsx
│   │   │   ├── Itineraries.jsx
│   │   │   ├── ItineraryDetail.jsx
│   │   │   └── Preferences.jsx
│   │   ├── services/
│   │   │   └── api.js         # API service layer
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and proxy API requests to the backend.

### Production Build

To build the frontend for production:
```bash
cd frontend
npm run build
```

The production-ready files will be in `frontend/dist/`

## 📡 API Endpoints

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `POST /api/destinations` - Create new destination
- `PUT /api/destinations/:id` - Update destination
- `DELETE /api/destinations/:id` - Delete destination

### Preferences
- `GET /api/preferences?userId=default` - Get user preferences
- `POST /api/preferences` - Update user preferences

**Preference Fields:**
- `travelAnxiety` (boolean) - Whether user experiences travel anxiety
- `travelAnxietyLevel` (string) - 'low', 'moderate', 'high'
- `womensSafety` (boolean) - Women's safety priority
- `safetyConcerns` (boolean) - General safety concerns
- `avoidNightTravel` (boolean) - Avoid night travel (8 PM - 6 AM)
- `foodSensitivity` (boolean) - Food sensitivity or stomach issues
- `overstimulationConcern` (boolean) - Concerned about overstimulation
- `silentTravelMode` (boolean) - Prefer calm, quiet locations
- `avoidTrekking` (boolean) - Avoid physically demanding activities
- `preferredCategories` (array) - Preferred destination categories
- `budgetRange` (string) - 'budget', 'moderate', 'luxury'
- `travelStyle` (string) - 'relaxed', 'moderate', 'fast-paced'
- `maxTripDuration` (number) - Maximum trip duration in days

### Itineraries
- `GET /api/itineraries?userId=default` - Get all itineraries
- `GET /api/itineraries/:id` - Get itinerary by ID
- `POST /api/itineraries` - Create new itinerary (uses rule engine for personalization)
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary

**Itinerary Request Body:**
```json
{
  "name": "Trip Name",
  "description": "Trip description",
  "destinationIds": ["1", "2", "3"],
  "userId": "default",
  "budget": {
    "total": 5000,
    "transport": 2000,
    "food": 1500,
    "activities": 1500
  },
  "preferences": { /* user preferences */ }
}
```

### Check-ins
- `POST /api/checkins` - Create emotional check-in
- `GET /api/checkins/itinerary/:itineraryId` - Get check-ins for an itinerary
- `GET /api/checkins/user/:userId` - Get all check-ins for a user

**Check-in Request Body:**
```json
{
  "itineraryId": "itinerary-id",
  "userId": "default",
  "mood": "tired",
  "energyLevel": "low",
  "stressLevel": "medium",
  "notes": "Feeling exhausted after long travel"
}
```

**Mood Values:** 'happy', 'calm', 'tired', 'anxious', 'energetic', 'stressed'

## 🧠 Rule-Based Logic Engine

The rule engine applies IF-THEN rules to create personalized itineraries:

### Safety Rules
- IF women's safety priority → Filter destinations with safety rating < 4
- IF avoid night travel → Filter destinations without night safety flag
- IF safety concerns → Prefer verified transport options

### Anxiety Rules
- IF travel anxiety = high → Exclude high-crowd destinations
- IF travel anxiety → Prefer direct routes, minimize transfers
- IF anxiety level = high → Add penalty to crowded destinations in routing

### Food Rules
- IF travel day → Suggest light, easily digestible meals
- IF rest day → Allow heavier meals and local cuisine
- IF food sensitivity → Avoid risky foods, raw items, unfamiliar spices

### Overstimulation Rules
- IF silent travel mode → Filter out loud destinations
- IF avoid trekking → Exclude physically demanding activities
- IF overstimulation concern → Prefer calm, nature-based locations

### Route Optimization
- Prefers closer destinations (distance-based)
- Applies safety and anxiety penalties in scoring
- Considers crowd levels for anxiety management

## 💾 Data Storage

The application uses JSON files stored in `backend/data/`:
- `destinations.json` - All destination data (includes safety ratings, crowd levels, transport options)
- `preferences.json` - User preferences
- `itineraries.json` - All itineraries (includes personalized routes and recommendations)
- `checkins.json` - Emotional check-in history

**Note**: These files are automatically created on first server startup. You can easily migrate to a database (MongoDB, PostgreSQL, Firestore) by replacing the file I/O logic in the route handlers.

## 🎯 How TravelWise Solves Real-Life Problems

### Travel Anxiety
The system avoids crowded routes, unnecessary transport changes, and unsafe travel timings. It prefers direct and predictable routes, especially for first-time or anxious travelers.

### Food and Stomach Issues
Food suggestions are made with physical comfort in mind. Light and easily digestible meals are recommended on travel days, while heavier meals are suggested only on rest days. Risky food options are avoided during long journeys.

### Women's Safety
TravelWise prioritizes safer routes and time windows, especially during night travel. Verified transport options are preferred, and unsafe routes are automatically filtered out.

### Overstimulation and Travel Burnout
The application offers a silent travel mode that focuses on calm locations and slow-paced itineraries. Users can choose to include or exclude trekking and physically demanding activities.

### Emotional Well-being During Trip
Through a simple daily emotional check-in, the system adjusts upcoming plans to match the user's mental and physical state, ensuring a balanced travel experience.

### Short-Duration and Budget-Aware Trips
TravelWise supports not only multi-day trips but also short outings such as four-hour trips, half-day trips, and single-day plans. When a budget is provided, the system breaks it down into transport, food, and activity expenses.

## 🔄 System Flow

1. User sets preferences (anxiety, safety, food sensitivity, etc.)
2. User creates a trip and selects destinations
3. Rule-based engine evaluates conditions and filters destinations
4. Personalized itinerary is generated with:
   - Optimized route (considering safety, anxiety, distance)
   - Food recommendations for each day
   - Transport suggestions based on budget and safety
5. During the trip, user provides daily emotional check-ins
6. System adjusts future plans based on mood and energy levels

## 🎨 Features in Detail

### Destination Data Model
Each destination includes:
- Basic info (name, description, coordinates, category)
- Safety rating (1-5)
- Crowd level (low, medium, high)
- Ambiance (calm, moderate, loud)
- Night safety flag
- Transport options available
- Physical demand level (for trekking activities)

### Personalized Itinerary
Each itinerary includes:
- Optimized route based on preferences
- Food recommendations for each destination
- Transport suggestions between destinations
- Safety information
- Budget breakdown

### Emotional Check-ins
Users can check in daily with:
- Current mood (happy, calm, tired, anxious, energetic, stressed)
- Energy level (low, medium, high)
- Stress level (low, medium, high)
- Optional notes

The system responds with personalized recommendations to adjust the itinerary.

## 🔮 Future Enhancements

Potential improvements:
- Firebase/Firestore integration for scalable data storage
- User authentication and multi-user support
- Integration with booking APIs
- Weather information for destinations
- Photo galleries for destinations
- Export itineraries to PDF
- Mobile app version (Flutter)
- More sophisticated routing algorithms
- Real-time safety alerts

## 📄 License

ISC

## 🙏 Acknowledgments

TravelWise is designed with empathy and understanding of real-world travel challenges. It prioritizes emotional comfort, health, and safety over speed and cost, making travel planning more human-centered and accessible.
