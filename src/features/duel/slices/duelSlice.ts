import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DuelState, SubmissionResult, Problem } from "../types/duel.types";
import { RoomUser, RatingChanges } from "@/libs/socket";

const initialState: DuelState = {
  // Matchmaking state
  matchmakingStatus: "idle",
  queuePosition: null,
  
  // Match state
  roomId: null,
  problemId: null,
  problem: null,
  users: [],
  roomStatus: "idle",
  matchDuration: 30 * 60 * 1000, // 30 minutes default
  matchStartTime: null,
  matchEndsAt: null,
  remainingTime: null,
  
  // Results
  winner: null,
  isDraw: false,
  submissionResult: null,
  ratingChanges: null,
  matchEndReason: null,
  
  // UI state
  error: null,
  loading: false,
  
  // Opponent status
  opponentDisconnected: false,
  opponentSubmitting: false,
};

const duelSlice = createSlice({
  name: "duel",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Matchmaking actions
    startSearching: (state) => {
      state.matchmakingStatus = "searching";
      state.loading = true;
      state.error = null;
    },
    setQueuePosition: (state, action: PayloadAction<number>) => {
      state.queuePosition = action.payload;
    },
    cancelSearching: (state) => {
      state.matchmakingStatus = "cancelled";
      state.queuePosition = null;
      state.loading = false;
    },
    matchmakingTimeout: (state) => {
      state.matchmakingStatus = "timeout";
      state.queuePosition = null;
      state.loading = false;
    },
    
    // Match found - start the match
    matchFound: (
      state,
      action: PayloadAction<{
        roomId: string;
        problemId: string;
        problem?: Problem;
        users: RoomUser[];
        duration: number;
        startedAt?: number;
        endsAt?: number;
      }>
    ) => {
      state.matchmakingStatus = "matched";
      state.roomId = action.payload.roomId;
      state.problemId = action.payload.problemId;
      state.problem = action.payload.problem || null;
      state.users = action.payload.users;
      state.matchDuration = action.payload.duration;
      state.matchStartTime = action.payload.startedAt || Date.now();
      state.matchEndsAt = action.payload.endsAt || (state.matchStartTime + action.payload.duration);
      state.remainingTime = action.payload.duration;
      state.roomStatus = "Live";
      state.loading = false;
      state.error = null;
      state.winner = null;
      state.isDraw = false;
      state.submissionResult = null;
      state.ratingChanges = null;
      state.matchEndReason = null;
      state.opponentDisconnected = false;
      state.opponentSubmitting = false;
    },
    
    // Rejoin existing match
    rejoinMatch: (
      state,
      action: PayloadAction<{
        roomId: string;
        problemId: string;
        users: RoomUser[];
        roomStatus: "Live" | "completed";
        remainingTime: number | null;
      }>
    ) => {
      state.roomId = action.payload.roomId;
      state.problemId = action.payload.problemId;
      state.users = action.payload.users;
      state.roomStatus = action.payload.roomStatus;
      state.remainingTime = action.payload.remainingTime;
      state.matchStartTime = action.payload.remainingTime 
        ? Date.now() - (state.matchDuration - action.payload.remainingTime)
        : null;
      state.loading = false;
      state.matchmakingStatus = "matched";
    },
    
    // Update users (score updates, etc.)
    updateUsers: (state, action: PayloadAction<RoomUser[]>) => {
      state.users = action.payload;
    },
    
    // Set problem data (when fetched separately)
    setProblem: (state, action: PayloadAction<Problem | null>) => {
      state.problem = action.payload;
    },
    
    // Set submission result
    setSubmissionResult: (state, action: PayloadAction<SubmissionResult>) => {
      state.submissionResult = action.payload;
    },
    
    // Opponent submitting
    setOpponentSubmitting: (state, action: PayloadAction<boolean>) => {
      state.opponentSubmitting = action.payload;
    },
    
    // Match completed
    matchCompleted: (
      state,
      action: PayloadAction<{
        users: RoomUser[];
        winner: RoomUser | null;
        isDraw: boolean;
        ratingChanges?: RatingChanges;
        reason?: "timeout" | "allSubmitted" | "forfeit";
      }>
    ) => {
      state.users = action.payload.users;
      state.winner = action.payload.winner;
      state.isDraw = action.payload.isDraw;
      state.roomStatus = "completed";
      state.ratingChanges = action.payload.ratingChanges || null;
      state.matchEndReason = action.payload.reason || null;
    },
    
    // Opponent left - match might end
    opponentLeft: (
      state,
      action: PayloadAction<{
        matchEnded: boolean;
        winner: RoomUser | null;
        ratingChanges?: RatingChanges;
      }>
    ) => {
      if (action.payload.matchEnded) {
        state.roomStatus = "completed";
        state.winner = action.payload.winner;
        state.ratingChanges = action.payload.ratingChanges || null;
        state.matchEndReason = "forfeit";
      }
    },
    
    // Opponent connection status
    setOpponentDisconnected: (state, action: PayloadAction<boolean>) => {
      state.opponentDisconnected = action.payload;
    },
    
    // Update remaining time
    updateRemainingTime: (state, action: PayloadAction<number>) => {
      state.remainingTime = action.payload;
    },
    
    // Leave match / reset
    leaveMatch: () => {
      return initialState;
    },
    
    // Full reset
    resetDuel: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  startSearching,
  setQueuePosition,
  cancelSearching,
  matchmakingTimeout,
  matchFound,
  rejoinMatch,
  updateUsers,
  setProblem,
  setSubmissionResult,
  setOpponentSubmitting,
  matchCompleted,
  opponentLeft,
  setOpponentDisconnected,
  updateRemainingTime,
  leaveMatch,
  resetDuel,
} = duelSlice.actions;

export default duelSlice.reducer;
