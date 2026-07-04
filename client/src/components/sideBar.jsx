import { LayoutDashboard, FolderKanban, Server, ShieldAlert, Bell, FileText, BarChart3, Settings, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/", active: location.pathname === "/" },
    { icon: FolderKanban, label: "Projects", path: "/projects", active: location.pathname === "/projects" },
    { icon: Server, label: "Services" },
    { icon: ShieldAlert, label: "Monitors", path: "/monitor" },
    { icon: Bell, label: "Alerts", badge: 3 },
    { icon: FileText, label: "Logs" },
    { icon: BarChart3, label: "Analytics" },
          { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-[248px] shrink-0 bg-[#0F1629] min-h-screen flex flex-col justify-between py-5 px-3">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-[15px]">
            🐶
          </div>
          <span className="text-white font-semibold text-[16px]">Mini DataDog</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, active, badge, path }) => (
            <Link
              key={label}
              to={path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] transition-colors ${
                active
                  ? "bg-indigo-500/15 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} className={active ? "text-indigo-400" : ""} />
                {label}
              </span>
              {badge && (
                <span className="bg-rose-500 text-white text-[11px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Plan card + help */}
      <div className="flex flex-col gap-3">
        <div className="bg-white/5 rounded-2xl p-4 relative">
          <button className="absolute top-3 right-3 text-slate-500 text-[12px]">✕</button>
          <p className="text-slate-400 text-[12px] mb-1">Plan</p>
          <p className="text-white font-semibold text-[14px] mb-1">Pro Plan</p>
          <p className="text-slate-400 text-[12px] mb-2">12 days left</p>
          <div className="h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
            <div className="h-full w-1/3 bg-indigo-500 rounded-full" />
          </div>
          <button className="w-full bg-white/10 hover:bg-white/15 text-white text-[13px] font-medium py-2 rounded-lg transition-colors">
            Upgrade Plan
          </button>
        </div>
        <button className="flex items-center gap-2.5 px-3 py-2 text-slate-400 text-[14px]">
          <HelpCircle size={17} />
          Help & Support
        </button>
      </div>
    </aside>
  );
}