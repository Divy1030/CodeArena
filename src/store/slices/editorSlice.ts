import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EditorState {
  code: string;
  language: string;
  theme: 'dark' | 'light' | 'none';
  fontSize: number;
  isFullScreen: boolean;
  showSettings: boolean;
  activeView: 'problem' | 'ide';
  isMobile: boolean;
  isTablet: boolean;
}

const initialState: EditorState = {
  code: `def is_palindrome(s):
  # Write your solution here
  # Only consider alphanumeric characters and ignore case
  
  return True

# Do not modify the code below
print(str(is_palindrome(input())).lower())`,
  language: 'python',
  theme: 'dark',
  fontSize: 14,
  isFullScreen: false,
  showSettings: false,
  activeView: 'problem',
  isMobile: false,
  isTablet: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light' | 'none'>) => {
      state.theme = action.payload;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    toggleFullScreen: (state) => {
      state.isFullScreen = !state.isFullScreen;
    },
    toggleSettings: (state) => {
      state.showSettings = !state.showSettings;
    },
    setActiveView: (state, action: PayloadAction<'problem' | 'ide'>) => {
      state.activeView = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setIsTablet: (state, action: PayloadAction<boolean>) => {
      state.isTablet = action.payload;
    },
    resetCode: (state) => {
      const templates = {
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
      state.code = templates[state.language as keyof typeof templates] || templates.python;
    },
  },
});

export const {
  setCode,
  setLanguage,
  setTheme,
  setFontSize,
  toggleFullScreen,
  toggleSettings,
  setActiveView,
  setIsMobile,
  setIsTablet,
  resetCode,
} = editorSlice.actions;

export default editorSlice.reducer;