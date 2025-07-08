const HabitsModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center">
      <div className="bg-[#1e1e1e] p-6 m-6 rounded-lg shadow-lg w-full max-w-lg text-white relative z-50">
        <button
          className="cursor-pointer absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default HabitsModal;