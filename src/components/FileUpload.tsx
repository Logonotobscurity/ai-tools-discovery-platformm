import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';

import { useToolStore } from '@/providers/tool-store-provider';
import { processUploadedJson } from '@/data/tools';

const FileUpload: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const { setTools } = useToolStore((state) => state);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setUploadStatus('error');
      setUploadMessage('Please upload a JSON file');
      return;
    }

    setUploadStatus('loading');
    setUploadMessage('Processing file...');

    try {
      const text = await file.text();
      const validatedTools = processUploadedJson(text);
      
      setTools(validatedTools);

      setUploadStatus('success');
      setUploadMessage(`Successfully loaded ${validatedTools.length} tools. The tool list on the home page has been updated for your current session.`);
      
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Failed to parse JSON file');
    }
  }, [setTools]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  return (
    <div className="bg-card rounded-lg p-6 text-center transition-colors">
      <div 
        {...getRootProps()}
        className={`flex flex-col items-center space-y-4 border-2 border-dashed border-border rounded-lg p-8 transition-colors cursor-pointer ${isDragActive ? 'border-primary bg-primary/10' : 'hover:border-primary/50'}`}
      >
        <input {...getInputProps()} />
        
        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
          {uploadStatus === 'loading' ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : uploadStatus === 'success' ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="w-6 h-6 text-destructive" />
          ) : (
            <Upload className="w-6 h-6 text-primary" />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            {isDragActive ? "Drop the file here..." : "Upload Tools JSON"}
          </h3>
          <p className="text-muted-foreground text-sm">
            Drag & drop or click to select a file
          </p>
        </div>
      </div>
      
      {uploadMessage && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
          uploadStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
          uploadStatus === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
          'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
        }`}>
          {uploadMessage}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
