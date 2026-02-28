import { X } from "lucide-react";
import type React from "react";

type EntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

export const EntryModal = ({
  isOpen,
  onClose,
  children,
  title,
}: EntryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4 py-4">
        <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-50 max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          {title && <h2 className="text-xl font-bold mb-4 pr-8">{title}</h2>}

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};
