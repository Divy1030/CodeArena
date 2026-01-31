import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status: 'pending' | 'passed' | 'failed';
  time?: string;
  memory?: number;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation: string;
}

export interface ProblemData {
  title: string;
  difficulty: string;
  timeEstimate: string;
  points: number;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  followUp: string;
  startTime?: string;
}

export interface ProblemState {
  problemData: ProblemData | null;
  testCases: TestCase[];
  selectedTestCase: TestCase | null;
  loading: boolean;
  error: string | null;
  userSolution: {
    solutionCode?: string;
    languageUsed?: string;
    score?: number;
    timeOccupied?: number;
    memoryOccupied?: number;
  } | null;
  hasSolved: boolean;
}

const initialState: ProblemState = {
  problemData: null,
  testCases: [],
  selectedTestCase: null,
  loading: false,
  error: null,
  userSolution: null,
  hasSolved: false,
};

// Async thunk for fetching problem data
export const fetchProblem = createAsyncThunk(
  'problem/fetchProblem',
  async ({ contestId, problemId }: { contestId: string; problemId: string }) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`/api/problem/getProblem/${contestId}/${problemId}`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch problem');
    }
    
    const data = await response.json();
    return data;
  }
);

const problemSlice = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    setSelectedTestCase: (state, action: PayloadAction<TestCase | null>) => {
      state.selectedTestCase = action.payload;
    },
    updateTestCases: (state, action: PayloadAction<TestCase[]>) => {
      state.testCases = action.payload;
    },
    updateTestCaseResults: (state, action: PayloadAction<{ index: number; result: Partial<TestCase> }>) => {
      const { index, result } = action.payload;
      if (state.testCases[index]) {
        state.testCases[index] = { ...state.testCases[index], ...result };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProblemData: (state) => {
      state.problemData = null;
      state.testCases = [];
      state.selectedTestCase = null;
      state.userSolution = null;
      state.hasSolved = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblem.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        
        if (data.statusCode === 200 && data.data) {
          const p = data.data;
          const constraintsArr = Array.isArray(p.constraints) ? p.constraints : p.constraints ? [p.constraints] : [];
          const testCasesArr = Array.isArray(p.testCases) ? p.testCases : p.testCases ? [p.testCases] : [];
          
          state.problemData = {
            title: p.title || "Problem",
            difficulty: p.difficulty || "Medium",
            timeEstimate: (p.timeLimit ? `${p.timeLimit} sec` : "30 mins"),
            points: p.maxScore || 200,
            description: p.statement || "No description provided.",
            examples: testCasesArr.slice(0, 3).map((tc: any) => ({
              input: tc.input,
              output: tc.output,
              explanation: tc.explanation || "No explanation provided."
            })),
            constraints: constraintsArr.length > 0 ? constraintsArr : ["No constraints specified."],
            followUp: p.followUp || ""
          };
          
          // Handle user's previous solution if it exists
          if (p.userSolution) {
            state.userSolution = p.userSolution;
            state.hasSolved = p.userSolution.score >= (p.maxScore || 0);
          } else {
            state.userSolution = null;
            state.hasSolved = false;
          }
          
          if (testCasesArr.length > 0) {
            const formattedTestCases: TestCase[] = testCasesArr.map((tc: any, idx: number) => ({
              id: idx + 1,
              input: tc.input,
              expectedOutput: tc.output,
              status: 'pending'
            }));
            state.testCases = formattedTestCases;
            state.selectedTestCase = formattedTestCases[0];
          }
        } else {
          state.problemData = {
            title: "Problem Not Found",
            difficulty: "N/A",
            timeEstimate: "-",
            points: 0,
            description: data.message || "Problem could not be loaded.",
            examples: [],
            constraints: [],
            followUp: ""
          };
          state.testCases = [];
          state.selectedTestCase = null;
          state.userSolution = null;
          state.hasSolved = false;
        }
      })
      .addCase(fetchProblem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch problem';
        state.problemData = {
          title: "Error",
          difficulty: "N/A",
          timeEstimate: "-",
          points: 0,
          description: "Failed to fetch problem.",
          examples: [],
          constraints: [],
          followUp: ""
        };
        state.testCases = [];
        state.selectedTestCase = null;
        state.userSolution = null;
        state.hasSolved = false;
      });
  },
});

export const {
  setSelectedTestCase,
  updateTestCases,
  updateTestCaseResults,
  clearError,
  clearProblemData,
} = problemSlice.actions;

export default problemSlice.reducer;