import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { lintGutter } from '@codemirror/lint';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCode } from '@/store/slices/editorSlice';

const CodeEditorComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { code, language, theme, fontSize } = useAppSelector(state => state.editor);

  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript':
        return javascript();
      case 'java':
        return java();
      case 'cpp':
        return cpp();
      case 'python':
        return python();
      default:
        return python();
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg h-96 mb-4 overflow-auto">
      <CodeMirror
        value={code}
        extensions={[getLanguageExtension(), lintGutter()]}
        onChange={(value) => dispatch(setCode(value))}
        theme={theme}
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
};

export default CodeEditorComponent;