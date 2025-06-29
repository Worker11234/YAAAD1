import React, { useState } from 'react';
import { Languages, Check } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
  ];

  const selectedLanguageInfo = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="relative">
      <TouchOptimized>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 bg-white"
        >
          <div className="flex items-center space-x-2">
            <span className="text-xl">{selectedLanguageInfo?.flag}</span>
            <span>{selectedLanguageInfo?.name}</span>
            {selectedLanguageInfo?.name !== selectedLanguageInfo?.nativeName && (
              <span className="text-gray-500">({selectedLanguageInfo?.nativeName})</span>
            )}
          </div>
          <Languages size={18} className="text-gray-500" />
        </button>
      </TouchOptimized>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {languages.map(language => (
              <TouchOptimized key={language.code}>
                <button
                  onClick={() => {
                    setSelectedLanguage(language.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors ${
                    selectedLanguage === language.code ? 'bg-sage-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{language.flag}</span>
                    <span>{language.name}</span>
                    {language.name !== language.nativeName && (
                      <span className="text-gray-500 text-sm">({language.nativeName})</span>
                    )}
                  </div>
                  {selectedLanguage === language.code && (
                    <Check size={16} className="text-sage-600" />
                  )}
                </button>
              </TouchOptimized>
            ))}
          </div>
        </>
      )}
    </div>
  );
}