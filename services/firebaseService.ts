
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  setDoc, 
  doc, 
  deleteDoc,
  getDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzmhJgx2QwVYLZyo1n0vYSmWWYZUre61I",
  authDomain: "vehicle-dfd89.firebaseapp.com",
  projectId: "vehicle-dfd89",
  storageBucket: "vehicle-dfd89.firebasestorage.app",
  messagingSenderId: "731090439774",
  appId: "1:731090439774:web:919d065659ad36a7766ecf"
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

// Admin Config Helpers
export const fbGetAdminPassword = async (): Promise<string> => {
  const docRef = doc(db, "config", "admin");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().password;
  }
  return "1234"; // Default fallback
};

export const fbUpdateAdminPassword = async (newPassword: string) => {
  await setDoc(doc(db, "config", "admin"), { password: newPassword });
};
