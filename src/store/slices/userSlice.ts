import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  rating?: number;
  solvedProblems?: Array<{
    problemId: string;
    solvedAt: string;
  }>;
  contestsParticipated?: Array<{
    contestId: string;
    score: number;
    rank?: number;
    contestProblems?: Array<{
      problemId: string;
      score: number;
      submissionStatus: 'correct' | 'wrong' | 'partially correct';
    }>;
  }>;
  followers?: Array<any>;
  following?: Array<any>;
  role?: string;
  [key: string]: any;
}

export interface UserState {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  loading: false,
  error: null,
};

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/user/current', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch user data');
    }
    
    // Update localStorage with fresh data
    if (typeof window !== "undefined") {
      localStorage.setItem('userData', JSON.stringify(data.data));
    }
    
    return data.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserData | null>) => {
      state.userData = action.payload;
      if (action.payload && typeof window !== "undefined") {
        localStorage.setItem('userData', JSON.stringify(action.payload));
      }
    },
    clearUserData: (state) => {
      state.userData = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem('userData');
      }
    },
    updateUserStats: (state, action: PayloadAction<{ rating?: number; solvedProblems?: any[] }>) => {
      if (state.userData) {
        if (action.payload.rating !== undefined) {
          state.userData.rating = action.payload.rating;
        }
        if (action.payload.solvedProblems !== undefined) {
          state.userData.solvedProblems = action.payload.solvedProblems;
        }
        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem('userData', JSON.stringify(state.userData));
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user data';
      });
  },
});

export const {
  setUserData,
  clearUserData,
  updateUserStats,
} = userSlice.actions;

export default userSlice.reducer;
