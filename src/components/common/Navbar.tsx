"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut, User, Settings } from "lucide-react";
import GooeyNav from "@/components/bits/Goey";

interface NavbarProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  userProfilePicture?: string | null;
  username?: string;
}

interface UserData {
  username?: string;
  profile?: {
    avatarUrl?: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated = false,
  isAdmin = false,
  userProfilePicture = null,
  username = "",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [actualUserData, setActualUserData] = useState<UserData | null>(null);
  const pathname = usePathname();

  // Load user data from localStorage
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData) as UserData;
        setActualUserData(parsedUserData);
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  }, []);

  // Close menus when pathname changes (navigation occurs)
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const toggleMenu = (): void => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = (): void => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    // Redirect to home page
    window.location.href = "/";
  };

  // Get user's first initial for fallback avatar
  const displayUsername = actualUserData?.username || username;
  const profilePicture =
    actualUserData?.profile?.avatarUrl || userProfilePicture;
  const userInitial = displayUsername
    ? displayUsername.charAt(0).toUpperCase()
    : isAdmin
      ? "A"
      : "U";

  // Define navigation items for authenticated users
  const getNavItems = () => {
    if (isAdmin) {
      return [
        { label: "Dashboard", href: "/admin/home" },
        { label: "Problems", href: "/problems" },
        { label: "Contests", href: "/contests" },
        { label: "Leaderboard", href: "/admin/leaderboard" },
      ];
    } else {
      return [
        { label: "Dashboard", href: "/user/home" },
        { label: "Problems", href: "/problems" },
        { label: "Contests", href: "/contests" },
      ];
    }
  };

  // Render profile avatar (image or fallback)
  const renderProfileAvatar = () => {
    if (profilePicture && !imageError) {
      return (
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={profilePicture}
            alt={displayUsername || "User profile"}
            fill
            sizes="32px"
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized={profilePicture.includes("googleusercontent.com")}
          />
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
          {userInitial}
        </div>
      );
    }
  };

  return (
    <nav className="px-6 py-4 bg-gray-900 md:px-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/common/code-arena-logo.png"
              alt="CodeArena Logo"
              width={32}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
            />
            <Image
              src="/images/common/logo.png"
              alt="CodeArena"
              width={80}
              height={40}
              className="object-contain translate-y-1"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Link>

        {/* Center navigation with GooeyNav - ONLY for authenticated users */}
        {isAuthenticated && (
          <div className="hidden md:block">
            <GooeyNav
              items={getNavItems()}
              particleCount={12}
              particleDistances={[60, 10]}
              particleR={80}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
        )}

        {/* Right side - Regular Login/Signup buttons or User Profile */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/register"
                className="px-4 py-2 rounded-md bg-white text-black border-black hover:bg-gray-300"
              >
                Sign-Up
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-300"
              >
                Log-In
              </Link>
            </>
          ) : (
            <div className="relative flex items-center gap-4">
              {/* <button className="text-gray-300 hover:text-white relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button> */}

              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 text-gray-300 hover:text-white"
              >
                {renderProfileAvatar()}
                <span className="hidden lg:inline">
                  {isAdmin ? "Admin" : displayUsername || "Profile"}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <Link
                      href={isAdmin ? "/admin/profile" : "/user/profile"}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={toggleProfileMenu}
              className="text-gray-300 hover:text-white"
            >
              {renderProfileAvatar()}
            </button>
          )}

          <button
            onClick={toggleMenu}
            className="focus:outline-none text-white"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {isAuthenticated ? (
            // Only show navigation items for authenticated users
            <>
              {getNavItems().map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-gray-700 my-2" />
              <Link
                href={isAdmin ? "/admin/profile" : "/user/profile"}
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            // Only show login/signup for non-authenticated users
            <>
              <Link
                href="/register"
                className="block px-4 py-2 rounded-md bg-white text-black hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Sign-Up
              </Link>
              <Link
                href="/login"
                className="block px-4 py-2 rounded-md bg-white text-black hover:bg-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Log-In
              </Link>
            </>
          )}
        </div>
      )}

      {/* Mobile profile menu */}
      {isProfileOpen && isAuthenticated && (
        <div className="md:hidden mt-4 space-y-2">
          <Link
            href={isAdmin ? "/admin/profile" : "/user/profile"}
            className="block px-4 py-2 text-gray-300 hover:bg-gray-800"
            onClick={() => setIsProfileOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-gray-300 hover:bg-gray-800"
            onClick={() => setIsProfileOpen(false)}
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
