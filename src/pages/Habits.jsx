import { useHabitManagerContext } from "../context/HabitManagerContext";
import { useSettingsContext } from "../context/SettingsContext";
import HabitsForm from "../components/habits/HabitsForm";
import HabitsModal from "../components/habits/HabitsModal";
import HabitsConfirmDelete from "../components/habits/HabitsConfirmDelete";
import { colorMap } from "../utils/colors";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import SortableWrapper from "../components/dnd/SortableWrapper";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableHabit = ({ habit, isColorCoded, handleEdit, handleDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-[#1e1e1e] p-4 rounded shadow flex justify-between items-start"
    >
      <div className="flex gap-2 items-start">
        <GripVertical
          className="mt-1 self-center text-gray-400 hover:text-white cursor-grab"
          {...listeners}
        />
        <div>
          <div className="flex items-center gap-2">
            {isColorCoded && (
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: colorMap[habit.color] }}
              />
            )}
            <p className="font-semibold">{habit.name}</p>
          </div>
          {habit.description && (
            <p className="text-sm text-gray-300 mt-1">{habit.description}</p>
          )}
          {habit.days?.length > 0 && (
            <p className="text-sm mt-1">
              Days: {habit.days.length === 7 ? "All Days" : habit.days.join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleEdit(habit)}
          className="text-blue-500 hover:text-blue-400 cursor-pointer"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => handleDelete(habit)}
          className="text-red-500 hover:text-red-400 cursor-pointer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
};

const Habits = () => {
  const {
    habits,
    setHabits,
    isHabitLoading,
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
  } = useHabitManagerContext();

  const { settings, isSettingsLoading } = useSettingsContext();

  if (isSettingsLoading || isHabitLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { isColorCoded } = settings;

  return (
    <div className="py-6 px-4 lg:px-42 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Habits</h1>

      {habits.length === 0 ? (
        <p className="text-gray-400">No habits yet. Click “+ Add Habit” to begin.</p>
      ) : (
        <SortableWrapper items={habits.map(h => h.id)} onReorder={(newOrder) => {
          const newHabits = newOrder.map(id => habits.find(h => h.id === id));
          setHabits(newHabits);
        }}>
          <ul className="space-y-4">
            {habits.map((habit) => (
              <SortableHabit
                key={habit.id}
                habit={habit}
                isColorCoded={isColorCoded}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </ul>
        </SortableWrapper>
      )}

      <div className="mt-4">
        <button
          onClick={openCreateModal}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          + Add Habit
        </button>
      </div>

      <HabitsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <HabitsForm
          onSubmit={handleAddOrUpdateHabit}
          habit={editingHabit}
          isColorCoded={isColorCoded}
        />
      </HabitsModal>

      <HabitsModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <HabitsConfirmDelete
          itemName={habitToDelete?.name}
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      </HabitsModal>
    </div>
  );
};

export default Habits;