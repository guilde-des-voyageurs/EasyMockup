'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  imageUrl?: string;
  onImageChange: (file: File) => void;
  className?: string;
}

export default function ImageUpload({ imageUrl, onImageChange, className = '' }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageChange(acceptedFiles[0]);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500'
      } ${className}`}
    >
      <input {...getInputProps()} />
      {imageUrl ? (
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
            <span className="text-white text-sm">Changer l'image</span>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">
          {isDragActive ? (
            <p>Déposez l'image ici...</p>
          ) : (
            <p>Cliquez ou déposez une image ici</p>
          )}
        </div>
      )}
    </div>
  );
}