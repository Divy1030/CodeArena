import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.code-arena.tech";

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Get token from localStorage
    const token = localStorage.getItem("token");

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: token,
      },
      extraHeaders: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // ==================== MATCHMAKING ====================

  findMatch(callback: (response: FindMatchResponse) => void): void {
    this.socket?.emit("findMatch", callback);
  }

  cancelMatchmaking(callback: (response: BaseResponse) => void): void {
    this.socket?.emit("cancelMatchmaking", callback);
  }

  getMatchmakingStatus(callback: (response: MatchmakingStatusResponse) => void): void {
    this.socket?.emit("getMatchmakingStatus", callback);
  }

  // ==================== MATCH EVENTS ====================

  submitSolution(
    roomId: string,
    code: string,
    language: string,
    callback: (response: SubmitResponse) => void
  ): void {
    this.socket?.emit("submitSolution", { roomId, code, language }, callback);
  }

  leaveMatch(roomId: string, callback: (response: BaseResponse) => void): void {
    this.socket?.emit("leaveMatch", { roomId }, callback);
  }

  getRoomStatus(roomId: string, callback: (response: RoomStatusResponse) => void): void {
    this.socket?.emit("getRoomStatus", { roomId }, callback);
  }

  getActiveMatches(callback: (response: ActiveMatchesResponse) => void): void {
    this.socket?.emit("getActiveMatches", callback);
  }

  rejoinMatch(roomId: string, callback: (response: RejoinMatchResponse) => void): void {
    this.socket?.emit("rejoinMatch", { roomId }, callback);
  }

  // ==================== CHAT ====================

  sendMessage(roomId: string, message: string, callback: (response: BaseResponse) => void): void {
    this.socket?.emit("sendMessage", { roomId, message }, callback);
  }

  // ==================== EVENT LISTENERS ====================

  // Matchmaking events
  onMatchFound(callback: (data: MatchFoundData) => void): void {
    this.socket?.on("matchFound", callback);
  }

  onMatchmakingStatus(callback: (data: MatchmakingStatusData) => void): void {
    this.socket?.on("matchmakingStatus", callback);
  }

  onMatchmakingTimeout(callback: (data: { message: string }) => void): void {
    this.socket?.on("matchmakingTimeout", callback);
  }

  onMatchmakingError(callback: (data: { message: string }) => void): void {
    this.socket?.on("matchmakingError", callback);
  }

  // Match events
  onScoreUpdate(callback: (data: ScoreUpdateData) => void): void {
    this.socket?.on("scoreUpdate", callback);
  }

  onSubmissionUpdate(callback: (data: SubmissionUpdateData) => void): void {
    this.socket?.on("submissionUpdate", callback);
  }

  onUserSubmitting(callback: (data: { userId: string; username: string }) => void): void {
    this.socket?.on("userSubmitting", callback);
  }

  onMatchFinished(callback: (data: MatchFinishedData) => void): void {
    this.socket?.on("matchFinished", callback);
  }

  onOpponentLeft(callback: (data: OpponentLeftData) => void): void {
    this.socket?.on("opponentLeft", callback);
  }

  onOpponentDisconnected(callback: (data: OpponentDisconnectedData) => void): void {
    this.socket?.on("opponentDisconnected", callback);
  }

  onOpponentReconnected(callback: (data: { userId: string; username: string }) => void): void {
    this.socket?.on("opponentReconnected", callback);
  }

  // Chat events
  onNewMessage(callback: (data: ChatMessage) => void): void {
    this.socket?.on("newMessage", callback);
  }

  // ==================== REMOVE LISTENERS ====================

  offMatchFound(): void {
    this.socket?.off("matchFound");
  }

  offMatchmakingStatus(): void {
    this.socket?.off("matchmakingStatus");
  }

  offMatchmakingTimeout(): void {
    this.socket?.off("matchmakingTimeout");
  }

  offMatchmakingError(): void {
    this.socket?.off("matchmakingError");
  }

  offScoreUpdate(): void {
    this.socket?.off("scoreUpdate");
  }

  offSubmissionUpdate(): void {
    this.socket?.off("submissionUpdate");
  }

  offUserSubmitting(): void {
    this.socket?.off("userSubmitting");
  }

  offMatchFinished(): void {
    this.socket?.off("matchFinished");
  }

  offOpponentLeft(): void {
    this.socket?.off("opponentLeft");
  }

  offOpponentDisconnected(): void {
    this.socket?.off("opponentDisconnected");
  }

  offOpponentReconnected(): void {
    this.socket?.off("opponentReconnected");
  }

  offNewMessage(): void {
    this.socket?.off("newMessage");
  }

  removeAllListeners(): void {
    this.offMatchFound();
    this.offMatchmakingStatus();
    this.offMatchmakingTimeout();
    this.offMatchmakingError();
    this.offScoreUpdate();
    this.offSubmissionUpdate();
    this.offUserSubmitting();
    this.offMatchFinished();
    this.offOpponentLeft();
    this.offOpponentDisconnected();
    this.offOpponentReconnected();
    this.offNewMessage();
  }
}

