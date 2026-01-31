'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setIsMobile, setIsTablet, setActiveView, setCode, setLanguage } from '@/store/slices/editorSlice';
import { fetchProblem } from '@/store/slices/problemSlice';
import toast from 'react-hot-toast';

// Components
import ProblemDisplay from '@/components/editor/ProblemDisplay';
import EditorToolbar from '@/components/editor/EditorToolbar';
import SettingsModal from '@/components/editor/SettingsModal';
import TestResults from '@/components/editor/TestResults';
import CodeEditorComponent from '@/components/editor/CodeEditorComponent';
import PreviousSolutionBanner from '@/components/editor/PreviousSolutionBanner';

export default function SolveProblemPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const contestId = params?.contestId as string;
  const problemId = params?.problemId as string;

  const { isFullScreen, activeView, isMobile } = useAppSelector(state => state.editor);
  const { problemData, loading, userSolution, hasSolved } = useAppSelector(state => state.problem);
  const { executionResult, isSubmitting } = useAppSelector(state => state.execution);

  // Track previous isSubmitting state to detect submission completion
  const [prevIsSubmitting, setPrevIsSubmitting] = React.useState(false);
  const [isSolved, setIsSolved] = React.useState(false);
  const [fromSource, setFromSource] = React.useState<string | null>(null);

  // Check navigation source from sessionStorage
  useEffect(() => {
    const source = sessionStorage.getItem('practiceModeSource');
    setFromSource(source);
    console.log('🔍 Navigation source from sessionStorage:', source);
  }, []);

  // Check if problem is solved by checking user's solvedProblems array
  const checkIfSolved = React.useCallback(() => {
    try {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr && problemId) {
        const userData = JSON.parse(userDataStr);
        const solvedProblems = userData.solvedProblems || [];
        
        // Check if current problemId is in solvedProblems array
        const solved = solvedProblems.some((sp: any) => {
          const spId = typeof sp === 'string' ? sp : sp.problemId || sp._id;
          return spId === problemId;
        });
        
        console.log('🔍 Checking solved status:', {
          problemId,
          totalSolved: solvedProblems.length,
          isSolved: solved
        });
        
        setIsSolved(solved);
      }
    } catch (error) {
      console.error('Error checking solved status:', error);
    }
  }, [problemId]);

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
      checkIfSolved();
    }
  }, [contestId, problemId, dispatch, checkIfSolved]);

  // Listen for userDataUpdated event to refresh problem state
  useEffect(() => {
    const handleUserDataUpdate = () => {
      console.log('🔄 Practice mode: User data updated, refreshing solved status');
      // Check solved status from updated localStorage
      checkIfSolved();
      // Refetch problem to update solution data
      if (contestId && problemId) {
        dispatch(fetchProblem({ contestId, problemId }));
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUserDataUpdate);
  }, [contestId, problemId, dispatch, checkIfSolved]);

  // Load user's previous solution into editor if it exists
  useEffect(() => {
    if (userSolution && userSolution.solutionCode && userSolution.languageUsed) {
      console.log('📝 Loading previous solution into editor:', {
        language: userSolution.languageUsed,
        codeLength: userSolution.solutionCode.length
      });
      dispatch(setCode(userSolution.solutionCode));
      dispatch(setLanguage(userSolution.languageUsed));
    }
  }, [userSolution, dispatch]);

  // Handle submission success - only show toast on NEW submission completion
  useEffect(() => {
    // Check if submission just completed (was submitting, now not submitting)
    const justFinishedSubmitting = prevIsSubmitting === true && isSubmitting === false;
    
    if (justFinishedSubmitting && executionResult?.total !== undefined && executionResult?.total !== null && executionResult?.total > 0 && executionResult?.passed === executionResult?.total) {
      toast.success('🎉 Congratulations! Problem solved in practice mode. Rating updated!');
      
      // Force check solved status after a short delay to allow localStorage update
      setTimeout(() => {
        console.log('⏱️ Delayed check of solved status after submission');
        checkIfSolved();
      }, 1000);
    }
    
    // Update previous state
    setPrevIsSubmitting(isSubmitting);
  }, [isSubmitting, executionResult?.passed, executionResult?.total, prevIsSubmitting, checkIfSolved]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Practice Mode Header */}
      <div className="bg-[#0f172a] border-b border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {fromSource !== 'profile' && (
              <>
                <button 
                  onClick={() => {
                    sessionStorage.removeItem('practiceModeSource');
                    router.push('/problems');
                  }}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Problems
                </button>
                <span className="text-gray-600">|</span>
              </>
            )}
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
              Practice Mode
            </span>
            {isSolved && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Solved
              </span>
            )}
          </div>
          {problemData && (
            <div className="text-sm text-gray-400">
              {problemData.title}
            </div>
          )}
        </div>
      </div>

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
            {userSolution && hasSolved && problemData && (
              <PreviousSolutionBanner 
                userSolution={userSolution} 
                maxScore={problemData.points} 
              />
            )}
            <EditorToolbar contestId={contestId} problemId={problemId} isStandalone={true} />
            <SettingsModal />
            <CodeEditorComponent />
            <TestResults />
          </div>
        )}
      </div>
    </div>
  );
}
