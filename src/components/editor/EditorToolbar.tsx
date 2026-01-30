import React from 'react';
import { Play, Settings, Send, Maximize, Minimize } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLanguage, setCode, toggleSettings, toggleFullScreen } from '@/store/slices/editorSlice';
import { runCode, submitSolution } from '@/store/slices/executionSlice';

interface EditorToolbarProps {
  contestId?: string;
  problemId: string;
  isStandalone?: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ contestId, problemId, isStandalone = false }) => {
  const dispatch = useAppDispatch();
  const { language, isFullScreen, isMobile } = useAppSelector(state => state.editor);
  const { code } = useAppSelector(state => state.editor);
  const { testCases } = useAppSelector(state => state.problem);
  const { isRunning, isSubmitting } = useAppSelector(state => state.execution);

  const codeTemplates = {
    javascript: `function isPalindrome(s) {
  // Write your solution here
  return true;
}

const s = readline();
console.log(isPalindrome(s));`,
    python: `def is_palindrome(s):
  # Write your solution here
  return True

print(str(is_palindrome(input())).lower())`,
    java: `import java.util.*;

public class Solution {
  public static boolean isPalindrome(String s) {
    // Write your solution here
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
using namespace std;

bool isPalindrome(string s) {
  // Write your solution here
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
      problemId,
      contestId: contestId || '',
      isStandalone
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
        <button 
          onClick={handleRunCode}
          disabled={isRunning || isSubmitting}
          className="bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={16} />
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <button 
          onClick={handleSubmitSolution}
          disabled={isRunning || isSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        {!isMobile && (
          <button onClick={() => dispatch(toggleFullScreen())}>
            {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;