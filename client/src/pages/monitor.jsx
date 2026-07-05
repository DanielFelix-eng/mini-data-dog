import React, { useEffect, useState } from 'react';
import { ExternalLink, Globe, PlusCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Sidebar } from '../components/sideBar';
import Navbar from '../components/navbar';

const initialForm = {
  projectId: '',
  interval: '5',
  timeout: '10000',
  expectedStatus: '200',
  enabled: true,
};

export default function MonitorPage() {
  const [projects, setProjects] = useState([]);
  const [monitors, setMonitors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [connectToProject, setConnectToProject] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsResponse, monitorsResponse] = await Promise.all([
          fetch('/api/projects', { credentials: 'include' }),
          fetch('/api/monitors', { credentials: 'include' }),
        ]);

        if (!projectsResponse.ok || !monitorsResponse.ok) {
          throw new Error('Unable to load monitor data');
        }

        const projectsData = await projectsResponse.json();
        const monitorsData = await monitorsResponse.json();

        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setMonitors(Array.isArray(monitorsData) ? monitorsData : []);
      } catch {
        setProjects([]);
        setMonitors([]);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!connectToProject) {
      setMessage('Turn on project linking to connect this monitor to an existing project.');
      return;
    }

    if (!form.projectId) {
      setMessage('Please choose an existing project to connect this monitor to.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/monitors', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: form.projectId,
          interval: Number(form.interval),
          timeout: Number(form.timeout),
          expectedStatus: Number(form.expectedStatus),
          enabled: form.enabled,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(data?.message || 'Unable to create the monitor right now.');
        return;
      }

      const selectedProject = projects.find((project) => project._id === form.projectId);
      const createdMonitor = {
        ...data,
        project: data.project || selectedProject,
      };

      setMonitors((prev) => [createdMonitor, ...prev]);
      setForm(initialForm);
      setConnectToProject(true);
      setMessage(
        `${selectedProject?.name || 'Your selected project'} is now ${form.enabled ? 'enabled' : 'saved but disabled'} for monitoring.`
      );
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                  <p className="text-sm font-medium text-indigo-100">Monitoring Setup</p>
                  <h3 className="mt-1 text-2xl font-semibold">Attach monitoring to one of your projects</h3>
                  <p className="mt-2 max-w-2xl text-sm text-indigo-100">
                    Choose an existing project, set your monitoring rules, and decide whether the monitor should start immediately.
                  </p>
                </div>
                <Link to="/" className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25">
                  Back to Dashboard
                </Link>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <PlusCircle size={18} className="text-indigo-500" />
                  <h4 className="text-lg font-semibold text-slate-900">New monitor</h4>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={connectToProject}
                      onChange={(event) => setConnectToProject(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Connect with an existing project
                  </label>

                  {connectToProject && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Existing project</label>
                      <select
                        name="projectId"
                        value={form.projectId}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                      >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name} ({project.projectType || 'Website'})
                          </option>
                        ))}
                      </select>
                      {projects.length === 0 && (
                        <p className="mt-2 text-xs text-slate-500">
                          Create a project first from the Projects page before adding a monitor.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Check interval</label>
                      <select
                        name="interval"
                        value={form.interval}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                      >
                        <option value="1">1 minute</option>
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">Timeout (ms)</label>
                      <input
                        name="timeout"
                        value={form.timeout}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Expected HTTP status</label>
                    <input
                      name="expectedStatus"
                      value={form.expectedStatus}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                    />
                  </div>

                  <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="enabled"
                      checked={form.enabled}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Enable monitoring right away
                  </label>
                </div>

                {message && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <ShieldCheck size={16} />
                  {loading ? 'Saving...' : 'Create monitor'}
                </button>
              </form>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Active monitors</h4>
                    <p className="text-sm text-slate-500">Your current project-linked monitors appear here.</p>
                  </div>
                  <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                    <Globe size={16} />
                  </div>
                </div>

                {monitors.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No monitors connected yet. Create one from the form on the left.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {monitors.map((monitor) => {
                      const project = monitor.project || {};
                      const target = project.websiteUrl || project.apiBaseUrl || 'No target set';

                      return (
                        <div key={monitor._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h5 className="font-semibold text-slate-900">{project.name || 'Connected project'}</h5>
                              <p className="mt-1 text-sm text-slate-600">
                                {monitor.enabled ? 'Monitoring is active' : 'Monitoring is paused'}
                              </p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${monitor.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {monitor.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <ExternalLink size={14} />
                              {target}
                            </span>
                            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                              {monitor.interval || 5} min
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
