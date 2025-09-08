'use client';

import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { TwitterDataParser } from '@/lib/twitter-parser';
import { HeatmapData } from '@/types/twitter';

interface FileUploaderProps {
  onDataProcessed: (data: HeatmapData) => void;
  onError: (error: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onDataProcessed, onError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  const parser = new TwitterDataParser();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      onError('Please upload a ZIP file containing your Twitter archive.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Reading archive...');

    try {
      setProcessingStep('Extracting data...');
      const result = await parser.parseArchive(file);
      
      if (result.success && result.data) {
        setProcessingStep('Processing tweets...');
        onDataProcessed(result.data);
      } else {
        onError(result.error || 'Failed to process the archive.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  }, [parser, onDataProcessed, onError]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Your Twitter Archive</h3>
          <p className="text-gray-600">{processingStep}</p>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div
        className={`
          border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-500' : 'text-gray-500'}`} />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Upload Your Twitter Archive
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your Twitter archive ZIP file here, or click to browse
            </p>
          </div>

          <label className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors cursor-pointer">
            Choose File
            <input
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          <div className="mt-6 text-sm text-gray-500 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Only ZIP files are supported</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>All processing happens locally in your browser</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">How to get your Twitter archive:</h4>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Go to <strong>Settings and privacy</strong> on Twitter/X</li>
          <li>Click on <strong>Your account</strong> → <strong>Download an archive of your data</strong></li>
          <li>Request your archive and wait for the email notification</li>
          <li>Download the ZIP file and upload it here</li>
        </ol>
        <p className="mt-4 text-sm text-gray-600">
          <strong>Privacy note:</strong> Your data never leaves your device. All processing is done locally in your browser.
        </p>
      </div>
    </div>
  );
};