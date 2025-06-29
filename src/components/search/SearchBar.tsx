import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialQuery?: string;
  className?: string;
  autoFocus?: boolean;
  showVoiceSearch?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  initialQuery = '',
  className = '',
  autoFocus = false,
  showVoiceSearch = true
}: SearchBarProps) {
  const { isMobile } = useDeviceDetection();
  const [query, setQuery] = useState(initialQuery);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);
  const [voiceSearchSupported, setVoiceSearchSupported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Check if voice search is supported
  useEffect(() => {
    setVoiceSearchSupported(
      showVoiceSearch && 
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    );
  }, [showVoiceSearch]);
  
  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleVoiceSearch = () => {
    if (!voiceSearchSupported) return;
    
    setIsVoiceSearchActive(true);
    
    // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      onSearch(transcript);
      setIsVoiceSearchActive(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsVoiceSearchActive(false);
    };
    
    recognition.onend = () => {
      setIsVoiceSearchActive(false);
    };
    
    recognition.start();
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={isMobile ? 18 : 20} 
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
              placeholder={placeholder}
            />
            {query && (
              <TouchOptimized>
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={isMobile ? 16 : 18} />
                </button>
              </TouchOptimized>
            )}
          </div>
          
          {voiceSearchSupported && (
            <TouchOptimized>
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`ml-2 p-3 rounded-xl ${
                  isVoiceSearchActive
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-sage-700 text-white hover:bg-sage-800'
                } transition-colors`}
                aria-label="Voice search"
              >
                <Mic size={isMobile ? 16 : 18} />
              </button>
            </TouchOptimized>
          )}
          
          <TouchOptimized>
            <button
              type="submit"
              className="ml-2 bg-sage-700 text-white px-5 py-3 rounded-xl hover:bg-sage-800 transition-colors"
            >
              Search
            </button>
          </TouchOptimized>
        </div>
      </form>
      
      {/* Voice Search Overlay */}
      {isVoiceSearchActive && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
              <Mic className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Listening...</h3>
            <p className="text-gray-600 mb-6">
              Speak clearly to search for memories
            </p>
            <TouchOptimized>
              <button
                onClick={() => setIsVoiceSearchActive(false)}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </TouchOptimized>
          </div>
        </div>
      )}
    </div>
  );
}