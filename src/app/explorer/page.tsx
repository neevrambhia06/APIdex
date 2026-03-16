import { Metadata } from 'next';
import ExplorerPage from './ExplorerPage';

export const metadata: Metadata = {
  title: 'API Explorer | APIdex',
  description: 'Browse and discover powerful public APIs for your next project',
};

export default function Explorer() {
  return <ExplorerPage />;
}
