import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Tag, User, MapPin, Calendar, Image, 
  Check, X, AlertTriangle, Search, Plus, Edit2, 
  Trash2, ChevronRight, ChevronDown, Smile, Eye,
  Camera, FileText, Video, Loader2, Filter, Save
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface AITaggingInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  memory?: Memory;
  onSave: (updatedMemory: Memory) => void;
  familyMembers: FamilyMember[];
}

interface Memory {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'audio' | 'story';
  thumbnail?: string;
  fileUrl?: string;
  tags: string[];
  aiTags?: {
    people: PersonTag[];
    objects: ObjectTag[];
    locations: LocationTag[];
    events: EventTag[];
    emotions: EmotionTag[];
    text: TextTag[];
  };
}

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship?: string;
}

interface BaseTag {
  id: string;
  name: string;
  confidence: number;
  isAccepted: boolean;
  isRejected: boolean;
  source: 'ai' | 'user' | 'existing';
}

interface PersonTag extends BaseTag {
  boundingBox?: { x: number, y: number, width: number, height: number };
  memberId?: string;
}

interface ObjectTag extends BaseTag {
  boundingBox?: { x: number, y: number, width: number, height: number };
}

interface LocationTag extends BaseTag {
  coordinates?: { lat: number, lng: number };
  address?: string;
}

interface EventTag extends BaseTag {
  date?: string;
}

interface EmotionTag extends BaseTag {
  intensity?: number;
}

interface TextTag extends BaseTag {
  boundingBox?: { x: number, y: number, width: number, height: number };
  text: string;
}

