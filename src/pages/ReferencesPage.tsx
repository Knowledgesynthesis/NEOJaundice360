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
        The calculator and its charts use the published hourly <a className="text-brand-strong underline" href="https://aap2.silverchair-cdn.com/aap2/content_public/journal/pediatrics/150/3/10.1542_peds.2022-058859/5/peds_2022058859supplementarydata.pdf" target="_blank" rel="noreferrer">AAP 2022 Supplemental Tables 1–4</a> for ≥35 weeks, hours 1–336. The hour-0 cell is blank in the source. There are no estimated gestational-age rows or extrapolated thresholds. TcB does not trigger treatment, and a separate preterm reference applies below 35 weeks.
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
