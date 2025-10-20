import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SecuritySettingsProps {
  onPasswordChange: (oldPassword: string, newPassword: string) => Promise<boolean>;
  isGoogleAccount: boolean;
  hasPassword: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ 
  onPasswordChange, 
  isGoogleAccount, 
  hasPassword 
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreatingPassword, setIsCreatingPassword] = useState(!hasPassword && isGoogleAccount);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation for creating new password (Google users without password)
    if (isCreatingPassword) {
      if (!newPassword || !confirmPassword) {
        setError('Both password fields are required');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      setLoading(true);
      
      try {
        // Get token from localStorage for authentication
        const token = localStorage.getItem('token');
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/user/create-password', {
          method: 'POST',
          headers,
          body: JSON.stringify({ newPassword }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          toast.success('Password created successfully! You can now use it to login.');
          setNewPassword('');
          setConfirmPassword('');
          setIsCreatingPassword(false);
          // Refresh the page to update the component state
          window.location.reload();
        } else {
          setError(result.message || 'Failed to create password');
          toast.error(result.message || 'Failed to create password');
        }
      } catch (err) {
        console.error('Error creating password:', err);
        const errorMessage = 'An error occurred while creating password';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
      return;
    }
    
    // Validation for changing existing password
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await onPasswordChange(oldPassword, newPassword);
      
      if (success) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };
  
  // Render different content based on account type and password status
  if (isGoogleAccount && !hasPassword) {
    return (
      <div className="bg-[#121B38] rounded-xl p-6">
        <h3 className="text-lg font-medium mb-6 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-green-400" />
          Create Password
        </h3>
        
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-400">
            You signed in with Google. Create a password to enable traditional login as well.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </span>
              ) : (
                'Create Password'
              )}
            </button>
            
            <p className="text-xs text-gray-400 text-center">
              After creating a password, you can use both Google login and email/password login.
            </p>
          </div>
        </form>
      </div>
    );
  }
  
  if (isGoogleAccount && hasPassword) {
    return (
      <div className="bg-[#121B38] rounded-xl p-6">
        <h3 className="text-lg font-medium mb-6 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-blue-400" />
          Security Settings
        </h3>
        
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm text-green-400">
            ✓ Google Account with Password Protection
          </p>
          <p className="text-xs text-gray-400 mt-1">
            You can now login using either Google or your email/password.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  disabled={loading}
                >
                  {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={loading}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Updating...
                </span>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  // Regular email/password account
  return (
    <div className="bg-[#121B38] rounded-xl p-6">
      <h3 className="text-lg font-medium mb-6 flex items-center">
        <Lock className="w-5 h-5 mr-2 text-blue-400" />
        Security Settings
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                className="w-full px-3 py-2 bg-[#0f172a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => setShowOldPassword(!showOldPassword)}
                disabled={loading}
              >
                {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full px-3 py-2 bg-[#0f172a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={loading}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-3 py-2 bg-[#0f172a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Updating...
              </span>
            ) : (
              'Change Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;