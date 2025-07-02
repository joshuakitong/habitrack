import HabitsForm from "../components/HabitsForm";
import Modal from "../components/Modal";
import ConfirmDelete from "../components/ConfirmDelete";
import { colorMap } from "../utils/colors";
import { useHabitManager } from "../hooks/useHabitManager";
import { Pencil, Trash2 } from "lucide-react";

const Habits = () => {
  const {
    habits,
    editingHabit,
    isModalOpen,
    isDeleteModalOpen,
    habitToDelete,
    setIsModalOpen,
    setIsDeleteModalOpen,
    handleAddOrUpdateHabit,
    handleEdit,
    handleDelete,
    confirmDelete,
    openCreateModal,
  } = useHabitManager();

  return (
    <div className="py-4 px-4 lg:px-42 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Habits</h1>

      {habits.length === 0 ? (
        <p className="text-gray-400">No habits yet. Add your first one below.</p>
      ) : (
        <ul className="space-y-4">
          {habits.map((habit) => (
            <li
              key={habit.id}
              className="bg-[#1e1e1e] p-4 rounded shadow flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
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
                <div className="flex justify-center gap-2">
                  <button onClick={() => handleEdit(habit)} className="text-blue-500 hover:text-blue-400 cursor-pointer">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(habit)} className="text-red-500 hover:text-red-400 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
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

export default Habits;