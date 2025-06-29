import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export function useNativeFeatures() {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<'web' | 'android' | 'ios'>('web');

  useEffect(() => {
    const checkPlatform = () => {
      const isNativeApp = Capacitor.isNativePlatform();
      const currentPlatform = Capacitor.getPlatform() as 'web' | 'android' | 'ios';
      
      setIsNative(isNativeApp);
      setPlatform(currentPlatform);

      // Configure status bar for native apps
      if (isNativeApp) {
        StatusBar.setStyle({ style: Style.Dark });
        StatusBar.setBackgroundColor({ color: '#2d5738' });
      }
    };

    checkPlatform();

    // Listen for app state changes
    if (Capacitor.isNativePlatform()) {
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
      });

      App.addListener('appUrlOpen', (event) => {
        console.log('App opened with URL:', event.url);
      });
    }

    return () => {
      if (Capacitor.isNativePlatform()) {
        App.removeAllListeners();
      }
    };
  }, []);

  const takePicture = async (): Promise<string | null> => {
    try {
      if (!isNative) {
        // Fallback for web
        return null;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error taking picture:', error);
      return null;
    }
  };

  const selectFromGallery = async (): Promise<string | null> => {
    try {
      if (!isNative) {
        return null;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      return null;
    }
  };

  const shareContent = async (title: string, text: string, url?: string) => {
    try {
      if (!isNative) {
        // Fallback to web share API
        if (navigator.share) {
          await navigator.share({ title, text, url });
        }
        return;
      }

      await Share.share({
        title,
        text,
        url,
      });
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const hapticFeedback = async (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      if (!isNative) return;

      const impactStyle = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy,
      }[style];

      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Error with haptic feedback:', error);
    }
  };

  const hideKeyboard = async () => {
    try {
      if (!isNative) return;
      await Keyboard.hide();
    } catch (error) {
      console.error('Error hiding keyboard:', error);
    }
  };

  const exitApp = async () => {
    try {
      if (!isNative) return;
      await App.exitApp();
    } catch (error) {
      console.error('Error exiting app:', error);
    }
  };

  return {
    isNative,
    platform,
    takePicture,
    selectFromGallery,
    shareContent,
    hapticFeedback,
    hideKeyboard,
    exitApp,
  };
}