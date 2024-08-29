import React from "react";

interface ConfirmationRequestProps {
   isOpen: boolean; 
   onClose: () => void;
   onConfirm: () => void;
   content: string; 
 }
 
 const ConfirmationRequest: React.FC<ConfirmationRequestProps> = ({ isOpen, onClose, onConfirm, content }) => {
  
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-2/3">
                <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                <div
          className="mb-4 text-sm text-gray-800 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: content }}
        />
                <div className="flex justify-end space-x-4">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={onConfirm}
                    >
                        Yes, accept it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationRequest;
