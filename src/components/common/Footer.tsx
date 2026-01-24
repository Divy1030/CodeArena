"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Linkedin, Github, LucideIcon } from "lucide-react";

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
      { label: "Features", href: "/features" },
      { label: "Contests", href: "/contests" },
      { label: "Problems", href: "/problems" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
    "About Us": [
      { label: "Our Team", href: "/about/team" },
      { label: "Contact Us", href: "/contact" },
    ],
  };

  const socialIcons: SocialIcon[] = [
    {
      Icon: Instagram,
      href: "https://instagram.com/codearena",
      label: "Instagram",
    },
    { Icon: Twitter, href: "https://twitter.com/codearena", label: "Twitter" },
    {
      Icon: Linkedin,
      href: "https://linkedin.com/company/codearena",
      label: "LinkedIn",
    },
    { Icon: Github, href: "https://github.com/codearena", label: "GitHub" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description - Takes full width on mobile, half on larger screens */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/common/code-arena-logo.png"
                  alt="CodeArena Logo"
                  width={32}
                  height={32}
                />
                <Image
                  src="/images/common/logo.png"
                  alt="CodeArena"
                  width={80}
                  height={40}
                  className="object-contain translate-y-1"
                />
              </div>
            </Link>
            <p className="text-sm mb-6 max-w-md">
              Empowering developers to improve their coding skills through
              competitive programming challenges and collaborative learning.
            </p>
            <div className="flex space-x-5 gap-2">
              {socialIcons.map(({ Icon, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-400 hover:text-white transition-colors p-2 -m-2"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links - Stack on mobile, side by side on larger screens */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-8 col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-2">
            {Object.entries(navItems).map(([title, items]) => (
              <div key={title} className="col-span-1">
                <h3 className="text-white font-semibold mb-3 text-base">
                  {title}
                </h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="hover:text-white transition-colors text-sm inline-block"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar - Stack on mobile, row on larger screens */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs sm:text-sm mb-4 sm:mb-0 text-center sm:text-left">
              © {currentYear} CodeArena. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6 text-xs sm:text-sm">
              <Link
                href="/terms"
                className="hover:text-white transition-colors py-1"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors py-1"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="hover:text-white transition-colors py-1"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