export function AITaggingInterface({ 
  isOpen, 
  onClose, 
  memory, 
  onSave,
  familyMembers
}: AITaggingInterfaceProps) {
  const { isMobile } = useDeviceDetection();
  const [activeTab, setActiveTab] = useState<'people' | 'objects' | 'locations' | 'events' | 'emotions' | 'text'>('people');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showFaceBoxes, setShowFaceBoxes] = useState(true);
  const [showObjectBoxes, setShowObjectBoxes] = useState(false);
  const [showTextBoxes, setShowTextBoxes] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonTag | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMemory, setEditedMemory] = useState<Memory | undefined>(memory);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock AI-generated tags for demonstration
  const mockAITags = {
    people: [
      { id: '1', name: 'Mom', confidence: 0.98, isAccepted: false, isRejected: false, source: 'ai' as const, boundingBox: { x: 0.2, y: 0.3, width: 0.1, height: 0.2 } },
      { id: '2', name: 'Dad', confidence: 0.95, isAccepted: false, isRejected: false, source: 'ai' as const, boundingBox: { x: 0.4, y: 0.3, width: 0.1, height: 0.2 } },
      { id: '3', name: 'Emma', confidence: 0.92, isAccepted: false, isRejected: false, source: 'ai' as const, boundingBox: { x: 0.6, y: 0.4, width: 0.1, height: 0.15 } },
      { id: '4', name: 'Unknown Person', confidence: 0.75, isAccepted: false, isRejected: false, source: 'ai' as const, boundingBox: { x: 0.8, y: 0.3, width: 0.1, height: 0.2 } }
    ],
    objects: [
      { id: '1', name: 'Christmas Tree', confidence: 0.96, isAccepted: false, isRejected: false, source: 'ai' as const, boundingBox: { x: 0.1, y: 0.5, width: 0.2, height: 0.4 } },
      { id: '2', name: 'Presents', confidence: 0.94, isAccepted: false, isRejected: false, source: 'ai' as const, boundingBox: { x: 0.3, y: 0.7, width: 0.3, height: 0.2 } },
      { id: '3', name: 'Fireplace', confidence: 0.89, isAccepted: false, isRejected: false, source: 'ai' as const, boundingBox: { x: 0.7, y: 0.6, width: 0.25, height: 0.3 } },
      { id: '4', name: 'Stockings', confidence: 0.85, isAccepted: false, isRejected: false, source: 'ai' as const, boundingBox: { x: 0.75, y: 0.5, width: 0.15, height: 0.1 } }
    ],
    locations: [
      { id: '1', name: 'Living Room', confidence: 0.92, isAccepted: false, isRejected: false, source: 'ai' as const },
      { id: '2', name: 'Home', confidence: 0.88, isAccepted: false, isRejected: false, source: 'ai' as const, address: '123 Family St, Hometown' }
    ],
    events: [
      { id: '1', name: 'Christmas', confidence: 0.97, isAccepted: false, isRejected: false, source: 'ai' as const, date: '2024-12-25' },
      { id: '2', name: 'Gift Opening', confidence: 0.91, isAccepted: false, isRejected: false, source: 'ai' as const }
    ],
    emotions: [
      { id: '1', name: 'Joy', confidence: 0.94, isAccepted: false, isRejected: false, source: 'ai' as const, intensity: 0.9 },
      { id: '2', name: 'Excitement', confidence: 0.89, isAccepted: false, isRejected: false, source: 'ai' as const, intensity: 0.85 },
      { id: '3', name: 'Happiness', confidence: 0.92, isAccepted: false, isRejected: false, source: 'ai' as const, intensity: 0.88 }
    ],
    text: [
      { id: '1', name: 'OCR Text', confidence: 0.82, isAccepted: false, isRejected: false, source: 'ai' as const, text: 'Merry Christmas 2024', boundingBox: { x: 0.4, y: 0.1, width: 0.4, height: 0.1 } }
    ]
  };

  useEffect(() => {
    if (isOpen && memory && !editedMemory?.aiTags) {
      // Simulate AI processing
      setIsProcessing(true);
      setProcessingProgress(0);
      
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            
            // Set mock AI tags after processing
            setEditedMemory(prev => ({
              ...prev!,
              aiTags: mockAITags
            }));
            
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, memory]);

  useEffect(() => {
    setEditedMemory(memory);
  }, [memory]);

  if (!isOpen || !editedMemory) return null;

  const handleTagAction = (
    category: keyof typeof mockAITags,
    tagId: string,
    action: 'accept' | 'reject'
  ) => {
    if (!editedMemory.aiTags) return;
    
    setEditedMemory(prev => {
      if (!prev || !prev.aiTags) return prev;
      
      const updatedTags = { ...prev.aiTags };
      const tagIndex = updatedTags[category].findIndex(tag => tag.id === tagId);
      
      if (tagIndex !== -1) {
        updatedTags[category] = updatedTags[category].map((tag, index) => {
          if (index === tagIndex) {
            return {
              ...tag,
              isAccepted: action === 'accept',
              isRejected: action === 'reject'
            };
          }
          return tag;
        });
      }
      
      return { ...prev, aiTags: updatedTags };
    });
  };

  const handleAddCustomTag = (category: keyof typeof mockAITags) => {
    if (!newTagName.trim() || !editedMemory.aiTags) return;
    
    setEditedMemory(prev => {
      if (!prev || !prev.aiTags) return prev;
      
      const updatedTags = { ...prev.aiTags };
      const newTag: BaseTag = {
        id: `custom-${Date.now()}`,
        name: newTagName.trim(),
        confidence: 1.0, // User-added tags have 100% confidence
        isAccepted: true,
        isRejected: false,
        source: 'user'
      };
      
      updatedTags[category] = [...updatedTags[category], newTag as any];
      
      return { ...prev, aiTags: updatedTags };
    });
    
    setNewTagName('');
  };

  const handleAssignPersonToFamilyMember = (personTagId: string, familyMemberId: string) => {
    if (!editedMemory.aiTags) return;
    
    setEditedMemory(prev => {
      if (!prev || !prev.aiTags) return prev;
      
      const updatedPeople = prev.aiTags.people.map(person => {
        if (person.id === personTagId) {
          const familyMember = familyMembers.find(fm => fm.id === familyMemberId);
          return {
            ...person,
            name: familyMember?.name || person.name,
            memberId: familyMemberId,
            isAccepted: true,
            isRejected: false
          };
        }
        return person;
      });
      
      return {
        ...prev,
        aiTags: {
          ...prev.aiTags,
          people: updatedPeople
        }
      };
    });
    
    setSelectedPerson(null);
  };

  const handleSaveChanges = () => {
    if (!editedMemory) return;
    
    // Convert accepted AI tags to regular tags
    const updatedTags = [...editedMemory.tags];
    
    if (editedMemory.aiTags) {
      // Add all accepted tags from each category
      Object.values(editedMemory.aiTags).flat().forEach(tag => {
        if (tag.isAccepted && !updatedTags.includes(tag.name)) {
          updatedTags.push(tag.name);
        }
      });
    }
    
    const updatedMemory = {
      ...editedMemory,
      tags: updatedTags
    };
    
    onSave(updatedMemory);
    onClose();
  };

  const handleCancelChanges = () => {
    if (isEditing) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.7) return 'Medium';
    return 'Low';
  };

  const renderBoundingBoxes = () => {
    if (!editedMemory.aiTags) return null;
    
    return (
      <>
        {/* Face Bounding Boxes */}
        {showFaceBoxes && editedMemory.aiTags.people.map(person => (
          person.boundingBox && (
            <div
              key={`face-${person.id}`}
              className={`absolute border-2 ${
                person.isAccepted ? 'border-green-500' : 
                person.isRejected ? 'border-red-500' : 'border-blue-500'
              } rounded-md transition-all duration-200 cursor-pointer`}
              style={{
                left: `${person.boundingBox.x * 100}%`,
                top: `${person.boundingBox.y * 100}%`,
                width: `${person.boundingBox.width * 100}%`,
                height: `${person.boundingBox.height * 100}%`,
                transform: `scale(${zoomLevel})`
              }}
              onClick={() => setSelectedPerson(person)}
            >
              <div className={`absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded-md ${
                person.isAccepted ? 'bg-green-500' : 
                person.isRejected ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                {person.name}
              </div>
            </div>
          )
        ))}
        
        {/* Object Bounding Boxes */}
        {showObjectBoxes && editedMemory.aiTags.objects.map(object => (
          object.boundingBox && (
            <div
              key={`object-${object.id}`}
              className={`absolute border-2 ${
                object.isAccepted ? 'border-green-500' : 
                object.isRejected ? 'border-red-500' : 'border-yellow-500'
              } rounded-md transition-all duration-200`}
              style={{
                left: `${object.boundingBox.x * 100}%`,
                top: `${object.boundingBox.y * 100}%`,
                width: `${object.boundingBox.width * 100}%`,
                height: `${object.boundingBox.height * 100}%`,
                transform: `scale(${zoomLevel})`
              }}
            >
              <div className={`absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded-md ${
                object.isAccepted ? 'bg-green-500' : 
                object.isRejected ? 'bg-red-500' : 'bg-yellow-500'
              }`}>
                {object.name}
              </div>
            </div>
          )
        ))}
        
        {/* Text Bounding Boxes */}
        {showTextBoxes && editedMemory.aiTags.text.map(text => (
          text.boundingBox && (
            <div
              key={`text-${text.id}`}
              className={`absolute border-2 ${
                text.isAccepted ? 'border-green-500' : 
                text.isRejected ? 'border-red-500' : 'border-purple-500'
              } rounded-md transition-all duration-200`}
              style={{
                left: `${text.boundingBox.x * 100}%`,
                top: `${text.boundingBox.y * 100}%`,
                width: `${text.boundingBox.width * 100}%`,
                height: `${text.boundingBox.height * 100}%`,
                transform: `scale(${zoomLevel})`
              }}
            >
              <div className={`absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded-md ${
                text.isAccepted ? 'bg-green-500' : 
                text.isRejected ? 'bg-red-500' : 'bg-purple-500'
              }`}>
                {text.text}
              </div>
            </div>
          )
        ))}
      </>
    );
  };

  const renderTagList = (category: keyof typeof mockAITags, icon: React.ReactNode, title: string) => {
    if (!editedMemory.aiTags) return null;
    
    const tags = editedMemory.aiTags[category];
    const filteredTags = searchQuery 
      ? tags.filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : tags;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
            <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              {filteredTags.length}
            </span>
          </h3>
          
          {category === 'people' && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFaceBoxes}
                  onChange={() => setShowFaceBoxes(!showFaceBoxes)}
                  className="mr-2 h-4 w-4 text-sage-600 rounded border-gray-300 focus:ring-sage-500"
                />
                Show Faces
              </label>
            </div>
          )}
          
          {category === 'objects' && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showObjectBoxes}
                  onChange={() => setShowObjectBoxes(!showObjectBoxes)}
                  className="mr-2 h-4 w-4 text-sage-600 rounded border-gray-300 focus:ring-sage-500"
                />
                Show Objects
              </label>
            </div>
          )}
          
          {category === 'text' && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTextBoxes}
                  onChange={() => setShowTextBoxes(!showTextBoxes)}
                  className="mr-2 h-4 w-4 text-sage-600 rounded border-gray-300 focus:ring-sage-500"
                />
                Show Text
              </label>
            </div>
          )}
        </div>
        
        {filteredTags.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No {title.toLowerCase()} detected</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {filteredTags.map(tag => (
              <div 
                key={tag.id} 
                className={`p-3 rounded-lg border transition-colors ${
                  tag.isAccepted ? 'bg-green-50 border-green-200' : 
                  tag.isRejected ? 'bg-red-50 border-red-200' : 
                  'bg-white border-gray-200 hover:border-sage-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {category === 'people' && (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium text-gray-900">{tag.name}</p>
                        {tag.source === 'ai' && (
                          <div className="ml-2 flex items-center">
                            <Sparkles className={`w-4 h-4 ${getConfidenceColor(tag.confidence)}`} />
                            <span className={`text-xs ${getConfidenceColor(tag.confidence)} ml-1`}>
                              {getConfidenceLabel(tag.confidence)}
                            </span>
                          </div>
                        )}
                        {tag.source === 'user' && (
                          <span className="ml-2 text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
                            Added by you
                          </span>
                        )}
                      </div>
                      
                      {category === 'people' && (tag as PersonTag).memberId && (
                        <p className="text-xs text-gray-500">
                          Family member: {familyMembers.find(fm => fm.id === (tag as PersonTag).memberId)?.name}
                        </p>
                      )}
                      
                      {category === 'locations' && (tag as LocationTag).address && (
                        <p className="text-xs text-gray-500">{(tag as LocationTag).address}</p>
                      )}
                      
                      {category === 'events' && (tag as EventTag).date && (
                        <p className="text-xs text-gray-500">
                          Date: {new Date((tag as EventTag).date!).toLocaleDateString()}
                        </p>
                      )}
                      
                      {category === 'text' && (
                        <p className="text-xs text-gray-500 italic">"{(tag as TextTag).text}"</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!tag.isAccepted && !tag.isRejected && (
                      <>
                        <TouchOptimized>
                          <button
                            onClick={() => handleTagAction(category, tag.id, 'accept')}
                            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                            aria-label="Accept tag"
                          >
                            <Check size={18} />
                          </button>
                        </TouchOptimized>
                        <TouchOptimized>
                          <button
                            onClick={() => handleTagAction(category, tag.id, 'reject')}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Reject tag"
                          >
                            <X size={18} />
                          </button>
                        </TouchOptimized>
                      </>
                    )}
                    
                    {tag.isAccepted && (
                      <TouchOptimized>
                        <button
                          onClick={() => handleTagAction(category, tag.id, 'reject')}
                          className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Undo accept"
                        >
                          <X size={18} />
                        </button>
                      </TouchOptimized>
                    )}
                    
                    {tag.isRejected && (
                      <TouchOptimized>
                        <button
                          onClick={() => handleTagAction(category, tag.id, 'accept')}
                          className="p-1 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                          aria-label="Undo reject"
                        >
                          <Check size={18} />
                        </button>
                      </TouchOptimized>
                    )}
                    
                    {category === 'people' && !tag.isRejected && (
                      <TouchOptimized>
                        <button
                          onClick={() => setSelectedPerson(tag as PersonTag)}
                          className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                          aria-label="Assign to family member"
                        >
                          <User size={18} />
                        </button>
                      </TouchOptimized>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Add Custom Tag */}
        <div className="mt-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag(category)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              placeholder={`Add custom ${category.slice(0, -1)}...`}
            />
            <TouchOptimized>
              <button
                onClick={() => handleAddCustomTag(category)}
                disabled={!newTagName.trim()}
                className="bg-sage-700 text-white px-3 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
              >
                <Plus size={20} />
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">AI-Powered Tagging</h2>
              <p className="text-sm text-gray-600">Organize your memories with smart tagging</p>
            </div>
          </div>
          
          <TouchOptimized>
            <button
              onClick={handleCancelChanges}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </TouchOptimized>
        </div>
        
        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Memory</h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Our AI is identifying people, objects, locations, and more in your memory.
              This helps organize and make your memories easier to find later.
            </p>
            <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-purple-600 h-4 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">{processingProgress}% complete</p>
          </div>
        )}
        
        {/* Main Content */}
        {!isProcessing && editedMemory && editedMemory.aiTags && (
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            {/* Left Side - Image/Media Preview */}
            <div className="lg:w-1/2 bg-gray-900 flex items-center justify-center relative overflow-hidden">
              <div 
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center"
              >
                {editedMemory.type === 'photo' && editedMemory.thumbnail && (
                  <img
                    ref={imageRef}
                    src={editedMemory.thumbnail}
                    alt={editedMemory.title}
                    className="max-w-full max-h-full object-contain transition-transform"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                )}
                
                {editedMemory.type === 'video' && editedMemory.thumbnail && (
                  <div className="relative">
                    <img
                      src={editedMemory.thumbnail}
                      alt={editedMemory.title}
                      className="max-w-full max-h-full object-contain"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <Video className="w-16 h-16 text-white opacity-80" />
                    </div>
                  </div>
                )}
                
                {editedMemory.type === 'audio' && (
                  <div className="text-center p-12">
                    <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-green-600" />
                    </div>
                    <p className="text-xl text-white font-medium">Audio File</p>
                    <p className="text-gray-300">AI has analyzed the audio content</p>
                  </div>
                )}
                
                {editedMemory.type === 'story' && (
                  <div className="text-center p-12">
                    <div className="w-32 h-32 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <FileText className="w-16 h-16 text-orange-600" />
                    </div>
                    <p className="text-xl text-white font-medium">Written Story</p>
                    <p className="text-gray-300">AI has analyzed the text content</p>
                  </div>
                )}
                
                {/* Bounding Boxes */}
                {(editedMemory.type === 'photo' || editedMemory.type === 'video') && 
                 editedMemory.thumbnail && renderBoundingBoxes()}
              </div>
              
              {/* Zoom Controls */}
              {(editedMemory.type === 'photo' || editedMemory.type === 'video') && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 rounded-lg p-2 flex space-x-2">
                  <TouchOptimized>
                    <button
                      onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.25))}
                      className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                      disabled={zoomLevel <= 1}
                    >
                      <ZoomOut size={20} />
                    </button>
                  </TouchOptimized>
                  <TouchOptimized>
                    <button
                      onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
                      className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    >
                      <ZoomIn size={20} />
                    </button>
                  </TouchOptimized>
                  <TouchOptimized>
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-1 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    >
                      <Maximize2 size={20} />
                    </button>
                  </TouchOptimized>
                </div>
              )}
            </div>
            
            {/* Right Side - Tagging Interface */}
            <div className="lg:w-1/2 flex flex-col bg-white">
              {/* Tabs */}
              <div className="border-b border-gray-200 overflow-x-auto">
                <div className="flex">
                  <TouchOptimized>
                    <button
                      onClick={() => setActiveTab('people')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'people'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>People</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {editedMemory.aiTags.people.length}
                        </span>
                      </div>
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={() => setActiveTab('objects')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'objects'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Image size={16} />
                        <span>Objects</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {editedMemory.aiTags.objects.length}
                        </span>
                      </div>
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={() => setActiveTab('locations')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'locations'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} />
                        <span>Locations</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {editedMemory.aiTags.locations.length}
                        </span>
                      </div>
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={() => setActiveTab('events')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'events'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>Events</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {editedMemory.aiTags.events.length}
                        </span>
                      </div>
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={() => setActiveTab('emotions')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'emotions'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Smile size={16} />
                        <span>Emotions</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {editedMemory.aiTags.emotions.length}
                        </span>
                      </div>
                    </button>
                  </TouchOptimized>
                  
                  <TouchOptimized>
                    <button
                      onClick={() => setActiveTab('text')}
                      className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === 'text'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <FileText size={16} />
                        <span>Text</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {editedMemory.aiTags.text.length}
                        </span>
                      </div>
                    </button>
                  </TouchOptimized>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder={`Search ${activeTab}...`}
                  />
                </div>
              </div>
              
              {/* Tag Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'people' && renderTagList('people', <User size={20} className="text-blue-600" />, 'People')}
                {activeTab === 'objects' && renderTagList('objects', <Image size={20} className="text-yellow-600" />, 'Objects')}
                {activeTab === 'locations' && renderTagList('locations', <MapPin size={20} className="text-green-600" />, 'Locations')}
                {activeTab === 'events' && renderTagList('events', <Calendar size={20} className="text-orange-600" />, 'Events')}
                {activeTab === 'emotions' && renderTagList('emotions', <Smile size={20} className="text-pink-600" />, 'Emotions')}
                {activeTab === 'text' && renderTagList('text', <FileText size={20} className="text-purple-600" />, 'Text')}
              </div>
              
              {/* Action Bar */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye size={16} />
                      <span>Visibility toggles control what's shown on the image</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <TouchOptimized>
                      <button
                        onClick={handleCancelChanges}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                    </TouchOptimized>
                    <TouchOptimized>
                      <button
                        onClick={handleSaveChanges}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Save size={18} />
                        <span>Save Tags</span>
                      </button>
                    </TouchOptimized>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Person Assignment Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assign to Family Member</h3>
              <TouchOptimized>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </TouchOptimized>
            </div>
            
            <p className="text-gray-600 mb-4">
              Select a family member to assign to this face:
            </p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {familyMembers.map(member => (
                <TouchOptimized key={member.id}>
                  <button
                    onClick={() => handleAssignPersonToFamilyMember(selectedPerson.id, member.id)}
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
            
            <div className="flex justify-between">
              <TouchOptimized>
                <button
                  onClick={() => {
                    handleTagAction('people', selectedPerson.id, 'reject');
                    setSelectedPerson(null);
                  }}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  Remove Face
                </button>
              </TouchOptimized>
              <TouchOptimized>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Discard Changes?</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              You have unsaved changes to your tags. Are you sure you want to discard them?
            </p>
            
            <div className="flex justify-end space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              <TouchOptimized>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    onClose();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Discard Changes
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}