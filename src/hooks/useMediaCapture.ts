import { useState, useRef } from 'react';

interface MediaCaptureOptions {
  video?: boolean;
  audio?: boolean;
  facingMode?: 'user' | 'environment';
}

export function useMediaCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCapture = async (options: MediaCaptureOptions = {}) => {
    try {
      setIsCapturing(true);
      
      const constraints: MediaStreamConstraints = {
        video: options.video ? {
          facingMode: options.facingMode || 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } : false,
        audio: options.audio || false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current && options.video) {
        videoRef.current.srcObject = mediaStream;
      }

      return mediaStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setIsCapturing(false);
      throw error;
    }
  };

  const stopCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capturePhoto = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !stream) {
        reject(new Error('No video stream available'));
        return;
      }

      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Could not capture photo'));
        }
      }, 'image/jpeg', 0.9);
    });
  };

  return {
    isCapturing,
    stream,
    videoRef,
    startCapture,
    stopCapture,
    capturePhoto
  };
}