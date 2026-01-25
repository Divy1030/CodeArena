import React from 'react';
import { Play, Check, X, Clock, AlertCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSelectedTestCase, updateTestCases } from '@/store/slices/problemSlice';

const TestResults: React.FC = () => {
  const dispatch = useAppDispatch();
  const { testCases, selectedTestCase } = useAppSelector(state => state.problem);
  const { executionResult, executionError } = useAppSelector(state => state.execution);

  // Update test cases with execution results
  React.useEffect(() => {
    if (executionResult && executionResult.results) {
      const updatedTestCases = testCases.map((tc, index) => {
        const result = executionResult.results[index];
        if (result) {
          return {
            ...tc,
            actualOutput: result.actualOutput,
            status: result.status === 'Passed' ? 'passed' as const : 'failed' as const,
            time: result.timeMs ? `${result.timeMs}ms` : undefined,
            memory: result.memoryKb
          };
        }
        return tc;
      });
      dispatch(updateTestCases(updatedTestCases));
    }
  }, [executionResult]);

  return (
    <div className="mt-6">
      <div className="text-sm text-white mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play size={16} className="text-white" />
          <span>Test Results</span>
        </div>
        {executionResult && (
          <div className="flex items-center gap-4">
            <span className={executionResult.passed === executionResult.total ? "text-green-500" : "text-red-500"}>
              {executionResult.passed}/{executionResult.total} passed
            </span>
            {executionResult.score !== null && (
              <span className="text-blue-400">
                Score: {executionResult.score}%
              </span>
            )}
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
              {testCase.status === 'passed' && <Check size={16} className="text-green-500" />}
              {testCase.status === 'failed' && <X size={16} className="text-red-500" />}
              {testCase.status === 'pending' && <Clock size={16} className="text-gray-500" />}
              <span>Test Case {testCase.id}</span>
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
              <div className="text-gray-400 text-sm">Input:</div>
              <pre className="whitespace-pre-wrap">{selectedTestCase?.input || 'N/A'}</pre>
            </div>
            <div className="bg-gray-800 p-2 rounded mb-2">
              <div className="text-gray-400 text-sm">Expected Output:</div>
              <pre className="whitespace-pre-wrap">{selectedTestCase?.expectedOutput || 'N/A'}</pre>
            </div>
            {selectedTestCase && selectedTestCase.actualOutput !== undefined && (
              <div className={`p-2 rounded mb-2 ${
                selectedTestCase.status === 'passed' ? 'bg-green-900' : 'bg-red-900'
              }`}>
                <div className="text-gray-400 text-sm">Actual Output:</div>
                <pre className="whitespace-pre-wrap">{selectedTestCase.actualOutput}</pre>
              </div>
            )}
            {selectedTestCase && selectedTestCase.time && (
              <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                <Clock size={14} />
                <span>Execution Time: {selectedTestCase.time}</span>
                {selectedTestCase.memory && (
                  <span className="ml-4">Memory: {selectedTestCase.memory} KB</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;