import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { SavedPropertiesProvider } from '@/contexts/SavedPropertiesContext';
import { UserRoleProvider } from '@/contexts/UserRoleContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import ChatKitWidget from '@/components/ChatKitWidget';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Antigua MLS',
  description: 'Real Estate Listings in Antigua',
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

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
              <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}>
                  {children}
                </div>
                <Footer />
              </div>
              <ChatKitWidget />
            </body>
          </html>
        </SavedPropertiesProvider>
      </UserRoleProvider>
    </ClerkProvider>
  );
}
