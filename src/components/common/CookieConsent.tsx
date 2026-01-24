"use client";

import React, { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  advertising: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: true,
    analytics: true,
    advertising: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const saveCookieConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // You can add analytics tracking here
    if (prefs.analytics && typeof window !== 'undefined') {
      // Initialize analytics
      console.log('Analytics enabled');
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      advertising: true,
    };
    setPreferences(allAccepted);
    saveCookieConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      advertising: false,
    };
    setPreferences(essentialOnly);
    saveCookieConsent(essentialOnly);
  };

  const handleSavePreferences = () => {
    saveCookieConsent(preferences);
  };

  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 animate-slide-up">
        <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Cookie className="w-6 h-6 text-blue-400" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1">
                  We Value Your Privacy
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-3">
                  We use cookies to enhance your experience. By clicking "Accept All", you consent to our use of cookies.{' '}
                  <a href="/cookies" className="text-blue-400 hover:text-blue-300 underline">
                    Learn more
                  </a>
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleAcceptAll}
                    className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-3 py-1.5 text-sm border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-md font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Settings size={14} />
                    Customize
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                aria-label="Close cookie banner"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Cookie Preferences</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close settings"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Essential Cookies</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-400 mr-3">Always Active</span>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-not-allowed opacity-50">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    These cookies are necessary for the website to function and cannot be disabled.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Functional Cookies</h3>
                    <button
                      onClick={() => handlePreferenceChange('functional')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        preferences.functional ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.functional ? 'right-1' : 'left-1'
                      }`}></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-300">
                    These cookies enable personalized features and remember your preferences.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Analytics Cookies</h3>
                    <button
                      onClick={() => handlePreferenceChange('analytics')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        preferences.analytics ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'right-1' : 'left-1'
                      }`}></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-300">
                    These cookies help us understand how visitors interact with our website.
                  </p>
                </div>

                {/* Advertising Cookies */}
                <div className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Advertising Cookies</h3>
                    <button
                      onClick={() => handlePreferenceChange('advertising')}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        preferences.advertising ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.advertising ? 'right-1' : 'left-1'
                      }`}></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-300">
                    These cookies may be used to show you relevant advertisements.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-3 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;