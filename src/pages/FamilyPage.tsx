import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Heart, Shield, Settings, 
  AlertCircle, Loader2, Plus, X, Check, Crown
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FamilyCard } from '../components/family/FamilyCard';
import { FamilyMembersList } from '../components/family/FamilyMembersList';
import { FamilyCreateForm } from '../components/family/FamilyCreateForm';
import { FamilyJoinForm } from '../components/family/FamilyJoinForm';
import { FamilyInviteForm } from '../components/family/FamilyInviteForm';
import { FamilyEmptyState } from '../components/family/FamilyEmptyState';
import { FamilyActivityFeed } from '../components/family/FamilyActivityFeed';
import { TouchOptimized } from '../components/ui/TouchOptimized';

interface Family {
  id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  privacy_level: string;
  created_at: string;
  updated_at: string;
  members?: FamilyMember[];
  member_count?: number;
  userRole?: string;
}

interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    relationship: string | null;
  };
}

export function FamilyPage() {
  const { user } = useAuth();
  const { familyId } = useParams<{ familyId: string }>();
  const navigate = useNavigate();
  
  const [families, setFamilies] = useState<Family[]>([]);
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showRemoveMemberConfirm, setShowRemoveMemberConfirm] = useState<string | null>(null);
  const [showPromoteMemberConfirm, setShowPromoteMemberConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Load families on initial render
  useEffect(() => {
    if (user) {
      loadFamilies();
    }
  }, [user]);
  
  // Load specific family if familyId is provided
  useEffect(() => {
    if (familyId && user) {
      loadFamilyDetails(familyId);
    } else {
      setCurrentFamily(null);
      setFamilyMembers([]);
    }
  }, [familyId, user]);
  
  const loadFamilies = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Mock data instead of Supabase query
      const mockFamilies: Family[] = [
        {
          id: 'family1',
          name: 'The Johnson Family',
          description: 'Our wonderful family with all our memories',
          created_by: user.id,
          privacy_level: 'family-only',
          created_at: '2024-01-15T12:00:00Z',
          updated_at: '2024-01-15T12:00:00Z',
          userRole: 'admin',
          member_count: 5
        },
        {
          id: 'family2',
          name: 'Extended Family',
          description: 'Cousins, aunts, uncles and more',
          created_by: 'other-user',
          privacy_level: 'extended',
          created_at: '2024-02-20T15:30:00Z',
          updated_at: '2024-02-20T15:30:00Z',
          userRole: 'member',
          member_count: 12
        }
      ];
      
      setFamilies(mockFamilies);
      
      // If there's a familyId in the URL but it wasn't loaded, navigate to the main family page
      if (familyId && !mockFamilies.some(f => f.id === familyId)) {
        navigate('/family');
      }
      
    } catch (err) {
      console.error('Unexpected error loading families:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const loadFamilyDetails = async (id: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Mock data instead of Supabase query
      const mockFamily: Family = {
        id,
        name: 'The Johnson Family',
        description: 'Our wonderful family with all our memories',
        created_by: user.id,
        privacy_level: 'family-only',
        created_at: '2024-01-15T12:00:00Z',
        updated_at: '2024-01-15T12:00:00Z'
      };
      
      const mockMembers: FamilyMember[] = [
        {
          id: 'member1',
          family_id: id,
          user_id: user.id,
          role: 'admin',
          joined_at: '2024-01-15T12:00:00Z',
          profile: {
            id: user.id,
            full_name: user.user_metadata?.full_name || 'Current User',
            avatar_url: null,
            relationship: 'Parent'
          }
        },
        {
          id: 'member2',
          family_id: id,
          user_id: 'user2',
          role: 'member',
          joined_at: '2024-01-16T10:30:00Z',
          profile: {
            id: 'user2',
            full_name: 'Sarah Johnson',
            avatar_url: null,
            relationship: 'Daughter'
          }
        },
        {
          id: 'member3',
          family_id: id,
          user_id: 'user3',
          role: 'member',
          joined_at: '2024-01-17T14:45:00Z',
          profile: {
            id: 'user3',
            full_name: 'Grandma Mary',
            avatar_url: null,
            relationship: 'Grandmother'
          }
        }
      ];
      
      // Check if the current user is an admin
      const userMember = mockMembers.find(member => member.user_id === user.id);
      setIsAdmin(userMember?.role === 'admin');
      
      setCurrentFamily(mockFamily);
      setFamilyMembers(mockMembers);
      
    } catch (err) {
      console.error('Unexpected error loading family details:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateFamily = async (data: { name: string; description: string; privacyLevel: string }) => {
    if (!user) return;
    
    try {
      // Create a mock family
      const newFamily: Family = {
        id: `family-${Date.now()}`,
        name: data.name,
        description: data.description || null,
        created_by: user.id,
        privacy_level: data.privacyLevel,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        userRole: 'admin',
        member_count: 1
      };
      
      // Add to families list
      setFamilies(prev => [...prev, newFamily]);
      
      // Close form and navigate to the new family
      setShowCreateForm(false);
      navigate(`/family/${newFamily.id}`);
      
    } catch (err: any) {
      console.error('Error in handleCreateFamily:', err);
      throw new Error(err.message || 'Failed to create family');
    }
  };
  
  const handleJoinFamily = async (inviteCode: string) => {
    if (!user) return;
    
    try {
      // Create a mock family
      const newFamily: Family = {
        id: `family-${Date.now()}`,
        name: 'Joined Family',
        description: 'A family you joined with an invite code',
        created_by: 'other-user',
        privacy_level: 'family-only',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        userRole: 'member',
        member_count: 5
      };
      
      // Add to families list
      setFamilies(prev => [...prev, newFamily]);
      
      // Close form and navigate to the new family
      setShowJoinForm(false);
      navigate(`/family/${newFamily.id}`);
      
    } catch (err: any) {
      console.error('Error in handleJoinFamily:', err);
      throw new Error(err.message || 'Failed to join family');
    }
  };
  
  const handleInviteMember = async (data: { email: string; name: string; message: string }) => {
    if (!user || !currentFamily) return '';
    
    try {
      // Generate a mock invite code
      const inviteCode = `FAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      return inviteCode;
      
    } catch (err: any) {
      console.error('Error in handleInviteMember:', err);
      throw new Error(err.message || 'Failed to create invitation');
    }
  };
  
  const handleDeleteFamily = async (id: string) => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      // Remove family from list
      setFamilies(prev => prev.filter(family => family.id !== id));
      
      // Navigate to the main family page
      navigate('/family');
      
    } catch (err: any) {
      console.error('Error in handleDeleteFamily:', err);
      setError(err.message || 'Failed to delete family');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(null);
    }
  };
  
  const handleRemoveMember = async (memberId: string) => {
    if (!user || !currentFamily) return;
    
    setIsUpdating(true);
    
    try {
      // Get the member details first
      const member = familyMembers.find(m => m.id === memberId);
      
      if (!member) {
        throw new Error('Member not found');
      }
      
      // Remove member from list
      setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
      
      // If the current user is removing themselves, navigate back to the main family page
      if (member.user_id === user.id) {
        navigate('/family');
      }
      
    } catch (err: any) {
      console.error('Error in handleRemoveMember:', err);
      setError(err.message || 'Failed to remove family member');
    } finally {
      setIsUpdating(false);
      setShowRemoveMemberConfirm(null);
    }
  };
  
  const handlePromoteMember = async (memberId: string) => {
    if (!user || !currentFamily) return;
    
    setIsUpdating(true);
    
    try {
      // Update member role
      setFamilyMembers(prev => prev.map(member => 
        member.id === memberId
          ? { ...member, role: 'admin' as const }
          : member
      ));
      
    } catch (err: any) {
      console.error('Error in handlePromoteMember:', err);
      setError(err.message || 'Failed to promote family member');
    } finally {
      setIsUpdating(false);
      setShowPromoteMemberConfirm(null);
    }
  };
  
  const handleMessageMember = (memberId: string) => {
    // In a real app, this would open a messaging interface
    console.log('Message member:', memberId);
  };
  
  // Render the family list view
  const renderFamilyList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-sage-600 animate-spin" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Error</h3>
              <p>{error}</p>
              <TouchOptimized>
                <button
                  onClick={loadFamilies}
                  className="mt-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Try Again
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      );
    }
    
    if (families.length === 0) {
      return (
        <FamilyEmptyState
          onCreateFamily={() => setShowCreateForm(true)}
          onJoinFamily={() => setShowJoinForm(true)}
        />
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Families</h2>
          <div className="flex space-x-2">
            <TouchOptimized>
              <button
                onClick={() => setShowJoinForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-sage-700 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
              >
                <Users size={18} />
                <span>Join Family</span>
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors"
              >
                <UserPlus size={18} />
                <span>Create Family</span>
              </button>
            </TouchOptimized>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {families.map(family => (
            <FamilyCard
              key={family.id}
              id={family.id}
              name={family.name}
              description={family.description || undefined}
              memberCount={family.member_count || 0}
              createdAt={family.created_at}
              privacyLevel={family.privacy_level}
              isAdmin={family.userRole === 'admin'}
              onDelete={family.userRole === 'admin' ? (id) => setShowDeleteConfirm(id) : undefined}
              onSettings={family.userRole === 'admin' ? (id) => navigate(`/family/${id}/settings`) : undefined}
            />
          ))}
        </div>
      </div>
    );
  };
  
  // Render the family detail view
  const renderFamilyDetail = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-sage-600 animate-spin" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Error</h3>
              <p>{error}</p>
              <TouchOptimized>
                <button
                  onClick={() => loadFamilyDetails(familyId!)}
                  className="mt-2 text-red-600 hover:text-red-700 font-medium"
                >
                  Try Again
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      );
    }
    
    if (!currentFamily) {
      return (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Family Not Found</h2>
          <p className="text-gray-600 mb-6">
            The family you're looking for doesn't exist or you don't have access to it.
          </p>
          <TouchOptimized>
            <button
              onClick={() => navigate('/family')}
              className="bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 transition-colors"
            >
              Back to Families
            </button>
          </TouchOptimized>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Family Header */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-sage-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentFamily.name}</h2>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{familyMembers.length} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield size={16} />
                    <span>
                      {currentFamily.privacy_level === 'private' ? 'Private' : 
                       currentFamily.privacy_level === 'family-only' ? 'Family Only' : 
                       'Extended Family'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex space-x-2">
                <TouchOptimized>
                  <button
                    onClick={() => setShowInviteForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-sage-700 text-white rounded-lg hover:bg-sage-800 transition-colors"
                  >
                    <UserPlus size={18} />
                    <span>Invite Member</span>
                  </button>
                </TouchOptimized>
                
                <TouchOptimized>
                  <button
                    onClick={() => navigate(`/family/${currentFamily.id}/settings`)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings size={20} />
                  </button>
                </TouchOptimized>
              </div>
            )}
          </div>
          
          {currentFamily.description && (
            <p className="text-gray-600 mb-4">{currentFamily.description}</p>
          )}
        </div>
        
        {/* Family Members List */}
        <FamilyMembersList
          members={familyMembers}
          currentUserId={user?.id || ''}
          isAdmin={isAdmin}
          onPromote={(memberId) => setShowPromoteMemberConfirm(memberId)}
          onRemove={(memberId) => setShowRemoveMemberConfirm(memberId)}
          onMessage={handleMessageMember}
        />
        
        {/* Family Activity Feed */}
        <FamilyActivityFeed
          familyId={currentFamily.id}
          limit={5}
        />
      </div>
    );
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Family Members</h1>
            <p className="text-lg text-gray-600">
              Manage family access
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="mb-8">
        {familyId ? renderFamilyDetail() : renderFamilyList()}
      </div>
      
      {/* Create Family Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <FamilyCreateForm
            onSubmit={handleCreateFamily}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}
      
      {/* Join Family Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <FamilyJoinForm
            onJoin={handleJoinFamily}
            onClose={() => setShowJoinForm(false)}
          />
        </div>
      )}
      
      {/* Invite Member Modal */}
      {showInviteForm && currentFamily && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <FamilyInviteForm
            familyId={currentFamily.id}
            familyName={currentFamily.name}
            onInvite={handleInviteMember}
            onClose={() => setShowInviteForm(false)}
          />
        </div>
      )}
      
      {/* Delete Family Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Family?</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this family? This will remove all family members and cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={() => handleDeleteFamily(showDeleteConfirm)}
                  disabled={isDeleting}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <X size={18} />
                      <span>Delete Family</span>
                    </>
                  )}
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
      
      {/* Remove Member Confirmation */}
      {showRemoveMemberConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {showRemoveMemberConfirm === familyMembers.find(m => m.user_id === user?.id)?.id
                  ? 'Leave Family?'
                  : 'Remove Member?'}
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              {showRemoveMemberConfirm === familyMembers.find(m => m.user_id === user?.id)?.id
                ? 'Are you sure you want to leave this family? You will no longer have access to family memories.'
                : 'Are you sure you want to remove this member from the family? They will no longer have access to family memories.'}
            </p>
            
            <div className="flex justify-end space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowRemoveMemberConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={() => handleRemoveMember(showRemoveMemberConfirm)}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <X size={18} />
                      <span>
                        {showRemoveMemberConfirm === familyMembers.find(m => m.user_id === user?.id)?.id
                          ? 'Leave Family'
                          : 'Remove Member'}
                      </span>
                    </>
                  )}
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
      
      {/* Promote Member Confirmation */}
      {showPromoteMemberConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Promote to Admin?</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to promote this member to admin? They will have full control over the family, including the ability to remove other members.
            </p>
            
            <div className="flex justify-end space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowPromoteMemberConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={() => handlePromoteMember(showPromoteMemberConfirm)}
                  disabled={isUpdating}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Crown size={18} />
                      <span>Promote to Admin</span>
                    </>
                  )}
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}