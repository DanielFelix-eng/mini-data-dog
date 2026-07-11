import React, { useEffect, useState } from 'react';
import { Bell, ShieldAlert, Shield, Globe, Clock, CheckCircle, Save, Loader2 } from 'lucide-react';
import { Sidebar } from '../components/sideBar';
import Navbar from '../components/navbar';

const defaultSettings = {
  defaultInterval: '5',
  defaultTimeout: '10000',
  defaultExpectedStatus: '200',
  defaultEnabled: true,
  alertOnDown: true,
  alertOnRecovery: true,
  alertChannels: {
    email: true,
    webhook: false,
    slack: false,
  },
  webhookUrl: '',
  slackWebhookUrl: '',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('monitoring');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setSettings({ ...defaultSettings, ...data });
      }
    } catch {
      const saved = localStorage.getItem('monitorSettings');
      if (saved) {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      }
    }
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(data?.message || 'Failed to save settings');
        return;
      }

      localStorage.setItem('monitorSettings', JSON.stringify(settings));
      setMessage('Settings saved successfully');
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const tabs = [
    { id: 'monitoring', label: 'Monitoring', icon: Shield },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Globe },
  ];

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
                  <p className="text-sm font-medium text-indigo-100">Configuration</p>
                  <h3 className="mt-1 text-2xl font-semibold">Monitoring Settings</h3>
                  <p className="mt-2 max-w-2xl text-sm text-indigo-100">
                    Configure default monitoring parameters, alert preferences, and integration settings.
                    These settings apply to new monitors by default.
                  </p>
                </div>
                <button
                  type="submit"
                  form="settings-form"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Save size={16} />
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </section>

            <form id="settings-form" onSubmit={saveSettings} className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <nav className="border-b border-slate-200" aria-label="Settings tabs">
                  <ul className="flex gap-6 px-6" role="tablist">
                    {tabs.map((tab) => (
                      <li key={tab.id} role="presentation">
                        <button
                          type="button"
                          role="tab"
                          aria-selected={activeTab === tab.id}
                          aria-controls={`${tab.id}-panel`}
                          id={`${tab.id}-tab`}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === tab.id
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
                          }`}
                        >
                          <tab.icon size={16} />
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-6">
                  {message && (
                    <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      {message}
                    </div>
                  )}

                  {activeTab === 'monitoring' && (
                    <div id="monitoring-panel" role="tabpanel" aria-labelledby="monitoring-tab" className="space-y-6">
                      <div>
                        <h4 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Shield className="text-indigo-500" size={20} />
                          Default Monitoring Parameters
                        </h4>
                        <p className="mb-4 text-sm text-slate-500">
                          These values will be used as defaults when creating new monitors. You can override them per monitor.
                        </p>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Check Interval</label>
                          <select
                            name="defaultInterval"
                            value={settings.defaultInterval}
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
                          <p className="mt-1 text-xs text-slate-500">How often to check the target endpoint</p>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Request Timeout (ms)</label>
                          <input
                            name="defaultTimeout"
                            type="number"
                            value={settings.defaultTimeout}
                            onChange={handleChange}
                            min="1000"
                            max="300000"
                            step="1000"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                          />
                          <p className="mt-1 text-xs text-slate-500">Maximum time to wait for a response (1000-300000 ms)</p>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Expected HTTP Status</label>
                          <input
                            name="defaultExpectedStatus"
                            type="number"
                            value={settings.defaultExpectedStatus}
                            onChange={handleChange}
                            min="100"
                            max="599"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                          />
                          <p className="mt-1 text-xs text-slate-500">HTTP status code considered as healthy (e.g., 200, 201, 204)</p>
                        </div>

                        <div>
                          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                            <input
                              name="defaultEnabled"
                              type="checkbox"
                              checked={settings.defaultEnabled}
                              onChange={handleChange}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            Enable monitoring by default for new monitors
                          </label>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <h5 className="mb-3 font-medium text-slate-900 flex items-center gap-2">
                          <Clock className="text-indigo-500" size={18} />
                          Interval Presets
                        </h5>
                        <p className="text-sm text-slate-500 mb-3">
                          Quick-select common monitoring intervals. These presets will be available when creating new monitors.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {['1', '2', '5', '10', '15', '30', '60'].map((interval) => (
                            <button
                              key={interval}
                              type="button"
                              onClick={() => handleChange({ target: { name: 'defaultInterval', value: interval } })}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                settings.defaultInterval === interval
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white text-slate-600 hover:bg-indigo-50'
                              }`}
                            >
                              {interval} min
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'alerts' && (
                    <div id="alerts-panel" role="tabpanel" aria-labelledby="alerts-tab" className="space-y-6">
                      <div>
                        <h4 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Bell className="text-indigo-500" size={20} />
                          Alert Preferences
                        </h4>
                        <p className="mb-4 text-sm text-slate-500">
                          Configure when and how you want to be notified about monitor status changes.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                          <input
                            name="alertOnDown"
                            type="checkbox"
                            checked={settings.alertOnDown}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <p className="font-medium text-slate-900">Alert when monitor goes down</p>
                            <p className="text-xs text-slate-500">Notify immediately when a check fails</p>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                          <input
                            name="alertOnRecovery"
                            type="checkbox"
                            checked={settings.alertOnRecovery}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <p className="font-medium text-slate-900">Alert on recovery</p>
                            <p className="text-xs text-slate-500">Notify when a previously failing monitor recovers</p>
                          </div>
                        </label>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <h5 className="mb-3 font-medium text-slate-900">Alert Channels</h5>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                              <input
                                name="alertChannels.email"
                                type="checkbox"
                                checked={settings.alertChannels.email}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">Email notifications</p>
                                <p className="text-xs text-slate-500">Send alerts to your registered email address</p>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                              <input
                                name="alertChannels.webhook"
                                type="checkbox"
                                checked={settings.alertChannels.webhook}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">Webhook</p>
                                <p className="text-xs text-slate-500">POST JSON payload to a custom endpoint</p>
                              </div>
                            </label>

                            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                              <input
                                name="alertChannels.slack"
                                type="checkbox"
                                checked={settings.alertChannels.slack}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">Slack</p>
                                <p className="text-xs text-slate-500">Send alerts to a Slack channel via webhook</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'integrations' && (
                    <div id="integrations-panel" role="tabpanel" aria-labelledby="integrations-tab" className="space-y-6">
                      <div>
                        <h4 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <Globe className="text-indigo-500" size={20} />
                          Webhook Integration
                        </h4>
                        <p className="mb-4 text-sm text-slate-500">
                          Configure a webhook URL to receive monitor status updates as JSON payloads.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Webhook URL</label>
                          <input
                            name="webhookUrl"
                            type="url"
                            value={settings.webhookUrl}
                            onChange={handleChange}
                            placeholder="https://your-server.com/webhook"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                          />
                          <p className="mt-1 text-xs text-slate-500">POST requests will be sent on status changes</p>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">Slack Webhook URL</label>
                          <input
                            name="slackWebhookUrl"
                            type="url"
                            value={settings.slackWebhookUrl}
                            onChange={handleChange}
                            placeholder="https://hooks.slack.com/services/..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-400"
                          />
                          <p className="mt-1 text-xs text-slate-500">Incoming webhook URL from Slack app configuration</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <h5 className="mb-3 font-medium text-slate-900">Webhook Payload Example</h5>
                          <pre className="rounded-xl bg-slate-900 p-4 text-xs text-green-300 overflow-x-auto"><code>{JSON.stringify({
  monitor: {
    id: "monitor_123",
    name: "Production API",
    url: "https://api.example.com/health",
  },
  status: "down",
  previousStatus: "up",
  timestamp: "2026-01-15T10:30:00.000Z",
  responseTime: 0,
  error: "Connection timeout",
}, null, 2)}</code></pre>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-200">
                        <h4 className="mb-4 text-lg font-semibold text-slate-900 flex items-center gap-2">
                          <ShieldAlert className="text-indigo-500" size={20} />
                          Status Page Integration
                        </h4>
                        <p className="mb-4 text-sm text-slate-500">
                          Connect your status page provider to automatically update component status.
                        </p>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 text-center">
                          <p className="font-medium text-slate-900 mb-1">Coming Soon</p>
                          <p>StatusPage.io, Better Uptime, and custom status page integrations are planned.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}