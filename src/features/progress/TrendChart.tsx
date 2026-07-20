import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { Point } from './chartData';
import { formatShort } from '../../utils/date';
import { EmptyState } from '../../components/EmptyState';

type TrendChartProps = {
  title: string;
  points: Point[];
  unit?: string;
  kind?: 'line' | 'bar';
  domain?: [number | 'auto', number | 'auto'];
  emptyHint?: string;
};

export function TrendChart({
  title,
  points,
  unit,
  kind = 'line',
  domain = ['auto', 'auto'],
  emptyHint = 'Nog te weinig gegevens om te tonen.',
}: TrendChartProps) {
  const data = points.map((p) => ({ ...p, label: formatShort(p.date) }));

  return (
    <section className="card">
      <h3 className="mb-3 font-heading font-semibold text-text">{title}</h3>
      {data.length < 2 ? (
        <EmptyState title="Nog geen trend" description={emptyHint} />
      ) : (
        <div className="h-56 w-full" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            {kind === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 8, bottom: 5, left: -12 }}>
                <CartesianGrid stroke="rgb(var(--color-sand))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'rgb(var(--color-text-muted))' }} />
                <YAxis
                  domain={domain}
                  tick={{ fontSize: 11, fill: 'rgb(var(--color-text-muted))' }}
                  width={40}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}${unit ? ` ${unit}` : ''}`, title]}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgb(var(--color-sand))',
                    fontSize: 13,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(var(--color-primary))"
                  strokeWidth={2.5}
                  dot={{ r: 2.5 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 8, bottom: 5, left: -12 }}>
                <CartesianGrid stroke="rgb(var(--color-sand))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'rgb(var(--color-text-muted))' }} />
                <YAxis
                  domain={domain}
                  tick={{ fontSize: 11, fill: 'rgb(var(--color-text-muted))' }}
                  width={40}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}${unit ? ` ${unit}` : ''}`, title]}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgb(var(--color-sand))',
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="value" fill="rgb(var(--color-primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
