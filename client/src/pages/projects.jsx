import React, { useEffect, useState } from 'react';
import { ExternalLink, Globe, PlusCircle, ShieldCheck, Trash2 } from 'lucide-react';
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

export default function ProjectsPage() {
  const [form, setForm] = useState(initialForm);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      setMessage('Project deleted successfully');
    } catch {
      setMessage('Failed to delete project');
    }
  };

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
        const savedProjects = localStorage.getItem('monitoringProjects');
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects));
        }
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    localStorage.setItem('monitoringProjects', JSON.stringify(projects));
  }, [projects]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      setMessage('Please add a project name and description.');
      return;
    }

    const targetUrl = form.websiteUrl.trim();
    const apiUrl = form.apiBaseUrl.trim();

    if (!targetUrl && form.projectType === 'Website') {
      setMessage('A website URL is required for website monitoring.');
      return;
    }

    if ((form.projectType === 'API' || form.projectType === 'Backend Service') && !apiUrl && !targetUrl) {
      setMessage('Please add a target URL for your API or backend service.');
      return;
    }

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
        setMessage(data?.message || 'Unable to create project right now.');
        return;
      }

      const createdProject = {
        ...data,
        target: data.websiteUrl || data.apiBaseUrl || 'Pending',
      };

      setProjects((prev) => [createdProject, ...prev]);
      setMessage(`${createdProject.name} is now ready to monitor.`);
      setForm(initialForm);
    } catch {
      setMessage('Network error. Please try again.');
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
                  <p className="text-sm font-medium text-indigo-100">Onboarding</p>
                  <h3 className="mt-1 text-2xl font-semibold">Add a new service to monitor</h3>
                  <p className="mt-2 max-w-2xl text-sm text-indigo-100">
                    Set up a website, API, or backend service in minutes and keep it visible on your dashboard.
                  </p>
                </div>
                <Link
                  to="/"
                  className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25"
                >
                  Back to Dashboard
                </Link>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <PlusCircle size={18} className="text-indigo-500" />
                  <h4 className="text-lg font-semibold text-slate-900">Project details</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Project header</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Marketing Website"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe what this project does and why you want to monitor it."
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
                    <label className="mb-1 block text-sm font-medium text-slate-700">Monitoring target</label>
                    <input
                      name="websiteUrl"
                      value={form.websiteUrl}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                    />
                    <p className="mt-1 text-xs text-slate-500">Website URL is required for website monitoring.</p>
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
                  className="mt-5 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  <ShieldCheck size={16} />
                  Create project
                </button>
              </form>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Your monitored projects</h4>
                    <p className="text-sm text-slate-500">Cards created here will also appear on your dashboard.</p>
                  </div>
                  <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                    <Globe size={16} />
                  </div>
                </div>

                {projects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No projects yet. Create your first monitoring setup on the left.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div key={project.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h5 className="font-semibold text-slate-900">{project.name}</h5>
                            <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                              {project.projectType}
                            </span>
                            <button
                              onClick={() => handleDeleteProject(project._id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Delete project"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <ExternalLink size={14} />
                            {project.target}
                          </span>
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            {project.status}
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
