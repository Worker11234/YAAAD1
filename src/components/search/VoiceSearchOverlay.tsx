import React, { useState, useEffect } from 'react';
import { Mic, X, Loader2 } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface VoiceSearchOverlayProps {
  isActive: boolean;
  onClose: () => void;
  onResult: (transcript: string) => void;
}

export function VoiceSearchOverlay({
  isActive,
  onClose,
  onResult
}: VoiceSearchOverlayProps) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isActive) {
      startListening();
    } else {
      stopListening();
    }
    
    return () => {
      stopListening();
    };
  }, [isActive]);
  
  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setError(null);
    
    try {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in your browser');
        setIsListening(false);
        return;
      }
      
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0];
        const transcript = result.transcript;
        
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          onResult(transcript);
          stopListening();
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        
        // If we have a transcript but onresult didn't fire the final event
        if (transcript && isListening) {
          onResult(transcript);
        }
      };
      
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Failed to start speech recognition');
      setIsListening(false);
    }
  };
  
  const stopListening = () => {
    setIsListening(false);
    
    try {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        // This is a bit of a hack to stop any ongoing recognition
        const recognition = new SpeechRecognition();
        recognition.abort();
      }
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
    }
  };
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
        <div className="relative w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          {isListening ? (
            <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75"></div>
          ) : null}
          <Mic className={`w-12 h-12 ${isListening ? 'text-red-600' : 'text-gray-400'}`} />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {isListening ? 'Listening...' : error ? 'Error' : 'Ready to Listen'}
        </h3>
        
        {error ? (
          <p className="text-red-600 mb-6">{error}</p>
        ) : (
          <p className="text-gray-600 mb-6">
            {isListening 
              ? 'Speak clearly to search for memories' 
              : transcript 
              ? 'Processing your search...' 
              : 'Click the microphone to start speaking'}
          </p>
        )}
        
        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-gray-900 font-medium">"{transcript}"</p>
          </div>
        )}
        
        <div className="flex justify-center space-x-4">
          {!isListening && !error && !transcript && (
            <TouchOptimized>
              <button
                onClick={startListening}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Start Listening
              </button>
            </TouchOptimized>
          )}
          
          {isListening && (
            <TouchOptimized>
              <button
                onClick={stopListening}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                Stop Listening
              </button>
            </TouchOptimized>
          )}
          
          {transcript && !isListening && (
            <TouchOptimized>
              <button
                onClick={() => onResult(transcript)}
                className="bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 transition-colors flex items-center space-x-2"
              >
                <span>Search</span>
                {!isListening && transcript && <Loader2 className="w-5 h-5 animate-spin" />}
              </button>
            </TouchOptimized>
          )}
          
          <TouchOptimized>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
}