import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Heart, MessageCircle, Share2, Edit3, Download, Calendar, 
  MapPin, User, Tag, Sparkles, ThumbsUp, Eye, Play, Volume2,
  ChevronLeft, ChevronRight, Flag, Copy, ExternalLink, Star,
  ZoomIn, ZoomOut, RotateCw, Maximize2, Send, AtSign, Reply,
  MoreHorizontal, Trash2, AlertTriangle, Check, Plus
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface Memory {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'audio' | 'story';
  date: string;
  location?: string;
  author: {
    name: string;
    avatar?: string;
    relationship?: string;
  };
  thumbnail?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  tags: string[];
  interactions: {
    likes: number;
    comments: number;
    views: number;
    isLiked: boolean;
    isFavorited: boolean;
  };
  aiInsights?: {
    faces: string[];
    objects: string[];
    events: string[];
    locations: string[];
    suggestedTags: string[];
  };
  privacy: 'private' | 'family' | 'public';
  isEditable: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    id: string;
  };
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  mentions?: string[];
}

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship?: string;
}

interface MemoryDetailModalProps {
  memory: Memory;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (memory: Memory) => void;
  onDelete: (memoryId: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  familyMembers?: FamilyMember[];
}

export function MemoryDetailModal({
  memory,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  familyMembers = []
}: MemoryDetailModalProps) {
  const { isMobile } = useDeviceDetection();
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'tags'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(memory.title);
  const [editedDescription, setEditedDescription] = useState(memory.description);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: { name: 'Mom', avatar: undefined, id: 'mom1' },
      content: 'Such a beautiful memory! I remember this day so clearly. The weather was perfect and everyone was so happy.',
      date: '2024-12-20T10:30:00Z',
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          author: { name: 'Dad', avatar: undefined, id: 'dad1' },
          content: 'Yes, it was one of our best family days ever!',
          date: '2024-12-20T11:00:00Z',
          likes: 2,
          isLiked: true
        }
      ]
    },
    {
      id: '2',
      author: { name: 'Uncle John', avatar: undefined, id: 'uncle1' },
      content: 'Thanks for capturing this @Mom! It brings back so many wonderful memories.',
      date: '2024-12-20T11:15:00Z',
      likes: 3,
      isLiked: true,
      mentions: ['Mom']
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Increment view count
      onUpdate({
        ...memory,
        interactions: {
          ...memory.interactions,
          views: memory.interactions.views + 1
        }
      });
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasNext && onNext) onNext();
          break;
        case 'f':
        case 'F':
          if (memory.type === 'photo') setIsFullscreen(!isFullscreen);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, hasNext, hasPrevious, onNext, onPrevious, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSave = () => {
    onUpdate({
      ...memory,
      title: editedTitle,
      description: editedDescription
    });
    setIsEditing(false);
  };

  const handleLike = () => {
    onUpdate({
      ...memory,
      interactions: {
        ...memory.interactions,
        isLiked: !memory.interactions.isLiked,
        likes: memory.interactions.isLiked 
          ? memory.interactions.likes - 1 
          : memory.interactions.likes + 1
      }
    });
  };

  const handleFavorite = () => {
    onUpdate({
      ...memory,
      interactions: {
        ...memory.interactions,
        isFavorited: !memory.interactions.isFavorited
      }
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: { name: 'Current User', id: 'current', avatar: undefined },
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };

    if (replyingTo) {
      setComments(prev => prev.map(c => 
        c.id === replyingTo 
          ? { ...c, replies: [...(c.replies || []), comment] }
          : c
      ));
      setReplyingTo(null);
    } else {
      setComments(prev => [comment, ...prev]);
    }

    setNewComment('');
    onUpdate({
      ...memory,
      interactions: {
        ...memory.interactions,
        comments: memory.interactions.comments + 1
      }
    });
  };

  const handleAddTag = () => {
    if (!newTag.trim() || memory.tags.includes(newTag.trim())) return;

    onUpdate({
      ...memory,
      tags: [...memory.tags, newTag.trim()]
    });
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({
      ...memory,
      tags: memory.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: memory.title,
          text: memory.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  };

  const handleDownload = () => {
    if (memory.fileUrl) {
      const link = document.createElement('a');
      link.href = memory.fileUrl;
      link.download = memory.fileName || `memory-${memory.id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = () => {
    onDelete(memory.id);
    onClose();
  };

  const handleMentionSelect = (member: FamilyMember) => {
    const textarea = commentInputRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = newComment;
    const beforeMention = text.substring(0, start - mentionQuery.length - 1);
    const afterMention = text.substring(end);
    
    setNewComment(`${beforeMention}@${member.name} ${afterMention}`);
    setShowMentions(false);
    setMentionQuery('');
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newPosition = beforeMention.length + member.name.length + 2;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleCommentChange = (value: string) => {
    setNewComment(value);
    
    // Check for @ mentions
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const query = value.substring(atIndex + 1);
      if (query.length === 0 || /^[a-zA-Z\s]*$/.test(query)) {
        setMentionQuery(query);
        setShowMentions(true);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const filteredMembers = familyMembers.filter(member =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const tabs = [
    { id: 'details', label: 'Details', icon: Eye },
    { id: 'comments', label: 'Comments', icon: MessageCircle, count: comments.length },
    { id: 'tags', label: 'Tags & AI', icon: Tag, count: memory.tags.length }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Main Modal Container */}
      <div className={`bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col ${
        isFullscreen ? 'fixed inset-0 rounded-none max-w-none max-h-none' : 'm-4'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 truncate max-w-md">
              {memory.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                memory.type === 'photo' ? 'bg-blue-100 text-blue-700' :
                memory.type === 'video' ? 'bg-purple-100 text-purple-700' :
                memory.type === 'audio' ? 'bg-green-100 text-green-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {memory.type.charAt(0).toUpperCase() + memory.type.slice(1)}
              </span>
              {memory.interactions.isFavorited && (
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Navigation Arrows */}
            {hasPrevious && (
              <TouchOptimized>
                <button
                  onClick={onPrevious}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Previous memory"
                >
                  <ChevronLeft size={24} />
                </button>
              </TouchOptimized>
            )}
            
            {hasNext && (
              <TouchOptimized>
                <button
                  onClick={onNext}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Next memory"
                >
                  <ChevronRight size={24} />
                </button>
              </TouchOptimized>
            )}

            {/* Fullscreen Toggle */}
            {memory.type === 'photo' && (
              <TouchOptimized>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize2 size={20} />
                </button>
              </TouchOptimized>
            )}

            <TouchOptimized>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </TouchOptimized>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Media Section */}
          <div className={`${isFullscreen ? 'w-full' : 'lg:w-2/3'} bg-gray-50 flex items-center justify-center relative`}>
            {memory.thumbnail || memory.fileUrl ? (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {memory.type === 'photo' ? (
                  <img
                    ref={imageRef}
                    src={memory.fileUrl || memory.thumbnail}
                    alt={memory.title}
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{ 
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      cursor: zoom > 1 ? 'grab' : 'zoom-in'
                    }}
                    onClick={() => setZoom(zoom === 1 ? 2 : 1)}
                  />
                ) : memory.type === 'video' ? (
                  <video
                    ref={videoRef}
                    src={memory.fileUrl}
                    controls
                    className="max-w-full max-h-full"
                    poster={memory.thumbnail}
                  >
                    <track kind="subtitles" src="" label="English" />
                  </video>
                ) : memory.type === 'audio' ? (
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Volume2 className="w-16 h-16 text-green-600" />
                    </div>
                    <audio controls className="w-full max-w-md">
                      <source src={memory.fileUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-32 h-32 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Written Story</h3>
                    <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto text-left">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {memory.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Photo Controls */}
                {memory.type === 'photo' && !isFullscreen && (
                  <div className="absolute bottom-4 right-4 flex space-x-2 bg-black bg-opacity-50 rounded-lg p-2">
                    <TouchOptimized>
                      <button
                        onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
                        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                        aria-label="Zoom out"
                      >
                        <ZoomOut size={20} />
                      </button>
                    </TouchOptimized>
                    <TouchOptimized>
                      <button
                        onClick={() => setZoom(Math.min(3, zoom + 0.5))}
                        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                        aria-label="Zoom in"
                      >
                        <ZoomIn size={20} />
                      </button>
                    </TouchOptimized>
                    <TouchOptimized>
                      <button
                        onClick={() => setRotation((rotation + 90) % 360)}
                        className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                        aria-label="Rotate"
                      >
                        <RotateCw size={20} />
                      </button>
                    </TouchOptimized>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Eye className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-xl text-gray-600 font-medium">No media available</p>
              </div>
            )}
          </div>

          {/* Details Panel */}
          {!isFullscreen && (
            <div className="lg:w-1/3 flex flex-col bg-white">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  {tabs.map(tab => (
                    <TouchOptimized key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-sage-500 text-sage-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    </TouchOptimized>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Author Info */}
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                        {memory.author.avatar ? (
                          <img 
                            src={memory.author.avatar} 
                            alt={memory.author.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={24} className="text-sage-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{memory.author.name}</p>
                        {memory.author.relationship && (
                          <p className="text-sm text-gray-500">{memory.author.relationship}</p>
                        )}
                      </div>
                    </div>

                    {/* Date and Location */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar size={16} />
                        <span className="text-sm">{formatDate(memory.date)}</span>
                      </div>
                      {memory.location && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin size={16} />
                          <span className="text-sm">{memory.location}</span>
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    {(memory.fileName || memory.fileSize) && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">File Information</h4>
                        {memory.fileName && (
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Filename:</span> {memory.fileName}
                          </p>
                        )}
                        {memory.fileSize && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Size:</span> {formatFileSize(memory.fileSize)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Title and Description */}
                    <div>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title
                            </label>
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <textarea
                              value={editedDescription}
                              onChange={(e) => setEditedDescription(e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <TouchOptimized>
                              <button
                                onClick={handleSave}
                                className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors"
                              >
                                <Check size={16} />
                                <span>Save</span>
                              </button>
                            </TouchOptimized>
                            <TouchOptimized>
                              <button
                                onClick={() => {
                                  setIsEditing(false);
                                  setEditedTitle(memory.title);
                                  setEditedDescription(memory.description);
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                Cancel
                              </button>
                            </TouchOptimized>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">Description</h4>
                            {memory.isEditable && (
                              <TouchOptimized>
                                <button
                                  onClick={() => setIsEditing(true)}
                                  className="text-sage-600 hover:text-sage-700 transition-colors"
                                >
                                  <Edit3 size={16} />
                                </button>
                              </TouchOptimized>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {memory.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Interaction Stats */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{memory.interactions.likes}</p>
                          <p className="text-sm text-gray-600">Likes</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{memory.interactions.comments}</p>
                          <p className="text-sm text-gray-600">Comments</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{memory.interactions.views}</p>
                          <p className="text-sm text-gray-600">Views</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    {/* Add Comment */}
                    <div className="space-y-3">
                      <div className="relative">
                        <textarea
                          ref={commentInputRef}
                          value={newComment}
                          onChange={(e) => handleCommentChange(e.target.value)}
                          placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none"
                          rows={3}
                        />
                        
                        {/* Mention Dropdown */}
                        {showMentions && filteredMembers.length > 0 && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                            {filteredMembers.map(member => (
                              <TouchOptimized key={member.id}>
                                <button
                                  onClick={() => handleMentionSelect(member)}
                                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
                                    {member.avatar ? (
                                      <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                      <User size={16} className="text-sage-600" />
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
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <AtSign size={14} />
                          <span>Type @ to mention family members</span>
                        </div>
                        <div className="flex space-x-2">
                          {replyingTo && (
                            <TouchOptimized>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setNewComment('');
                                }}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </TouchOptimized>
                          )}
                          <TouchOptimized>
                            <button
                              onClick={handleAddComment}
                              disabled={!newComment.trim()}
                              className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-sage-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Send size={16} />
                              <span>{replyingTo ? 'Reply' : 'Comment'}</span>
                            </button>
                          </TouchOptimized>
                        </div>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map(comment => (
                        <div key={comment.id} className="space-y-3">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                                {comment.author.avatar ? (
                                  <img 
                                    src={comment.author.avatar} 
                                    alt={comment.author.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <User size={16} className="text-sage-600" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-semibold text-gray-900 text-sm">{comment.author.name}</p>
                                  <p className="text-xs text-gray-500">{formatDate(comment.date)}</p>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <TouchOptimized>
                                    <button className={`flex items-center space-x-1 text-xs transition-colors ${
                                      comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                                    }`}>
                                      <Heart size={12} className={comment.isLiked ? 'fill-current' : ''} />
                                      <span>{comment.likes}</span>
                                    </button>
                                  </TouchOptimized>
                                  <TouchOptimized>
                                    <button 
                                      onClick={() => setReplyingTo(comment.id)}
                                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                      <Reply size={12} />
                                      <span>Reply</span>
                                    </button>
                                  </TouchOptimized>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-8 space-y-2">
                              {comment.replies.map(reply => (
                                <div key={reply.id} className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <User size={12} className="text-sage-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <p className="font-medium text-gray-900 text-xs">{reply.author.name}</p>
                                        <p className="text-xs text-gray-500">{formatDate(reply.date)}</p>
                                      </div>
                                      <p className="text-gray-700 text-xs">{reply.content}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'tags' && (
                  <div className="space-y-6">
                    {/* Current Tags */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Current Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {memory.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {tag}
                            {memory.isEditable && (
                              <TouchOptimized>
                                <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-2 text-sage-500 hover:text-sage-700 transition-colors"
                                >
                                  <X size={14} />
                                </button>
                              </TouchOptimized>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Add New Tag */}
                    {memory.isEditable && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Add New Tag</h4>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                            placeholder="Enter tag name"
                          />
                          <TouchOptimized>
                            <button
                              onClick={handleAddTag}
                              className="bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </TouchOptimized>
                        </div>
                      </div>
                    )}

                    {/* AI Insights */}
                    {memory.aiInsights && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center space-x-2 mb-4">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-purple-700">AI-Generated Insights</h4>
                        </div>

                        <div className="space-y-4">
                          {memory.aiInsights.faces.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">People Detected</h5>
                              <div className="flex flex-wrap gap-2">
                                {memory.aiInsights.faces.map((face, index) => (
                                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                    {face}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {memory.aiInsights.objects.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Objects & Scenes</h5>
                              <div className="flex flex-wrap gap-2">
                                {memory.aiInsights.objects.map((object, index) => (
                                  <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                    {object}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {memory.aiInsights.events.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Event Type</h5>
                              <div className="flex flex-wrap gap-2">
                                {memory.aiInsights.events.map((event, index) => (
                                  <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                    {event}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {memory.aiInsights.suggestedTags && memory.aiInsights.suggestedTags.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Suggested Tags</h5>
                              <div className="flex flex-wrap gap-2">
                                {memory.aiInsights.suggestedTags.map((tag, index) => (
                                  <TouchOptimized key={index}>
                                    <button
                                      onClick={() => {
                                        if (!memory.tags.includes(tag)) {
                                          onUpdate({
                                            ...memory,
                                            tags: [...memory.tags, tag]
                                          });
                                        }
                                      }}
                                      disabled={memory.tags.includes(tag)}
                                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                        memory.tags.includes(tag)
                                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                      }`}
                                    >
                                      + {tag}
                                    </button>
                                  </TouchOptimized>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <TouchOptimized>
                      <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 transition-colors ${
                          memory.interactions.isLiked
                            ? 'text-red-600'
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        <ThumbsUp size={20} className={memory.interactions.isLiked ? 'fill-current' : ''} />
                        <span className="font-medium">{memory.interactions.likes}</span>
                      </button>
                    </TouchOptimized>

                    <TouchOptimized>
                      <button
                        onClick={() => setActiveTab('comments')}
                        className="flex items-center space-x-2 text-gray-600 hover:text-sage-600 transition-colors"
                      >
                        <MessageCircle size={20} />
                        <span className="font-medium">{memory.interactions.comments}</span>
                      </button>
                    </TouchOptimized>

                    <TouchOptimized>
                      <button
                        onClick={handleFavorite}
                        className={`transition-colors ${
                          memory.interactions.isFavorited
                            ? 'text-yellow-500'
                            : 'text-gray-600 hover:text-yellow-500'
                        }`}
                      >
                        <Star size={20} className={memory.interactions.isFavorited ? 'fill-current' : ''} />
                      </button>
                    </TouchOptimized>
                  </div>

                  <div className="flex items-center space-x-2">
                    <TouchOptimized>
                      <button
                        onClick={handleShare}
                        className="p-2 text-gray-600 hover:text-sage-600 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Share"
                      >
                        <Share2 size={20} />
                      </button>
                    </TouchOptimized>

                    <TouchOptimized>
                      <button
                        onClick={handleDownload}
                        className="p-2 text-gray-600 hover:text-sage-600 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Download"
                      >
                        <Download size={20} />
                      </button>
                    </TouchOptimized>

                    {memory.isEditable && (
                      <>
                        <TouchOptimized>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-gray-600 hover:text-sage-600 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Edit"
                          >
                            <Edit3 size={20} />
                          </button>
                        </TouchOptimized>

                        <TouchOptimized>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 size={20} />
                          </button>
                        </TouchOptimized>
                      </>
                    )}
                  </div>
                </div>

                {/* Keyboard Shortcuts Hint */}
                <div className="text-xs text-gray-500 text-center">
                  Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">F</kbd> for fullscreen, 
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded ml-1">←</kbd>/<kbd className="px-1 py-0.5 bg-gray-100 rounded">→</kbd> to navigate, 
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded ml-1">Esc</kbd> to close
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Memory</h3>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{memory.title}"? This will permanently remove the memory and all associated comments.
            </p>
            <div className="flex space-x-3">
              <TouchOptimized>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Memory
                </button>
              </TouchOptimized>
              <TouchOptimized>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}