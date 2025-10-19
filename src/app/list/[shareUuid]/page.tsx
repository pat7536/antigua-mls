import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import SharedListContent from './SharedListContent';

type Props = {
  params: Promise<{ shareUuid: string }>;
};

async function getSharedList(shareUuid: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  (process.env.NODE_ENV === 'production' ? 'https://www.antigua-mls.com' : 'http://localhost:3000');

  try {
    const response = await fetch(`${baseUrl}/api/public/lists/${shareUuid}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.list;
  } catch (error) {
    console.error('Error fetching shared list:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shareUuid } = await params;
  const list = await getSharedList(shareUuid);

  if (!list) {
    return {
      title: 'Shared Property List - Not Found',
    };
  }

  return {
    title: `${list.title} - Shared Property List | Antigua MLS`,
    description:
      list.description ||
      `View ${list._count.properties} properties shared by a realtor on Antigua MLS`,
  };
}

export default async function SharedListPage({ params }: Props) {
  const { shareUuid } = await params;
  const list = await getSharedList(shareUuid);

  if (!list) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading properties...</div>}>
          <SharedListContent list={list} />
        </Suspense>
      </div>
    </div>
  );
}
