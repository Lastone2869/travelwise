import axios from 'axios'
import { db } from '../firebase'
import { collection, doc, getDoc, setDoc, query, where, getDocs, Timestamp, addDoc } from 'firebase/firestore'

const API_BASE_URL = 'http://localhost:5005/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Destinations API - Read only from backend
export const destinationsAPI = {
  getAll: () => api.get('/destinations'),
  getById: (id) => api.get(`/destinations/${id}`),
  getSubdestinations: (destinationId) => api.get(`/destinations/${destinationId}/subdestinations`)
}

// Itineraries API
export const itinerariesAPI = {
  generateItinerary: (data) => api.post('/itineraries/generate-itinerary', data),
  saveToFirestore: async (itineraryData, userId) => {
    const docRef = await addDoc(collection(db, 'itineraries'), {
      ...itineraryData,
      userId,
      createdAt: Timestamp.now()
    })
    return docRef.id
  },
  getById: async (id) => {
    const docRef = doc(db, 'itineraries', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() } }
    } else {
      throw new Error('Itinerary not found')
    }
  },
  updateInFirestore: async (id, dataToUpdate) => {
    const docRef = doc(db, 'itineraries', id)
    await setDoc(docRef, dataToUpdate, { merge: true })
  },
  getByUserId: async (userId) => {
    if (!userId) return [];
    const q = query(
      collection(db, 'itineraries'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const itineraries = [];
    querySnapshot.forEach((doc) => {
      itineraries.push({ id: doc.id, ...doc.data() });
    });
    // Sort manually as requiring a composite index for orderBy might fail without one created in console
    return itineraries.sort((a, b) => {
      const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
      return timeB - timeA; // descending
    });
  }
}

// Checkins API
export const checkinsAPI = {
  getAdjustments: (itinerary, checkin) => api.post('/checkins/adjust', { itinerary, checkin }),
  saveCheckinToFirestore: async (checkinData) => {
    return addDoc(collection(db, 'checkins'), {
      ...checkinData,
      createdAt: Timestamp.now()
    })
  }
}

// Preferences API
export const preferencesAPI = {
  get: async (userId) => {
    if (!userId) return { data: {} };
    const docRef = doc(db, 'preferences', userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { data: docSnap.data() }
    }
    return { data: {} }
  },
  update: async (preferences, userId) => {
    if (!userId) return;
    const docRef = doc(db, 'preferences', userId)
    await setDoc(docRef, preferences, { merge: true })
  }
}

export default api

