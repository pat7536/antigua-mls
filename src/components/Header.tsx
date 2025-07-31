'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-start md:items-center">
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

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn text-sm md:text-base px-3 py-2 md:px-4 md:py-2">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm md:text-base"
              >
                Dashboard
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-6 h-6 md:w-8 md:h-8',
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
