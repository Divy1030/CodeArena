"use client";

import React from 'react';
import Link from 'next/link';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                At CodeArena, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully.
              </p>
              <p>
                By using CodeArena, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>Personal Information:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, and username when you create an account</li>
                <li>Profile information including profile picture, bio, and social links</li>
                <li>Authentication data when using third-party login (Google OAuth)</li>
                <li>Communication preferences and contact information</li>
              </ul>
              
              <p className="mt-4"><strong>Usage Information:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Code submissions and solutions to problems</li>
                <li>Contest participation data and rankings</li>
                <li>Activity logs, including problems solved and contests entered</li>
                <li>Performance metrics and statistics</li>
              </ul>

              <p className="mt-4"><strong>Technical Information:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address, browser type, and device information</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log data including access times and pages viewed</li>
                <li>Error logs and diagnostic information</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <div className="space-y-4 text-gray-300">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, operate, and maintain our platform</li>
                <li>Process your code submissions and evaluate contest entries</li>
                <li>Maintain leaderboards and user rankings</li>
                <li>Personalize your experience and provide tailored content</li>
                <li>Communicate with you about updates, contests, and platform changes</li>
                <li>Improve our services and develop new features</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Information Sharing and Disclosure</h2>
            <div className="space-y-4 text-gray-300">
              <p>We may share your information in the following circumstances:</p>
              
              <p><strong>Public Information:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your username, profile picture, and public profile information</li>
                <li>Contest rankings and leaderboard positions</li>
                <li>Problem-solving statistics and achievements</li>
                <li>Code submissions (unless marked as private)</li>
              </ul>

              <p className="mt-4"><strong>Third-Party Services:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authentication providers (e.g., Google) for login services</li>
                <li>Cloud hosting providers for data storage and processing</li>
                <li>Analytics services to understand platform usage</li>
                <li>Email service providers for communications</li>
              </ul>

              <p className="mt-4"><strong>Legal Requirements:</strong></p>
              <p className="ml-4">
                We may disclose your information if required by law, court order, or governmental request, or to protect our rights, property, or safety.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and monitoring</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookies and Tracking Technologies</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We use cookies and similar tracking technologies to track activity on our platform and store certain information. You can control cookie preferences through our{' '}
                <Link href="/cookies" className="text-blue-400 hover:text-blue-300 underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Your Privacy Rights</h2>
            <div className="space-y-4 text-gray-300">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and review your personal information</li>
                <li>Correct or update inaccurate information</li>
                <li>Request deletion of your account and associated data</li>
                <li>Object to or restrict certain processing of your information</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent for optional data collection</li>
                <li>Opt-out of marketing communications</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:privacy@codearena.com" className="text-blue-400 hover:text-blue-300 underline">
                  privacy@codearena.com
                </a>
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Retention</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. We may retain certain information for longer periods for legal, regulatory, or legitimate business purposes.
              </p>
              <p>
                When you delete your account, we will delete or anonymize your personal information, though some information may remain in backups for a limited period.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Children's Privacy</h2>
            <p className="text-gray-300">
              Our service is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">International Data Transfers</h2>
            <p className="text-gray-300">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable laws.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Privacy Policy</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p>
                Your continued use of CodeArena after any changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <div className="space-y-4 text-gray-300">
              <p>If you have questions about this Privacy Policy, please contact us:</p>
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

export default PrivacyPage;