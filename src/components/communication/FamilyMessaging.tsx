import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Send, Smile, Image, Paperclip, MoreHorizontal, 
  Search, Phone, Video, Info, ArrowLeft, Check, X,
  Loader2, Clock, Pin, Download, Forward, Reply, Edit2,
  Trash2, Copy, Mic, Play, Pause, FileText, MessageCircle,
  Users
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { useAuth } from '../../hooks/useAuth';

interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  relationship?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isPinned?: boolean;
  replyTo?: {
    id: string;
    content: string;
    senderId: string;
  };
  attachments?: {
    id: string;
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    thumbnail?: string;
    name: string;
    size: number;
  }[];
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  unreadCount: number;
  isPinned: boolean;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
}

interface FamilyMessagingProps {
  familyId: string;
  initialConversationId?: string;
  onClose?: () => void;
  className?: string;
}

export function FamilyMessaging({
  familyId,
  initialConversationId,
  onClose,
  className = ''
}: FamilyMessagingProps) {
  const { isMobile } = useDeviceDetection();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConversationList, setShowConversationList] = useState(!initialConversationId || !isMobile);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch conversations and family members
  useEffect(() => {
    fetchConversationsAndMembers();
  }, [familyId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set initial conversation if provided
  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === initialConversationId);
      if (conversation) {
        setSelectedConversation(conversation);
        setShowConversationList(!isMobile);
        fetchMessages(conversation.id);
      }
    }
  }, [initialConversationId, conversations, isMobile]);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0);
    }
    
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const fetchConversationsAndMembers = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock family members data
    const mockFamilyMembers: FamilyMember[] = [
      {
        id: 'user1',
        name: 'Mom',
        relationship: 'Mother',
        avatar: undefined,
        isOnline: true
      },
      {
        id: 'user2',
        name: 'Dad',
        relationship: 'Father',
        avatar: undefined,
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      },
      {
        id: 'user3',
        name: 'Grandma',
        relationship: 'Grandmother',
        avatar: undefined,
        isOnline: true
      },
      {
        id: 'user4',
        name: 'Uncle John',
        relationship: 'Uncle',
        avatar: undefined,
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
      },
      {
        id: 'user5',
        name: 'Sarah',
        relationship: 'Daughter',
        avatar: undefined,
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
      }
    ];
    
    // Mock conversations data
    const mockConversations: Conversation[] = [
      {
        id: 'conv1',
        participants: ['user1', 'user2', 'user3', 'user4', 'user5'],
        lastMessage: {
          content: 'Let\'s plan the family reunion next month!',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          senderId: 'user1'
        },
        unreadCount: 3,
        isPinned: true,
        isGroup: true,
        groupName: 'Family Chat'
      },
      {
        id: 'conv2',
        participants: ['user1'],
        lastMessage: {
          content: 'Did you see the photos I uploaded from Christmas?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          senderId: 'user1'
        },
        unreadCount: 1,
        isPinned: false
      },
      {
        id: 'conv3',
        participants: ['user3'],
        lastMessage: {
          content: 'I found some old family recipes I want to share',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          senderId: 'user3'
        },
        unreadCount: 0,
        isPinned: true
      },
      {
        id: 'conv4',
        participants: ['user2', 'user5'],
        lastMessage: {
          content: 'Planning a surprise for Mom\'s birthday',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          senderId: 'user5'
        },
        unreadCount: 0,
        isPinned: false,
        isGroup: true,
        groupName: 'Birthday Planning'
      }
    ];
    
    setFamilyMembers(mockFamilyMembers);
    setConversations(mockConversations);
    
    // If there's an initial conversation ID, select it
    if (initialConversationId) {
      const conversation = mockConversations.find(c => c.id === initialConversationId);
      if (conversation) {
        setSelectedConversation(conversation);
        setShowConversationList(!isMobile);
        fetchMessages(conversation.id);
      }
    }
    
    setLoading(false);
  };

  const fetchMessages = async (conversationId: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock messages data
    const mockMessages: Message[] = [
      {
        id: 'msg1',
        senderId: 'user1',
        content: 'Hi everyone! I just uploaded some new photos from our last family gathering.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'user2',
        content: 'Those are great! I especially love the one with all the grandkids together.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 15).toISOString(), // 2 days ago + 15 minutes
        isRead: true
      },
      {
        id: 'msg3',
        senderId: 'user3',
        content: 'It reminds me of when we used to have those big summer picnics at the lake house.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30).toISOString(), // 2 days ago + 30 minutes
        isRead: true
      },
      {
        id: 'msg4',
        senderId: 'user1',
        content: 'We should plan another gathering like that soon!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
        isRead: true,
        attachments: [
          {
            id: 'att1',
            type: 'image',
            url: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
            thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
            name: 'family_gathering.jpg',
            size: 1024000
          }
        ]
      },
      {
        id: 'msg5',
        senderId: 'user4',
        content: 'Count me in! I can bring the grill and we can do a barbecue.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 45).toISOString(), // 1 day ago + 45 minutes
        isRead: true
      },
      {
        id: 'msg6',
        senderId: 'user5',
        content: 'I found some old family videos too. I\'ll upload them to the timeline.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        isRead: true,
        replyTo: {
          id: 'msg4',
          content: 'We should plan another gathering like that soon!',
          senderId: 'user1'
        }
      },
      {
        id: 'msg7',
        senderId: 'user2',
        content: 'That would be amazing! I miss watching those old home movies.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        isRead: true
      },
      {
        id: 'msg8',
        senderId: 'user1',
        content: 'Let\'s plan the family reunion next month! What dates work for everyone?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        isRead: false,
        isPinned: true
      }
    ];
    
    setMessages(mockMessages);
    setLoading(false);
    
    // Mark conversation as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    
    if (isMobile) {
      setShowConversationList(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !isRecording) return;
    if (!selectedConversation) return;
    
    setSendingMessage(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create new message
      const newMsg: Message = {
        id: `msg${Date.now()}`,
        senderId: user?.id || 'currentUser',
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isRead: false
      };
      
      // Add reply info if replying
      if (replyingTo) {
        newMsg.replyTo = {
          id: replyingTo.id,
          content: replyingTo.content,
          senderId: replyingTo.senderId
        };
      }
      
      // Add to messages
      setMessages(prev => [...prev, newMsg]);
      
      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: {
                  content: newMessage.trim(),
                  timestamp: new Date().toISOString(),
                  senderId: user?.id || 'currentUser'
                }
              }
            : conv
        )
      );
      
      // Clear input and reply state
      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file and then send a message with the attachment
      console.log('File selected:', file);
      
      // For demo purposes, we'll just add a message with a mock attachment
      if (file.type.startsWith('image/')) {
        // Create a temporary URL for the image
        const imageUrl = URL.createObjectURL(file);
        
        // Add a message with the image attachment
        const newMsg: Message = {
          id: `msg${Date.now()}`,
          senderId: user?.id || 'currentUser',
          content: '',
          timestamp: new Date().toISOString(),
          isRead: false,
          attachments: [
            {
              id: `att${Date.now()}`,
              type: 'image',
              url: imageUrl,
              thumbnail: imageUrl,
              name: file.name,
              size: file.size
            }
          ]
        };
        
        setMessages(prev => [...prev, newMsg]);
        
        // Update conversation last message
        if (selectedConversation) {
          setConversations(prev => 
            prev.map(conv => 
              conv.id === selectedConversation.id
                ? {
                    ...conv,
                    lastMessage: {
                      content: '[Image]',
                      timestamp: new Date().toISOString(),
                      senderId: user?.id || 'currentUser'
                    }
                  }
                : conv
            )
          );
        }
      }
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // In a real app, you would start recording audio here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // In a real app, you would stop recording and process the audio file
    
    // For demo purposes, we'll just add a message with a mock audio attachment
    if (recordingTime > 1) {
      const newMsg: Message = {
        id: `msg${Date.now()}`,
        senderId: user?.id || 'currentUser',
        content: '',
        timestamp: new Date().toISOString(),
        isRead: false,
        attachments: [
          {
            id: `att${Date.now()}`,
            type: 'audio',
            url: '#',
            name: `Voice message (${formatRecordingTime(recordingTime)})`,
            size: recordingTime * 16000 // Rough estimate of audio size
          }
        ]
      };
      
      setMessages(prev => [...prev, newMsg]);
      
      // Update conversation last message
      if (selectedConversation) {
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  lastMessage: {
                    content: '[Voice Message]',
                    timestamp: new Date().toISOString(),
                    senderId: user?.id || 'currentUser'
                  }
                }
              : conv
          )
        );
      }
    }
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
  };

  const handleTogglePlayAudio = (messageId: string) => {
    if (isPlaying === messageId) {
      setIsPlaying(null);
    } else {
      setIsPlaying(messageId);
    }
  };

  const handlePinMessage = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId
          ? { ...msg, isPinned: !msg.isPinned }
          : msg
      )
    );
    setShowMessageActions(null);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setShowMessageActions(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setShowMessageActions(null);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
             ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  const formatLastSeen = (timestamp?: string) => {
    if (!timestamp) return 'Offline';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 24 * 60) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / (60 * 24))}d ago`;
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup && conversation.groupName) {
      return conversation.groupName;
    }
    
    // For one-on-one conversations, show the other person's name
    const otherParticipantId = conversation.participants.find(id => id !== user?.id);
    if (otherParticipantId) {
      const otherParticipant = familyMembers.find(member => member.id === otherParticipantId);
      return otherParticipant?.name || 'Unknown';
    }
    
    return 'Conversation';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.isGroup && conversation.groupAvatar) {
      return conversation.groupAvatar;
    }
    
    // For one-on-one conversations, show the other person's avatar
    const otherParticipantId = conversation.participants.find(id => id !== user?.id);
    if (otherParticipantId) {
      const otherParticipant = familyMembers.find(member => member.id === otherParticipantId);
      return otherParticipant?.avatar;
    }
    
    return undefined;
  };

  const isParticipantOnline = (conversation: Conversation) => {
    if (conversation.isGroup) {
      // For groups, check if any participant is online
      return conversation.participants.some(id => {
        const member = familyMembers.find(m => m.id === id);
        return member?.isOnline;
      });
    }
    
    // For one-on-one conversations, check if the other person is online
    const otherParticipantId = conversation.participants.find(id => id !== user?.id);
    if (otherParticipantId) {
      const otherParticipant = familyMembers.find(member => member.id === otherParticipantId);
      return otherParticipant?.isOnline;
    }
    
    return false;
  };

  const getParticipantLastSeen = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return '';
    }
    
    // For one-on-one conversations, get the other person's last seen
    const otherParticipantId = conversation.participants.find(id => id !== user?.id);
    if (otherParticipantId) {
      const otherParticipant = familyMembers.find(member => member.id === otherParticipantId);
      return otherParticipant?.lastSeen ? formatLastSeen(otherParticipant.lastSeen) : 'Offline';
    }
    
    return '';
  };

  const getSenderName = (senderId: string) => {
    if (senderId === user?.id) {
      return 'You';
    }
    
    const sender = familyMembers.find(member => member.id === senderId);
    return sender?.name || 'Unknown';
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    const conversationName = getConversationName(conversation);
    return conversationName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col ${className}`}>
      <div className="flex h-full">
        {/* Conversation List */}
        {showConversationList && (
          <div className={`${isMobile ? 'w-full' : 'w-80'} border-r border-gray-200 flex flex-col`}>
            {/* Search Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                />
              </div>
            </div>
            
            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                // Loading state
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="p-4 border-b border-gray-100 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredConversations.length === 0 ? (
                // Empty state
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery 
                      ? `No results for "${searchQuery}"`
                      : "Start a new conversation with your family members."}
                  </p>
                  {searchQuery && (
                    <TouchOptimized>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-sage-600 hover:text-sage-700 font-medium"
                      >
                        Clear search
                      </button>
                    </TouchOptimized>
                  )}
                </div>
              ) : (
                // Conversation list
                filteredConversations.map(conversation => (
                  <TouchOptimized key={conversation.id}>
                    <div
                      onClick={() => handleSelectConversation(conversation)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-sage-50' : ''
                      } ${conversation.isPinned ? 'border-l-4 border-l-sage-500' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            {getConversationAvatar(conversation) ? (
                              <img 
                                src={getConversationAvatar(conversation)} 
                                alt={getConversationName(conversation)}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : conversation.isGroup ? (
                              <Users className="w-6 h-6 text-gray-500" />
                            ) : (
                              <User className="w-6 h-6 text-gray-500" />
                            )}
                          </div>
                          
                          {/* Online indicator */}
                          {isParticipantOnline(conversation) && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        {/* Conversation details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {getConversationName(conversation)}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessage?.timestamp 
                                ? formatTimestamp(conversation.lastMessage.timestamp).split(',')[0]
                                : ''}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-600 truncate max-w-[180px]">
                              {conversation.lastMessage ? (
                                <>
                                  {conversation.lastMessage.senderId === user?.id ? 'You: ' : ''}
                                  {conversation.lastMessage.content}
                                </>
                              ) : (
                                <span className="text-gray-400 italic">No messages yet</span>
                              )}
                            </p>
                            
                            {conversation.unreadCount > 0 && (
                              <span className="bg-sage-600 text-white text-xs px-2 py-1 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TouchOptimized>
                ))
              )}
            </div>
            
            {/* New Conversation Button */}
            <div className="p-4 border-t border-gray-200">
              <TouchOptimized>
                <button
                  onClick={() => {
                    // In a real app, this would open a new conversation dialog
                    console.log('New conversation');
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-sage-600 text-white px-4 py-3 rounded-lg hover:bg-sage-700 transition-colors"
                >
                  <MessageCircle size={18} />
                  <span>New Conversation</span>
                </button>
              </TouchOptimized>
            </div>
          </div>
        )}
        
        {/* Conversation/Chat View */}
        {selectedConversation ? (
          <div className={`${showConversationList && !isMobile ? 'flex-1' : 'w-full'} flex flex-col`}>
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isMobile && (
                  <TouchOptimized>
                    <button
                      onClick={() => setShowConversationList(true)}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  </TouchOptimized>
                )}
                
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getConversationAvatar(selectedConversation) ? (
                      <img 
                        src={getConversationAvatar(selectedConversation)} 
                        alt={getConversationName(selectedConversation)}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : selectedConversation.isGroup ? (
                      <Users className="w-5 h-5 text-gray-500" />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  
                  {/* Online indicator */}
                  {isParticipantOnline(selectedConversation) && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getConversationName(selectedConversation)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.isGroup 
                      ? `${selectedConversation.participants.length} members`
                      : isParticipantOnline(selectedConversation)
                      ? 'Online'
                      : getParticipantLastSeen(selectedConversation)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <TouchOptimized>
                  <button
                    onClick={() => {
                      // In a real app, this would initiate a voice call
                      console.log('Voice call');
                    }}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Phone size={20} />
                  </button>
                </TouchOptimized>
                
                <TouchOptimized>
                  <button
                    onClick={() => {
                      // In a real app, this would initiate a video call
                      console.log('Video call');
                    }}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Video size={20} />
                  </button>
                </TouchOptimized>
                
                <TouchOptimized>
                  <button
                    onClick={() => {
                      // In a real app, this would open conversation info
                      console.log('Conversation info');
                    }}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Info size={20} />
                  </button>
                </TouchOptimized>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {loading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <div 
                    key={index} 
                    className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-4`}
                  >
                    <div className={`max-w-[80%] animate-pulse ${
                      index % 2 === 0 ? 'bg-white' : 'bg-sage-100'
                    } rounded-xl p-3 shadow-sm`}>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-48 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                ))
              ) : messages.length === 0 ? (
                // Empty state
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start a conversation with {getConversationName(selectedConversation)}
                    </p>
                  </div>
                </div>
              ) : (
                // Messages
                <>
                  {messages.map((message, index) => {
                    const isCurrentUser = message.senderId === user?.id;
                    const showSenderInfo = index === 0 || messages[index - 1].senderId !== message.senderId;
                    const sender = familyMembers.find(member => member.id === message.senderId);
                    
                    // Check if this is the first message of a new day
                    const showDateSeparator = index === 0 || 
                      new Date(message.timestamp).toDateString() !== 
                      new Date(messages[index - 1].timestamp).toDateString();
                    
                    return (
                      <React.Fragment key={message.id}>
                        {/* Date separator */}
                        {showDateSeparator && (
                          <div className="flex justify-center my-4">
                            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                              {new Date(message.timestamp).toLocaleDateString([], { 
                                weekday: 'long', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </div>
                        )}
                        
                        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 relative`}>
                          {/* Message bubble */}
                          <TouchOptimized
                            onLongPress={() => setShowMessageActions(message.id)}
                          >
                            <div className={`max-w-[80%] relative ${
                              isCurrentUser 
                                ? 'bg-sage-100 text-gray-800' 
                                : 'bg-white text-gray-800'
                            } rounded-xl p-3 shadow-sm ${message.isPinned ? 'border-l-4 border-l-sage-500' : ''}`}>
                              {/* Sender info */}
                              {showSenderInfo && !isCurrentUser && (
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-xs text-gray-900">
                                    {sender?.name || 'Unknown'}
                                  </span>
                                </div>
                              )}
                              
                              {/* Reply reference */}
                              {message.replyTo && (
                                <div className="bg-gray-100 rounded-lg p-2 mb-2 text-xs text-gray-600 border-l-2 border-l-gray-400">
                                  <p className="font-medium mb-1">
                                    Replying to {getSenderName(message.replyTo.senderId)}
                                  </p>
                                  <p className="truncate">{message.replyTo.content}</p>
                                </div>
                              )}
                              
                              {/* Message content */}
                              {message.content && (
                                <p className="whitespace-pre-wrap break-words">
                                  {message.content}
                                </p>
                              )}
                              
                              {/* Attachments */}
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map(attachment => (
                                    <div key={attachment.id} className="rounded-lg overflow-hidden">
                                      {attachment.type === 'image' && (
                                        <img 
                                          src={attachment.url} 
                                          alt={attachment.name}
                                          className="max-w-full rounded-lg"
                                        />
                                      )}
                                      
                                      {attachment.type === 'video' && (
                                        <div className="relative">
                                          {attachment.thumbnail ? (
                                            <img 
                                              src={attachment.thumbnail} 
                                              alt={attachment.name}
                                              className="max-w-full rounded-lg"
                                            />
                                          ) : (
                                            <div className="bg-gray-200 w-full h-32 rounded-lg flex items-center justify-center">
                                              <Video className="w-8 h-8 text-gray-500" />
                                            </div>
                                          )}
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-black bg-opacity-50 rounded-full p-3">
                                              <Play className="w-6 h-6 text-white" />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {attachment.type === 'audio' && (
                                        <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-3">
                                          <TouchOptimized>
                                            <button
                                              onClick={() => handleTogglePlayAudio(message.id)}
                                              className="bg-sage-600 text-white p-2 rounded-full"
                                            >
                                              {isPlaying === message.id ? (
                                                <Pause size={16} />
                                              ) : (
                                                <Play size={16} />
                                              )}
                                            </button>
                                          </TouchOptimized>
                                          
                                          <div className="flex-1">
                                            <div className="w-full bg-gray-300 rounded-full h-1.5">
                                              <div 
                                                className="bg-sage-600 h-1.5 rounded-full" 
                                                style={{ width: isPlaying === message.id ? '60%' : '0%' }}
                                              ></div>
                                            </div>
                                          </div>
                                          
                                          <span className="text-xs text-gray-500">
                                            {attachment.name}
                                          </span>
                                        </div>
                                      )}
                                      
                                      {attachment.type === 'document' && (
                                        <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-3">
                                          <FileText className="w-6 h-6 text-gray-600" />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                              {attachment.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {(attachment.size / 1024).toFixed(1)} KB
                                            </p>
                                          </div>
                                          <TouchOptimized>
                                            <button className="text-sage-600 hover:text-sage-700">
                                              <Download size={16} />
                                            </button>
                                          </TouchOptimized>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {/* Timestamp */}
                              <div className={`text-xs text-gray-500 mt-1 flex items-center ${
                                isCurrentUser ? 'justify-end' : 'justify-start'
                              }`}>
                                <Clock size={10} className="mr-1" />
                                {formatTimestamp(message.timestamp).split(',')[1] || formatTimestamp(message.timestamp)}
                                {isCurrentUser && (
                                  <Check 
                                    size={12} 
                                    className={`ml-1 ${message.isRead ? 'text-blue-500' : 'text-gray-400'}`} 
                                  />
                                )}
                              </div>
                            </div>
                          </TouchOptimized>
                          
                          {/* Message actions */}
                          {showMessageActions === message.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShowMessageActions(null)}
                              />
                              <div className={`absolute z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-2 ${
                                isCurrentUser ? 'right-0 mr-2' : 'left-0 ml-2'
                              } ${index < messages.length / 2 ? 'top-0' : 'bottom-0'}`}>
                                <TouchOptimized>
                                  <button
                                    onClick={() => {
                                      setReplyingTo(message);
                                      setShowMessageActions(null);
                                      setTimeout(() => messageInputRef.current?.focus(), 0);
                                    }}
                                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Reply size={16} />
                                    <span>Reply</span>
                                  </button>
                                </TouchOptimized>
                                
                                <TouchOptimized>
                                  <button
                                    onClick={() => handlePinMessage(message.id)}
                                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Pin size={16} />
                                    <span>{message.isPinned ? 'Unpin' : 'Pin'}</span>
                                  </button>
                                </TouchOptimized>
                                
                                <TouchOptimized>
                                  <button
                                    onClick={() => handleCopyMessage(message.content)}
                                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Copy size={16} />
                                    <span>Copy</span>
                                  </button>
                                </TouchOptimized>
                                
                                <TouchOptimized>
                                  <button
                                    onClick={() => {
                                      // In a real app, this would open a forward dialog
                                      console.log('Forward message');
                                      setShowMessageActions(null);
                                    }}
                                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Forward size={16} />
                                    <span>Forward</span>
                                  </button>
                                </TouchOptimized>
                                
                                {isCurrentUser && (
                                  <>
                                    <TouchOptimized>
                                      <button
                                        onClick={() => {
                                          // In a real app, this would allow editing the message
                                          console.log('Edit message');
                                          setShowMessageActions(null);
                                        }}
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                      >
                                        <Edit2 size={16} />
                                        <span>Edit</span>
                                      </button>
                                    </TouchOptimized>
                                    
                                    <TouchOptimized>
                                      <button
                                        onClick={() => handleDeleteMessage(message.id)}
                                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                                      >
                                        <Trash2 size={16} />
                                        <span>Delete</span>
                                      </button>
                                    </TouchOptimized>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                  
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            {/* Reply indicator */}
            {replyingTo && (
              <div className="px-4 pt-2">
                <div className="bg-gray-100 rounded-t-lg p-3 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Replying to {getSenderName(replyingTo.senderId)}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {replyingTo.content}
                    </p>
                  </div>
                  <TouchOptimized>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </TouchOptimized>
                </div>
              </div>
            )}
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              {isRecording ? (
                // Recording UI
                <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium">Recording... {formatRecordingTime(recordingTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TouchOptimized>
                      <button
                        onClick={handleCancelRecording}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </TouchOptimized>
                    <TouchOptimized>
                      <button
                        onClick={handleStopRecording}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Check size={20} />
                      </button>
                    </TouchOptimized>
                  </div>
                </div>
              ) : (
                // Normal input UI
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={messageInputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 resize-none"
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                    
                    <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                      <TouchOptimized>
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-1 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                        >
                          <Smile size={20} />
                        </button>
                      </TouchOptimized>
                      
                      <div className="relative">
                        <TouchOptimized>
                          <button
                            onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                            className="p-1 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
                          >
                            <Paperclip size={20} />
                          </button>
                        </TouchOptimized>
                        
                        {/* Attachment options */}
                        {showAttachmentOptions && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowAttachmentOptions(false)}
                            />
                            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                              <TouchOptimized>
                                <button
                                  onClick={() => {
                                    handleFileUpload();
                                    setShowAttachmentOptions(false);
                                  }}
                                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Image size={16} />
                                  <span>Photo</span>
                                </button>
                              </TouchOptimized>
                              
                              <TouchOptimized>
                                <button
                                  onClick={() => {
                                    // In a real app, this would open a video selector
                                    console.log('Video');
                                    setShowAttachmentOptions(false);
                                  }}
                                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Video size={16} />
                                  <span>Video</span>
                                </button>
                              </TouchOptimized>
                              
                              <TouchOptimized>
                                <button
                                  onClick={() => {
                                    // In a real app, this would open a document selector
                                    console.log('Document');
                                    setShowAttachmentOptions(false);
                                  }}
                                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <FileText size={16} />
                                  <span>Document</span>
                                </button>
                              </TouchOptimized>
                            </div>
                          </>
                        )}
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                          className="hidden"
                          onChange={handleFileSelected}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {newMessage.trim() ? (
                    <TouchOptimized>
                      <button
                        onClick={handleSendMessage}
                        disabled={sendingMessage}
                        className="bg-sage-600 text-white p-3 rounded-full hover:bg-sage-700 disabled:opacity-50 transition-colors"
                      >
                        {sendingMessage ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Send size={20} />
                        )}
                      </button>
                    </TouchOptimized>
                  ) : (
                    <TouchOptimized
                      onTap={handleStartRecording}
                      onLongPress={handleStartRecording}
                    >
                      <button
                        className="bg-sage-600 text-white p-3 rounded-full hover:bg-sage-700 transition-colors"
                      >
                        <Mic size={20} />
                      </button>
                    </TouchOptimized>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // No conversation selected
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Family Messaging</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Select a conversation to start messaging with your family members.
                Share updates, coordinate events, or just stay connected.
              </p>
              {isMobile && (
                <TouchOptimized>
                  <button
                    onClick={() => setShowConversationList(true)}
                    className="bg-sage-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-sage-700 transition-colors"
                  >
                    View Conversations
                  </button>
                </TouchOptimized>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}