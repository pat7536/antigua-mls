import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { SavedPropertiesProvider } from '@/contexts/SavedPropertiesContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Antigua MLS',
  description: 'Real Estate Listings in Antigua',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <UserRoleProvider>
        <SavedPropertiesProvider>
          <html lang="en">
            <body>{children}</body>
          </html>
        </SavedPropertiesProvider>
      </UserRoleProvider>
    </ClerkProvider>
  );
}
