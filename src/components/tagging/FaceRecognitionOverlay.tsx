import React, { useState, useRef, useEffect } from 'react';
import { User, Plus, Check, X, Loader2 } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface FaceBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  personId?: string;
  personName?: string;
  confidence: number;
  isNew?: boolean;
}

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship?: string;
}

interface FaceRecognitionOverlayProps {
  imageUrl: string;
  faces: FaceBox[];
  familyMembers: FamilyMember[];
  onFaceAssign: (faceId: string, personId: string, personName: string) => void;
  onFaceRemove: (faceId: string) => void;
  onAddNewPerson: (faceId: string, name: string) => void;
  className?: string;
}

export function FaceRecognitionOverlay({
  imageUrl,
  faces,
  familyMembers,
  onFaceAssign,
  onFaceRemove,
  onAddNewPerson,
  className = ''
}: FaceRecognitionOverlayProps) {
  const { isMobile } = useDeviceDetection();
  const [selectedFace, setSelectedFace] = useState<FaceBox | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [isAddingNewPerson, setIsAddingNewPerson] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      handleImageLoad();
    }
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight
      });
    }
  };

  const handleFaceClick = (face: FaceBox) => {
    setSelectedFace(face);
    setShowSelector(true);
  };

  const handleAssignPerson = (personId: string) => {
    if (!selectedFace) return;
    
    const person = familyMembers.find(fm => fm.id === personId);
    if (person) {
      onFaceAssign(selectedFace.id, personId, person.name);
    }
    
    setShowSelector(false);
    setSelectedFace(null);
  };

  const handleAddNewPerson = () => {
    if (!selectedFace || !newPersonName.trim()) return;
    
    setIsAddingNewPerson(true);
    
    // Simulate API call
    setTimeout(() => {
      onAddNewPerson(selectedFace.id, newPersonName.trim());
      setIsAddingNewPerson(false);
      setShowSelector(false);
      setSelectedFace(null);
      setNewPersonName('');
    }, 1000);
  };

  const handleRemoveFace = () => {
    if (!selectedFace) return;
    
    onFaceRemove(selectedFace.id);
    setShowSelector(false);
    setSelectedFace(null);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Image */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Face recognition"
        className="max-w-full max-h-full object-contain"
        onLoad={handleImageLoad}
      />
      
      {/* Loading Indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="w-8 h-8 text-sage-600 animate-spin" />
        </div>
      )}
      
      {/* Face Boxes */}
      {imageLoaded && faces.map(face => (
        <TouchOptimized key={face.id}>
          <div
            className={`absolute border-2 ${
              face.personId ? 'border-green-500' : 'border-blue-500'
            } rounded-md transition-all duration-200 cursor-pointer hover:border-yellow-500`}
            style={{
              left: `${face.x * 100}%`,
              top: `${face.y * 100}%`,
              width: `${face.width * 100}%`,
              height: `${face.height * 100}%`
            }}
            onClick={() => handleFaceClick(face)}
          >
            {face.personName && (
              <div className="absolute -bottom-8 left-0 px-2 py-1 text-xs text-white bg-green-500 rounded-md whitespace-nowrap">
                {face.personName}
              </div>
            )}
          </div>
        </TouchOptimized>
      ))}
      
      {/* Person Selector */}
      {showSelector && selectedFace && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Who is this?</h3>
              <TouchOptimized>
                <button
                  onClick={() => {
                    setShowSelector(false);
                    setSelectedFace(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </TouchOptimized>
            </div>
            
            {/* Family Members List */}
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {familyMembers.map(member => (
                <TouchOptimized key={member.id}>
                  <button
                    onClick={() => handleAssignPerson(member.id)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={20} className="text-sage-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      {member.relationship && (
                        <p className="text-xs text-gray-500">{member.relationship}</p>
                      )}
                    </div>
                  </button>
                </TouchOptimized>
              ))}
            </div>
            
            {/* Add New Person */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-2">Not in your family list?</p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                  placeholder="Enter name..."
                />
                <TouchOptimized>
                  <button
                    onClick={handleAddNewPerson}
                    disabled={!newPersonName.trim() || isAddingNewPerson}
                    className="bg-sage-700 text-white px-3 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
                  >
                    {isAddingNewPerson ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus size={20} />
                    )}
                  </button>
                </TouchOptimized>
              </div>
            </div>
            
            {/* Remove Face */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <TouchOptimized>
                <button
                  onClick={handleRemoveFace}
                  className="text-red-600 hover:text-red-700 transition-colors text-sm"
                >
                  This is not a face / Remove detection
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}