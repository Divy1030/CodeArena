"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaSearch, FaUserPlus, FaUserMinus, FaUsers } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  isFollowing?: boolean;
}

interface SocialFeaturesProps {
  currentUserId: string;
}

const SocialFeatures: React.FC<SocialFeaturesProps> = ({ currentUserId }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'suggested'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch suggested users on component mount
  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  const fetchSuggestedUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        return;
      }

      console.log('Fetching suggested users...');
      
      const response = await fetch('/api/user/suggested-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response content-type:', response.headers.get('content-type'));

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData.substring(0, 100)}`);
      }

      const result = await response.json();
      console.log('Suggested users result:', result);
      
      if (result.success) {
        setSuggestedUsers(result.data || []);
        if (result.data?.length === 0) {
          console.log('No suggested users found');
        }
      } else {
        toast.error(result.message || 'Failed to fetch suggested users');
      }
    } catch (error: any) {
      console.error('Error fetching suggested users:', error);
      toast.error(`Failed to load suggested users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a username to search');
      return;
    }

    try {
      setSearchLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/user/search-friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: searchQuery.trim() })
      });

      const result = await response.json();
      
      if (result.success) {
        setSearchResults(result.data || []);
        if (result.data.length === 0) {
          toast.success('No users found with that username');
        }
      } else {
        toast.error(result.message || 'Failed to search users');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFollowUnfollow = async (userId: string, isCurrentlyFollowing: boolean) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/user/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idOfWhomWeAreFollowing: userId })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message || (isCurrentlyFollowing ? 'Unfollowed successfully' : 'Followed successfully'));
        
        // Update the UI
        if (activeTab === 'search') {
          setSearchResults(prev => prev.map(user => 
            user._id === userId 
              ? { ...user, isFollowing: !isCurrentlyFollowing }
              : user
          ));
        } else {
          setSuggestedUsers(prev => prev.map(user => 
            user._id === userId 
              ? { ...user, isFollowing: !isCurrentlyFollowing }
              : user
          ));
        }
      } else {
        toast.error(result.message || 'Failed to update follow status');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  const UserCard: React.FC<{ user: User; index: number }> = ({ user, index }) => (
    <div className="flex items-center justify-between p-4 bg-[#1a2332] rounded-lg hover:bg-[#1e2738] transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold text-lg">
              {(user.firstName?.charAt(0) || user.username?.charAt(0) || 'U').toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-medium text-white">{user.username}</h4>
          {(user.firstName || user.lastName) && (
            <p className="text-sm text-gray-400">
              {user.firstName} {user.lastName}
            </p>
          )}
        </div>
      </div>
      
      {user._id !== currentUserId && (
        <button
          onClick={() => handleFollowUnfollow(user._id, user.isFollowing || false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            user.isFollowing
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {user.isFollowing ? (
            <>
              <FaUserMinus className="inline mr-1" />
              Unfollow
            </>
          ) : (
            <>
              <FaUserPlus className="inline mr-1" />
              Follow
            </>
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-[#121B38] rounded-xl p-6">
      <h3 className="text-lg font-medium mb-6 flex items-center">
        <FaUsers className="mr-2" />
        Connect with Others
      </h3>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-blue-600 text-white'
              : 'bg-[#1a2332] text-gray-400 hover:text-white'
          }`}
        >
          Search Users
        </button>
        <button
          onClick={() => setActiveTab('suggested')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'suggested'
              ? 'bg-blue-600 text-white'
              : 'bg-[#1a2332] text-gray-400 hover:text-white'
          }`}
        >
          Suggested
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 bg-[#1a2332] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={searchUsers}
              disabled={searchLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {searchLoading && (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          )}

          {!searchLoading && searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((user, index) => (
                <UserCard key={user._id || `search-${index}`} user={user} index={index} />
              ))}
            </div>
          )}

          {!searchLoading && searchQuery && searchResults.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No users found. Try a different username.
            </p>
          )}
        </div>
      )}

      {/* Suggested Tab */}
      {activeTab === 'suggested' && (
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          )}

          {!loading && suggestedUsers.length > 0 && (
            <div className="space-y-3">
              {suggestedUsers.map((user, index) => (
                <UserCard key={user._id || `suggested-${index}`} user={user} index={index} />
              ))}
            </div>
          )}

          {!loading && suggestedUsers.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No suggested users available at the moment.
            </p>
          )}

          <button
            onClick={fetchSuggestedUsers}
            disabled={loading}
            className="w-full py-2 bg-[#1a2332] text-gray-400 rounded-lg hover:bg-[#1e2738] hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh Suggestions'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialFeatures;