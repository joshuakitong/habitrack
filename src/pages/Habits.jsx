import { useState, useEffect } from "react";
import HabitsForm from "../components/HabitsForm";
import Modal from "../components/Modal";
import ConfirmDelete from "../components/ConfirmDelete";
import { v4 as uuidv4 } from "uuid";
import { colorMap } from "../utils/colors";
import { daysOfWeek } from "../utils/daysOfWeek";

const Habit = () => {
  const [habits, setHabits] = useState(() => {
    try {
      const stored = localStorage.getItem("habits");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [editingHabit, setEditingHabit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="py-4 px-42 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Habits</h1>

      {habits.length === 0 ? (
        <p className="text-gray-400">No habits yet. Add your first one below.</p>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="bg-gray-700 p-4 rounded shadow flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colorMap[habit.color] }}
                  />
                  <p className="font-semibold">{habit.name}</p>
                </div>
                {habit.description && (
                  <p className="text-sm text-gray-300">{habit.description}</p>
                )}
                {habit.days?.length > 0 && (
                  <p className="text-sm mt-1">
                    Days: {habit.days.length === 7 ? "All Days" : habit.days.join(", ")}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(habit)}
                  className="cursor-pointer text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(habit)}
                  className="cursor-pointer text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <button
          onClick={openCreateModal}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          + Add Habit
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <HabitsForm 
          onSubmit={handleAddOrUpdateHabit} 
          habit={editingHabit} 
        />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ConfirmDelete
          itemName={habitToDelete?.name}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Habit;