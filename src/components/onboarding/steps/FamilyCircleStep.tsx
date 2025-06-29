import React, { useState } from 'react';
import { Users, Plus, Mail, Shield, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react';
import { TouchOptimized } from '../../ui/TouchOptimized';

interface FamilyCircleData {
  action: 'create' | 'join';
  familyName?: string;
  joinCode?: string;
  invitations: string[];
  privacyLevel: 'private' | 'family-only' | 'extended';
}

interface FamilyCircleStepProps {
  data: FamilyCircleData;
  onUpdate: (data: FamilyCircleData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FamilyCircleStep({ data, onUpdate, onNext, onBack }: FamilyCircleStepProps) {
  const [newInvitation, setNewInvitation] = useState('');

  const privacyLevels = [
    {
      id: 'private' as const,
      title: 'Private',
      description: 'Only you can see and add memories',
      icon: '🔒'
    },
    {
      id: 'family-only' as const,
      title: 'Family Only',
      description: 'Only invited family members can participate',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      id: 'extended' as const,
      title: 'Extended Family',
      description: 'Family members can invite other relatives',
      icon: '🌟'
    }
  ];

  const addInvitation = () => {
    if (newInvitation.trim() && newInvitation.includes('@')) {
      onUpdate({
        ...data,
        invitations: [...data.invitations, newInvitation.trim()]
      });
      setNewInvitation('');
    }
  };

  const removeInvitation = (email: string) => {
    onUpdate({
      ...data,
      invitations: data.invitations.filter(inv => inv !== email)
    });
  };

  const isFormValid = data.action === 'join' 
    ? data.joinCode?.trim() 
    : data.familyName?.trim();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-sage-100">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Set Up Your Family Circle</h2>
            <p className="text-lg text-gray-600">Create a new family group or join an existing one</p>
          </div>
        </div>
      </div>

      {/* Action Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">What would you like to do?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TouchOptimized>
            <button
              onClick={() => onUpdate({ ...data, action: 'create' })}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                data.action === 'create'
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-gray-200 hover:border-sage-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-sage-700 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Create New Family Group</h4>
              </div>
              <p className="text-gray-600">Start fresh with a new family memory collection</p>
            </button>
          </TouchOptimized>

          <TouchOptimized>
            <button
              onClick={() => onUpdate({ ...data, action: 'join' })}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                data.action === 'join'
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-gray-200 hover:border-sage-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-sage-700 p-2 rounded-lg">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Join Existing Family</h4>
              </div>
              <p className="text-gray-600">Connect with a family group that's already been created</p>
            </button>
          </TouchOptimized>
        </div>
      </div>

      {/* Create Family Form */}
      {data.action === 'create' && (
        <div className="space-y-6">
          {/* Family Name */}
          <div>
            <label htmlFor="familyName" className="block text-lg font-semibold text-gray-700 mb-3">
              Family Group Name *
            </label>
            <input
              id="familyName"
              type="text"
              required
              value={data.familyName || ''}
              onChange={(e) => onUpdate({ ...data, familyName: e.target.value })}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
              placeholder="e.g., The Johnson Family, Smith Family Memories"
            />
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              <Shield className="inline w-5 h-5 mr-2" />
              Privacy Settings
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {privacyLevels.map((level) => (
                <TouchOptimized key={level.id}>
                  <button
                    type="button"
                    onClick={() => onUpdate({ ...data, privacyLevel: level.id })}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      data.privacyLevel === level.id
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{level.icon}</span>
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-1">{level.title}</h4>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                    </div>
                  </button>
                </TouchOptimized>
              ))}
            </div>
          </div>

          {/* Family Invitations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              <Mail className="inline w-5 h-5 mr-2" />
              Invite Family Members (Optional)
            </h3>
            <p className="text-base text-gray-600 mb-4">
              Add email addresses of family members you'd like to invite. They'll receive an invitation to join your family group.
            </p>
            
            <div className="flex space-x-2 mb-4">
              <input
                type="email"
                value={newInvitation}
                onChange={(e) => setNewInvitation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInvitation()}
                className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
                placeholder="Enter email address"
              />
              <TouchOptimized>
                <button
                  type="button"
                  onClick={addInvitation}
                  className="bg-sage-700 text-white px-6 py-3 rounded-xl hover:bg-sage-800 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </TouchOptimized>
            </div>

            {data.invitations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-base font-medium text-gray-700">Pending Invitations:</h4>
                {data.invitations.map((email, index) => (
                  <div key={index} className="flex items-center justify-between bg-sage-50 p-3 rounded-lg">
                    <span className="text-base text-gray-700">{email}</span>
                    <TouchOptimized>
                      <button
                        onClick={() => removeInvitation(email)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </TouchOptimized>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Join Family Form */}
      {data.action === 'join' && (
        <div>
          <label htmlFor="joinCode" className="block text-lg font-semibold text-gray-700 mb-3">
            Family Invitation Code *
          </label>
          <input
            id="joinCode"
            type="text"
            required
            value={data.joinCode || ''}
            onChange={(e) => onUpdate({ ...data, joinCode: e.target.value })}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors"
            placeholder="Enter the invitation code from your family"
          />
          <p className="text-base text-gray-600 mt-2">
            Ask a family member who's already using MemoryMesh for the invitation code.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <TouchOptimized>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-semibold transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
        </TouchOptimized>

        <TouchOptimized>
          <button
            onClick={onNext}
            disabled={!isFormValid}
            className="flex items-center space-x-2 bg-sage-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-sage-800 focus:outline-none focus:ring-4 focus:ring-sage-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[56px]"
          >
            <span>Continue to First Memory</span>
            <ChevronRight size={20} />
          </button>
        </TouchOptimized>
      </div>
    </div>
  );
}