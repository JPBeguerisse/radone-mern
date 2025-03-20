import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null; // ❌ Ne rien afficher si `isOpen` est false
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-white text-lg font-semibold">{title}</h2>
        <p className="text-gray-400 text-sm mt-2">{message}</p>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Supprimer
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
