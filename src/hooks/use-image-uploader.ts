
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseImageUploaderProps {
  onFileSelected: (file: File | null) => void;
  selectedFile: File | null;
}

export const useImageUploader = ({ onFileSelected, selectedFile }: UseImageUploaderProps) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
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

  const handlePaste = async (e: ClipboardEvent) => {
    e.preventDefault();
    
    // Handle pasted image URLs
    if (e.clipboardData) {
      const text = e.clipboardData.getData('text/plain');
      
      // Check if the pasted content is a URL
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        try {
          // Check if URL is an image
          if (/\.(jpg|jpeg|png|gif|webp)$/i.test(text)) {
            setPreview(text);
            
            // Convert URL to blob/file
            const response = await fetch(text);
            const blob = await response.blob();
            const fileExt = text.split('.').pop() || 'jpg';
            const file = new File([blob], `pasted-image.${fileExt}`, { type: `image/${fileExt}` });
            
            onFileSelected(file);
            toast({
              title: "Image URL pasted",
              description: "Image loaded successfully",
            });
            return;
          }
        } catch (error) {
          console.error("Error loading image URL:", error);
          toast({
            title: "Error",
            description: "Failed to load image from URL",
            variant: "destructive",
          });
        }
      }
      
      // Handle pasted image data
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFile(file);
            toast({
              title: "Image pasted",
              description: "Image loaded successfully",
            });
            return;
          }
        }
      }
    }
  };

  useEffect(() => {
    // Add paste event listener to the window
    window.addEventListener('paste', handlePaste);
    
    // Cleanup
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return {
    dragActive,
    preview,
    fileInputRef,
    dropAreaRef,
    handleDrag,
    handleDrop,
    handleChange,
    handleClick,
    handleRemove
  };
};
