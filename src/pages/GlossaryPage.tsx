import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Search } from 'lucide-react';
import { GLOSSARY, type Term } from '@/data/glossary';
import { Badge, PageHeader } from '@/components/ui';
import { cn } from '@/lib/cn';

const CATS: ('All' | Term['category'])[] = ['All', 'Physiology', 'Measurement', 'Causes', 'Treatment', 'Neurotoxicity', 'Cholestasis'];

export default function GlossaryPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof CATS)[number]>('All');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return GLOSSARY.filter((t) => (cat === 'All' || t.category === cat) && (!s || (t.term + ' ' + t.def).toLowerCase().includes(s))).sort((a, b) =>
      a.term.localeCompare(b.term),
    );
  }, [q, cat]);

  return (
    <div>
      <PageHeader title="Glossary" lead={`${GLOSSARY.length} terms, each defined the way current guidelines use them.`} />
      <div className="mb-4 space-y-3">
        <label className="relative block">
          <span className="sr-only">Search terms</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms or definitions"
            className="min-h-11 w-full rounded-xl border border-border bg-surface pl-9 pr-3"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn('min-h-9 rounded-full border px-3 text-sm', cat === c ? 'border-brand bg-brand/15 font-semibold' : 'border-border hover:bg-surface-2')}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-muted" aria-live="polite">
        {list.length} term{list.length === 1 ? '' : 's'}
      </p>
      <dl className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {list.map((t) => (
          <div key={t.term} className="p-4">
            <dt className="flex flex-wrap items-center gap-2 font-bold">
              {t.term} <Badge>{t.category}</Badge>
            </dt>
            <dd className="mt-1 text-sm">
              {t.def}{' '}
              {t.see && (
                <Link to={t.see} className="font-semibold text-brand-strong hover:underline">
                  Learn more →
                </Link>
              )}
            </dd>
          </div>
        ))}
        {!list.length && <p className="p-6 text-center text-sm text-muted">No matching terms.</p>}
      </dl>
    </div>
  );
}
