import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/sideBar';
import Navbar from '../components/navbar';

import { Activity, CheckCircle, Server, XCircle, TrendingUp, Timer } from 'lucide-react';
import ResponseTimeChart from '../components/ResponseTimeCharts';
import axios from 'axios'
import { StatCard } from '../components/startCard';
import UptimeChart from '../components/uptimeChart';



// const stats = [
//   { title: 'Active Services', value: '24', icon: Server, color: 'from-indigo-500 to-purple-500' },
//   { title: 'Alerts', value: '7', icon: AlertTriangle, color: 'from-amber-500 to-orange-500' },
//   { title: 'Healthy Checks', value: '98%', icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
// ];
const mockData = [
  { checkedAt: "2026-07-08T10:00:00Z", responseTime: 140 },
  { checkedAt: "2026-07-08T10:05:00Z", responseTime: 170 },
  { checkedAt: "2026-07-08T10:10:00Z", responseTime: 120 },
  { checkedAt: "2026-07-08T10:15:00Z", responseTime: 200 },
  { checkedAt: "2026-07-08T10:20:00Z", responseTime: 160 },
];


const activityItems = [
  { label: 'API latency improved by 12%', time: '10 mins ago' },
  { label: '3 new incidents resolved', time: '45 mins ago' },
  { label: 'Weekly report generated', time: '2 hrs ago' },
];


export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    online: 0,
    offline: 0,
    averageResponseTime: 0,

  });
  const [projects, setProjects] = useState([]);

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

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/dashboard-stats', {

          withCredentials: true,
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };

    loadStats();
  }, []);

  const [chartData, setChartData] = useState([])
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const res = await fetch('/api/dashboard/response-times', {
          method: 'GET',
          credentials: 'include',
        })

        const data = await res.json().catch(() => null)
        setChartData(Array.isArray(data) ? data : [])
      } catch (error) {
        console.log(error)
      }
    }

   

    loadChartData()
  }, []) 
   useEffect(() => {
      const loadUptime = async () => {
      try {
        const res = await fetch('/api/dashboard/uptime-percentage', {
          method: 'GET',
          credentials: 'include',
        })
        const data = await res.json().catch(() => null)
        setUptime(Number(data?.uptime) || 0)
      } catch (error) {
        console.log(error)
      }
    }
    loadUptime()
     
   })
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
                  <p className="text-sm font-medium text-indigo-100">System Health</p>
                  <h3 className="mt-1 text-2xl font-semibold">Everything is running smoothly</h3>
                  <p className="mt-2 max-w-xl text-sm text-indigo-100">
                    Your infrastructure is healthy and monitoring is active across all key services.
                  </p>
                </div>
                <button className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur hover:bg-white/25">
                  View Report
                </button>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <StatCard
                title='Total Monitors'
                value={stats?.total || 0}
                icon={<Server size={28} />}
                color={"bg-gradient-to-br from-indigo-500 to-purple-500"}
              />
              <StatCard
                title='Online'

                value={stats?.online || 0}
                icon={<CheckCircle size={28} />}
              />

              <StatCard
                title='Offline'
                value={stats?.offline || 0}
                icon={<XCircle size={28} />}
                color={"bg-red-500"}
              />

              <StatCard
                title='Avg Response'
                value={stats?.total || 0}
                icon={<Timer size={28} />}
                color={"bg-gradient-to-br from-green-500 to-teal-500"}
              />



            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">Recent Projects</h4>
                  <p className="text-sm text-slate-500">Projects created from onboarding are shown here.</p>
                </div>
                <Link to="/projects" className="rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">
                  Add project
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No monitored projects yet. Start onboarding your first target.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
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
                      <p className="mt-3 text-sm text-slate-500">{project.websiteUrl || project.apiBaseUrl || 'Monitoring target pending'}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Performance Trend</h4>
                    <p className="text-sm text-slate-500">Last 7 days</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
                    <TrendingUp size={16} />
                    +8.4%
                  </div>
                </div>

                <div className="flex h-44 items-end gap-3 rounded-2xl bg-slate-50 p-4">
                  {[40, 70, 55, 80, 68, 92, 85].map((height, idx) => (
                    <div key={idx} className="flex-1 rounded-t-xl bg-gradient-to-t from-indigo-500 to-violet-400" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">Recent Activity</h4>
                    <p className="text-sm text-slate-500">Latest updates</p>
                  </div>
                  <Activity size={18} className="text-indigo-500" />
                </div>


                <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>




                </div>
              </div>
              <ResponseTimeChart data={chartData} />
              <UptimeChart uptime={uptime} />

            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
