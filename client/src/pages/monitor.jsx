import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ExternalLink, Globe, PlusCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Sidebar } from '../components/sideBar';
import Navbar from '../components/navbar';

const initialForm = {
  name: '',
  description: '',
  projectType: 'Website',
  websiteUrl: '',
  apiBaseUrl: '',
};

export default function MonitorPage() {
  const [form, setForm] = useState(initialForm);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Unable to load projects');
        }

        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch {
        setProjects([]);
      }
    };

    loadProjects();
  }, []);

  const targetLabel = useMemo(() => {
    if (form.projectType === 'Website') return 'Website URL';
    if (form.projectType === 'API') return 'API base URL';
    return 'Service target';
  }, [form.projectType]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (!form.name.trim() || !form.description.trim()) {
      setMessage('Please add a project name and description.');
      return;
    }

    const targetUrl = form.websiteUrl.trim();
    const apiUrl = form.apiBaseUrl.trim();

    if (form.projectType === 'Website' && !targetUrl) {
      setMessage('A website URL is required for website monitoring.');
      return;
    }

    if ((form.projectType === 'API' || form.projectType === 'Backend Service') && !apiUrl && !targetUrl) {
      setMessage('Please add a target URL for your API or backend service.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          projectType: form.projectType,
          websiteUrl: targetUrl,
          apiBaseUrl: apiUrl,
          status: 'Active',
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(data?.message || 'Unable to create the monitor right now.');
        return;
      }

      const createdProject = {
        ...data,
        target: data.websiteUrl || data.apiBaseUrl || 'Pending',
      };

      setProjects((prev) => [createdProject, ...prev]);
      setForm(initialForm);
      setMessage(`${createdProject.name} is now active for monitoring.`);
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
                  <h3 className="mt-1 text-2xl font-semibold">Onboard a website, API, or service</h3>
                  <p className="mt-2 max-w-2xl text-sm text-indigo-100">
                    Add the target you want monitored and keep it visible in your dashboard.
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
                  <h4 className="text-lg font-semibold text-slate-900">Monitor details</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Project name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Customer Portal"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="What should be monitored?"
                      rows="3"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Project type</label>
                    <select
                      name="projectType"
                      value={form.projectType}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                    >
                      <option value="Website">Website</option>
                      <option value="API">API</option>
                      <option value="Backend Service">Backend Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">{targetLabel}</label>
                    <input
                      name="websiteUrl"
                      value={form.websiteUrl}
                      onChange={handleChange}
                      placeholder={form.projectType === 'Website' ? 'https://example.com' : 'https://api.example.com'}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                    />
                  </div>

                  {(form.projectType === 'API' || form.projectType === 'Backend Service') && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">API base URL (optional)</label>
                      <input
                        name="apiBaseUrl"
                        value={form.apiBaseUrl}
                        onChange={handleChange}
                        placeholder="https://api.example.com/v1"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                      />
                    </div>
                  )}
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
                    <p className="text-sm text-slate-500">Targets created here are stored and shown on your dashboard.</p>
                  </div>
                  <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                    <Globe size={16} />
                  </div>
                </div>

                {projects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No monitors yet. Create your first monitoring target on the left.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div key={project._id || project.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h5 className="font-semibold text-slate-900">{project.name}</h5>
                            <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                          </div>
                          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                            {project.projectType || 'Website'}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <ExternalLink size={14} />
                            {project.websiteUrl || project.apiBaseUrl || 'Pending'}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            <AlertTriangle size={12} />
                            {project.status || 'Active'}
                          </span>
                        </div>
                      </div>
                    ))}
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
