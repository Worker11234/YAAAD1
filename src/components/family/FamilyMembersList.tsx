import React, { useState } from 'react';
import { Search, Filter, Users, Crown } from 'lucide-react';
import { FamilyMemberCard } from './FamilyMemberCard';
import { TouchOptimized } from '../ui/TouchOptimized';

interface FamilyMember {
  id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: {
    full_name: string;
    avatar_url: string | null;
    relationship: string | null;
  };
}

interface FamilyMembersListProps {
  members: FamilyMember[];
  currentUserId: string;
  isAdmin: boolean;
  onPromote?: (memberId: string) => void;
  onRemove?: (memberId: string) => void;
  onMessage?: (memberId: string) => void;
  className?: string;
}

export function FamilyMembersList({
  members,
  currentUserId,
  isAdmin,
  onPromote,
  onRemove,
  onMessage,
  className = ''
}: FamilyMembersListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'member'>('all');

  const filteredMembers = members.filter(member => {
    // Apply search filter
    if (searchQuery) {
      const fullName = member.profile?.full_name || '';
      const relationship = member.profile?.relationship || '';
      
      if (!fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !relationship.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
    }
    
    // Apply role filter
    if (filterRole !== 'all' && member.role !== filterRole) {
      return false;
    }
    
    return true;
  });

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              placeholder="Search members..."
            />
          </div>
          
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'member')}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 appearance-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins Only</option>
              <option value="member">Members Only</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      </div>
      
      {filteredMembers.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          {searchQuery || filterRole !== 'all' ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Members Found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Members Yet</h3>
              <p className="text-gray-600">
                Invite family members to join your family circle
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map(member => (
            <FamilyMemberCard
              key={member.id}
              id={member.id}
              name={member.profile?.full_name || 'Unknown User'}
              relationship={member.profile?.relationship || undefined}
              avatarUrl={member.profile?.avatar_url || undefined}
              role={member.role}
              joinedAt={member.joined_at}
              isCurrentUser={member.user_id === currentUserId}
              onPromote={isAdmin && member.role !== 'admin' && onPromote ? () => onPromote(member.id) : undefined}
              onRemove={(isAdmin || member.user_id === currentUserId) && onRemove ? () => onRemove(member.id) : undefined}
              onMessage={member.user_id !== currentUserId && onMessage ? () => onMessage(member.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}