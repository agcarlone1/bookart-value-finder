
import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('image/')) {
        handleFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    onFileSelected(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelected(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      className={cn(
        'w-full flex flex-col items-center justify-center',
        className
      )}
    >
      <div
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
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain p-2"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-light-md transition-transform duration-200 hover:scale-110"
            >
              <X size={16} className="text-gray-700" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center p-4 space-y-2 text-center animate-fade-in">
              {dragActive ? (
                <Upload className="h-10 w-10 text-primary mb-2 animate-pulse" />
              ) : (
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
              )}
              <p className="text-sm font-medium text-foreground">
                {dragActive 
                  ? "Drop image here" 
                  : "Drag & drop an image here or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
