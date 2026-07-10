import React, { useMemo } from 'react';
import { ResponsiveContainer, Pie, PieChart , Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#22C55E', '#EF4444']; // green = uptime, red = downtime

export default function UptimeChart({ uptime = 0, height = 260 }) {
  const safeUptime = Number.isFinite(Number(uptime)) ? Math.max(0, Math.min(100, Number(uptime))) : 0;

  const data = useMemo(
    () => [
      { name: 'Uptime', value: safeUptime },
      { name: 'Downtime', value: 100 - safeUptime },
    ],
    [safeUptime]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-semibold text-slate-900">Uptime</h4>
          <p className="text-sm text-slate-500">Last 30 days</p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          {safeUptime.toFixed(1)}%
        </div>
      </div>

      <div className="h-64" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', background: 'white' }}
              formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
              labelFormatter={() => ''}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 12, color: '#334155' }}
            />

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              stroke="none"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            {/* center label */}
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#0f172a">
              <tspan style={{ fontSize: 22, fontWeight: 700 }}>{safeUptime.toFixed(0)}%</tspan>
              <tspan style={{ fontSize: 12, fontWeight: 500 }} dx="0" dy="18">
                uptime
              </tspan>
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

