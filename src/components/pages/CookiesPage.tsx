"use client";

import React from 'react';
import Link from 'next/link';

const CookiesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
        
        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
              </p>
              <p>
                This Cookie Policy explains what cookies are, how we use them, the types of cookies we use, and how you can control cookie preferences.
              </p>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
            <div className="space-y-4 text-gray-300">
              <p>CodeArena uses cookies for various purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To keep you signed in to your account</li>
                <li>To remember your preferences and settings</li>
                <li>To understand how you interact with our platform</li>
                <li>To improve our services and user experience</li>
                <li>To provide personalized content and recommendations</li>
                <li>To analyze platform performance and functionality</li>
                <li>To secure our platform and prevent fraud</li>
              </ul>
            </div>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>
            <div className="space-y-6 text-gray-300">
              {/* Essential Cookies */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">1. Essential Cookies</h3>
                <p className="mb-2">
                  These cookies are necessary for the platform to function properly. They enable core functionality such as security, authentication, and accessibility.
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Examples:</strong> Session cookies, authentication tokens, security cookies
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Duration:</strong> Session-based or up to 30 days
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Can be disabled:</strong> No (required for platform functionality)
                </p>
              </div>

              {/* Functional Cookies */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Functional Cookies</h3>
                <p className="mb-2">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences, editor settings, and language choices.
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Examples:</strong> Editor theme preferences, language settings, UI customizations
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Duration:</strong> Up to 1 year
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Can be disabled:</strong> Yes
                </p>
              </div>

              {/* Analytics Cookies */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">3. Analytics Cookies</h3>
                <p className="mb-2">
                  These cookies help us understand how users interact with our platform by collecting and reporting information anonymously. This helps us improve our services.
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Examples:</strong> Google Analytics, usage statistics, performance metrics
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Duration:</strong> Up to 2 years
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Can be disabled:</strong> Yes
                </p>
              </div>

              {/* Performance Cookies */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">4. Performance Cookies</h3>
                <p className="mb-2">
                  These cookies collect information about how you use our platform, such as which pages you visit most often and if you receive error messages.
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Examples:</strong> Load time tracking, error logging, feature usage
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Duration:</strong> Session-based or up to 6 months
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Can be disabled:</strong> Yes
                </p>
              </div>

              {/* Targeting Cookies */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">5. Targeting/Advertising Cookies</h3>
                <p className="mb-2">
                  These cookies may be set by third-party advertising partners to build a profile of your interests and show you relevant content on other sites.
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Examples:</strong> Third-party ad cookies, social media pixels
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Duration:</strong> Up to 1 year
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  <strong>Can be disabled:</strong> Yes
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We may use third-party services that set cookies on our platform. These include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Google OAuth:</strong> For authentication services</li>
                <li><strong>Analytics Providers:</strong> To understand platform usage</li>
                <li><strong>Cloud Services:</strong> For hosting and content delivery</li>
              </ul>
              <p className="mt-4">
                These third parties have their own privacy policies and cookie policies. We recommend reviewing their policies to understand how they use cookies.
              </p>
            </div>
          </section>

          {/* Managing Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Managing Your Cookie Preferences</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                You have several options to manage cookies:
              </p>
              
              <div className="ml-4 space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">1. Cookie Consent Banner</h4>
                  <p>
                    When you first visit CodeArena, you'll see a cookie consent banner where you can accept or customize your cookie preferences.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">2. Browser Settings</h4>
                  <p>
                    Most web browsers allow you to control cookies through their settings. You can typically:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>View and delete cookies</li>
                    <li>Block third-party cookies</li>
                    <li>Block all cookies</li>
                    <li>Clear cookies when closing your browser</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-2">3. Browser-Specific Instructions</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                    <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-6">
                <p className="text-yellow-400 font-semibold mb-2">⚠️ Important Note</p>
                <p className="text-sm">
                  Blocking or deleting cookies may impact your experience on CodeArena. Some features may not work properly, and you may need to sign in again.
                </p>
              </div>
            </div>
          </section>

          {/* Cookie Consent */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Your Cookie Consent</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                By clicking "Accept All Cookies" on our cookie banner, you consent to the use of all cookies as described in this policy. You can change your preferences at any time by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Updating your browser cookie settings</li>
                <li>Clicking the cookie preferences link in our footer</li>
                <li>Contacting us directly</li>
              </ul>
            </div>
          </section>

          {/* Do Not Track */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Do Not Track Signals</h2>
            <p className="text-gray-300">
              Some browsers support "Do Not Track" (DNT) signals. Currently, there is no industry standard for responding to DNT signals, and our platform does not respond to DNT signals at this time.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Cookie Policy</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We will notify you of any material changes by updating the "Last Updated" date.
              </p>
              <p>
                We encourage you to review this policy periodically to stay informed about how we use cookies.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <div className="space-y-4 text-gray-300">
              <p>If you have questions about our use of cookies, please contact us:</p>
              <ul className="list-none space-y-2 ml-4">
                <li>
                  Email:{' '}
                  <a href="mailto:privacy@codearena.com" className="text-blue-400 hover:text-blue-300 underline">
                    privacy@codearena.com
                  </a>
                </li>
                <li>
                  Support:{' '}
                  <a href="mailto:support@codearena.com" className="text-blue-400 hover:text-blue-300 underline">
                    support@codearena.com
                  </a>
                </li>
              </ul>
              <p className="mt-4">
                For more information about your privacy rights, please see our{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Last Updated */}
          <section className="pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              Last Updated: January 18, 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;