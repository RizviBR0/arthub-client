import React from 'react';
import { FiAlertTriangle, FiX, FiInfo } from 'react-icons/fi';

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  isDanger = true 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#a89888] hover:text-[#3d3029] transition-colors"
        >
          <FiX size={20} />
        </button>
        
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDanger ? 'bg-red-50 text-red-500' : 'bg-[#faf5ef] text-[#b07c5b]'}`}>
          {isDanger ? <FiAlertTriangle size={24} /> : <FiInfo size={24} />}
        </div>
        
        <h3 className="text-xl font-bold text-[#3d3029] mb-2">{title}</h3>
        <p className="text-sm text-[#7a6e64] mb-6">
          {message}
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-transparent border border-[#d4c3b3] text-[#7a6e64] font-medium rounded-lg hover:bg-[#faf8f5] transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 px-4 text-white font-medium rounded-lg transition-colors shadow-sm ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#b07c5b] hover:bg-[#9e6c4d]'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
