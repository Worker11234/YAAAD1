import React, { useState } from 'react';
import { MessageCircle, Users, Settings, Camera } from 'lucide-react';
import { FamilyMessaging } from '../components/communication/FamilyMessaging';
import { FamilyHighlights } from '../components/communication/FamilyHighlights';
import { FamilyEngagementPrompts } from '../components/communication/FamilyEngagementPrompts';
import { MemoryRequestForm } from '../components/communication/MemoryRequestForm';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export function MessagingPage() {
  const { isMobile } = useDeviceDetection();
  const [showMemoryRequest, setShowMemoryRequest] = useState(false);
  
  // Mock family members data
  const familyMembers = [
    { id: 'user1', name: 'Mom', relationship: 'Mother' },
    { id: 'user2', name: 'Dad', relationship: 'Father' },
    { id: 'user3', name: 'Grandma', relationship: 'Grandmother' },
    { id: 'user4', name: 'Uncle John', relationship: 'Uncle' },
    { id: 'user5', name: 'Sarah', relationship: 'Daughter' }
  ];

  const handleMemoryRequest = async (request: any) => {
    // In a real app, this would send the request to your backend
    console.log('Memory request submitted:', request);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Family Communication</h1>
            <p className="text-lg text-gray-600">
              Stay connected with your family members
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Messaging Area */}
        <div className="lg:col-span-2">
          <FamilyMessaging
            familyId="family1"
            className="h-[700px]"
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Memory Request Button */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <TouchOptimized>
              <button
                onClick={() => setShowMemoryRequest(true)}
                className="w-full flex items-center justify-center space-x-2 bg-sage-700 text-white px-4 py-3 rounded-lg hover:bg-sage-800 transition-colors"
              >
                <Camera className="w-5 h-5" />
                <span>Request Family Memories</span>
              </button>
            </TouchOptimized>
            <p className="text-sm text-gray-600 text-center mt-2">
              Ask family members to share specific memories
            </p>
          </div>
          
          {/* Family Highlights */}
          <FamilyHighlights
            familyId="family1"
            limit={3}
          />
          
          {/* Engagement Prompts */}
          <FamilyEngagementPrompts
            familyId="family1"
          />
          
          {/* Family Stats */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-sage-600" />
              <h3 className="font-semibold text-gray-900">Family Activity</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Active Members</span>
                <span className="text-sm font-medium text-gray-900">5/8</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Messages This Week</span>
                <span className="text-sm font-medium text-gray-900">47</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Shared Memories</span>
                <span className="text-sm font-medium text-gray-900">12</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Memory Requests</span>
                <span className="text-sm font-medium text-gray-900">3</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <TouchOptimized>
                <button
                  onClick={() => {
                    // In a real app, this would navigate to family settings
                    console.log('Family settings');
                  }}
                  className="flex items-center justify-center space-x-2 text-sage-600 hover:text-sage-700 font-medium w-full"
                >
                  <Settings size={16} />
                  <span>Communication Settings</span>
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      </div>
      
      {/* Memory Request Modal */}
      {showMemoryRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <MemoryRequestForm
              familyMembers={familyMembers}
              onSubmit={handleMemoryRequest}
              onCancel={() => setShowMemoryRequest(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}