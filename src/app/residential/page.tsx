import { Metadata } from 'next';
import PropertyResultsPage from '@/components/PropertyResultsPage';

export const metadata: Metadata = {
  title: 'Residential Real Estate in Antigua | Antigua MLS',
  description:
    'Discover beautiful homes, villas, and condos for sale in Antigua & Barbuda. Browse our residential property listings with detailed photos, prices, and locations.',
  openGraph: {
    title: 'Residential Real Estate in Antigua | Antigua MLS',
    description:
      'Discover beautiful homes, villas, and condos for sale in Antigua & Barbuda. Browse our residential property listings with detailed photos, prices, and locations.',
    type: 'website',
  },
};

export default function ResidentialPage() {
  return <PropertyResultsPage propertyType="residential" />;
}
