import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { daysOfWeek } from "../utils/dateUtils";
import { defaultHabits } from "../data/defaultHabits";
import { saveHabits, getUserData, saveUserData } from "../firebase/firebaseService";
import { useAuth } from "../context/AuthContext";

export const useHabitManager = () => {
  const { user } = useAuth();

  const [habits, setHabits] = useState([]);
  const [isHabitLoading, setLoading] = useState(true);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  useEffect(() => {
    const loadHabits = async () => {
      setLoading(true);

      if (!user) {
        const localHabits = JSON.parse(localStorage.getItem("habits") || "[]");
        const localInitialized = !!localStorage.getItem("hasInitialized");

        if (!localInitialized) {
          localStorage.setItem("habits", JSON.stringify(defaultHabits));
          localStorage.setItem("hasInitialized", "true");
          setHabits(defaultHabits);
        } else {
          setHabits(localHabits);
        }
      } else {
        const userData = await getUserData(user.uid);
        const habitsFromDB = userData?.habits ?? [];
        const hasInitialized = !!userData?.createdAt;
        const localHabits = JSON.parse(localStorage.getItem("habits") || "[]");

        if (!hasInitialized) {
          const newHabits = localHabits.length ? localHabits : defaultHabits;
          const newData = {
            habits: newHabits,
            settings: {},
            createdAt: new Date().toISOString(),
          };
          await saveUserData(user.uid, newData);
          setHabits(newHabits);
        } else {
          setHabits(habitsFromDB);
        }
      }

      setLoading(false);
    };

    loadHabits();
  }, [user]);

  useEffect(() => {
    if (!isHabitLoading) saveHabits(habits);
  }, [habits, isHabitLoading]);

  const handleAddOrUpdateHabit = (habit) => {
    const finalHabit = {
      ...habit,
      days: habit.days.length === 0 ? [...daysOfWeek] : habit.days,
      isChecked: false,
    };

    if (editingHabit) {
      setHabits((prev) =>
        prev.map((h) => (h.id === editingHabit.id ? { ...h, ...finalHabit } : h))
      );
    } else {
      setHabits((prev) => [...prev, { ...finalHabit, id: uuidv4() }]);
    }

    setEditingHabit(null);
    setIsModalOpen(false);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleDelete = (habit) => {
    setHabitToDelete(habit);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setHabits((prev) => prev.filter((h) => h.id !== habitToDelete?.id));
    setHabitToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  return {
    habits,
    setHabits,
    isHabitLoading,
    editingHabit,
    isModalOpen,
    isDeleteModalOpen,
    habitToDelete,
    setIsModalOpen,
    setIsDeleteModalOpen,
    setEditingHabit,
    setHabitToDelete,
    handleAddOrUpdateHabit,
    handleEdit,
    handleDelete,
    confirmDelete,
    openCreateModal,
  };
};