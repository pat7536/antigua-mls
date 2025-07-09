import './globals.css';

export const metadata = {
  title: 'Antigua MLS',
  description: 'Real Estate Listings in Antigua',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}