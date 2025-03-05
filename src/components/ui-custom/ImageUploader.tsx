
import React from 'react';
import { cn } from '@/lib/utils';
import { useImageUploader } from '@/hooks/use-image-uploader';
import ImagePreview from './ImagePreview';
import DropzoneInstructions from './DropzoneInstructions';

interface ImageUploaderProps {
  onFileSelected: (file: File | null) => void;
  selectedFile: File | null;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onFileSelected, 
  selectedFile,
  className
}) => {
  const {
    dragActive,
    preview,
    fileInputRef,
    dropAreaRef,
    handleDrag,
    handleDrop,
    handleChange,
    handleClick,
    handleRemove
  } = useImageUploader({ onFileSelected, selectedFile });

  return (
    <div 
      className={cn(
        'w-full flex flex-col items-center justify-center',
        className
      )}
    >
      <div
        ref={dropAreaRef}
        className={cn(
          'w-full h-[200px] border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative',
          dragActive ? 'border-primary bg-primary/5' : 'border-input bg-secondary/50',
          preview ? 'border-none' : ''
        )}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        {preview ? (
          <ImagePreview src={preview} onRemove={handleRemove} />
        ) : (
          <DropzoneInstructions isDragging={dragActive} />
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
