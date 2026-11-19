import { type ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import {
  BookA,
  Brain,
  Calculator,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  Home,
  Library,
  Menu,
  Microscope,
  Moon,
  Search,
  Stethoscope,
  Sun,
  SunMedium,
  Syringe,
  Timer,
  X,
  Droplets,
} from 'lucide-react';
import { applyTheme, useApp, type Theme } from '@/stores/appStore';
import { MODULES } from '@/data/modules';
import {  } from './ui';
import { cn } from '@/lib/cn';

const moduleIcons: Record<string, typeof Home> = {
  physiology: FlaskConical,
  causes: Microscope,
  evaluation: Stethoscope,
  thresholds: Timer,
  treatment: SunMedium,
  neurotoxicity: Brain,
  cholestasis: Droplets,
};

const groups: { title: string; items: { to: string; label: string; icon: typeof Home; id?: string }[] }[] = [
  { title: 'Start', items: [{ to: '/', label: 'Home', icon: Home }] },
  {
    title: 'Learn',
    items: MODULES.map((m) => ({ to: m.path, label: `${m.step}. ${m.title}`, icon: moduleIcons[m.id] ?? BookA, id: m.id })),
  },
  {
    title: 'Practice',
    items: [
      { to: '/cases', label: 'Clinical cases', icon: ClipboardList },
      { to: '/assessment', label: 'Mastery quiz', icon: GraduationCap },
    ],
  },
  {
    title: 'Tools & reference',
    items: [
      { to: '/calculator', label: 'Bilirubin calculator', icon: Calculator },
      { to: '/quick-reference', label: 'Quick reference', icon: Syringe },
      { to: '/glossary', label: 'Glossary', icon: Search },
      { to: '/references', label: 'Evidence & sources', icon: Library },
    ],
  },
];

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const completed = useApp((s) => s.completed);
  return (
    <nav aria-label="Main" className="space-y-5 p-4">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="mb-1.5 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">{g.title}</p>
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const Icon = it.icon;
              return (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    end={it.to === '/'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors',
                        isActive ? 'bg-brand/15 text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg',
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="flex-1 truncate">{it.label}</span>
                    {it.id && completed[it.id] && <CheckCircle2 className="h-4 w-4 text-ok" aria-label="completed" />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function ThemeToggle() {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  const order: Theme[] = ['system', 'dark', 'light'];
  const next = order[(order.indexOf(theme) + 1) % order.length];
  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : SunMedium;
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="inline-flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm text-muted hover:bg-surface-2 hover:text-fg"
      aria-label={`Theme: ${theme}. Switch to ${next}`}
      title={`Theme: ${theme}`}
    >
      <Icon className="h-5 w-5" aria-hidden />
      <span className="hidden capitalize sm:inline">{theme}</span>
    </button>
  );
}

function UnitToggle() {
  const unit = useApp((s) => s.unit);
  const setUnit = useApp((s) => s.setUnit);
  return (
    <div role="radiogroup" aria-label="Bilirubin unit" className="inline-flex rounded-xl border border-border bg-surface-2 p-0.5 text-xs font-semibold">
      {(['mgdl', 'umol'] as const).map((u) => (
        <button
          key={u}
          type="button"
          role="radio"
          aria-checked={unit === u}
          onClick={() => setUnit(u)}
          className={cn('min-h-8 rounded-lg px-2.5', unit === u ? 'bg-surface text-fg shadow-sm' : 'text-muted hover:text-fg')}
        >
          {u === 'mgdl' ? 'mg/dL' : 'µmol/L'}
        </button>
      ))}
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const theme = useApp((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== 'system') return;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const fn = () => applyTheme('system');
    mq?.addEventListener?.('change', fn);
    return () => mq?.removeEventListener?.('change', fn);
  }, [theme]);

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Pages are lazy-loaded: wait (briefly) for the anchor target to mount.
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let raf = 0;
    const seek = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: 'start' });
      else if (tries++ < 120) raf = requestAnimationFrame(seek);
    };
    seek();
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="min-h-dvh bg-bg">
      <a href="#main" className="sr-only z-50 rounded-lg bg-brand px-3 py-2 text-brand-fg focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <header className="no-print sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-2 px-3 sm:px-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-surface-2 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-fg" aria-hidden>
              <Droplets className="h-4.5 w-4.5" />
            </span>
            <span>
              NeoJaundice<span className="text-brand-strong">360</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              to="/calculator"
              className="hidden h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-fg md:inline-flex"
            >
              <Calculator className="h-4 w-4" /> Calculator
            </Link>
            <UnitToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[90rem]">
        <aside className="no-print sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-border lg:block">
          <Nav />
        </aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close menu" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-[min(20rem,85vw)] overflow-y-auto border-r border-border bg-bg shadow-xl">
              <div className="flex h-14 items-center justify-between border-b border-border px-4">
                <span className="font-bold">Menu</span>
                <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-surface-2" onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Nav onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main id="main" className="min-w-0 flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl">{children}</div>
          <footer className="mx-auto mt-16 max-w-5xl border-t border-border pt-6 text-xs text-muted">
            <p>
              Content current to AAP 2022 (≥35 wk), AAP 2025 biliary atresia guidance, NASPGHAN/ESPGHAN 2017, NICE CG98 and CPS 2025. For learning; apply
              local protocols at the bedside. <Link className="underline hover:text-fg" to="/references">Sources</Link>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
