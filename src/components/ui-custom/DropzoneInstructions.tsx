
import React from 'react';
import { Upload, Image as ImageIcon, Clipboard } from 'lucide-react';

interface DropzoneInstructionsProps {
  isDragging: boolean;
}

const DropzoneInstructions: React.FC<DropzoneInstructionsProps> = ({ isDragging }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-2 text-center animate-fade-in">
      {isDragging ? (
        <Upload className="h-10 w-10 text-primary mb-2 animate-pulse" />
      ) : (
        <div className="flex flex-col items-center">
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <div className="flex items-center mt-1 text-xs text-primary font-medium">
            <Clipboard size={14} className="mr-1" />
            <span>Paste URL or image</span>
          </div>
        </div>
      )}
      <p className="text-sm font-medium text-foreground">
        {isDragging 
          ? "Drop image here" 
          : "Drag & drop, paste, or click to browse"}
      </p>
      <p className="text-xs text-muted-foreground">
        Supports: JPG, PNG, GIF (max 5MB)
      </p>
    </div>
  );
};

export default DropzoneInstructions;
