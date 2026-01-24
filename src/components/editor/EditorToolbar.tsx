import React from 'react';
import { Play, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLanguage, setCode, toggleSettings, toggleFullScreen } from '@/store/slices/editorSlice';
import { runCode, submitSolution } from '@/store/slices/executionSlice';

interface EditorToolbarProps {
  contestId: string;
  problemId: string;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ contestId, problemId }) => {
  const dispatch = useAppDispatch();
  const { language, isFullScreen, isMobile } = useAppSelector(state => state.editor);
  const { code } = useAppSelector(state => state.editor);
  const { testCases } = useAppSelector(state => state.problem);
  const { problemData } = useAppSelector(state => state.problem);
  const { isRunning, isSubmitting } = useAppSelector(state => state.execution);

  const codeTemplates = {
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    dispatch(setLanguage(newLanguage));
    dispatch(setCode(codeTemplates[newLanguage as keyof typeof codeTemplates]));
  };

  const handleRunCode = () => {
    dispatch(runCode({ code, language, testCases }));
  };

  const handleSubmitSolution = () => {
    dispatch(submitSolution({ 
      code, 
      language, 
      testCases, 
      contestId, 
      problemId, 
      problemData 
    }));
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <select 
        className="text-gray-400 bg-gray-800 border border-gray-600 rounded p-2" 
        onChange={handleLanguageChange}
        value={language}
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>
      
      <div className="flex items-center gap-4">
        {!isMobile && (
          <Settings 
            size={16} 
            className="text-white cursor-pointer" 
            onClick={() => dispatch(toggleSettings())} 
          />
        )}
        {!isMobile && (isFullScreen ? (
          <Minimize2 
            size={16} 
            className="text-white cursor-pointer" 
            onClick={() => dispatch(toggleFullScreen())} 
          />
        ) : (
          <Maximize2 
            size={16} 
            className="text-white cursor-pointer" 
            onClick={() => dispatch(toggleFullScreen())} 
          />
        ))}
        
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded ${
            isRunning ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'
          }`}
          onClick={handleRunCode}
          disabled={isRunning}
        >
          <Play size={16} />
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        
        <button 
          className={`px-4 py-2 rounded ${
            isSubmitting ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleSubmitSolution}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Solution'}
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;