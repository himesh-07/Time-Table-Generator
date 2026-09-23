import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, setDoc, getDoc, collection,
  onSnapshot, serverTimestamp
} from 'firebase/firestore';
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInAnonymously, onAuthStateChanged, signOut, User
} from 'firebase/auth';
import config from '../firebase-applet-config.json';
import { TimetableEntry, OptimizationMetrics, ConflictItem } from './types';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore (uses default database unless custom databaseId is provided)
export const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.warn("Google sign in popup error, falling back to anonymous auth", error);
    try {
      const anon = await signInAnonymously(auth);
      return anon.user;
    } catch (e) {
      console.error("Anonymous auth failed", e);
      return null;
    }
  }
}

export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}

// Save complete timetable state to Cloud Firestore
export async function saveTimetableToCloud(
  semester: number,
  entries: TimetableEntry[],
  metrics: OptimizationMetrics,
  conflicts: ConflictItem[]
): Promise<{ success: boolean; id: string }> {
  try {
    const docId = `sem_${semester}_latest`;
    const ref = doc(db, 'timetables', docId);

    await setDoc(ref, {
      academicSession: "2026-2027 (Odd)",
      semester,
      entries,
      metrics,
      conflicts,
      totalClasses: entries.filter(e => !e.isBreak).length,
      updatedAt: new Date().toISOString(),
      serverTimestamp: serverTimestamp()
    });

    return { success: true, id: docId };
  } catch (err) {
    console.error("Error saving timetable to Firestore:", err);
    throw err;
  }
}

// Load timetable state from Cloud Firestore
export async function loadTimetableFromCloud(semester: number) {
  try {
    const docId = `sem_${semester}_latest`;
    const ref = doc(db, 'timetables', docId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.error("Error loading timetable from Firestore:", err);
    throw err;
  }
}
