
import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  onRemove: (e: React.MouseEvent) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, onRemove }) => {
  return (
    <div className="relative w-full h-full">
      <img 
        src={src} 
        alt="Preview" 
        className="w-full h-full object-contain p-2"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-light-md transition-transform duration-200 hover:scale-110"
      >
        <X size={16} className="text-gray-700" />
      </button>
    </div>
  );
};

export default ImagePreview;
