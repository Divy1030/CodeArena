"use client";

import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Linkedin, Github, LucideIcon } from 'lucide-react';

interface NavItems {
  [category: string]: {
    label: string;
    href: string;
  }[];
}

interface SocialIcon {
  Icon: LucideIcon;
  href: string;
  label: string;
}

const Footer: React.FC = () => {
  const navItems: NavItems = {
    Product: [
      { label: 'Features', href: '/features' },
      { label: 'Contests', href: '/contests' },
      { label: 'Problems', href: '/problems' },
      { label: 'Leaderboard', href: '/leaderboard' }
    ],
    'About Us': [
      { label: 'Our Team', href: '/about/team' },
      { label: 'Contact Us', href: '/contact' }
    ]
  };

  const socialIcons: SocialIcon[] = [
    { Icon: Instagram, href: 'https://instagram.com/codearena', label: 'Instagram' },
    { Icon: Twitter, href: 'https://twitter.com/codearena', label: 'Twitter' },
    { Icon: Linkedin, href: 'https://linkedin.com/company/codearena', label: 'LinkedIn' },
    { Icon: Github, href: 'https://github.com/codearena', label: 'GitHub' }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="inline-block">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xl">◁</span>
              </div>
              <span className="text-white text-xl font-semibold">CodeArena</span>
            </div>
          </Link>
          <p className="text-sm mb-6">
            Empowering developers to improve their coding skills <br />through competitive programming challenges and collaborative learning.
          </p>
          <div className="flex space-x-4">
            {socialIcons.map(({ Icon, href, label }, index) => (
              <a 
                key={index} 
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        {Object.entries(navItems).map(([title, items]) => (
          <div key={title}>
            <h3 className="text-white font-semibold mb-4">{title}</h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-4 md:mb-0">
          © {currentYear} CodeArena. All rights reserved.
        </p>
        <div className="flex space-x-6 text-sm">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;