import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { fromMgdl, unitLabel, type BiliUnit, UMOL_PER_MGDL } from '@/lib/bili/units';

export interface Series {
  id: string;
  label: string;
  color: string; // CSS color or var()
  dashed?: boolean;
  /** Fill the area above this curve (zone shading). */
  fillAbove?: boolean;
  points: { h: number; v: number }[];
}

export interface Marker {
  h: number;
  v: number;
  method?: 'TSB' | 'TcB';
  label?: string;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(320);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setW(Math.max(280, el.clientWidth));
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function valueAt(points: Series['points'], h: number): number | null {
  if (!points.length || h < points[0].h || h > points[points.length - 1].h) return null;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (h >= a.h && h <= b.h) return a.v + ((b.v - a.v) * (h - a.h)) / (b.h - a.h || 1);
  }
  return points[points.length - 1].v;
}

export function BiliChart({
  series,
  markers = [],
  unit,
  xMax = 168,
  yMax = 30,
  title,
  height = 340,
}: {
  series: Series[];
  markers?: Marker[];
  unit: BiliUnit;
  xMax?: number;
  yMax?: number;
  title: string;
  height?: number;
}) {
  const [wrapRef, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const compact = width < 480;
  const m = { top: 14, right: compact ? 10 : 18, bottom: 40, left: compact ? 40 : 52 };
  const W = width;
  const H = compact ? Math.min(height, 300) : height;
  const iw = W - m.left - m.right;
  const ih = H - m.top - m.bottom;
  const x = (h: number) => m.left + (h / xMax) * iw;
  const y = (v: number) => m.top + ih - (Math.min(v, yMax) / yMax) * ih;

  const xTicks = useMemo(() => {
    const step = xMax <= 120 ? 12 : 24;
    const t: number[] = [];
    for (let h = 0; h <= xMax; h += step) t.push(h);
    return t;
  }, [xMax]);

  const yTicks = useMemo(() => {
    const t: { mg: number; label: string }[] = [];
    if (unit === 'mgdl') for (let v = 0; v <= yMax; v += 5) t.push({ mg: v, label: String(v) });
    else for (let u = 0; u <= yMax * UMOL_PER_MGDL; u += 100) t.push({ mg: u / UMOL_PER_MGDL, label: String(u) });
    return t;
  }, [unit, yMax]);

  const pathFor = (pts: Series['points']) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.h).toFixed(1)},${y(p.v).toFixed(1)}`).join('');

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const h = ((px - m.left) / iw) * xMax;
    setHover(h >= 0 && h <= xMax ? Math.round(h) : null);
  };

  const hoverRows =
    hover == null
      ? []
      : series
          .map((s) => ({ s, v: valueAt(s.points, hover) }))
          .filter((r): r is { s: Series; v: number } => r.v != null);

  const fmt = (mg: number) => (unit === 'mgdl' ? fromMgdl(mg, unit).toFixed(1) : Math.round(fromMgdl(mg, unit)).toString());
  const summary = `${title}. ${series.map((s) => s.label).join(', ')}${markers.length ? `; ${markers.length} plotted measurement(s)` : ''}.`;

  return (
    <figure className="w-full min-w-0">
      <div ref={wrapRef} className="relative w-full min-w-0 select-none overflow-hidden">
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={summary}
          className="block touch-pan-y"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {/* grid */}
          {yTicks.map((t) => (
            <g key={t.label}>
              <line x1={m.left} x2={W - m.right} y1={y(t.mg)} y2={y(t.mg)} stroke="var(--border)" strokeWidth={1} />
              <text x={m.left - 6} y={y(t.mg)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--muted)" className="tabular">
                {t.label}
              </text>
            </g>
          ))}
          {xTicks.map((h) => (
            <g key={h}>
              <line x1={x(h)} x2={x(h)} y1={m.top} y2={m.top + ih} stroke="var(--border)" strokeWidth={h % 24 === 0 ? 1 : 0.5} strokeDasharray={h % 24 === 0 ? undefined : '2 3'} />
              {(!compact || h % 24 === 0) && (
                <text x={x(h)} y={m.top + ih + 16} textAnchor="middle" fontSize={11} fill="var(--muted)" className="tabular">
                  {h}
                </text>
              )}
            </g>
          ))}
          <text x={m.left + iw / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="var(--muted)">
            Age (hours)
          </text>
          <text transform={`translate(12 ${m.top + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize={11} fill="var(--muted)">
            Bilirubin ({unitLabel(unit)})
          </text>

          {/* zone fills */}
          {series
            .filter((s) => s.fillAbove && s.points.length > 1)
            .map((s) => (
              <path
                key={`fill-${s.id}`}
                d={`${pathFor(s.points)}L${x(s.points[s.points.length - 1].h)},${m.top}L${x(s.points[0].h)},${m.top}Z`}
                fill={s.color}
                opacity={0.07}
              />
            ))}

          {/* curves */}
          {series.filter((s) => s.points.length > 1).map((s) => (
            <path key={s.id} d={pathFor(s.points)} fill="none" stroke={s.color} strokeWidth={2.5} strokeDasharray={s.dashed ? '7 5' : undefined} strokeLinejoin="round" />
          ))}

          {/* measurements */}
          {markers.map((mk, i) => {
            const cx = x(Math.min(mk.h, xMax));
            const cy = y(mk.v);
            return (
              <g key={i}>
                {mk.method === 'TcB' ? (
                  <rect x={cx - 6} y={cy - 6} width={12} height={12} transform={`rotate(45 ${cx} ${cy})`} fill="var(--surface)" stroke="var(--fg)" strokeWidth={2.5} />
                ) : (
                  <circle cx={cx} cy={cy} r={6.5} fill="var(--brand)" stroke="var(--fg)" strokeWidth={2} />
                )}
                <title>{`${mk.method ?? 'TSB'} ${fmt(mk.v)} ${unitLabel(unit)} at ${mk.h} h`}</title>
                {mk.label && (
                  <text x={cx} y={cy - 12} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--fg)">
                    {mk.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* hover crosshair */}
          {hover != null && (
            <g pointerEvents="none">
              <line x1={x(hover)} x2={x(hover)} y1={m.top} y2={m.top + ih} stroke="var(--fg)" strokeOpacity={0.35} />
              {hoverRows.map((r) => (
                <circle key={r.s.id} cx={x(hover)} cy={y(r.v)} r={3.5} fill={r.s.color} />
              ))}
            </g>
          )}
        </svg>
        {hover != null && hoverRows.length > 0 && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-lg border border-border bg-surface/95 p-2 text-xs shadow-lg"
            style={x(hover) > W / 2 ? { left: m.left + 6 } : { right: m.right + 6 }}
          >
            <p className="mb-1 font-semibold tabular">{hover} h</p>
            {hoverRows.map((r) => (
              <p key={r.s.id} className="flex items-center justify-between gap-3 tabular">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: r.s.color }} />
                  {r.s.label}
                </span>
                <span className="font-semibold">{fmt(r.v)}</span>
              </p>
            ))}
          </div>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {series.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1.5">
            <svg width="22" height="8" aria-hidden>
              <line x1="0" x2="22" y1="4" y2="4" stroke={s.color} strokeWidth="3" strokeDasharray={s.dashed ? '6 4' : undefined} />
            </svg>
            {s.label}
          </span>
        ))}
        {markers.length > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-fg bg-brand" aria-hidden /> TSB
            <span className="ml-2 inline-block h-2.5 w-2.5 rotate-45 border-2 border-fg bg-surface" aria-hidden /> TcB
          </span>
        )}
      </figcaption>
      <details className="mt-2 text-xs">
        <summary className="cursor-pointer text-muted hover:text-fg">Show values as a table</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="tabular min-w-full text-left">
            <thead>
              <tr>
                <th className="pr-3">Hour</th>
                {series.map((s) => (
                  <th key={s.id} className="pr-3">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[12, 18, 24, 36, 48, 60, 72, 84, 96, 120, 144, 168].filter((h) => h <= xMax).map((h) => (
                <tr key={h}>
                  <td className="pr-3">{h}</td>
                  {series.map((s) => {
                    const v = valueAt(s.points, h);
                    return (
                      <td key={s.id} className="pr-3">
                        {v == null ? '—' : fmt(v)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
