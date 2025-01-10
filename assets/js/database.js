// Import necessary Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { logger } from './logger.js'; // Ensure the logger module is robust

// Firebase configuration (consider moving to environment variables for security)
const firebaseConfig = {
    apiKey: "NA",
    authDomain: "bookingappointment-60eba.firebaseapp.com",
    projectId: "bookingappointment-60eba",
    storageBucket: "bookingappointment-60eba.firebasestorage.app",
    messagingSenderId: "931981332376",
    appId: "1:931981332376:web:50004f9d301f1a362ca5ed",
    measurementId: "G-3BSWB45DT3"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Define collection names as constants
const COLLECTIONS = {
  USERS: 'users',
  APPOINTMENTS: 'appointments',
  MESSAGES: 'messages',
  LOGS: 'logs',
};

// Database operations
export const dbOperations = {
  // Create a new user document
  async createUser(userData) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userData.uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
      });
      logger.log('info', `User created: ${userData.uid}`);
      return true;
    } catch (error) {
      logger.log('error', `Error creating user: ${error.message}`);
      throw error;
    }
  },

  // Create a new appointment document
  async createAppointment(appointmentData) {
    try {
      const appointmentRef = collection(db, COLLECTIONS.APPOINTMENTS);
      const newAppointment = await addDoc(appointmentRef, {
        ...appointmentData,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      logger.log('info', `Appointment created: ${newAppointment.id}`);
      return newAppointment.id;
    } catch (error) {
      logger.log('error', `Error creating appointment: ${error.message}`);
      throw error;
    }
  },

  // Update an existing appointment document
  async updateAppointment(appointmentId, data) {
    try {
      const appointmentRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
      await updateDoc(appointmentRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      logger.log('info', `Appointment updated: ${appointmentId}`);
      return true;
    } catch (error) {
      logger.log('error', `Error updating appointment: ${error.message}`);
      throw error;
    }
  },
};

// Export database, auth, and collections for external use
export { db, auth, COLLECTIONS };
