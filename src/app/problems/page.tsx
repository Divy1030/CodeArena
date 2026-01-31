'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Contest interface
interface Contest {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
}

// Problem interface
interface Problem {
  _id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  maxScore: number;
  timeLimit: number;
  memoryLimit: number;
  createdAt: string;
}

// Extended problem with contest info and solved status
interface ExtendedProblem extends Problem {
  contestId: string;
  contestTitle: string;
  isSolved: boolean;
}

type DifficultyFilter = 'all' | 'easy' | 'medium' | 'hard';
type TimeFilter = 'all' | 'week' | 'month';
type StatusFilter = 'all' | 'solved' | 'unsolved';

const ProblemsPage: React.FC = () => {
  const router = useRouter();
  const [problems, setProblems] = useState<ExtendedProblem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState<boolean>(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const problemsPerPage = 20;

  // Fetch problems from past contests only
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        // Get user data for solved problems
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          // Extract problemIds from solvedProblems array (which contains objects with problemId field)
          const solvedIds = (userData.solvedProblems || []).map((sp: any) => 
            typeof sp === 'string' ? sp : (sp.problemId || sp._id)
          );
          setSolvedProblems(solvedIds);
        }

        // Fetch all contests
        const response = await fetch('/api/contest/getAllContests', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch contests');
        }

        const contests = data.data || [];
        const now = new Date();
        
        // Filter to only past contests (endTime < now)
        const pastContests = contests.filter((contest: Contest) => {
          const endTime = new Date(contest.endTime);
          return endTime < now;
        });

        // Extract problems from past contests
        const allProblems: ExtendedProblem[] = [];
        pastContests.forEach((contest: Contest) => {
          if (contest.problems && Array.isArray(contest.problems)) {
            contest.problems.forEach((problem: Problem) => {
              allProblems.push({
                ...problem,
                contestId: contest._id,
                contestTitle: contest.title,
                isSolved: false, // Will be updated below
              });
            });
          }
        });

        setProblems(allProblems);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [router]);

  // Listen for userDataUpdated event to update solved problems
  useEffect(() => {
    const handleUserDataUpdate = () => {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        // Extract problemIds from solvedProblems array
        const solvedIds = (userData.solvedProblems || []).map((sp: any) => 
          typeof sp === 'string' ? sp : (sp.problemId || sp._id)
        );
        setSolvedProblems(solvedIds);
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUserDataUpdate);
  }, []);

  // Get all unique tags from problems
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    problems.forEach(problem => {
      problem.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [problems]);

  // Filter problems based on all criteria
  const filteredProblems = useMemo(() => {
    let filtered = problems.map(problem => ({
      ...problem,
      isSolved: solvedProblems.includes(problem._id),
    }));

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(problem => {
        return problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.contestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      });
    }
    
    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === difficultyFilter);
    }

    // Time filter (week/month)
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (timeFilter === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (timeFilter === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      }
      
      filtered = filtered.filter(problem => {
        const createdAt = new Date(problem.createdAt);
        return createdAt >= cutoffDate;
      });
    }
    
    // Status filter (solved/unsolved)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(problem => {
        if (statusFilter === 'solved') return problem.isSolved;
        if (statusFilter === 'unsolved') return !problem.isSolved;
        return true;
      });
    }
    
    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(problem => 
        selectedTags.every(tag => problem.tags?.includes(tag))
      );
    }
    
    return filtered;
  }, [problems, searchQuery, difficultyFilter, timeFilter, statusFilter, selectedTags, solvedProblems]);

  // Pagination
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * problemsPerPage;
    return filteredProblems.slice(startIndex, startIndex + problemsPerPage);
  }, [filteredProblems, currentPage, problemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, difficultyFilter, timeFilter, statusFilter, selectedTags]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleProblemClick = (contestId: string, problemId: string, isSolved: boolean) => {
    // Always navigate to standalone practice mode editor
    // It will load the previous solution if the problem is already solved
    router.push(`/problems/solve/${contestId}/${problemId}`);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('all');
    setTimeFilter('all');
    setStatusFilter('all');
    setSelectedTags([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121B38] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading problems...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121B38] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121B38]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm mb-2">
          <button 
            onClick={() => router.push('/user/home')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Home
          </button>
          <span className="text-gray-600">/</span>
          <span className="text-white">Problems</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Practice Problems</h1>
          <p className="text-gray-400">Solve problems from past contests to improve your skills and rating</p>
        </div>

        {/* Filters Section */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <svg 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search problems, contests, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Time Filter */}
            <div>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="solved">Solved</option>
                <option value="unsolved">Unsolved</option>
              </select>
            </div>

            {/* Tags Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 hover:border-blue-500 flex items-center gap-2"
              >
                <span>Tags {selectedTags.length > 0 && `(${selectedTags.length})`}</span>
                <svg className={`w-4 h-4 transition-transform ${showTagsDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showTagsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-700 rounded-lg border border-gray-600 shadow-xl z-50 max-h-64 overflow-y-auto">
                  {allTags.length === 0 ? (
                    <div className="p-3 text-gray-400 text-sm">No tags available</div>
                  ) : (
                    <div className="p-2">
                      {allTags.map(tag => (
                        <label
                          key={tag}
                          className="flex items-center gap-2 p-2 hover:bg-gray-600 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                            className="w-4 h-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 bg-gray-600"
                          />
                          <span className="text-white text-sm">{tag}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {(searchQuery || difficultyFilter !== 'all' || timeFilter !== 'all' || statusFilter !== 'all' || selectedTags.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="text-gray-400 hover:text-white text-sm underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-700">
              {selectedTags.map(tag => (
                <span
                  key={tag}
                  className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleTagToggle(tag)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-400">
            Showing {paginatedProblems.length} of {filteredProblems.length} problems
            {filteredProblems.length > 0 && (
              <span className="ml-2 text-green-400">
                ({filteredProblems.filter(p => p.isSolved).length} solved)
              </span>
            )}
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-green-500">Easy: {filteredProblems.filter(p => p.difficulty === 'easy').length}</span>
            <span className="text-yellow-500">Medium: {filteredProblems.filter(p => p.difficulty === 'medium').length}</span>
            <span className="text-red-500">Hard: {filteredProblems.filter(p => p.difficulty === 'hard').length}</span>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-700 p-4 text-gray-300 font-medium text-sm">
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Contest</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-1 text-center">Difficulty</div>
            <div className="col-span-2 text-center">Action</div>
          </div>

          {/* Problems List */}
          <div className="divide-y divide-gray-700">
            {paginatedProblems.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                {problems.length === 0 ? (
                  <>
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No past contest problems available yet.</p>
                    <p className="text-sm mt-2">Problems will appear here after contests end.</p>
                  </>
                ) : (
                  'No problems found matching your criteria'
                )}
              </div>
            ) : (
              paginatedProblems.map((problem, index) => (
                <div
                  key={`${problem.contestId}-${problem._id}`}
                  className="grid grid-cols-12 p-4 items-center hover:bg-gray-700/50 transition-colors"
                >
                  {/* Status */}
                  <div className="col-span-1 text-center">
                    {problem.isSolved ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-500 rounded-full mx-auto" />
                    )}
                  </div>

                  {/* Title */}
                  <div className="col-span-4">
                    <span className="text-gray-500 mr-2">{(currentPage - 1) * problemsPerPage + index + 1}.</span>
                    <span className="text-white">{problem.title}</span>
                    {problem.isSolved && (
                      <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                        Solved
                      </span>
                    )}
                  </div>

                  {/* Contest */}
                  <div className="col-span-2">
                    <span className="text-gray-400 text-sm">{problem.contestTitle}</span>
                  </div>

                  {/* Tags */}
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags?.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {problem.tags?.length > 2 && (
                        <span className="text-gray-500 text-xs">+{problem.tags.length - 2}</span>
                      )}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="col-span-1 text-center">
                    <span className={`px-2 py-1 rounded text-xs border capitalize ${getDifficultyBadge(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 text-center">
                    <button
                      onClick={() => handleProblemClick(problem.contestId, problem._id, problem.isSolved)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        problem.isSolved
                          ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {problem.isSolved ? 'View Solution' : 'Solve Problem'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Click outside handler for tags dropdown */}
      {showTagsDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowTagsDropdown(false)}
        />
      )}
    </div>
  );
};

export default ProblemsPage;
