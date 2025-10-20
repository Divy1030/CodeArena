"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaSearch, FaUserPlus, FaUserMinus, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; // Updated import
import {
  fetchSuggestedUsers,
  searchUsers,
  followUnfollowUser,
  clearSearchResults,
  toggleShowAllSuggested,
  clearError
} from '@/store/socialSlice';

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
  const dispatch = useAppDispatch(); // Updated hook
  const { 
    suggestedUsers, 
    searchResults, 
    loading, 
    error, 
    showAllSuggested 
  } = useAppSelector((state) => state.social); // Updated hook

  const [activeTab, setActiveTab] = useState<'search' | 'suggested'>('search');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch suggested users on component mount
  useEffect(() => {
    dispatch(fetchSuggestedUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearchUsers = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a username to search');
      return;
    }
    dispatch(searchUsers(searchQuery));
  };

  const handleFollowUnfollow = (userId: string, isCurrentlyFollowing: boolean) => {
    dispatch(followUnfollowUser({ targetUserId: userId, isCurrentlyFollowing }))
      .unwrap()
      .then((result) => {
        toast.success(result.message);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchUsers();
    }
  };

  // Show only 5 suggested users initially, or all if expanded
  const displayedSuggestedUsers = showAllSuggested ? suggestedUsers : suggestedUsers.slice(0, 5);
  const hasMoreSuggested = suggestedUsers.length > 5;

  const UserCard: React.FC<{ user: User; index: number }> = ({ user }) => (
    <div className="flex items-center justify-between p-4 bg-[#1a2332] rounded-lg hover:bg-[#1e2738] transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
          {user.profilePicture ? (
            <div className="relative w-full h-full">
              <Image
                src={user.profilePicture}
                alt={user.username}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
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
          disabled={loading.followAction}
          className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
            user.isFollowing
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading.followAction ? (
            <span className="flex items-center">
              <LoadingSpinner />
              <span className="ml-2">...</span>
            </span>
          ) : user.isFollowing ? (
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
          Suggested ({suggestedUsers.length})
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
              onClick={handleSearchUsers}
              disabled={loading.search}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.search ? 'Searching...' : 'Search'}
            </button>
          </div>

          {loading.search && (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          )}

          {!loading.search && searchResults.length > 0 && (
            <div className="space-y-3">
              {searchResults.map((user, index) => (
                <UserCard key={user._id} user={user} index={index} />
              ))}
            </div>
          )}

          {!loading.search && searchQuery && searchResults.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No users found. Try a different username.
            </p>
          )}

          {searchResults.length > 0 && (
            <button
              onClick={() => dispatch(clearSearchResults())}
              className="w-full py-2 bg-[#1a2332] text-gray-400 rounded-lg hover:bg-[#1e2738] hover:text-white transition-colors"
            >
              Clear Results
            </button>
          )}
        </div>
      )}

      {/* Suggested Tab */}
      {activeTab === 'suggested' && (
        <div className="space-y-4">
          {loading.suggested && (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          )}

          {!loading.suggested && displayedSuggestedUsers.length > 0 && (
            <>
              <div className="space-y-3">
                {displayedSuggestedUsers.map((user, index) => (
                  <UserCard key={user._id} user={user} index={index} />
                ))}
              </div>

              {/* Show More/Less Button */}
              {hasMoreSuggested && (
                <button
                  onClick={() => dispatch(toggleShowAllSuggested())}
                  className="w-full py-2 bg-[#1a2332] text-blue-400 rounded-lg hover:bg-[#1e2738] hover:text-blue-300 transition-colors flex items-center justify-center"
                >
                  {showAllSuggested ? (
                    <>
                      <FaChevronUp className="mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="mr-2" />
                      Show More ({suggestedUsers.length - 5} more)
                    </>
                  )}
                </button>
              )}
            </>
          )}

          {!loading.suggested && suggestedUsers.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No suggested users available at the moment.
            </p>
          )}

          <button
            onClick={() => dispatch(fetchSuggestedUsers())}
            disabled={loading.suggested}
            className="w-full py-2 bg-[#1a2332] text-gray-400 rounded-lg hover:bg-[#1e2738] hover:text-white transition-colors disabled:opacity-50"
          >
            {loading.suggested ? 'Refreshing...' : 'Refresh Suggestions'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialFeatures;