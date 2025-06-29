import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Save, Trash2, Loader2 } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface AudioRecorderProps {
  onSave: (blob: Blob, duration: number) => void;
  onCancel: () => void;
}

export function AudioRecorder({ onSave, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        setAudioBlob(audioBlob);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };
      
      // Start recording
      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      
      const updatePlaybackPosition = () => {
        if (audioRef.current) {
          setPlaybackPosition(audioRef.current.currentTime);
          animationFrameRef.current = requestAnimationFrame(updatePlaybackPosition);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(updatePlaybackPosition);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const handleSave = () => {
    if (audioBlob) {
      setIsProcessing(true);
      
      // Simulate processing time
      setTimeout(() => {
        onSave(audioBlob, duration);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isRecording ? 'Recording Audio' : audioBlob ? 'Review Recording' : 'Record Audio Memory'}
        </h3>
        <p className="text-gray-600">
          {isRecording 
            ? 'Speak clearly to capture your memory' 
            : audioBlob 
            ? 'Listen to your recording before saving' 
            : 'Capture a voice memory to preserve'}
        </p>
      </div>

      {/* Timer/Duration Display */}
      <div className="bg-gray-100 rounded-xl p-6 mb-6 text-center">
        <div className={`text-4xl font-bold mb-2 ${isRecording && !isPaused ? 'text-red-600' : 'text-gray-900'}`}>
          {formatTime(isRecording || !audioBlob ? duration : Math.round(playbackPosition))}
        </div>
        <div className="text-sm text-gray-600">
          {isRecording 
            ? isPaused ? 'Recording Paused' : 'Recording...' 
            : audioBlob 
            ? 'Total Duration' 
            : 'Ready to Record'}
        </div>
        
        {/* Waveform Visualization (simplified) */}
        {(isRecording || audioBlob) && (
          <div className="h-12 mt-4 flex items-center justify-center space-x-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const height = isRecording && !isPaused
                ? Math.random() * 100
                : isPlaying
                ? Math.random() * 100
                : 30 + Math.sin(i / 2) * 20;
                
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isRecording && !isPaused
                      ? 'bg-red-500'
                      : isPlaying
                      ? 'bg-green-500'
                      : 'bg-gray-400'
                  }`}
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Audio Player (when recording is complete) */}
      {audioBlob && (
        <div className="mb-6">
          <audio 
            ref={audioRef} 
            src={URL.createObjectURL(audioBlob)} 
            onEnded={() => setIsPlaying(false)}
            className="hidden" 
          />
          
          {/* Playback Progress */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(playbackPosition / duration) * 100}%` }}
            />
          </div>
          
          {/* Playback Controls */}
          <div className="flex justify-center">
            <TouchOptimized>
              <button
                onClick={isPlaying ? pauseAudio : playAudio}
                className="bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
            </TouchOptimized>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      {!audioBlob && (
        <div className="flex justify-center space-x-4 mb-6">
          {isRecording ? (
            <>
              {isPaused ? (
                <TouchOptimized>
                  <button
                    onClick={resumeRecording}
                    className="bg-green-600 text-white p-4 rounded-full hover:bg-green-700 transition-colors"
                  >
                    <Play size={24} />
                  </button>
                </TouchOptimized>
              ) : (
                <TouchOptimized>
                  <button
                    onClick={pauseRecording}
                    className="bg-yellow-600 text-white p-4 rounded-full hover:bg-yellow-700 transition-colors"
                  >
                    <Pause size={24} />
                  </button>
                </TouchOptimized>
              )}
              
              <TouchOptimized>
                <button
                  onClick={stopRecording}
                  className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors"
                >
                  <Square size={24} />
                </button>
              </TouchOptimized>
            </>
          ) : (
            <TouchOptimized>
              <button
                onClick={startRecording}
                className="bg-red-600 text-white p-6 rounded-full hover:bg-red-700 transition-colors"
              >
                <Mic size={32} />
              </button>
            </TouchOptimized>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <TouchOptimized>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </TouchOptimized>
        
        {audioBlob && (
          <div className="flex space-x-3">
            <TouchOptimized>
              <button
                onClick={() => {
                  setAudioBlob(null);
                  setDuration(0);
                  setPlaybackPosition(0);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 size={18} />
                <span>Discard</span>
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Recording</span>
                  </>
                )}
              </button>
            </TouchOptimized>
          </div>
        )}
      </div>
    </div>
  );
}