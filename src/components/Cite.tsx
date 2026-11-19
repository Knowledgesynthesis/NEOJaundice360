import { Link } from 'react-router';
import { REF_BY_ID } from '@/data/references';

/** Inline citation chips linking to the reference list. */
export function Cite({ ids, className }: { ids: string[]; className?: string }) {
  if (!ids.length) return null;
  return (
    <span className={className}>
      {ids.map((id) => {
        const r = REF_BY_ID[id];
        if (!r) return null;
        return (
          <Link
            key={id}
            to={`/references#${id}`}
            title={r.citation}
            className="ml-1 inline-block rounded-md border border-border bg-surface-2 px-1.5 py-px align-baseline text-[0.7rem] font-medium text-muted no-underline hover:text-fg"
          >
            {r.short}
          </Link>
        );
      })}
    </span>
  );
}
