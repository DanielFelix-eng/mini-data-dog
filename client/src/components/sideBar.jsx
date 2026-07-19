import { LayoutDashboard, FolderKanban, Server, ShieldAlert, Bell, FileText, BarChart3, Settings, HelpCircle, Dog, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from '../context/SidebarContext';

export function Sidebar() {
  const location = useLocation();
  const { collapsed, setHover, toggleSidebar } = useSidebar();
   
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/", active: location.pathname === "/" },
    { icon: FolderKanban, label: "Projects", path: "/projects", active: location.pathname === "/projects" },
    { icon: ShieldAlert, label: "Monitors", path: "/monitor", active: location.pathname === "/monitor" },
    { icon: FileText, label: "Logs", path: "/logs", active: location.pathname === "/logs" },
    { icon: BarChart3, label: "Analytics", path: "/analytics", active: location.pathname === "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings", active: location.pathname === "/settings" },
  ];

  return (
    <aside 
      className={`bg-[#0F1629] min-h-screen flex flex-col justify-between py-5 px-3 transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-[248px]'}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div>
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-3 mb-6 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-[15px] flex-shrink-0">
            <Dog size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-white font-semibold text-[16px] whitespace-nowrap overflow-hidden transition-opacity duration-200">Mini DataDog</span>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className={`mx-auto mb-6 flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 transition-colors ${collapsed ? 'rotate-180' : ''}`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} className="text-slate-300" /> : <ChevronLeft size={18} className="text-slate-300" />}
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, active, badge, path }) => (
            <Link
              key={label}
              to={path}
              className={`flex items-center px-3 py-2.5 rounded-xl text-[14px] transition-colors ${
                active
                  ? "bg-indigo-500/15 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
              title={collapsed ? label : undefined}
            >
              <span className="flex items-center gap-3">
                <Icon size={17} className={`flex-shrink-0 ${active ? "text-indigo-400" : ""}`} />
                {!collapsed && (
                  <span className="whitespace-nowrap overflow-hidden transition-opacity duration-200">{label}</span>
                )}
              </span>
              {badge && !collapsed && (
                <span className="bg-rose-500 text-white text-[11px] font-medium w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Plan card + help */}
     
    </aside>
  );
}