'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

interface UploadZoneProps {
  accept?: string; // e.g., 'audio/*', 'audio/mp3,audio/wav'
  maxSize?: number; // in bytes
  maxFiles?: number;
  onUpload?: (files: File[]) => Promise<void>;
  className?: string;
  disabled?: boolean;
}

/**
 * UploadZone - Drag-and-drop file upload with progress
 * Features visual feedback, file validation, and upload progress
 */
export function UploadZone({
  accept = 'audio/*',
  maxSize = 50 * 1024 * 1024, // 50MB default
  maxFiles = 1,
  onUpload,
  className,
  disabled = false,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (accept !== '*') {
      const acceptTypes = accept.split(',').map((t) => t.trim());
      const isValid = acceptTypes.some((type) => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type;
      });
      if (!isValid) {
        return `Invalid file type. Accepted: ${accept}`;
      }
    }

    // Check file size
    if (file.size > maxSize) {
      return `File too large. Maximum: ${formatFileSize(maxSize)}`;
    }

    return null;
  };

  const processFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles).slice(0, maxFiles - files.length);

      const uploadedFiles: UploadedFile[] = fileArray.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        progress: 0,
        status: 'pending' as const,
        error: validateFile(file) || undefined,
      }));

      // Mark files with errors
      uploadedFiles.forEach((f) => {
        if (f.error) f.status = 'error';
      });

      setFiles((prev) => [...prev, ...uploadedFiles]);

      // Filter valid files and start upload
      const validFiles = uploadedFiles.filter((f) => !f.error);
      if (validFiles.length > 0 && onUpload) {
        // Simulate upload progress
        for (const uploadFile of validFiles) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
            )
          );

          // Simulate progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id ? { ...f, progress } : f
              )
            );
          }

          try {
            await onUpload([uploadFile.file]);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id
                  ? { ...f, status: 'complete', progress: 100 }
                  : f
              )
            );
          } catch {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadFile.id
                  ? { ...f, status: 'error', error: 'Upload failed' }
                  : f
              )
            );
          }
        }
      }
    },
    [files.length, maxFiles, maxSize, onUpload, accept]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;
      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [disabled, processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {/* Drop Zone */}
      <motion.div
        className={cn(
          'relative border-2 border-dashed rounded-none',
          'p-8 md:p-12',
          'flex flex-col items-center justify-center',
          'cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-accent bg-accent/10'
            : 'border-white/20 hover:border-white/40 bg-bg-elevated',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={disabled ? undefined : openFilePicker}
        whileHover={disabled ? {} : { scale: 1.01 }}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {/* Icon */}
        <motion.div
          className={cn(
            'w-16 h-16 md:w-20 md:h-20 mb-4',
            'flex items-center justify-center',
            'bg-white/5 rounded-full'
          )}
          animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        >
          <svg
            className={cn(
              'w-8 h-8 md:w-10 md:h-10',
              isDragging ? 'text-accent' : 'text-white/60'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </motion.div>

        {/* Text */}
        <p className="font-display text-xl md:text-2xl text-white mb-2 uppercase">
          {isDragging ? 'Drop Your Track' : 'Upload Your Music'}
        </p>
        <p className="text-text-secondary text-sm md:text-base text-center">
          Drag & drop your file here, or{' '}
          <span className="text-accent">browse</span>
        </p>
        <p className="text-text-muted text-xs mt-2">
          {accept.replace('audio/', '').toUpperCase()} • Max {formatFileSize(maxSize)}
        </p>

        {/* Glow effect when dragging */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                boxShadow: 'inset 0 0 60px rgba(255, 0, 64, 0.2)',
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {files.map((uploadFile) => (
              <motion.div
                key={uploadFile.id}
                className={cn(
                  'flex items-center gap-3 p-3',
                  'bg-bg-elevated border',
                  uploadFile.status === 'error'
                    ? 'border-red-500/50'
                    : uploadFile.status === 'complete'
                    ? 'border-green-500/50'
                    : 'border-white/10'
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* File Icon */}
                <div
                  className={cn(
                    'w-10 h-10 flex items-center justify-center',
                    uploadFile.status === 'error'
                      ? 'bg-red-500/20'
                      : uploadFile.status === 'complete'
                      ? 'bg-green-500/20'
                      : 'bg-accent/20'
                  )}
                >
                  {uploadFile.status === 'error' ? (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : uploadFile.status === 'complete' ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{uploadFile.file.name}</p>
                  <p className="text-text-muted text-xs">
                    {uploadFile.error || formatFileSize(uploadFile.file.size)}
                  </p>

                  {/* Progress Bar */}
                  {uploadFile.status === 'uploading' && (
                    <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadFile.progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(uploadFile.id);
                  }}
                  className={cn(
                    'w-8 h-8 flex items-center justify-center',
                    'text-white/40 hover:text-white',
                    'transition-colors duration-200'
                  )}
                  aria-label="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UploadZone;
