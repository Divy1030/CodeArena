"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Play, Settings, Trophy, Award, Maximize2, Minimize2, Clock, AlertCircle } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { linter, lintGutter, Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import Modal from '@/components/editor/Modal';
// import Navbar from '@/components/common/Navbar';

interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status: 'pending' | 'passed' | 'failed';
  time?: string;
  memory?: number;
}

interface LintResult {
  line: number;
  endLine?: number;
  severity: string | number;
  message: string;
}

interface ExecutionResult {
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

const Compiler: React.FC = () => {
  const searchParams = useSearchParams();
  const questionId = searchParams.get('problemId');
  const contestId = searchParams.get('contestId');
  const encodedProblemData = searchParams.get('problemData');

  // Define problem data structure
  interface ProblemData {
    id: string;
    title: string;
    difficulty: string;
    statement?: string;
    testCases?: {
      input: string;
      output: string;
      explanation?: string;
      _id?: string;
    }[];
  }

  // Parse problem data from URL
  useEffect(() => {
    if (encodedProblemData) {
      try {
        const decodedData: ProblemData = JSON.parse(decodeURIComponent(encodedProblemData));
        
        // Update problem data
        setProblemData({
          title: decodedData.title || "Problem",
          difficulty: decodedData.difficulty || "Medium",
          timeEstimate: "30 mins", // Default or calculate based on difficulty
          points: getDifficultyPoints(decodedData.difficulty), // Helper function to assign points
          description: decodedData.statement || "No description provided.",
          examples: decodedData.testCases?.slice(0, 3).map((tc, idx) => ({
            input: tc.input,
            output: tc.output,
            explanation: tc.explanation || "No explanation provided."
          })) || [],
          constraints: ["1 ≤ s.length ≤ 2 * 10^5"], // Default constraints
          followUp: "Could you optimize your solution further?"
        });
        
        // Update test cases based on problem data
        if (decodedData.testCases && decodedData.testCases.length > 0) {
          const formattedTestCases: TestCase[] = decodedData.testCases.map((tc, idx) => ({
            id: idx + 1,
            input: tc.input,
            expectedOutput: tc.output,
            status: 'pending'
          }));
          setTestCases(formattedTestCases);
          setSelectedTestCase(formattedTestCases[0]);
        }
      } catch (error) {
        console.error('Error parsing problem data:', error);
      }
    }
  }, [encodedProblemData]);

  // Helper function to assign points based on difficulty
  const getDifficultyPoints = (difficulty: string = 'medium'): number => {
    const difficultyLower = difficulty.toLowerCase();
    if (difficultyLower === 'easy') return 100;
    if (difficultyLower === 'hard') return 300;
    return 200; // medium or default
  };

  // Initial code templates for different languages
  const initialCodeTemplates = {
    javascript: `function isPalindrome(s) {
  // Write your solution here
  // Only consider alphanumeric characters and ignore case
  
  return true;
}

// Do not modify the code below
const s = readline();
console.log(isPalindrome(s));`,
    python: `def is_palindrome(s):
  # Write your solution here
  # Only consider alphanumeric characters and ignore case
  
  return True

# Do not modify the code below
print(str(is_palindrome(input())).lower())`,
    java: `import java.util.*;

public class Solution {
  public static boolean isPalindrome(String s) {
    // Write your solution here
    // Only consider alphanumeric characters and ignore case
    
    return true;
  }
  
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    String s = scanner.nextLine();
    System.out.println(isPalindrome(s));
  }
}`,
    cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
  // Write your solution here
  // Only consider alphanumeric characters and ignore case
  
  return true;
}

int main() {
  string s;
  getline(cin, s);
  cout << (isPalindrome(s) ? "true" : "false") << endl;
  return 0;
}`
  };

  const testCasesData: TestCase[] = [
    {
      id: 1,
      input: "A man, a plan, a canal: Panama",
      expectedOutput: "true",
      status: 'pending'
    },
    {
      id: 2,
      input: "race a car",
      expectedOutput: "false",
      status: 'pending'
    },
    {
      id: 3,
      input: "No lemon, no melon",
      expectedOutput: "true",
      status: 'pending'
    },
    {
      id: 4,
      input: " ",
      expectedOutput: "true",
      status: 'pending'
    }
  ];

  // Update the problem data
  const [problemData, setProblemData] = useState<any>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);

  useEffect(() => {
    if (encodedProblemData) {
      try {
        const decodedData: ProblemData = JSON.parse(decodeURIComponent(encodedProblemData));
        setProblemData({
          title: decodedData.title || "Problem",
          difficulty: decodedData.difficulty || "Medium",
          timeEstimate: "30 mins",
          points: getDifficultyPoints(decodedData.difficulty),
          description: decodedData.statement || "No description provided.",
          examples: decodedData.testCases?.slice(0, 3).map((tc, idx) => ({
            input: tc.input,
            output: tc.output,
            explanation: tc.explanation || "No explanation provided."
          })) || [],
          constraints: ["1 ≤ s.length ≤ 2 * 10^5"],
          followUp: "Could you optimize your solution further?"
        });
        if (decodedData.testCases && decodedData.testCases.length > 0) {
          const formattedTestCases: TestCase[] = decodedData.testCases.map((tc, idx) => ({
            id: idx + 1,
            input: tc.input,
            expectedOutput: tc.output,
            status: 'pending'
          }));
          setTestCases(formattedTestCases);
          setSelectedTestCase(formattedTestCases[0]);
        }
      } catch (error) {
        console.error('Error parsing problem data:', error);
      }
    }
  }, [encodedProblemData]);

  const [code, setCode] = useState<string>(initialCodeTemplates.python);
  const [theme, setTheme] = useState<'dark' | 'light' | 'none'>('dark');
  const [fontSize, setFontSize] = useState<number>(14);
  const [language, setLanguage] = useState<Extension>(python());
  const [languageName, setLanguageName] = useState<string>('python');
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'problem' | 'ide'>('problem');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);

  // Initialize window size state after component mounts to avoid SSR issues
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);

    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch problem data based on URL params
  useEffect(() => {
    if (questionId && contestId) {
      // In a real app, you would fetch the specific problem data here
      console.log(`Loading question ID: ${questionId} from contest: ${contestId}`);
      
      // For demo purposes, we're using the hardcoded data
      // But you would replace this with an API call
    }
  }, [questionId, contestId]);

  const resetCode = (): void => {
    setCode(initialCodeTemplates[languageName as keyof typeof initialCodeTemplates]);
  };

  const runCode = async () => {
    setIsRunning(true);
    setExecutionError(null);
    
    try {
      // Format test cases for the API
      const formattedTestCases = testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput
      }));
      
      // Create the request payload
      const requestPayload = {
        code,
        language: languageName,
        testCases: formattedTestCases
      };
      
      // Log the request payload
      console.log('Sending code execution request:', requestPayload);
      
      // Call the API
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });
      
      console.log('API Response status:', response.status);
      const result = await response.json();
      console.log('API Response data:', result);
      
      if (!result.success) {
        setExecutionError(result.message || 'Code execution failed');
        // Reset test cases to pending
        setTestCases(testCases.map(tc => ({...tc, status: 'pending', actualOutput: undefined})));
      } else {
        setExecutionResult(result.data);
        
        // Update test cases with results
        const updatedTestCases = testCases.map((tc, index) => {
          // Find the matching result by index
          const resultData = result.data.results[index];
          
          return {
            ...tc,
            status: resultData.passed ? 'passed' : 'failed',
            actualOutput: resultData.actualOutput,
            time: resultData.time,
            memory: resultData.memory
          } as TestCase;
        });
        
        setTestCases(updatedTestCases);
        
        // Update selected test case if it's in the results
        if (selectedTestCase) {
          const updatedSelectedTestCase = updatedTestCases.find(tc => tc.id === selectedTestCase.id);
          if (updatedSelectedTestCase) {
            setSelectedTestCase(updatedSelectedTestCase);
          }
        }
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setExecutionError('Network error or server unavailable');
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = async () => {
    setIsSubmitting(true);
    setExecutionError(null);
    
    try {
      // Format test cases for the API
      const formattedTestCases = testCases.map(tc => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput
      }));
      
      // Call the API
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: languageName,
          testCases: formattedTestCases
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        setExecutionError(result.message || 'Submission failed');
      } else {
        setExecutionResult(result.data);
        
        // Update test cases with results
        const updatedTestCases = testCases.map((tc, index) => {
          const resultData = result.data.results[index];
          return {
            ...tc,
            status: resultData.passed ? 'passed' : 'failed',
            actualOutput: resultData.actualOutput,
            time: resultData.time,
            memory: resultData.memory
          } as TestCase;
        });
        
        setTestCases(updatedTestCases);
        
        // Auto-select the first failed test case or keep current selection
        const failedTestCase = updatedTestCases.find(tc => tc.status === 'failed');
        if (failedTestCase) {
          setSelectedTestCase(failedTestCase);
        }
        
        // Show alert with submission result
        if (result.data.allPassed) {
          alert('Congratulations! All test cases passed. Your solution has been submitted.');
        } else {
          alert('Some test cases failed. Please review your solution and try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      setExecutionError('Network error or server unavailable');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFullScreen = (): void => {
    setIsFullScreen(!isFullScreen);
  };

  const toggleSettings = (): void => {
    setShowSettings(!showSettings);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setTheme(e.target.value as 'dark' | 'light' | 'none');
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFontSize(Number(e.target.value));
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const lang = e.target.value;
    setLanguageName(lang);
    
    // Set code template for the selected language
    setCode(initialCodeTemplates[lang as keyof typeof initialCodeTemplates]);
    
    switch (lang) {
      case 'javascript':
        setLanguage(javascript());
        break;
      case 'java':
        setLanguage(java());
        break;
      case 'cpp':
        setLanguage(cpp());
        break;
      case 'python':
        setLanguage(python());
        break;
      default:
        setLanguage(javascript());
    }
  };
  
  const lintJavaScript = async (view: EditorView): Promise<Diagnostic[]> => {
    // Mock linter - in a real app you'd use a real linter like ESLint
    const results: LintResult[] = [];
    // Simulating results from a linter
    const diagnostics: Diagnostic[] = results.map((msg) => ({
      from: view.state.doc.line(msg.line).from,
      to: view.state.doc.line(msg.endLine || msg.line).to,
      severity: msg.severity === 2 ? 'error' : 'warning',
      message: msg.message,
    }));
    return diagnostics;
  };

  const lintPython = async (view: EditorView): Promise<Diagnostic[]> => {
    // In development/testing, don't actually make the API call
    if (process.env.NODE_ENV === 'development') {
      console.log('Linting Python code (mock)');
      return [];
    }
    
    const code = view.state.doc.toString();
    try {
      const response = await fetch('https://python-lint-api.example.com/lint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const results: LintResult[] = await response.json();
      const diagnostics: Diagnostic[] = results.map((msg) => ({
        from: view.state.doc.line(msg.line).from,
        to: view.state.doc.line(msg.endLine || msg.line).to,
        severity: msg.severity === 'error' ? 'error' : 'warning',
        message: msg.message,
      }));
      return diagnostics;
    } catch (error) {
      console.error('Error linting Python code:', error);
      return [];
    }
  };

  const lintJava = async (view: EditorView): Promise<Diagnostic[]> => {
    // Mock implementation
    return [];
  };

  const lintCpp = async (view: EditorView): Promise<Diagnostic[]> => {
    // Mock implementation
    return [];
  };

  const lint = linter((view) => {
    if (languageName === 'javascript') {
      return lintJavaScript(view);
    } else if (languageName === 'python') {
      return lintPython(view);
    } else if (languageName === 'java') {
      return lintJava(view);
    } else if (languageName === 'cpp') {
      return lintCpp(view);
    } else {
      return Promise.resolve([]);
    }
  });
  
  return (
    <div className={`min-h-screen bg-gray-900 text-white ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Navigation Bar */}
      {/* <Navbar isAuthenticated={true} isAdmin={false} /> */}

