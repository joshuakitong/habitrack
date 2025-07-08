const HabitsConfirmDelete = ({ itemName = "this item", onConfirm, onCancel }) => {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-xl font-bold">Delete Confirmation</h2>
      <p className="text-gray-300">
        Are you sure you want to delete <span className="font-semibold">{itemName}</span>?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="cursor-pointer bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
        >
          Delete
        </button>
        <button
          onClick={onCancel}
          className="cursor-pointer bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default HabitsConfirmDelete;