import { Link } from 'react-router';
import { PageHeader } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="py-10">
      <PageHeader title="Page not found" lead="That page doesn’t exist (or moved in the 2026 rebuild)." />
      <Link to="/" className="font-semibold text-brand-strong hover:underline">
        Go to the start →
      </Link>
    </div>
  );
}
