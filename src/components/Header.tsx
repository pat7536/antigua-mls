'use client';

import { useState, useEffect, useRef } from 'react';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { useUserRole } from '@/contexts/UserRoleContext';

const AUTHORIZED_EMAILS = ['pat7536@gmail.com', 'ross.caribbeankeys@gmail.com'];

export default function Header() {
  const { role } = useUserRole();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Check if current user is authorized to add properties
  const isAuthorizedForAddProperty =
    user?.primaryEmailAddress?.emailAddress &&
    AUTHORIZED_EMAILS.includes(user.primaryEmailAddress.emailAddress);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-1 min-w-0">
            <Link href="/" className="no-underline">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                Antigua MLS
              </h1>
              <p className="text-sm md:text-base text-gray-600 hidden sm:block">
                Find your dream property in Antigua
              </p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn text-base px-4 py-2">Sign In</button>
              </SignInButton>
            </SignedOut>

            {/* Property Type Links */}
            <Link
              href="/residential"
              className="text-blue-700 hover:text-blue-900 font-medium transition-colors text-base"
            >
              Residential
            </Link>
            <Link
              href="/commercial"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-base"
            >
              Commercial
            </Link>

            <SignedIn>
              {role === 'viewer' && (
                <Link
                  href="/become-agent"
                  className="text-green-600 hover:text-green-800 font-medium transition-colors text-base"
                >
                  Become an Agent
                </Link>
              )}
              {role === 'admin' && (
                <Link
                  href="/admin/agent-requests"
                  className="text-purple-600 hover:text-purple-800 font-medium transition-colors text-base"
                >
                  Agent Requests
                </Link>
              )}
              <Link
                href="/featured-properties"
                className="text-emerald-600 hover:text-emerald-800 font-medium transition-colors text-base"
              >
                Featured Properties
              </Link>
              {isAuthorizedForAddProperty && (
                <Link
                  href="/add-property"
                  className="text-orange-600 hover:text-orange-800 font-medium transition-colors text-base"
                >
                  Add Property
                </Link>
              )}
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-base"
              >
                Dashboard
              </Link>
              
              {/* Resources Dropdown */}
              <div className="relative" ref={resourcesRef}>
                <button
                  onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors text-base flex items-center gap-1"
                >
                  Resources
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {resourcesDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <a
                      href="/guides/antigua-agents-guide.html"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setResourcesDropdownOpen(false)}
                    >
                      Agent Guide
                    </a>
                  </div>
                )}
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-3">
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </SignedIn>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-gray-600 transform transition duration-300 ease-in-out ${
                    isMobileMenuOpen
                      ? 'rotate-45 translate-y-1.5'
                      : '-translate-y-1'
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-gray-600 transform transition duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`block w-5 h-0.5 bg-gray-600 transform transition duration-300 ease-in-out ${
                    isMobileMenuOpen
                      ? '-rotate-45 -translate-y-1.5'
                      : 'translate-y-1'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden mt-4 pb-4 border-t border-gray-200 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="pt-4 space-y-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="block w-full text-left btn text-base px-4 py-2">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            {/* Property Type Links - available to all users */}
            <Link
              href="/residential"
              className="block text-blue-700 hover:text-blue-900 font-medium transition-colors text-base py-2 px-4 hover:bg-gray-50 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Residential Properties
            </Link>
            <Link
              href="/commercial"
              className="block text-indigo-600 hover:text-indigo-800 font-medium transition-colors text-base py-2 px-4 hover:bg-gray-50 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Commercial Properties
            </Link>

            <SignedIn>
              {role === 'viewer' && (
                <Link
                  href="/become-agent"
                  className="block text-green-600 hover:text-green-800 font-medium transition-colors text-base py-2 px-4 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Become an Agent
                </Link>
              )}
              {role === 'admin' && (
                <Link
                  href="/admin/agent-requests"
                  className="block text-purple-600 hover:text-purple-800 font-medium transition-colors text-base py-2 px-4 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agent Requests
                </Link>
              )}
              <Link
                href="/featured-properties"
                className="block text-emerald-600 hover:text-emerald-800 font-medium transition-colors text-base py-2 px-4 hover:bg-gray-50 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Featured Properties
              </Link>
              {isAuthorizedForAddProperty && (
                <Link
                  href="/add-property"
                  className="block text-orange-600 hover:text-orange-800 font-medium transition-colors text-base py-2 px-4 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Add Property
                </Link>
              )}
              <Link
                href="/dashboard"
                className="block text-blue-600 hover:text-blue-800 font-medium transition-colors text-base py-2 px-4 hover:bg-gray-50 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              
              {/* Resources Section */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <p className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">Resources</p>
                <a
                  href="/guides/antigua-agents-guide.html"
                  className="block text-gray-600 hover:text-gray-800 font-medium transition-colors text-base py-2 px-4 hover:bg-gray-50 rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Agent Guide
                </a>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
