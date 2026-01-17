
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  deleteDoc, 
  onSnapshot,
  query,
  getDocs
} from "firebase/firestore";

// These values are injected by Vercel's environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Collection References
export const vehiclesRef = collection(db, "vehicles");
export const bookingsRef = collection(db, "bookings");

// Persistence Helpers
export const fbUpdateVehicle = async (vehicle: any) => {
  await setDoc(doc(db, "vehicles", vehicle.id), vehicle);
};

export const fbDeleteVehicle = async (id: string) => {
  await deleteDoc(doc(db, "vehicles", id));
};

export const fbAddBooking = async (booking: any) => {
  await setDoc(doc(db, "bookings", booking.id), booking);
};

export const fbAddVehicle = async (vehicle: any) => {
  await setDoc(doc(db, "vehicles", vehicle.id), vehicle);
};
