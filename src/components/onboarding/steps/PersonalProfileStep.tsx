import React, { useState } from 'react';
import { User, Camera, Globe, Clock, Accessibility, ChevronRight } from 'lucide-react';
import { TouchOptimized } from '../../ui/TouchOptimized';

interface PersonalProfileData {
  name: string;
  age: string;
  relationship: string;
  language: string;
  timezone: string;
  accessibilityNeeds: string[];
  profilePhoto?: string;
}

interface PersonalProfileStepProps {
  data: PersonalProfileData;
  onUpdate: (data: PersonalProfileData) => void;
  onNext: () => void;
  userEmail: string;
}

export function PersonalProfileStep({ data, onUpdate, onNext, userEmail }: PersonalProfileStepProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(data.profilePhoto || null);

  const relationships = [
    'Parent', 'Grandparent', 'Child', 'Grandchild', 
    'Sibling', 'Spouse/Partner', 'Other Family Member'
  ];

  const accessibilityOptions = [
    { id: 'large-text', label: 'Larger text size' },
    { id: 'high-contrast', label: 'High contrast colors' },
    { id: 'voice-commands', label: 'Voice command support' },
    { id: 'simple-interface', label: 'Simplified interface' },
    { id: 'audio-descriptions', label: 'Audio descriptions' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoPreview(result);
        onUpdate({ ...data, profilePhoto: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAccessibilityNeed = (needId: string) => {
    const updated = data.accessibilityNeeds.includes(needId)
      ? data.accessibilityNeeds.filter(id => id !== needId)
      : [...data.accessibilityNeeds, needId];
    onUpdate({ ...data, accessibilityNeeds: updated });
  };

  const isFormValid = data.name.trim() && data.relationship;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-sage-100">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Tell Us About Yourself</h2>
            <p className="text-lg text-gray-600">Help us personalize your MemoryMesh experience</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Profile Photo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-sage-600" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-base font-medium text-gray-700">Add a photo</p>
                <p className="text-sm text-gray-500">This helps family members recognize you</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-3">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={data.name}
              onChange={(e) => onUpdate({ ...data, name: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-lg font-semibold text-gray-700 mb-3">
              Age (Optional)
            </label>
            <input
              id="age"
              type="number"
              min="1"
              max="120"
              value={data.age}
              onChange={(e) => onUpdate({ ...data, age: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
              placeholder="Your age"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Relationship */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Your Role in the Family *
            </label>
            <div className="grid grid-cols-1 gap-2">
              {relationships.map((relationship) => (
                <TouchOptimized key={relationship}>
                  <button
                    type="button"
                    onClick={() => onUpdate({ ...data, relationship })}
                    className={`w-full p-3 text-left rounded-xl border-2 transition-all ${
                      data.relationship === relationship
                        ? 'border-sage-500 bg-sage-50 text-sage-700'
                        : 'border-gray-200 hover:border-sage-300 hover:bg-sage-25'
                    }`}
                  >
                    {relationship}
                  </button>
                </TouchOptimized>
              ))}
            </div>
          </div>

          {/* Language & Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="language" className="block text-lg font-semibold text-gray-700 mb-3">
                <Globe className="inline w-5 h-5 mr-2" />
                Language
              </label>
              <select
                id="language"
                value={data.language}
                onChange={(e) => onUpdate({ ...data, language: e.target.value })}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-lg font-semibold text-gray-700 mb-3">
                <Clock className="inline w-5 h-5 mr-2" />
                Timezone
              </label>
              <input
                id="timezone"
                type="text"
                value={data.timezone}
                onChange={(e) => onUpdate({ ...data, timezone: e.target.value })}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                placeholder="Your timezone"
              />
            </div>
          </div>

          {/* Accessibility Needs */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              <Accessibility className="inline w-5 h-5 mr-2" />
              Accessibility Preferences (Optional)
            </label>
            <p className="text-base text-gray-600 mb-4">
              Select any features that would help you use MemoryMesh more easily:
            </p>
            <div className="space-y-2">
              {accessibilityOptions.map((option) => (
                <TouchOptimized key={option.id}>
                  <label className="flex items-center space-x-3 p-3 rounded-xl hover:bg-sage-25 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.accessibilityNeeds.includes(option.id)}
                      onChange={() => toggleAccessibilityNeed(option.id)}
                      className="w-5 h-5 text-sage-600 border-2 border-gray-300 rounded focus:ring-sage-500"
                    />
                    <span className="text-base text-gray-700">{option.label}</span>
                  </label>
                </TouchOptimized>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="mt-8 flex justify-end">
        <TouchOptimized>
          <button
            onClick={onNext}
            disabled={!isFormValid}
            className="flex items-center space-x-2 bg-sage-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-sage-800 focus:outline-none focus:ring-4 focus:ring-sage-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[56px]"
          >
            <span>Continue to Family Setup</span>
            <ChevronRight size={20} />
          </button>
        </TouchOptimized>
      </div>
    </div>
  );
}