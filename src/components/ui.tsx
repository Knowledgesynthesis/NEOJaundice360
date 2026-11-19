import { type ReactNode, useId } from 'react';
import { cn } from '@/lib/cn';
import { AlertTriangle, CheckCircle2, Info, Lightbulb, OctagonAlert } from 'lucide-react';

export function Card({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className={cn('rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-6', className)}>
      {children}
    </section>
  );
}

export function SectionTitle({ kicker, children, id }: { kicker?: string; children: ReactNode; id?: string }) {
  return (
    <div className="mb-4">
      {kicker && <p className="text-xs font-semibold uppercase tracking-wider text-brand-strong">{kicker}</p>}
      <h2 id={id} className="text-xl font-bold tracking-tight sm:text-2xl">
        {children}
      </h2>
    </div>
  );
}

export function PageHeader({ step, title, lead, children }: { step?: string; title: string; lead: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-6 sm:mb-8">
      {step && <p className="text-xs font-semibold uppercase tracking-wider text-brand-strong">{step}</p>}
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-base text-muted sm:text-lg">{lead}</p>
      {children}
    </header>
  );
}

type Tone = 'neutral' | 'brand' | 'photo' | 'esc' | 'exch' | 'ok' | 'info';
const toneCls: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-fg border-border',
  brand: 'bg-brand/15 text-brand-strong border-brand/40',
  photo: 'bg-photo/12 text-photo border-photo/40',
  esc: 'bg-esc/12 text-esc border-esc/40',
  exch: 'bg-exch/12 text-exch border-exch/40',
  ok: 'bg-ok/12 text-ok border-ok/40',
  info: 'bg-info/12 text-info border-info/40',
};

export function Badge({ tone = 'neutral', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium', toneCls[tone], className)}>
      {children}
    </span>
  );
}

const calloutIcon = { info: Info, warn: AlertTriangle, danger: OctagonAlert, ok: CheckCircle2, pearl: Lightbulb };
const calloutCls = {
  info: 'border-info/40 bg-info/8',
  warn: 'border-esc/40 bg-esc/8',
  danger: 'border-exch/50 bg-exch/10',
  ok: 'border-ok/40 bg-ok/8',
  pearl: 'border-brand/50 bg-brand/10',
};
const calloutIconCls = { info: 'text-info', warn: 'text-esc', danger: 'text-exch', ok: 'text-ok', pearl: 'text-brand-strong' };

export function Callout({
  kind = 'info',
  title,
  children,
  className,
}: {
  kind?: keyof typeof calloutCls;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const Icon = calloutIcon[kind];
  return (
    <div className={cn('flex gap-3 rounded-xl border p-3 text-sm sm:p-4', calloutCls[kind], className)}>
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', calloutIconCls[kind])} aria-hidden />
      <div className="min-w-0 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-fg/90">{children}</div>
      </div>
    </div>
  );
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-brand text-brand-fg hover:bg-brand-strong',
        variant === 'outline' && 'border border-border bg-surface hover:bg-surface-2',
        variant === 'ghost' && 'hover:bg-surface-2',
        className,
      )}
    />
  );
}

/** Segmented control (radio group). */
export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex flex-wrap rounded-xl border border-border bg-surface-2 p-1', className)}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            'min-h-9 rounded-lg px-3 text-sm font-medium transition-colors',
            o.value === value ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  suffix,
  hint,
}: {
  label: string;
  value: number | '';
  onChange: (v: number | '') => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center rounded-xl border border-border bg-surface focus-within:ring-2 focus-within:ring-brand">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className="tabular w-full min-w-0 rounded-xl bg-transparent px-3 py-2 text-base outline-none"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
        {suffix && <span className="pr-3 text-sm text-muted">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Check({
  label,
  checked,
  onChange,
  hint,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-3 hover:bg-surface-2">
      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--brand)]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm">
        {label}
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function KeyPoints({ points, title = 'Key points' }: { points: ReactNode[]; title?: string }) {
  return (
    <Card className="border-brand/40 bg-brand/5">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
        <Lightbulb className="h-5 w-5 text-brand-strong" aria-hidden /> {title}
      </h2>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm sm:text-base">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Simple responsive table wrapper. */
export function Table({ head, rows, caption }: { head: ReactNode[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        {caption && <caption className="mb-2 text-left text-xs text-muted">{caption}</caption>}
        <thead>
          <tr className="border-b border-border">
            {head.map((h, i) => (
              <th key={i} scope="col" className="px-2 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/70 align-top">
              {r.map((c, j) => (
                <td key={j} className={cn('px-2 py-2', j === 0 && 'font-medium')}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