// ==================== TYPES ====================

export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface RoomUser {
  userId: string;
  username: string;
  score: number;
  submissionStatus: "pending" | "submitted" | "forfeited";
  submissionTime?: string;
  rating: number;
  isCreator?: boolean;
}

export interface FindMatchResponse extends BaseResponse {
  status?: "matched" | "searching";
  queuePosition?: number;
  roomId?: string;
}

export interface MatchmakingStatusResponse extends BaseResponse {
  inQueue?: boolean;
  queueSize?: number;
  waitTime?: number;
}

export interface RoomStatusResponse extends BaseResponse {
  roomId?: string;
  problemId?: string;
  roomStatus?: "waiting" | "Live" | "completed";
  users?: RoomUser[];
  isActive?: boolean;
  remainingTime?: number | null;
}

export interface RejoinMatchResponse extends BaseResponse {
  roomId?: string;
  problemId?: string;
  roomStatus?: "waiting" | "Live" | "completed";
  users?: RoomUser[];
  remainingTime?: number | null;
}

export interface ActiveMatchesResponse extends BaseResponse {
  matches?: {
    roomId: string;
    roomStatus: string;
    problemId: string;
    users: RoomUser[];
    createdAt: string;
  }[];
}

export interface SubmitResponse extends BaseResponse {
  score?: number;
  passedTestcases?: number;
}

// Rating change data for Elo calculations
export interface RatingChange {
  oldRating: number;
  newRating: number;
  ratingChange: number;
}

export interface RatingChanges {
  [userId: string]: RatingChange;
}

// Problem data sent with match
export interface MatchProblem {
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
}

export interface MatchFoundData {
  roomId: string;
  problemId: string;
  problem?: MatchProblem; // Optional - backend may include full problem data
  users: RoomUser[];
  duration: number;
  startedAt: number;
  endsAt: number;
  message: string;
}

export interface MatchmakingStatusData {
  status: "searching" | "cancelled";
  rating?: number;
  queueSize?: number;
}

export interface ScoreUpdateData {
  users: RoomUser[];
}

export interface SubmissionUpdateData {
  userId: string;
  username: string;
  submissionStatus: string;
  score: number;
  passedTestcases: number;
}

export interface MatchFinishedData {
  message: string;
  reason: "timeout" | "allSubmitted" | "forfeit";
  users: RoomUser[];
  winner: RoomUser | null;
  isDraw: boolean;
  ratingChanges: RatingChanges;
}

export interface OpponentLeftData {
  userId: string;
  username: string;
  matchEnded: boolean;
  winner: RoomUser | null;
  ratingChanges: RatingChanges;
}

export interface OpponentDisconnectedData {
  userId: string;
  username: string;
  temporary: boolean;
  message: string;
}

export interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  timestamp: string;
}

export const socketService = SocketService.getInstance();
export default socketService;
