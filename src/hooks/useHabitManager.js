import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { daysOfWeek } from "../utils/dateUtils";
import { defaultHabits } from "../data/defaultHabits";

export const useHabitManager = () => {
  const [habits, setHabits] = useState(() => {
    try {
      const stored = localStorage.getItem("habits");
      if (stored) return JSON.parse(stored);

      localStorage.setItem("habits", JSON.stringify(defaultHabits));
      return defaultHabits;
    } catch {
      return defaultHabits;
    }
  });

  const [editingHabit, setEditingHabit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

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