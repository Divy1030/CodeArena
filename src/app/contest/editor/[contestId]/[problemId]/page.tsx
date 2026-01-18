"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setIsMobile, setIsTablet, setActiveView } from '@/store/slices/editorSlice';
import { fetchProblem } from '@/store/slices/problemSlice';
import { updateTestCases } from '@/store/slices/problemSlice';
import toast from 'react-hot-toast';

// Components
import ProblemDisplay from '@/components/editor/ProblemDisplay';
import EditorToolbar from '@/components/editor/EditorToolbar';
import SettingsModal from '@/components/editor/SettingsModal';
import TestResults from '@/components/editor/TestResults';
import CodeEditorComponent from '@/components/editor/CodeEditorComponent';

const Compiler: React.FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  
  const contestId = params?.contestId as string;
  const problemId = params?.problemId as string;

  const { isFullScreen, activeView, isMobile } = useAppSelector(state => state.editor);
  const { problemData, loading } = useAppSelector(state => state.problem);
  const { executionResult, isSubmitting } = useAppSelector(state => state.execution);
  const { testCases } = useAppSelector(state => state.problem);

  // Initialize responsive state
  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth <= 768));
      dispatch(setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Fetch problem data
  useEffect(() => {
    if (contestId && problemId) {
      dispatch(fetchProblem({ contestId, problemId }));
    }
  }, [contestId, problemId, dispatch]);

  // Update test cases when execution result changes
  useEffect(() => {
    if (executionResult) {
      const updatedTestCases = testCases.map((tc, idx) => {
        const result = executionResult.results[idx];
        if (!result) return tc;
        
        return {
          ...tc,
          actualOutput: result.actualOutput,
          status: result.passed ? 'passed' as const : 'failed' as const,
          time: result.time,
          memory: result.memory
        };
      });
      
      dispatch(updateTestCases(updatedTestCases));
    }
  }, [executionResult, testCases, dispatch]);

  // Handle submission success
  useEffect(() => {
    if (isSubmitting === false && executionResult?.allPassed) {
      toast.success('Congratulations! Your solution has been submitted successfully.');
    }
  }, [isSubmitting, executionResult]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="flex justify-around items-center p-4 bg-gray-900">
          <button
            className={`text-white ${activeView === 'problem' ? 'font-bold' : ''}`}
            onClick={() => dispatch(setActiveView('problem'))}
          >
            Problem
          </button>
          <button
            className={`text-white ${activeView === 'ide' ? 'font-bold' : ''}`}
            onClick={() => dispatch(setActiveView('ide'))}
          >
            IDE
          </button>
        </nav>
      )}

      <div className="flex h-full overflow-hidden bg-gray-800">
        {/* Problem Section */}
        {!isFullScreen && (!isMobile || activeView === 'problem') && (
          <div className={`p-4 ${isMobile ? 'w-full' : 'w-1/2'} overflow-auto h-screen`}>
            <div className="lg:h-full sm:h-screen pr-4">
              <ProblemDisplay contestId={contestId} />
            </div>
          </div>
        )}

        {/* Editor Section */}
        {(!isMobile || activeView === 'ide') && (
          <div className={`p-4 ${isMobile || isFullScreen ? 'w-full' : 'w-1/2'} overflow-auto h-screen`}>
            <EditorToolbar contestId={contestId} problemId={problemId} />
            <SettingsModal />
            <CodeEditorComponent />
            <TestResults />
          </div>
        )}
      </div>
    </div>
  );
};

export default Compiler;