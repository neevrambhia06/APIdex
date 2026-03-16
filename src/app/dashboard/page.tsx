import { Metadata } from 'next';
import DashboardPage from './DashboardPage';

export const metadata: Metadata = {
  title: 'Dashboard | APIdex',
  description: 'Manage your bookmarks, subscriptions, and API submissions',
};

export default function Dashboard() {
  return <DashboardPage />;
}
