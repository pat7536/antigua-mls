import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { SavedPropertiesProvider } from '@/contexts/SavedPropertiesContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import './globals.css';

export const metadata: Metadata = {
  title: 'Antigua MLS',
  description: 'Real Estate Listings in Antigua',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
            <body>
              <GoogleAnalytics gaId="G-55VV3FDGJJ" />
              {children}
            </body>
          </html>
        </SavedPropertiesProvider>
      </UserRoleProvider>
    </ClerkProvider>
  );
}
