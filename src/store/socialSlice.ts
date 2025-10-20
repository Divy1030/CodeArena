import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
  isFollowing?: boolean;
}

interface SocialState {
  suggestedUsers: User[];
  searchResults: User[];
  followers: User[];
  following: User[];
  loading: {
    suggested: boolean;
    search: boolean;
    followers: boolean;
    following: boolean;
    followAction: boolean;
  };
  error: string | null;
  showAllSuggested: boolean;
}

const initialState: SocialState = {
  suggestedUsers: [],
  searchResults: [],
  followers: [],
  following: [],
  loading: {
    suggested: false,
    search: false,
    followers: false,
    following: false,
    followAction: false,
  },
  error: null,
  showAllSuggested: false,
};

// Helper function to get token
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('accessToken');
};

// Async thunks
export const fetchSuggestedUsers = createAsyncThunk(
  'social/fetchSuggestedUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/social/suggested-users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      return result.data || [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const searchUsers = createAsyncThunk(
  'social/searchUsers',
  async (username: string, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/social/search-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: username.trim() })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      return result.data || [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchFollowers = createAsyncThunk(
  'social/fetchFollowers',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/social/followers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      return result.data || [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchFollowing = createAsyncThunk(
  'social/fetchFollowing',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/social/following', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      return result.data || [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const followUnfollowUser = createAsyncThunk(
  'social/followUnfollowUser',
  async ({ targetUserId }: { targetUserId: string; isCurrentlyFollowing: boolean }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/social/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUserId })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      
      return { targetUserId, action: result.data?.action, message: result.message };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    toggleShowAllSuggested: (state) => {
      state.showAllSuggested = !state.showAllSuggested;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Suggested Users
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.loading.suggested = true;
        state.error = null;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.loading.suggested = false;
        state.suggestedUsers = action.payload;
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.loading.suggested = false;
        state.error = action.payload as string;
      })
      
      // Search Users
      .addCase(searchUsers.pending, (state) => {
        state.loading.search = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading.search = false;
        state.error = action.payload as string;
      })
      
      // Fetch Followers
      .addCase(fetchFollowers.pending, (state) => {
        state.loading.followers = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading.followers = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading.followers = false;
        state.error = action.payload as string;
      })
      
      // Fetch Following
      .addCase(fetchFollowing.pending, (state) => {
        state.loading.following = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading.following = false;
        state.following = action.payload;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading.following = false;
        state.error = action.payload as string;
      })
      
      // Follow/Unfollow User
      .addCase(followUnfollowUser.pending, (state) => {
        state.loading.followAction = true;
        state.error = null;
      })
      .addCase(followUnfollowUser.fulfilled, (state, action) => {
        state.loading.followAction = false;
        const { targetUserId, action: followAction } = action.payload;
        const isNowFollowing = followAction === 'followed';
        
        // Update suggested users
        state.suggestedUsers = state.suggestedUsers.map(user =>
          user._id === targetUserId ? { ...user, isFollowing: isNowFollowing } : user
        );
        
        // Update search results
        state.searchResults = state.searchResults.map(user =>
          user._id === targetUserId ? { ...user, isFollowing: isNowFollowing } : user
        );
        
        // Update following list
        if (isNowFollowing) {
          // Add to following if not already there
          const userToAdd = state.suggestedUsers.find(u => u._id === targetUserId) || 
                           state.searchResults.find(u => u._id === targetUserId);
          if (userToAdd && !state.following.find(u => u._id === targetUserId)) {
            state.following.push(userToAdd);
          }
        } else {
          // Remove from following
          state.following = state.following.filter(user => user._id !== targetUserId);
        }
      })
      .addCase(followUnfollowUser.rejected, (state, action) => {
        state.loading.followAction = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearchResults, toggleShowAllSuggested, clearError } = socialSlice.actions;
export default socialSlice.reducer;