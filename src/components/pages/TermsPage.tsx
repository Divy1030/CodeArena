"use client";

import React from 'react';
import Link from 'next/link';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
        
        <div className="space-y-8">
          {/* Overview Section */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                This website is operated by CodeArena. Throughout the site, the terms "CodeArena", "CodeArena platform", "we", "us" and "our" refer to CodeArena. CodeArena offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
              </p>
              <p>
                By visiting our site, participating in contests, solving problems, or using any services, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein. These Terms of Service apply to all users of the site, including without limitation users who are browsers, contestants, problem setters, and contributors of content.
              </p>
              <p>
                Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
              </p>
              <p>
                Any new features, products or tools which are added to the current website shall also be subject to the Terms of Service. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
              </p>
            </div>
          </section>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 1 - Account Terms</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-300">
              <li>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.</li>
              <li>You may not use our platform for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction.</li>
              <li>You must not transmit any worms or viruses or any code of a destructive nature.</li>
              <li>A breach or violation of any of the Terms will result in an immediate termination of your services/account.</li>
              <li>You are responsible for maintaining the confidentiality of your account and password.</li>
              <li>By agreeing to the terms of service, you also agree to adhere to our Code of Conduct.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 2 - General Conditions</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-300">
              <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
              <li>You understand that your content (not including sensitive information), may be transferred and involve transmissions over various networks.</li>
              <li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without prior written permission by us.</li>
              <li>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 3 - Contest and Problem Submissions</h2>
            <div className="space-y-4 text-gray-300">
              <p><strong>Intellectual Property:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contestants retain ownership of all intellectual property rights in their code submissions.</li>
                <li>By submitting code, you grant CodeArena a non-exclusive license to use, display, and evaluate your submission for the purpose of the contest and platform functionality.</li>
                <li>Problem setters and contest creators retain ownership of their problems but grant CodeArena the right to display and use them on the platform.</li>
              </ul>
              <p className="mt-4"><strong>Contest Rules:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Participants must follow all contest-specific rules and guidelines.</li>
                <li>Cheating, plagiarism, or any unfair practices will result in disqualification and potential account termination.</li>
                <li>Contest rankings and results are final and determined by our automated judging system.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 4 - User Content and Conduct</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-300">
              <li>You are solely responsible for the content you submit, including code, comments, and profile information.</li>
              <li>We reserve the right to monitor, edit, or remove content that we determine is unlawful, offensive, or violates these Terms.</li>
              <li>You may not use false information, impersonate others, or engage in any deceptive practices.</li>
              <li>Harassment, discrimination, or abusive behavior towards other users is strictly prohibited.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 5 - Leaderboard and Rankings</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                CodeArena maintains leaderboards and user rankings based on contest participation and problem-solving activity. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify ranking algorithms at any time without prior notice.</li>
                <li>Remove or adjust rankings if suspicious activity or rule violations are detected.</li>
                <li>Display user statistics and achievements publicly on the platform.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 6 - Third-Party Services</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Our platform may integrate with third-party services for authentication (e.g., Google OAuth), payment processing, and other functionalities. By using these services through CodeArena:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You agree to be bound by the terms and conditions of those third-party services.</li>
                <li>CodeArena is not responsible for the actions, policies, or content of third-party services.</li>
                <li>We do not guarantee the availability or accuracy of third-party services.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 7 - Code Execution and Security</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                CodeArena provides an online code editor and execution environment. By using this service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You agree not to submit malicious code that could harm our infrastructure or other users.</li>
                <li>We may limit execution time, memory usage, and other resources for code submissions.</li>
                <li>We are not responsible for any data loss or errors in code execution.</li>
                <li>Code submissions are evaluated in a sandboxed environment for security purposes.</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 8 - Personal Information</h2>
            <p className="text-gray-300">
              Your submission of personal information through the website is governed by our{' '}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </Link>
              . By using CodeArena, you consent to the collection and use of your information as described in our Privacy Policy.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 9 - Prohibited Uses</h2>
            <div className="space-y-4 text-gray-300">
              <p>You are prohibited from using the site or its content:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>For any unlawful purpose or to violate any regulations, rules, or laws.</li>
                <li>To infringe upon intellectual property rights of CodeArena or others.</li>
                <li>To harass, abuse, or discriminate against other users.</li>
                <li>To submit false, misleading, or plagiarized content.</li>
                <li>To upload malicious code or attempt to compromise platform security.</li>
                <li>To scrape, crawl, or collect user data without authorization.</li>
                <li>To circumvent contest rules or attempt to gain unfair advantages.</li>
              </ul>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 10 - Disclaimer of Warranties</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We do not guarantee that your use of our service will be uninterrupted, timely, secure or error-free. The service and all content delivered through the service are provided 'as is' and 'as available' without any warranties of any kind.
              </p>
              <p>
                In no case shall CodeArena, our directors, officers, employees, or affiliates be liable for any injury, loss, claim, or damages of any kind arising from your use of the service, including lost data, incorrect rankings, or contest-related issues.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 11 - Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify, defend and hold harmless CodeArena and our affiliates, partners, officers, directors, and employees from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or your violation of any law or the rights of a third-party.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 12 - Termination</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                These Terms of Service are effective unless terminated by either you or us. You may terminate by ceasing to use our services. We may terminate or suspend your account at any time if you fail to comply with any term or provision of these Terms of Service.
              </p>
              <p>
                Upon termination, your right to use the service will immediately cease, but your obligations and our rights under these Terms will survive termination.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 13 - Governing Law</h2>
            <p className="text-gray-300">
              These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms shall be resolved in accordance with the dispute resolution procedures outlined herein.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Section 14 - Changes to Terms</h2>
            <p className="text-gray-300">
              We reserve the right to update or change these Terms of Service at any time. We will notify users of any material changes by posting the new Terms on this page. Your continued use of the platform following any changes constitutes acceptance of those changes.
            </p>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
            <p className="text-gray-300">
              Questions about the Terms of Service should be sent to us at{' '}
              <a href="mailto:support@codearena.com" className="text-blue-400 hover:text-blue-300 underline">
                support@codearena.com
              </a>
            </p>
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

export default TermsPage;