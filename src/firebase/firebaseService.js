import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const LOCAL_HABITS_KEY = "habits";
const LOCAL_SETTINGS_KEY = "settings";

const getCurrentUser = () => getAuth().currentUser;

export const fetchHabits = async () => {
  const user = getCurrentUser();
  if (!user) {
    const stored = localStorage.getItem(LOCAL_HABITS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().habits || [] : [];
};

export const saveHabits = async (habits) => {
  const user = getCurrentUser();
  if (!user) {
    localStorage.setItem(LOCAL_HABITS_KEY, JSON.stringify(habits));
    return;
  }

  const docRef = doc(db, "users", user.uid);
  await setDoc(docRef, { habits }, { merge: true });
};

export const fetchSettings = async () => {
  const user = getCurrentUser();
  if (!user) {
    const local = localStorage.getItem(LOCAL_SETTINGS_KEY);
    return local ? JSON.parse(local) : null;
  }

  const docRef = doc(db, "users", user.uid, "settings", "main");
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const saveSettings = async (settings) => {
  const user = getCurrentUser();
  if (!user) {
    const current = JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY)) || {};
    const updated = { ...current, ...settings };
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(updated));
    return;
  }

  const docRef = doc(db, "users", user.uid, "settings", "main");
  await setDoc(docRef, settings, { merge: true });
};