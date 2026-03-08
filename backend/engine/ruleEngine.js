/**
 * Rule-Based Logic Engine for TravelWise
 * Implements IF-THEN rules for anxiety, safety, food, and health considerations
 */

class RuleEngine {
  /**
   * Filter destinations based on safety preferences
   * Rule: Avoid unsafe routes and prioritize verified transport options
   */
  filterBySafety(destinations, preferences) {
    if (!preferences.womensSafety && !preferences.safetyConcerns) {
      return destinations;
    }

    return destinations.filter(dest => {
      // If safety rating exists and is too low, filter out
      if (dest.safetyRating !== undefined && dest.safetyRating < 3) {
        return false;
      }

      // Default safety rating if not specified (assume moderate safety)
      const safetyRating = dest.safetyRating || 5;
      
      // For women's safety, require higher safety standards
      if (preferences.womensSafety && safetyRating < 4) {
        return false;
      }

      return true;
    });
  }

  /**
   * Filter destinations based on travel anxiety
   * Rule: Prefer direct routes, avoid crowded places, daytime travel preferred
   */
  filterByAnxiety(destinations, preferences) {
    if (!preferences.travelAnxiety) {
      return destinations;
    }

    const anxietyLevel = preferences.travelAnxietyLevel || 'moderate';
    
    return destinations.map(dest => {
      // Penalize destinations with high crowd levels if anxiety is high
      if (anxietyLevel === 'high' && dest.crowdLevel === 'high') {
        dest._anxietyPenalty = 2;
      } else if (anxietyLevel === 'high' && dest.crowdLevel === 'medium') {
        dest._anxietyPenalty = 1;
      } else {
        dest._anxietyPenalty = 0;
      }

      return dest;
    }).filter(dest => {
      // For high anxiety, exclude high-crowd destinations
      if (anxietyLevel === 'high' && dest.crowdLevel === 'high') {
        return false;
      }
      return true;
    });
  }

  /**
   * Filter activities based on overstimulation preferences
   * Rule: Provide silent travel mode and slow-paced itineraries
   */
  filterByOverstimulation(destinations, preferences) {
    if (!preferences.overstimulationConcern) {
      return destinations;
    }

    return destinations.filter(dest => {
      // Exclude physically demanding activities if overstimulation is a concern
      if (preferences.avoidTrekking && dest.category === 'trekking') {
        return false;
      }

      // Prefer calm locations
      if (preferences.silentTravelMode && dest.ambiance && dest.ambiance === 'loud') {
        return false;
      }

      return true;
    });
  }

  /**
   * Calculate route considering anxiety and safety
   * Rule: Prefer direct routes, minimize transfers, daytime travel
   */
  calculateSafeRoute(destinations, preferences) {
    if (destinations.length <= 1) return destinations;

    // Start with first destination
    const route = [destinations[0]];
    const remaining = [...destinations.slice(1)];

    while (remaining.length > 0) {
      const current = route[route.length - 1];
      let bestIndex = 0;
      let bestScore = -Infinity;

      remaining.forEach((dest, index) => {
        // Calculate distance
        const distance = this.calculateDistance(
          current.coordinates.lat,
          current.coordinates.lng,
          dest.coordinates.lat,
          dest.coordinates.lng
        );

        // Calculate score (higher is better)
        let score = 1 / (distance + 1); // Prefer closer destinations

        // Apply anxiety penalty
        if (dest._anxietyPenalty) {
          score -= dest._anxietyPenalty * 0.3;
        }

        // Prefer safer destinations
        if (preferences.womensSafety || preferences.safetyConcerns) {
          const safetyRating = dest.safetyRating || 5;
          score += (safetyRating / 5) * 0.2;
        }

        // Prefer less crowded if anxiety is a concern
        if (preferences.travelAnxiety) {
          if (dest.crowdLevel === 'low') score += 0.3;
          else if (dest.crowdLevel === 'high') score -= 0.2;
        }

        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });

      route.push(remaining[bestIndex]);
      remaining.splice(bestIndex, 1);
    }

    return route;
  }

  /**
   * Get food recommendations based on travel day type
   * Rule: Light food on travel days, avoid risky food during journeys
   */
  getFoodRecommendations(dayType, preferences) {
    const recommendations = [];

    if (dayType === 'travel') {
      // Light, easily digestible meals
      recommendations.push({
        type: 'light',
        suggestions: ['Soup', 'Salad', 'Sandwiches', 'Fruit', 'Yogurt'],
        avoid: ['Spicy food', 'Heavy curries', 'Fried food', 'Street food'],
        reasoning: 'Light meals are easier to digest during travel and reduce stomach discomfort'
      });
    } else if (dayType === 'rest') {
      // Can have heavier meals
      recommendations.push({
        type: 'full',
        suggestions: preferences.foodSensitivity 
          ? ['Grilled chicken', 'Steamed vegetables', 'Rice', 'Fresh fruits']
          : ['Local cuisine', 'Traditional dishes', 'Popular restaurants'],
        avoid: preferences.foodSensitivity ? ['Raw food', 'Unfamiliar spices', 'Street food'] : [],
        reasoning: 'Rest days allow for more substantial meals and trying local cuisine'
      });
    }

    // Apply food sensitivity filters
    if (preferences.foodSensitivity) {
      recommendations.forEach(rec => {
        rec.avoid.push('Dairy products', 'Gluten-heavy dishes', 'Raw seafood');
        rec.suggestions = rec.suggestions.filter(food => 
          !food.toLowerCase().includes('dairy') && 
          !food.toLowerCase().includes('gluten')
        );
      });
    }

    return recommendations;
  }

