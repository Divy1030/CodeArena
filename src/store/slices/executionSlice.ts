import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface ExecutionResult {
  allPassed: boolean;
  results: {
    testCase: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    stderr: string | null;
    status: string;
    time: string;
    memory: number;
  }[];
}

export interface ExecutionState {
  isRunning: boolean;
  isSubmitting: boolean;
  executionResult: ExecutionResult | null;
  executionError: string | null;
}

const initialState: ExecutionState = {
  isRunning: false,
  isSubmitting: false,
  executionResult: null,
  executionError: null,
};

// Async thunk for running code
export const runCode = createAsyncThunk(
  'execution/runCode',
  async ({ code, language, testCases }: { code: string; language: string; testCases: any[] }) => {
    const formattedTestCases = testCases.map(tc => ({
      input: tc.input,
      output: tc.expectedOutput
    }));
    
    const response = await fetch('/api/code/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({
        code,
        language,
        testCases: formattedTestCases
      }),
    });
    
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Code execution failed');
    }
    
    return result;
  }
);

// Async thunk for submitting solution
export const submitSolution = createAsyncThunk(
  'execution/submitSolution',
  async ({ 
    code, 
    language, 
    testCases, 
    contestId, 
    problemId, 
    problemData 
  }: { 
    code: string; 
    language: string; 
    testCases: any[]; 
    contestId: string; 
    problemId: string; 
    problemData: any; 
  }) => {
    const formattedTestCases = testCases.map(tc => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput
    }));
    
    // First execute the code
    const executeResponse = await fetch('/api/code/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({
        code,
        language,
        testCases: formattedTestCases
      }),
    });
    
    const executeResult = await executeResponse.json();
    if (!executeResult.success) {
      throw new Error(executeResult.message || 'Execution failed');
    }
    
    const executionData = executeResult.data || {};
    const results = Array.isArray(executionData.results) ? executionData.results : [];
    const totalTests = testCases.length;
    const passedTests = results.filter((r: any) => r.status === 'Accepted' || r.passed === true).length;
    const allPassed = passedTests === totalTests;
    
    if (!allPassed) {
      throw new Error(`Your solution passed ${passedTests} out of ${totalTests} test cases. Please fix your code and try again.`);
    }
    
    // Submit the solution
    const memoryOccupied = results?.[0]?.memory || 1;
    const timeOccupied = results?.[0]?.time || 1;
    
    const submitResponse = await fetch(`/api/problem/submit-solution/${contestId}/${problemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify({
        score: 100,
        solutionCode: code,
        languageUsed: language,
        timeOccupied: Number(timeOccupied),
        memoryOccupied: Number(memoryOccupied),
        timeGivenOnSolution: (new Date().getTime() - new Date(problemData?.startTime || Date.now()).getTime()) / 1000
      }),
    });
    
    const submitResult = await submitResponse.json();
    if (!submitResult.success) {
      throw new Error(submitResult.message || 'Submission failed');
    }
    
    return submitResult;
  }
);

const executionSlice = createSlice({
  name: 'execution',
  initialState,
  reducers: {
    clearExecutionResult: (state) => {
      state.executionResult = null;
      state.executionError = null;
    },
    clearExecutionError: (state) => {
      state.executionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Run code cases
      .addCase(runCode.pending, (state) => {
        state.isRunning = true;
        state.executionError = null;
      })
      .addCase(runCode.fulfilled, (state, action) => {
        state.isRunning = false;
        const data = action.payload.data || {};
        const results = Array.isArray(data.testCases) ? data.testCases : [];
        const totalTests = results.length;
        const passedTests = results.filter((r: any) => r.status === 'Accepted' || r.passed === true).length;
        
        state.executionResult = {
          allPassed: passedTests === totalTests,
          results: results.map((r: any, idx: number) => ({
            testCase: idx + 1,
            input: r.input || '',
            expectedOutput: r.expectedOutput || '',
            actualOutput: r.actualOutput || r.output || '',
            passed: r.passed || r.status === 'Accepted',
            stderr: r.stderr || null,
            status: r.status || (r.passed ? 'Accepted' : 'Wrong Answer'),
            time: r.time || '0.00',
            memory: r.memory || 0
          }))
        };
      })
      .addCase(runCode.rejected, (state, action) => {
        state.isRunning = false;
        state.executionError = action.error.message || 'Network error or server unavailable';
      })
      // Submit solution cases
      .addCase(submitSolution.pending, (state) => {
        state.isSubmitting = true;
        state.executionError = null;
      })
      .addCase(submitSolution.fulfilled, (state) => {
        state.isSubmitting = false;
        // Success handled in component
      })
      .addCase(submitSolution.rejected, (state, action) => {
        state.isSubmitting = false;
        state.executionError = action.error.message || 'Network error or server unavailable';
      });
  },
});

export const {
  clearExecutionResult,
  clearExecutionError,
} = executionSlice.actions;

export default executionSlice.reducer;