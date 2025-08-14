import { Metadata } from 'next';
import PropertyResultsPage from '@/components/PropertyResultsPage';

export const metadata: Metadata = {
  title: 'Commercial Real Estate in Antigua | Antigua MLS',
  description: 'Find commercial properties for sale in Antigua & Barbuda including office buildings, retail spaces, warehouses, and investment opportunities.',
  openGraph: {
    title: 'Commercial Real Estate in Antigua | Antigua MLS',
    description: 'Find commercial properties for sale in Antigua & Barbuda including office buildings, retail spaces, warehouses, and investment opportunities.',
    type: 'website',
  },
};

export default function CommercialPage() {
  return (
    <PropertyResultsPage
      propertyType="commercial"
      title="Commercial Properties"
      description="Find commercial properties for sale including office buildings, retail spaces, and investment opportunities"
    />
  );
}