import type { Metadata } from 'next';
import NotFoundClient from '@/components/shared/not-found-client';

export const metadata: Metadata = {
  title: '404: Page Not Found',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function NotFoundPage() {
  return <NotFoundClient />;
}
