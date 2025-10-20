"use client";

import React, { useState, useEffect } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import Image from 'next/image';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; // Updated import
import { fetchFollowers, fetchFollowing, followUnfollowUser } from '@/store/socialSlice';

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  isFollowing?: boolean;
}

interface FollowingListProps {
  currentUserId: string;
}

const FollowingList: React.FC<FollowingListProps> = ({ currentUserId }) => {
  const dispatch = useAppDispatch(); // Updated hook
  const { followers, following, loading } = useAppSelector((state) => state.social); // Updated hook
  
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('following');

  useEffect(() => {
    dispatch(fetchFollowers());
    dispatch(fetchFollowing());
  }, [dispatch]);

  const handleUnfollow = (userId: string) => {
    dispatch(followUnfollowUser({ targetUserId: userId, isCurrentlyFollowing: true }));
  };

  const UserCard: React.FC<{ user: User; showUnfollowButton?: boolean }> = ({ 
    user, 
    showUnfollowButton = false 
  }) => (
    <div className="flex items-center justify-between p-3 bg-[#1a2332] rounded-lg hover:bg-[#1e2738] transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
          {user.profilePicture ? (
            <div className="relative w-full h-full">
              <Image 
                src={user.profilePicture} 
                alt={user.username || 'User'}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <span className="text-white font-semibold text-sm">
              {(user.firstName?.charAt(0) || user.username?.charAt(0) || 'U').toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-white text-sm">{user.username}</h4>
          {(user.firstName || user.lastName) && (
            <p className="text-xs text-gray-400">
              {user.firstName} {user.lastName}
            </p>
          )}
        </div>
      </div>
      
      {showUnfollowButton && user._id !== currentUserId && (
        <button
          onClick={() => handleUnfollow(user._id)}
          disabled={loading.followAction}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading.followAction ? 'Unfollowing...' : 'Unfollow'}
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-[#121B38] rounded-xl p-6">
      <h3 className="text-lg font-medium mb-6 flex items-center">
        <FaUserFriends className="mr-2" />
        Connections
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1a2332] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {loading.following ? '...' : following.length}
          </div>
          <div className="text-sm text-gray-400">Following</div>
        </div>
        <div className="bg-[#1a2332] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {loading.followers ? '...' : followers.length}
          </div>
          <div className="text-sm text-gray-400">Followers</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'following'
              ? 'bg-blue-600 text-white'
              : 'bg-[#1a2332] text-gray-400 hover:text-white'
          }`}
        >
          Following ({following.length})
        </button>
        <button
          onClick={() => setActiveTab('followers')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'followers'
              ? 'bg-blue-600 text-white'
              : 'bg-[#1a2332] text-gray-400 hover:text-white'
          }`}
        >
          Followers ({followers.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {activeTab === 'following' && (
          <>
            {loading.following ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : following.length > 0 ? (
              following.map((user: User, index: number) => (
                <UserCard 
                  key={user._id || `following-${index}`} 
                  user={user} 
                  showUnfollowButton={true}
                />
              ))
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">
                You&apos;re not following anyone yet.
              </p>
            )}
          </>
        )}

        {activeTab === 'followers' && (
          <>
            {loading.followers ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : followers.length > 0 ? (
              followers.map((user: User, index: number) => (
                <UserCard 
                  key={user._id || `follower-${index}`} 
                  user={user} 
                  showUnfollowButton={false}
                />
              ))
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">
                No followers yet.
              </p>
            )}
          </>
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-4">
        <button
          onClick={() => {
            dispatch(fetchFollowers());
            dispatch(fetchFollowing());
          }}
          disabled={loading.followers || loading.following}
          className="w-full py-2 bg-[#1a2332] text-gray-400 rounded-lg hover:bg-[#1e2738] hover:text-white transition-colors disabled:opacity-50"
        >
          {(loading.followers || loading.following) ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </div>
  );
};

export default FollowingList;