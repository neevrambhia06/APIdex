'use client';

import { getAPIById, apiData } from '@/data/apis';
import APIDetailPage from '@/components/explorer/APIDetailPage';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { apiId: string } }): Promise<Metadata> {
  const api = getAPIById(params.apiId);
  
  if (!api) {
    return {
      title: 'API Not Found',
      description: 'The requested API was not found in our database.'
    };
  }

  return {
    title: `${api.name} API | APIdex`,
    description: api.shortDescription,
    keywords: api.tags.join(', ')
  };
}

export function generateStaticParams() {
  return apiData.map(api => ({
    apiId: api.id
  }));
}

export default function APIDetailPageRoute({ params }: { params: { apiId: string } }) {
  const api = getAPIById(params.apiId);

  if (!api) {
    notFound();
  }

  return <APIDetailPage api={api} />;
}
