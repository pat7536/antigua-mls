'use client';

import { useState } from 'react';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import Link from 'next/link';
import { useUserRole } from '@/contexts/UserRoleContext';

const AUTHORIZED_EMAILS = ['pat7536@gmail.com', 'ross.caribbeankeys@gmail.com'];

export default function Header() {
  const { role } = useUserRole();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if current user is authorized to add properties
  const isAuthorizedForAddProperty =
    user?.primaryEmailAddress?.emailAddress &&
    AUTHORIZED_EMAILS.includes(user.primaryEmailAddress.emailAddress);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
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
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
