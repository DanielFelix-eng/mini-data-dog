import React from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  Zap, 
  Shield, 
  Globe, 
  Mail, 
  Lock, 
  ArrowRight,
  CheckCircle,
  Server,
  AlertTriangle,
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react'

const features = [
  {
    icon: Server,
    title: 'Uptime Monitoring',
    description: 'Monitor HTTP(s), TCP, DNS, and keyword checks with configurable intervals. Get real-time alerts when your services go down.',
  },
  {
    icon: AlertTriangle,
    title: 'Instant Alerts',
    description: 'Receive notifications via email, webhook, or Slack the moment an incident is detected. Customizable escalation policies.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Reports',
    description: 'Track uptime percentages, response times, and incident history. Generate beautiful status pages for your team and customers.',
  },
  {
    icon: Shield,
    title: 'SSL Certificate Monitoring',
    description: 'Automatic SSL certificate expiration tracking with advance warnings. Never get caught off guard by expired certificates.',
  },
  {
    icon: Globe,
    title: 'Global Check Locations',
    description: 'Run checks from multiple regions worldwide to detect regional outages and measure true global performance.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Invite team members, assign roles, manage on-call schedules, and share custom status pages with stakeholders.',
  },
]

const stats = [
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '30s', label: 'Check Interval' },
  { value: '50+', label: 'Global Locations' },
  { value: '24/7', label: 'Monitoring' },
]

const integrations = [
  { name: 'Slack', icon: Mail },
  { name: 'Email', icon: Mail },
  { name: 'Webhooks', icon: Globe },
  { name: 'PagerDuty', icon: AlertTriangle },
  { name: 'Discord', icon: Mail },
  { name: 'Telegram', icon: Mail },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-lime-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">DataDog</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
            <Link to="#integrations" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Integrations</Link>
            <Link to="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
            <Link to="#docs" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-200"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-1.5 inline-block" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-cyan-500/10 via-transparent to-emerald-500/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-sm font-medium text-cyan-700">Now with SSL monitoring & multi-region checks</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight leading-[1.1]">
              Infrastructure monitoring
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
                that developers actually enjoy
              </span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Monitor uptime, SSL certificates, and performance from 50+ global locations. 
              Get alerted instantly via Slack, Email, PagerDuty, and more. 
              Built for developers who value simplicity and reliability.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Start monitoring free — no credit card required
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
              >
                Sign in to dashboard
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-slate-500">
              14-day free trial • Cancel anytime • SOC 2 Type II certified
            </p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent z-10 pointer-events-none" />
              <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="ml-4 flex-1 text-center text-sm text-slate-500 font-mono">
                    dashboard.datadog.example.com
                  </div>
                </div>
                <div className="p-6 h-96 bg-slate-50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Uptime', value: '99.99%', change: '+0.01%', trend: 'up', color: 'emerald' },
                      { label: 'Avg Response', value: '142ms', change: '-12ms', trend: 'up', color: 'emerald' },
                      { label: 'Incidents (30d)', value: '2', change: '-3', trend: 'up', color: 'emerald' },
                      { label: 'Checks/min', value: '1,247', change: '+5%', trend: 'up', color: 'cyan' },
                    ].map((stat, i) => (
                      <div key={i} className="rounded-xl bg-white p-4 border border-slate-100 shadow-sm">
                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                          <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-white border border-slate-100 p-4 h-48 flex items-end justify-around">
                    {[85, 92, 78, 95, 88, 94, 90, 96, 87, 93, 91, 97].map((height, i) => (
                      <div
                        key={i}
                        className="w-8 rounded-t bg-gradient-to-t from-cyan-500 to-emerald-500 transition-all duration-500"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-16 px-6 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-wider mb-8">
            Trusted by engineering teams at innovative companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 hover:opacity-100 transition-opacity">
            {['Acme Corp', 'Globex', 'Wayne Enterprises', 'Stark Industries', 'Umbrella Corp', 'Initech'].map((name, i) => (
              <span key={i} className="text-lg font-medium text-slate-400 hover:text-slate-600 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              Everything you need to keep your systems healthy
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Comprehensive monitoring tools built for modern infrastructure. 
              No bloat, no complexity — just reliable monitoring that works.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="mt-2 text-slate-400 text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
              Integrates with your workflow
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Connect DataDog to the tools your team already uses. 
              Set up alerts in seconds with our pre-built integrations.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {integrations.map((integration, i) => (
              <div
                key={i}
                className="group rounded-xl border border-slate-200 bg-white p-6 text-center hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-all">
                  <integration.icon className="w-7 h-7 text-slate-400 group-hover:text-cyan-600 transition-colors" />
                </div>
                <h3 className="font-medium text-slate-900">{integration.name}</h3>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
            >
              View all 20+ integrations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900 via-cyan-900/30 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%)] from-cyan-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-from)_0%,_transparent_50%)] from-emerald-500/10 to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to monitor your infrastructure?
          </h2>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Join thousands of developers who trust DataDog for their uptime monitoring. 
            Start your 14-day free trial — no credit card required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-lime-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start free trial
              <ArrowRight className="w-5 h-5 ml-2 inline-block" />
            </Link>
            <Link
              to="#docs"
              className="w-full sm:w-auto rounded-xl border border-slate-700 bg-transparent px-8 py-4 text-base font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-lime-500 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DataDog</span>
              </div>
              <p className="text-slate-400 max-w-xs">
                Modern infrastructure monitoring for developers. 
                Simple, reliable, and built to scale.
              </p>
              <div className="mt-6 flex gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#integrations" className="hover:text-cyan-400 transition-colors">Integrations</a></li>
                <li><a href="#docs" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Status Page</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Partners</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">SLA</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 DataDog. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}