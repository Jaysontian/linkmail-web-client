'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, File, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFile?: string | null;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  currentFile, 
  accept = "*/*",
  maxSize = 10,
  className = ""
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size should be less than ${maxSize}MB`;
    }
    return null;
  };

  const handleFileChange = useCallback((file: File | null) => {
    setError(null);
    
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      setUploadedFile(file);
    } else {
      setUploadedFile(null);
    }
    
    onFileSelect(file);
  }, [onFileSelect, maxSize]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const clearFile = useCallback(() => {
    handleFileChange(null);
  }, [handleFileChange]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasFile = uploadedFile || currentFile;

  return (
    <div className={className}>
      <label className="block text-sm text-secondary mb-2">
        Attachment (optional)
      </label>
      
      {!hasFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="flex flex-col items-center gap-2">
            <Upload className={`w-8 h-8 ${error ? 'text-red-400' : 'text-gray-400'}`} />
            <div className="text-sm">
              <span className="font-medium text-primary">Click to upload</span>
              <span className="text-secondary"> or drag and drop</span>
            </div>
            <div className="text-xs text-tertiary">
              Maximum file size: {maxSize}MB
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-foreground border border-border rounded-lg">
          <File className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-primary truncate">
              {uploadedFile ? uploadedFile.name : currentFile}
            </div>
            {uploadedFile && (
              <div className="text-xs text-tertiary">
                {formatFileSize(uploadedFile.size)}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-700 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
