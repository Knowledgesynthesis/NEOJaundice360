import { ExternalLink } from 'lucide-react';
import { REFERENCES } from '@/data/references';
import { Badge, Callout, Card, PageHeader } from '@/components/ui';

const ORDER = ['guideline', 'trial', 'cohort', 'review', 'basic', 'tool'] as const;
const LABEL: Record<(typeof ORDER)[number], string> = {
  guideline: 'Guidelines & clinical reports',
  trial: 'Randomized trials',
  cohort: 'Cohort & diagnostic studies',
  review: 'Reviews & consensus',
  basic: 'Physiology & biomarkers',
  tool: 'Calculators',
};

export default function ReferencesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence & sources"
        lead="Every clinical statement in this app links here. Guidelines take precedence; studies explain the why."
      />
      <Callout kind="info" title="How the threshold data were built">
        AAP 2022 phototherapy values at 24/48/72/96 h were taken from the guideline’s supplemental tables as reproduced by independent implementations, cross-checked against each
        other, and are locked by automated tests. Interpolated or approximate values are labelled wherever they appear. Curves not verifiable offline (35–37-week exchange) are not
        embedded — use BiliTool or PediTools for those.
      </Callout>
      {ORDER.map((k) => {
        const refs = REFERENCES.filter((r) => r.kind === k);
        if (!refs.length) return null;
        return (
          <Card key={k}>
            <h2 className="mb-3 text-lg font-bold">{LABEL[k]}</h2>
            <ol className="space-y-4">
              {refs.map((r) => (
                <li key={r.id} id={r.id} className="scroll-mt-20 rounded-xl target:bg-brand/10 target:p-3 target:ring-2 target:ring-brand">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    <Badge tone="brand">{r.short}</Badge>
                  </p>
                  <p className="mt-1 text-sm">{r.citation}</p>
                  <p className="mt-1 text-sm text-muted">{r.use}</p>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer noopener" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong hover:underline">
                      Open source <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </Card>
        );
      })}
    </div>
  );
}