      {/* Mobile Navbar */}
      {isMobile && (
        <nav className="flex justify-around items-center p-4 bg-gray-900">
          <button
            className={`text-white ${activeView === 'problem' ? 'font-bold' : ''}`}
            onClick={() => setActiveView('problem')}
          >
            Problem
          </button>
          <button
            className={`text-white ${activeView === 'ide' ? 'font-bold' : ''}`}
            onClick={() => setActiveView('ide')}
          >
            IDE
          </button>
        </nav>
      )}

      {/* Main Content */}
      <div className="flex h-full overflow-hidden bg-gray-800">
        {/* Problem Description Section */}
        {!isFullScreen && (!isMobile || activeView === 'problem') && (
          <div className={`p-4 ${isMobile ? 'w-full' : 'w-1/2'} overflow-auto h-screen`}>
            <div className="lg:h-full sm:h-screen pr-4">
              <div className="bg-gray-900 p-4 rounded-lg mb-4 overflow-y-auto max-h-screen">
                <div className="flex justify-between items-center mb-4 gap-2">
                  <h1 className="text-xl font-semibold">{problemData.title}</h1>
                  <div className="flex items-center gap-4">
                    <span className="text-red-500 px-2 py-1 rounded text-sm bg-red-900">{problemData.difficulty}</span>
                    <div className='flex items-center gap-1'>
                      <Clock size={16} className="text-white" />
                      <span className="text-gray-400">{problemData.timeEstimate}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Trophy size={16} className="text-white" />
                      <span className="text-gray-400">{problemData.points} points</span>
                    </div>
                  </div>
                </div>
                <h2 className="font-semibold mb-2">Problem Description</h2>
                <p className="text-gray-400 mb-4">
                  {problemData.description}
                </p>

                {problemData.examples.map((example: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-2">Example {index + 1}:</h3>
                    <div className="bg-gray-700 p-4 rounded mb-4">
                      <p className="text-white">
                        Input: {example.input}
                        <br />
                        Output: {example.output}
                        <br />
                        Explanation: {example.explanation}
                      </p>
                    </div>
                  </div>
                ))}

                <h3 className="font-semibold mb-2">Constraints:</h3>
                <ul className="text-gray-400 list-disc pl-4 mb-4">
                  {problemData.constraints.map((constraint: string, index: number) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>

                {problemData.followUp && (
                  <>
                    <h3 className="font-semibold mb-2">Follow-up:</h3>
                    <p className="text-gray-400 mb-4">
                      {problemData.followUp}
                    </p>
                  </>
                )}
              </div>

              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <h2 className="font-semibold mb-4">Weekly Contest #{contestId || '123'}</h2>
                <div className="flex justify-between gap-4">
                  <div className="flex-1 flex items-center gap-2 bg-gray-700 p-4 rounded-lg">
                    <Award size={16} className="text-blue-400" />
                    <div>
                      <div className="text-sm text-white">Current Rank</div>
                      <div className="text-xl font-bold">#42</div>
                      <div className="text-sm text-white">out of 1,234 participants</div>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-2 bg-gray-700 p-4 rounded-lg">
                    <Trophy size={16} className="text-yellow-300" />
                    <div>
                      <div className="text-sm text-white">Total Score</div>
                      <div className="text-xl font-bold">250</div>
                      <div className="text-sm text-white">points earned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Editor Section */}
        {(!isMobile || activeView === 'ide') && (
          <div className={`p-4 ${isMobile || isFullScreen ? 'w-full' : 'w-1/2'} overflow-auto h-screen`}>
            <div className="flex items-center justify-between mb-4">
              <select 
                className="text-gray-400 bg-gray-800 border border-gray-600 rounded p-2" 
                onChange={handleLanguageChange}
                value={languageName}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              <div className="flex items-center gap-4">
                {!isMobile && <Settings size={16} className="text-white cursor-pointer" onClick={toggleSettings} />}
                {!isMobile && (isFullScreen ? (
                  <Minimize2 size={16} className="text-white cursor-pointer" onClick={toggleFullScreen} />
                ) : (
                  <Maximize2 size={16} className="text-white cursor-pointer" onClick={toggleFullScreen} />
                ))}
                <button 
                  className={`flex items-center gap-2 px-4 py-2 rounded ${isRunning ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  onClick={runCode}
                  disabled={isRunning}
                >
                  <Play size={16} />
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <button 
                  className={`px-4 py-2 rounded ${isSubmitting ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}
                  onClick={submitSolution}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Solution'}
                </button>
              </div>
            </div>

            <Modal isOpen={showSettings} onClose={toggleSettings}>
              <div className="mb-4">
                <label className="text-gray-400">Theme:</label>
                <select value={theme} onChange={handleThemeChange} className="ml-2 bg-gray-800 border border-gray-600 rounded p-2">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400">Font Size:</label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  className="ml-2 w-16 bg-gray-800 border border-gray-600 rounded p-2"
                />
              </div>
              <div className="mt-4">
                <button 
                  onClick={resetCode}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reset Code
                </button>
              </div>
            </Modal>

            <div className="bg-gray-900 p-4 rounded-lg h-96 mb-4 overflow-auto">
              <CodeMirror
                value={code}
                extensions={[language, lint, lintGutter()]}
                onChange={(value) => {
                  setCode(value);
                }}
                theme={theme}
                style={{ fontSize: `${fontSize}px` }}
              />
            </div>

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
                      onClick={() => setSelectedTestCase(testCase)}
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
                    <div className="text-gray-500">
                      No test case selected.
                    </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Compiler;