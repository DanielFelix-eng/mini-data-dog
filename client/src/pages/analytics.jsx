import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Server,
  Activity,
  ChevronDown,
  Download,
  RefreshCw,
  Calendar,
  Filter,
} from 'lucide-react';
import { Sidebar } from '../components/sideBar';
import Navbar from '../components/navbar';

const TIME_RANGES = [
  { value: '1h', label: '1 Hour', granularity: 'minute' },
  { value: '6h', label: '6 Hours', granularity: 'minute' },
  { value: '24h', label: '24 Hours', granularity: 'hour' },
  { value: '7d', label: '7 Days', granularity: 'hour' },
  { value: '30d', label: '30 Days', granularity: 'day' },
];

const STATUS_COLORS = {
  UP: '#22C55E',
  DOWN: '#EF4444',
  UNKNOWN: '#94A3B8',
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('24h');
  const [summary, setSummary] = useState(null);
  const [uptimeData, setUptimeData] = useState([]);
  const [errorData, setErrorData] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [monitorComparison, setMonitorComparison] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    setError('');

    try {
      const [summaryRes, uptimeRes, errorRes, incidentsRes, comparisonRes] = await Promise.all([
        fetch(`/api/analytics/summary?range=${timeRange}`, { credentials: 'include' }),
        fetch(`/api/analytics/uptime-over-time?range=${timeRange}`, { credentials: 'include' }),
        fetch(`/api/analytics/error-rate?range=${timeRange}`, { credentials: 'include' }),
        fetch(`/api/analytics/incidents?range=${timeRange}&limit=20`, { credentials: 'include' }),
        fetch(`/api/analytics/monitor-comparison?range=${timeRange}`, { credentials: 'include' }),
      ]);

      const summaryData = await summaryRes.json().catch(() => null);
      const uptimeResult = await uptimeRes.json().catch(() => ({ data: [] }));
      const errorResult = await errorRes.json().catch(() => ({ data: [], statusCodes: {} }));
      const incidentsResult = await incidentsRes.json().catch(() => ({ incidents: [] }));
      const comparisonResult = await comparisonRes.json().catch(() => ({ monitors: [] }));

      if (!summaryRes.ok) throw new Error(summaryData?.message || 'Failed to load summary');
      if (!uptimeRes.ok) throw new Error(uptimeResult?.message || 'Failed to load uptime data');
      if (!errorRes.ok) throw new Error(errorResult?.message || 'Failed to load error data');
      if (!incidentsRes.ok) throw new Error(incidentsResult?.message || 'Failed to load incidents');
      if (!comparisonRes.ok) throw new Error(comparisonResult?.message || 'Failed to load comparison');

      setSummary(summaryData);
      setUptimeData(uptimeResult.data || []);
      setErrorData(errorResult.data || []);
      setIncidents(incidentsResult.incidents || []);
      setMonitorComparison(comparisonResult.monitors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [timeRange]);

  const formatDuration = (ms) => {
    if (!ms || ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${minutes % 60}m`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  const getStatusColor = (status) => STATUS_COLORS[status] || '#94A3B8';

  const summaryCards = useMemo(() => {
    if (!summary) return [];
    const uptime = summary.avgUptime || 0;
    const incidents = summary.totalIncidents || summary.totalErrors || 0;
    return [
      {
        title: 'Overall Uptime',
        value: `${uptime.toFixed(2)}%`,
        icon: Activity,
        color: 'from-emerald-500 to-teal-500',
        trend: uptime >= 99.9 ? 'up' : uptime >= 99 ? 'neutral' : 'down',
        trendLabel: uptime >= 99.9 ? 'Excellent' : uptime >= 99 ? 'Good' : 'Needs Attention',
      },
      {
        title: 'Avg Response Time',
        value: `${summary.avgResponseTime || 0}ms`,
        icon: Clock,
        color: 'from-blue-500 to-indigo-500',
        trend: (summary.avgResponseTime || 0) <= 200 ? 'up' : (summary.avgResponseTime || 0) <= 500 ? 'neutral' : 'down',
        trendLabel: (summary.avgResponseTime || 0) <= 200 ? 'Fast' : (summary.avgResponseTime || 0) <= 500 ? 'Moderate' : 'Slow',
      },
      {
        title: 'Total Checks',
        value: (summary.totalChecks || 0).toLocaleString(),
        icon: Server,
        color: 'from-indigo-500 to-purple-500',
        trend: 'neutral',
        trendLabel: '',
      },
      {
        title: 'Incidents',
        value: incidents,
        icon: AlertTriangle,
        color: incidents === 0 ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-red-500',
        trend: incidents === 0 ? 'up' : 'down',
        trendLabel: incidents === 0 ? 'No incidents' : `${incidents} incident${incidents !== 1 ? 's' : ''}`,
      },
    ];
  }, [summary]);

  const renderSummaryCard = (card) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{card.title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{card.value}</p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <card.icon size={14} className={`text-${card.color.split('-')[0]}-500`} />
            <span className={`font-medium ${
              card.trend === 'up' ? 'text-emerald-600' :
              card.trend === 'down' ? 'text-rose-600' : 'text-slate-500'
            }`}>
              {card.trendLabel}
            </span>
          </div>
        </div>
        <div className={`rounded-xl p-3 bg-gradient-to-br ${card.color}`}>
          <card.icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const UptimeChart = () => {
    if (!uptimeData.length) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 h-80 flex items-center justify-center">
          <p className="text-slate-400">No uptime data available for this time range</p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Uptime Over Time</h3>
          <span className="text-xs text-slate-500">{timeRange} • Hourly/Daily aggregation</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={uptimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="uptime-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                domain={[95, 100.5]}
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', background: 'white' }}
                labelFormatter={(v) => v}
                formatter={(value) => [`${value.toFixed(2)}%`, 'Uptime']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="uptime"
                name="Uptime %"
                stroke="#22C55E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#uptime-gradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const ErrorRateChart = () => {
    if (!errorData.length) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 h-80 flex items-center justify-center">
          <p className="text-slate-400">No error data available for this time range</p>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Error Rate & Status Codes</h3>
          <span className="text-xs text-slate-500">{timeRange}</span>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={errorData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', background: 'white' }}
                labelFormatter={(v) => v}
                formatter={(value) => [`${value.toFixed(2)}%`, 'Error Rate']}
              />
              <Legend />
              <Bar
                dataKey="errorRate"
                name="Error Rate %"
                radius={[4, 4, 0, 0]}
                fill="#EF4444"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const StatusCodeChart = () => {
    if (!error || !errorData.length) {
      const statusCodes = useMemo(() => {
        const codes = {};
        errorData.forEach(d => {
          Object.entries(d.statusCodes || {}).forEach(([code, count]) => {
            codes[code] = (codes[code] || 0) + count;
          });
        });
        return Object.entries(codes)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8);
      }, [errorData]);

      if (!statusCodes.length) {
        return (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 h-80 flex items-center justify-center">
            <p className="text-slate-400">No status code data available</p>
          </div>
        );
      }

      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Status Code Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCodes.map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {statusCodes.map((_, index) => (
                    <Cell key={index} fill={['#22C55E', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'][index % 8]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', background: 'white' }}
                  formatter={(value) => [value, 'Requests']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }
    return null;
  };

  const IncidentTimeline = () => {
    if (!incidents.length) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Incidents</h3>
          <div className="text-center py-8 text-slate-400">
            <AlertTriangle size={32} className="mx-auto mb-2 text-slate-300" />
            <p>No incidents in this time range</p>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Incidents</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {incidents.map((incident, index) => (
            <div
              key={`${incident.monitor}-${incident.startTime}-${index}`}
              className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-500" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{incident.monitorName}</p>
                <p className="text-sm text-slate-500">
                  {new Date(incident.startTime).toLocaleString()} •
                  {incident.ongoing ? 'Ongoing' : `Duration: ${formatDuration(incident.durationMs)}`}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                incident.ongoing ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {incident.ongoing ? 'Active' : 'Resolved'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const MonitorComparisonTable = () => {
    if (!monitorComparison.length) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Monitor Comparison</h3>
          <div className="text-center py-8 text-slate-400">
            <Server size={32} className="mx-auto mb-2 text-slate-300" />
            <p>No monitors configured yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Monitor Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                <th className="pb-3">Monitor</th>
                <th className="pb-3 text-right">Uptime</th>
                <th className="pb-3 text-right">Avg Response</th>
                <th className="pb-3 text-right">Checks</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monitorComparison.map((monitor) => (
                <tr key={monitor.id} className="hover:bg-slate-50">
                  <td className="py-3">
                    <div className="font-medium text-slate-900">{monitor.name}</div>
                    <div className="text-xs text-slate-500">{monitor.type} • {monitor.interval}min</div>
                  </td>
                  <td className="py-3 text-right font-medium">
                    <span className={monitor.uptime >= 99.9 ? 'text-emerald-600' : monitor.uptime >= 99 ? 'text-amber-600' : 'text-rose-600'}>
                      {monitor.uptime.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 text-right text-slate-600">{monitor.avgResponseTime}ms</td>
                  <td className="py-3 text-right text-slate-500">{monitor.totalChecks}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      monitor.lastStatus === 'UP' ? 'bg-emerald-100 text-emerald-700' :
                      monitor.lastStatus === 'DOWN' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {monitor.lastStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1">
          <Navbar />

          <div className="space-y-6 p-6">
            <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-500">Analytics</p>
                <h3 className="mt-1 text-2xl font-semibold">Monitoring Analytics</h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Deep dive into uptime trends, error rates, incidents, and monitor performance.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
                >
                  {TIME_RANGES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <button
                  onClick={fetchAll}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </section>

            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <section className="grid gap-4 md:grid-cols-4">
              {summaryCards.map((card, index) => (
                <div key={index}>{renderSummaryCard(card)}</div>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <UptimeChart />
              <ErrorRateChart />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <IncidentTimeline />
              <StatusCodeChart />
            </section>

            <section>
              <MonitorComparisonTable />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}