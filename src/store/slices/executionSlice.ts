import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  status: 'Passed' | 'Failed' | 'TLE' | 'Runtime Error';
  timeMs?: number;
  memoryKb?: number;
}

export interface ExecutionResult {
  status: 'queued' | 'running' | 'completed';
  mode: 'run' | 'submit';
  score: number | null;
  passed: number | null;
  total: number | null;
  executionTimeMs: number | null;
  memoryKb: number | null;
  results: TestCaseResult[];
}

export interface ExecutionState {
  isRunning: boolean;
  isSubmitting: boolean;
  currentJobId: string | null;
  executionResult: ExecutionResult | null;
  executionError: string | null;
}

const initialState: ExecutionState = {
  isRunning: false,
  isSubmitting: false,
  currentJobId: null,
  executionResult: null,
  executionError: null,
};

// Helper function to poll for results
const pollForResult = async (jobId: string, maxAttempts = 30): Promise<ExecutionResult> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`/api/code/result/${jobId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch result');
    }

    const result = data.data;

    // If completed, return the result
    if (result.status === 'completed') {
      return result;
    }

    // Wait 1 second before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Execution timeout - please try again');
};

// Async thunk for running code
export const runCode = createAsyncThunk(
  'execution/runCode',
  async ({ code, language, testCases }: { 
    code: string; 
    language: string; 
    testCases: any[] 
  }) => {
    // Step 1: Start execution
    const runResponse = await fetch('/api/code/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language,
        testCases: testCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput
        }))
      }),
    });

    const runData = await runResponse.json();
    if (!runData.success) {
      throw new Error(runData.message || 'Failed to start code execution');
    }

    const jobId = runData.data.jobId;

    // Step 2: Poll for result
    const result = await pollForResult(jobId);
    
    return { jobId, result };
  }
);

// Async thunk for submitting solution
export const submitSolution = createAsyncThunk(
  'execution/submitSolution',
  async ({ 
    code, 
    language, 
    testCases,
    problemId,
    contestId,
    isStandalone = false
  }: { 
    code: string; 
    language: string; 
    testCases: any[]; 
    problemId: string;
    contestId: string;
    isStandalone?: boolean;
  }) => {
    // Step 1: Start submission to code execution service
    const submitResponse = await fetch('/api/code/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language,
        problemId,
        testCases: testCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput
        }))
      }),
    });

    const submitData = await submitResponse.json();
    if (!submitData.success) {
      throw new Error(submitData.message || 'Failed to submit solution');
    }

    const jobId = submitData.data.jobId;

    // Step 2: Poll for result
    const result = await pollForResult(jobId);
    
    // Step 3: Save to database via problem controller
    if (result.status === 'completed' && contestId) {
      const saveResponse = await fetch(`/api/problem/submit-solution/${contestId}/${problemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: result.score || 0,
          solutionCode: code,
          languageUsed: language,
          timeOccupied: result.executionTimeMs,
          memoryOccupied: result.memoryKb,
          timeGivenOnSolution: Date.now()
        }),
      });

      const saveData = await saveResponse.json();
      if (!saveData.success) {
        console.error('Failed to save submission to database:', saveData.message);
      } else {
        console.log('✅ Solution saved successfully to database');
        
        // Refresh user data after successful save
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
          
          if (token) {
            const userResponse = await fetch('/api/user/current', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            const userData = await userResponse.json();
            console.log('📊 Refreshed user data:', userData);
            console.log('📋 User data details:', {
              rating: userData.data?.rating,
              solvedProblemsLength: userData.data?.solvedProblems?.length,
              solvedProblems: userData.data?.solvedProblems,
              hasRating: 'rating' in (userData.data || {}),
              hasSolvedProblems: 'solvedProblems' in (userData.data || {})
            });
            
            if (userData.success && typeof window !== 'undefined') {
              localStorage.setItem('userData', JSON.stringify(userData.data));
              console.log('✅ Updated localStorage with new user data');
              console.log('Rating:', userData.data.rating, 'Solved:', userData.data.solvedProblems?.length);
              
              // Dispatch event to notify components
              console.log('🔔 Dispatching userDataUpdated event');
              window.dispatchEvent(new Event('userDataUpdated'));
              console.log('✅ Event dispatched');
            } else {
              console.error('❌ Failed to get user data:', userData.message);
            }
          } else {
            console.error('❌ No token found for user data refresh');
          }
        } catch (error) {
          console.error('❌ Failed to refresh user data:', error);
        }
      }
    }
    
    return { jobId, result };
  }
);

const executionSlice = createSlice({
  name: 'execution',
  initialState,
  reducers: {
    clearExecutionResult: (state) => {
      state.executionResult = null;
      state.currentJobId = null;
    },
    clearExecutionError: (state) => {
      state.executionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Run Code
      .addCase(runCode.pending, (state) => {
        state.isRunning = true;
        state.executionError = null;
        state.executionResult = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.isRunning = false;
        state.currentJobId = action.payload.jobId;
        state.executionResult = action.payload.result;
      })
      .addCase(runCode.rejected, (state, action) => {
        state.isRunning = false;
        state.executionError = action.error.message || 'Failed to execute code';
      })
      // Submit Solution
      .addCase(submitSolution.pending, (state) => {
        state.isSubmitting = true;
        state.executionError = null;
        state.executionResult = null;
      })
      .addCase(submitSolution.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentJobId = action.payload.jobId;
        state.executionResult = action.payload.result;
      })
      .addCase(submitSolution.rejected, (state, action) => {
        state.isSubmitting = false;
        state.executionError = action.error.message || 'Failed to submit solution';
      });
  },
});

export const {
  clearExecutionResult,
  clearExecutionError,
} = executionSlice.actions;

export default executionSlice.reducer;