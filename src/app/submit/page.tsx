import { Metadata } from 'next';
import SubmitPage from './SubmitPage';

export const metadata: Metadata = {
  title: 'Submit API | APIdex',
  description: 'Submit your API to be featured in the APIdex directory',
};

export default function Submit() {
  return <SubmitPage />;
}
