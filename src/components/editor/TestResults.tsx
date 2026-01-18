import React from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSelectedTestCase } from '@/store/slices/problemSlice';

const TestResults: React.FC = () => {
  const dispatch = useAppDispatch();
  const { testCases, selectedTestCase } = useAppSelector(state => state.problem);
  const { executionResult, executionError } = useAppSelector(state => state.execution);

  return (
    <div className="mt-6">
      <div className="text-sm text-white mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play size={16} className="text-white" />
          <span>Test Results</span>
        </div>
        {executionResult && (
          <div className={executionResult.allPassed ? "text-green-500" : "text-red-500"}>
            {executionResult.allPassed ? "All tests passed!" : "Some tests failed"}
          </div>
        )}
      </div>
      
      {executionError && (
        <div className="bg-red-900 p-4 rounded-lg mb-4 flex items-start gap-2">
          <AlertCircle size={18} className="text-red-500 mt-1" />
          <div>
            <div className="font-semibold text-red-500">Execution Error</div>
            <div className="text-white">{executionError}</div>
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 p-4 rounded-lg max-h-64 overflow-y-auto">
        <div className="flex mb-4 overflow-x-auto pb-2">
          {testCases.map((testCase) => (
            <button
              key={testCase.id}
              className={`flex items-center gap-2 px-4 py-2 rounded whitespace-nowrap mr-2 ${
                selectedTestCase && selectedTestCase.id === testCase.id ? 'bg-gray-800' : 'bg-none'
              }`}
              onClick={() => dispatch(setSelectedTestCase(testCase))}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  testCase.status === 'passed' ? 'bg-green-500' : 
                  testCase.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                }`}
              ></div>
              <span>Test Case #{testCase.id}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-2">
          {selectedTestCase ? (
            <div className={
              selectedTestCase.status === 'passed' ? 'text-green-500' : 
              selectedTestCase.status === 'failed' ? 'text-red-500' : 'text-gray-500'
            }>
              Test Case #{selectedTestCase.id}: {
                selectedTestCase.status === 'pending' ? 'Pending' :
                selectedTestCase.status.charAt(0).toUpperCase() + selectedTestCase.status.slice(1)
              }
            </div>
          ) : (
            <div className="text-gray-500">No test case selected.</div>
          )}
          
          <div className="text-white mt-2">
            <div className="bg-gray-800 p-2 rounded mb-2">
              <div className="text-xs text-gray-400">Input:</div>
              <pre className="font-mono">{selectedTestCase ? selectedTestCase.input : ''}</pre>
            </div>
            <div className="bg-gray-800 p-2 rounded mb-2">
              <div className="text-xs text-gray-400">Expected Output:</div>
              <pre className="font-mono">{selectedTestCase ? selectedTestCase.expectedOutput : ''}</pre>
            </div>
            {selectedTestCase && selectedTestCase.actualOutput !== undefined && (
              <div className={`bg-gray-800 p-2 rounded mb-2 ${
                selectedTestCase.status === 'failed' ? 'border border-red-600' : ''
              }`}>
                <div className="text-xs text-gray-400">Your Output:</div>
                <pre className="font-mono">{selectedTestCase.actualOutput}</pre>
              </div>
            )}
            {selectedTestCase && selectedTestCase.time && (
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Time: {selectedTestCase.time}s</span>
                {selectedTestCase.memory && <span>Memory: {selectedTestCase.memory} KB</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;