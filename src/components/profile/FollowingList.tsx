"use client";

import React, { useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';
import Image from 'next/image';

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
}

interface UserDataProfile {
  followers?: User[];
  following?: User[];
}

interface FollowingListProps {
  userData: UserDataProfile;
}

const FollowingList: React.FC<FollowingListProps> = ({ userData }) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('following');

  const followers = userData?.followers || [];
  const following = userData?.following || [];

  const UserCard: React.FC<{ user: User }> = ({ user }) => (
    <div className="flex items-center space-x-3 p-3 bg-[#1a2332] rounded-lg hover:bg-[#1e2738] transition-colors">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
        {user.profilePicture ? (
          <div className="relative w-full h-full">
            <Image 
              src={user.profilePicture} 
              alt={user.username}
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
          <div className="text-2xl font-bold text-blue-400">{following.length}</div>
          <div className="text-sm text-gray-400">Following</div>
        </div>
        <div className="bg-[#1a2332] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{followers.length}</div>
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
            {following.length > 0 ? (
              following.map((user: User, index: number) => (
                <UserCard key={user._id || `following-${index}`} user={user} />
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
            {followers.length > 0 ? (
              followers.map((user: User, index: number) => (
                <UserCard key={user._id || `follower-${index}`} user={user} />
              ))
            ) : (
              <p className="text-gray-400 text-center py-4 text-sm">
                No followers yet.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FollowingList;