  /**
   * Suggest transport modes based on preferences and budget
   * Rule: Verified transport for safety, direct routes for anxiety
   */
  suggestTransportMode(distance, preferences, budget) {
    const suggestions = [];

    // Safety priority: verified transport
    if (preferences.womensSafety || preferences.safetyConcerns) {
      suggestions.push({
        mode: 'verified-taxi',
        priority: 'high',
        reasoning: 'Verified transport options provide better safety and security'
      });
      suggestions.push({
        mode: 'public-transit-daytime',
        priority: 'medium',
        reasoning: 'Daytime public transit is generally safer'
      });
    }

    // Anxiety priority: direct routes
    if (preferences.travelAnxiety) {
      suggestions.push({
        mode: 'direct-route',
        priority: 'high',
        reasoning: 'Direct routes minimize transfers and reduce travel anxiety'
      });
    }

    // Budget considerations
    if (budget && budget.transport) {
      if (budget.transport < 500) {
        suggestions.push({
          mode: 'public-transit',
          priority: 'high',
          reasoning: 'Most budget-friendly option'
        });
      } else if (budget.transport < 2000) {
        suggestions.push({
          mode: 'shared-taxi',
          priority: 'medium',
          reasoning: 'Good balance of cost and comfort'
        });
      } else {
        suggestions.push({
          mode: 'private-taxi',
          priority: 'medium',
          reasoning: 'Comfortable and convenient within budget'
        });
      }
    }

    // Default suggestion
    if (suggestions.length === 0) {
      suggestions.push({
        mode: 'public-transit',
        priority: 'medium',
        reasoning: 'Standard transport option'
      });
    }

    return suggestions[0]; // Return highest priority
  }

  /**
   * Adjust itinerary based on emotional check-in
   * Rule: If user is tired/stressed, reduce activities; if energetic, can add more
   */
  adjustItineraryForMood(currentPlan, moodCheckIn) {
    const adjustedPlan = { ...currentPlan };

    if (moodCheckIn.mood === 'tired' || moodCheckIn.energyLevel === 'low') {
      // Reduce activities, prefer rest
      adjustedPlan.recommendations = {
        action: 'reduce',
        message: 'You seem tired. Consider reducing activities and taking more rest breaks.',
        suggestedChanges: [
          'Remove physically demanding activities',
          'Add rest breaks between locations',
          'Focus on calm, low-energy activities'
        ]
      };
    } else if (moodCheckIn.mood === 'anxious' || moodCheckIn.stressLevel === 'high') {
      // Suggest calming activities
      adjustedPlan.recommendations = {
        action: 'calm',
        message: 'Consider focusing on calm, peaceful locations.',
        suggestedChanges: [
          'Avoid crowded areas',
          'Prefer quiet, nature-based locations',
          'Take longer breaks between activities'
        ]
      };
    } else if (moodCheckIn.mood === 'energetic' && moodCheckIn.energyLevel === 'high') {
      // Can add more activities
      adjustedPlan.recommendations = {
        action: 'maintain',
        message: 'You have good energy! Current plan should work well.',
        suggestedChanges: []
      };
    }

    return adjustedPlan;
  }

  /**
   * Filter destinations by time window for safety
   * Rule: Avoid night travel for safety concerns
   */
  filterByTimeWindow(destinations, timeWindow, preferences) {
    if (!preferences.womensSafety && !preferences.avoidNightTravel) {
      return destinations;
    }

    const hour = timeWindow ? new Date(timeWindow).getHours() : new Date().getHours();

    // Avoid night travel (8 PM to 6 AM)
    if ((hour >= 20 || hour < 6) && preferences.avoidNightTravel) {
      return destinations.filter(dest => {
        // Only allow destinations that are explicitly safe at night
        return dest.nightSafety === true;
      });
    }

    return destinations;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Main method to apply all rules and generate personalized itinerary
   */
  generatePersonalizedItinerary(destinations, preferences, budget = null) {
    // Step 1: Filter by safety
    let filtered = this.filterBySafety(destinations, preferences);

    // Step 2: Filter by anxiety
    filtered = this.filterByAnxiety(filtered, preferences);

    // Step 3: Filter by overstimulation
    filtered = this.filterByOverstimulation(filtered, preferences);

    // Step 4: Calculate safe route
    const route = this.calculateSafeRoute(filtered, preferences);

    // Step 5: Add food recommendations for each day
    const itineraryWithFood = route.map((dest, index) => {
      const dayType = index === 0 ? 'travel' : (index === route.length - 1 ? 'travel' : 'rest');
      return {
        ...dest,
        foodRecommendations: this.getFoodRecommendations(dayType, preferences),
        transportSuggestion: index > 0 
          ? this.suggestTransportMode(
              this.calculateDistance(
                route[index - 1].coordinates.lat,
                route[index - 1].coordinates.lng,
                dest.coordinates.lat,
                dest.coordinates.lng
              ),
              preferences,
              budget
            )
          : null
      };
    });

    return itineraryWithFood;
  }
}

module.exports = new RuleEngine();

