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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur">
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
      <section className="relative pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-sm font-medium text-cyan-700">Infrastructure monitoring</span>
            </p>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1] mb-6">
              Infrastructure monitoring
              <br />
              <span className="block text-3xl font-semibold text-slate-900 mt-2">
                that developers actually enjoy
              </span>
            </h1>
            
            <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Monitor uptime, SSL certificates, and performance from global locations. 
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
            <div className="relative mx-auto max-w-4xl">
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="flex-1 text-center text-sm text-slate-500 font-mono">
                      dashboard.datadog.example.com
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="text-center">
                      <p className="text-sm text-slate-500 font-medium">Uptime</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">99.99%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-500 font-medium">Avg Response</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">142ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-500 font-medium">Incidents (30d)</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">2</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-500 font-medium">Checks/min</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">1,247</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight text-center mb-12">
            Essential monitoring features
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Comprehensive tools built for modern infrastructure.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            <div className="border border-slate-200 rounded-xl p-6 bg-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Uptime Monitoring</h3>
                  <p className="text-slate-600">
                    Monitor HTTP(s), TCP, DNS, and keyword checks with configurable intervals. Get real-time alerts when your services go down.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border border-slate-200 rounded-xl p-6 bg-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Instant Alerts</h3>
                  <p className="text-slate-600">
                    Receive notifications via email, webhook, or Slack the moment an incident is detected. Customizable escalation policies.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border border-slate-200 rounded-xl p-6 bg-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Analytics & Reports</h3>
                  <p className="text-slate-600">
                    Track uptime percentages, response times, and incident history. Generate beautiful status pages for your team and customers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border border-slate-200 rounded-xl p-6 bg-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">SSL Certificate Monitoring</h3>
                  <p className="text-slate-600">
                    Automatic SSL certificate expiration tracking with advance warnings. Never get caught off guard by expired certificates.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border border-slate-200 rounded-xl p-6 bg-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Global Check Locations</h3>
                  <p className="text-slate-600">
                    Run checks from multiple regions worldwide to detect regional outages and measure true global performance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border border-slate-200 rounded-xl p-6 bg-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Team Collaboration</h3>
                  <p className="text-slate-600">
                    Invite team members, assign roles, manage on-call schedules, and share custom status pages with stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-50 via-cyan-50 to-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-6">
            Ready to monitor your infrastructure?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
              className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-lime-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">DataDog</span>
            </div>
            <div className="text-sm text-slate-500">
              © 2024 DataDog. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}