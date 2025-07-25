'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="no-underline">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Antigua MLS
              </h1>
              <p className="text-gray-600">
                Find your dream property in Antigua
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn">Agent Sign In</button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
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
        </div>
      </div>
    </header>
  );
}
