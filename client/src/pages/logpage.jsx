import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/sideBar';
import Navbar from '../components/navbar';
import { HealthCard, HealthCardGrid } from '../components/HealthCard';
import { Activity, Clock, AlertTriangle, CheckCircle, TrendingUp, Download, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function LogPage() {
  const [downtimeData, setDowntimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);

  const fetchDowntime = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (timeRange !== 'all') params.append('range', timeRange);
      if (selectedProject) params.append('projectId', selectedProject);
      
      const response = await axios.get(`/api/logs/downtime?${params.toString()}`, {
        withCredentials: true,
      });
      
      if (response.data.success) {
        setDowntimeData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch downtime data');
      }
    } catch (err) {
      console.error('Error fetching downtime:', err);
      setError(err.response?.data?.message || 'Failed to fetch downtime data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects', {
        withCredentials: true,
      });
      setProjects(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchDowntime();
    fetchProjects();
  }, [timeRange, selectedProject]);

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
    return `${(ms / 3600000).toFixed(1)}h`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusFromPeriod = (period) => {
    return period.ongoing ? 'down' : 'up';
  };

  const generateHealthCards = () => {
    if (!downtimeData?.downtimePeriods?.length) {
      return [
        {
          title: 'System Healthy',
          content: 'No downtime incidents detected in the selected time range',
          status: 'up',
          type: 'server',
          image: null,
        },
      ];
    }

    return downtimeData.downtimePeriods.map((period, index) => ({
      title: period.project?.name || 'Unknown Project',
      content: period.monitor?.name || `Monitor ${period.monitor}`,
      status: getStatusFromPeriod(period),
      type: period.monitor?.type || 'http',
      image: null,
      details: {
        'start time': formatDate(period.startTime),
        'end time': period.endTime ? formatDate(period.endTime) : 'Ongoing',
        'duration': formatDuration(period.durationMs),
        'error': period.error || 'No error details',
        'monitor': period.monitor?.name || 'N/A',
        'project': period.project?.name || 'N/A',
      },
      onDetailsClick: () => handleCardClick(index),
      showDetails: expandedCard === index,
    }));
  };

  const healthCards = generateHealthCards();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <Sidebar />
        
        <main className="flex-1">
          <Navbar />
          
          <div className="space-y-6 p-6">
            <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-500 p-6 text-white shadow-lg">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-100">System Health Overview</p>
                  <h3 className="mt-1 text-2xl font-semibold">Downtime & Incident Tracking</h3>
                  <p className="mt-2 max-w-2xl text-sm text-indigo-100">
                    Monitor system health, track downtime incidents, and analyze service reliability metrics.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25 flex items-center gap-2">
                    <Download size={16} />
                    Export Report
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <h4 className="text-lg font-semibold text-slate-900">Filters</h4>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-500">Time Range:</label>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-indigo-400 text-sm"
                    >
                      <option value="1h">Last Hour</option>
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-500">Project:</label>
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-indigo-400 text-sm"
                    >
                      <option value="">All Projects</option>
                      {projects.map((project) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {downtimeData && (
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
                      <CheckCircle size={14} className="text-emerald-600" />
                      <span className="font-medium">Total Incidents: {downtimeData.totalIncidents}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
                      <Clock size={14} className="text-amber-600" />
                      <span className="font-medium">Total Downtime: {downtimeData.totalDowntimeMinutes}m</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full">
                      <AlertTriangle size={14} className="text-rose-600" />
                      <span className="font-medium">Ongoing: {downtimeData.ongoingDowntimes}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {loading ? (
              <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 size={24} className="animate-spin text-indigo-600" />
                  <span className="text-slate-500">Loading health data...</span>
                </div>
              </section>
            ) : error ? (
              <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={24} className="text-rose-500" />
                  <div>
                    <p className="font-medium text-rose-700">Failed to load downtime data</p>
                    <p className="text-sm text-rose-600">{error}</p>
                  </div>
                  <button
                    onClick={fetchDowntime}
                    className="ml-auto rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
                  >
                    Retry
                  </button>
                </div>
              </section>
            ) : healthCards.length === 1 && healthCards[0].status === 'up' ? (
              <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 shadow-sm">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-emerald-800">All Systems Operational</h4>
                    <p className="mt-1 text-sm text-emerald-600">
                      No downtime incidents detected in the selected time range
                    </p>
                  </div>
                </div>
              </section>
            ) : (
<section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Health Incidents</h4>
                    <p className="text-sm text-slate-500">Click "Show Details" on any card to expand</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Activity size={16} className="text-indigo-500" />
                    {healthCards.length} incident{healthCards.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <HealthCardGrid cards={healthCards} columns={3} />
              </section>
            )}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">Summary Statistics</h4>
                  <p className="text-sm text-slate-500">Key metrics for the selected period</p>
                </div>
              </div>
<div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-3xl bg-emerald-50 p-4 border border-emerald-100">
                  <p className="text-sm text-emerald-600">Uptime</p>
                  <h3 className="mt-1 text-2xl font-bold text-emerald-800">
                    {downtimeData ? (100 - (downtimeData.totalDowntimeMs / (timeRange === '1h' ? 3600000 : timeRange === '24h' ? 86400000 : timeRange === '7d' ? 604800000 : timeRange === '30d' ? 2592000000 : 1)) * 100).toFixed(2) : '100'}%
                  </h3>
                </div>
                <div className="rounded-3xl bg-rose-50 p-4 border border-rose-100">
                  <p className="text-sm text-rose-600">Total Incidents</p>
                  <h3 className="mt-1 text-2xl font-bold text-rose-800">
                    {downtimeData?.totalIncidents || 0}
                  </h3>
                </div>
                <div className="rounded-3xl bg-amber-50 p-4 border border-amber-100">
                  <p className="text-sm text-amber-600">Total Downtime</p>
                  <h3 className="mt-1 text-2xl font-bold text-amber-800">
                    {downtimeData?.totalDowntimeMinutes || 0}m
                  </h3>
                </div>
                <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100">
                  <p className="text-sm text-rose-600">Total Incidents</p>
                  <h3 className="mt-1 text-2xl font-bold text-rose-800">
                    {downtimeData?.totalIncidents || 0}
                  </h3>
                </div>
                <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100">
                  <p className="text-sm text-amber-600">Total Downtime</p>
                  <h3 className="mt-1 text-2xl font-bold text-amber-800">
                    {downtimeData?.totalDowntimeMinutes || 0}m
                  </h3>
                </div>
                <div className="rounded-3xl bg-indigo-50 p-4 border border-indigo-100">
                  <p className="text-sm text-indigo-600">Ongoing Issues</p>
                  <h3 className="mt-1 text-2xl font-bold text-indigo-800">
                    {downtimeData?.ongoingDowntimes || 0}
                  </h3>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}