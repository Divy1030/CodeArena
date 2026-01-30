import { RoomUser, RatingChanges } from "@/libs/socket";

export interface DuelState {
  // Matchmaking state
  matchmakingStatus: "idle" | "searching" | "matched" | "cancelled" | "timeout";
  queuePosition: number | null;
  
  // Match state
  roomId: string | null;
  problemId: string | null;
  problem: Problem | null; // Store problem data directly
  users: RoomUser[];
  roomStatus: "idle" | "Live" | "completed";
  matchDuration: number;
  matchStartTime: number | null;
  matchEndsAt: number | null; // Server-provided end time
  remainingTime: number | null;
  
  // Results
  winner: RoomUser | null;
  isDraw: boolean;
  submissionResult: SubmissionResult | null;
  ratingChanges: RatingChanges | null; // Elo rating changes after match
  matchEndReason: "timeout" | "allSubmitted" | "forfeit" | null;
  
  // UI state
  error: string | null;
  loading: boolean;
  
  // Opponent status
  opponentDisconnected: boolean;
  opponentSubmitting: boolean;
}

export interface SubmissionResult {
  score: number;
  passedTestcases: number;
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  testCases?: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}
