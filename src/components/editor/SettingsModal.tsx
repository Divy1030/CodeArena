import React from 'react';
import Modal from './Modal';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setTheme, setFontSize, resetCode, toggleSettings } from '@/store/slices/editorSlice';

const SettingsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, fontSize, showSettings } = useAppSelector(state => state.editor);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTheme(e.target.value as 'dark' | 'light' | 'none'));
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFontSize(Number(e.target.value)));
  };

  const handleResetCode = () => {
    dispatch(resetCode());
  };

  return (
    <Modal isOpen={showSettings} onClose={() => dispatch(toggleSettings())}>
      <div className="mb-4">
        <label className="text-gray-400">Theme:</label>
        <select 
          value={theme} 
          onChange={handleThemeChange} 
          className="ml-2 bg-gray-800 border border-gray-600 rounded p-2"
        >
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
          onClick={handleResetCode}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reset Code
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;