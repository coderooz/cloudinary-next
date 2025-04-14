'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { uploadAsset } from '@/lib/cloudinary/cloudinary-client';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/utils';

interface ImageUploaderProps {
  folder?: string;
  onUploadComplete?: (result: any) => void;
  onUploadError?: (error: Error) => void;
  maxFileSizeMB?: number;
  allowMultiple?: boolean;
  tags?: string;
}

export function ImageUploader({
  folder = 'uploads',
  onUploadComplete,
  onUploadError,
  maxFileSizeMB = 10,
  allowMultiple = false,
  tags,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadResults, setUploadResults] = useState<any[]>([]);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Reset progress
      setUploadProgress({});
      setIsUploading(true);

      const maxSize = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes
      const filesToUpload = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          toast.error(`File ${file.name} exceeds the ${maxFileSizeMB}MB limit`);
          return false;
        }
        return true;
      });

      if (filesToUpload.length === 0) {
        setIsUploading(false);
        return;
      }

      try {
        const results = [];

        for (const file of filesToUpload) {
          // Set initial progress
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: 0,
          }));

          // Simulate progress (in a real app, you'd get this from an upload API)
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              const currentProgress = prev[file.name] || 0;
              if (currentProgress >= 90) {
                clearInterval(progressInterval);
                return prev;
              }
              return {
                ...prev,
                [file.name]: currentProgress + Math.random() * 10,
              };
            });
          }, 200);

          // Upload file
          const result = await uploadAsset(file, folder, tags);
          results.push(result);

          // Complete progress
          clearInterval(progressInterval);
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: 100,
          }));

          // Wait a bit before processing next file
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        setUploadResults(results);
        
        // Callback with all results
        if (onUploadComplete) {
          onUploadComplete(results);
        }

        toast.success(`Successfully uploaded ${results.length} file${results.length !== 1 ? 's' : ''}`);

        // Clear progress after a delay
        setTimeout(() => {
          setUploadProgress({});
        }, 2000);
      } catch (error) {
        console.error('Upload error:', error);
        if (onUploadError && error instanceof Error) {
          onUploadError(error);
        }
        toast.error('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setIsUploading(false);
      }
    },
    [folder, maxFileSizeMB, onUploadComplete, onUploadError, tags]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': [],
    },
    multiple: allowMultiple,
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        className={`dropzone p-6 ${
          isDragActive ? 'dropzone-active' : ''
        } flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        
        <motion.div 
          className="text-center"
          animate={{ 
            scale: isDragActive ? 1.05 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="mx-auto mb-4 flex justify-center"
            animate={{ 
              rotate: isDragActive ? [0, -10, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.5, repeat: isDragActive ? Infinity : 0, repeatDelay: 1 }}
          >
            <Upload 
              size={36} 
              className={`${isDragAccept ? 'text-green-500' : isDragReject ? 'text-red-500' : 'text-primary'}`} 
            />
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2">
            {isDragActive
              ? isDragAccept
                ? 'Drop to upload'
                : 'This file type is not accepted'
              : 'Drag and drop to upload'}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            {allowMultiple ? 'You can upload multiple files' : 'Upload a single file'} up to {maxFileSizeMB}MB
          </p>
          
          <Button 
            type="button" 
            disabled={isUploading}
            className="mt-2"
          >
            {isUploading ? 'Uploading...' : 'Select File'}
          </Button>
        </motion.div>
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {Object.keys(uploadProgress).length > 0 && (
          <motion.div 
            className="mt-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-sm font-medium">Upload Progress</h4>
            
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <motion.div 
                key={fileName}
                className="bg-secondary p-3 rounded-md text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="truncate max-w-[200px]">{fileName}</span>
                  <span className="text-xs">
                    {progress >= 100 ? (
                      <span className="flex items-center text-green-500">
                        <Check size={14} className="mr-1" /> Complete
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Loader2 size={14} className="mr-1 animate-spin" /> {Math.round(progress)}%
                      </span>
                    )}
                  </span>
                </div>
                
                <div className="w-full bg-primary/20 rounded-full h-1.5">
                  <motion.div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Results Preview */}
      <AnimatePresence>
        {uploadResults.length > 0 && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Uploaded Files</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUploadResults([])}
                className="text-xs"
              >
                <X size={14} className="mr-1" />
                Clear
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {uploadResults.map((result, index) => (
                <motion.div 
                  key={result.public_id || index}
                  className="relative overflow-hidden rounded-lg border bg-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative aspect-square">
                    <img 
                      src={result.secure_url} 
                      alt="Uploaded file"
                      className="w-full h-full object-cover"  
                    />
                  </div>
                  
                  <div className="p-3 text-xs">
                    <p className="font-medium truncate">{result.original_filename || result.public_id}</p>
                    <p className="text-muted-foreground mt-1">
                      {formatFileSize(result.bytes)} &middot; {result.width}×{result.height}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}