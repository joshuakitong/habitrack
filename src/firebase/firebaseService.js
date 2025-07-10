import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const LOCAL_HABITS_KEY = "habits";
const LOCAL_SETTINGS_KEY = "settings";

const getCurrentUser = () => getAuth().currentUser;

export const getUserData = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : {};
};

export const saveUserData = async (uid, data) => {
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, data, { merge: true });
};

export const fetchHabits = async () => {
  const user = getCurrentUser();
  if (!user) {
    const stored = localStorage.getItem(LOCAL_HABITS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  const data = docSnap.exists() ? docSnap.data() : {};
  return data.habits || [];
};

export const saveHabits = async (habits) => {
  const user = getCurrentUser();
  if (!user) {
    localStorage.setItem("habits", JSON.stringify(habits));
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  const existingData = docSnap.exists() ? docSnap.data() : {};
  const newData = {
    ...existingData,
    habits,
    createdAt: existingData.createdAt ?? new Date().toISOString(),
  };

  await setDoc(docRef, newData, { merge: true });
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