import { Bell, ChevronDown, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div>
        <p className="text-sm font-medium text-indigo-500">Overview</p>
        <h2 className="text-xl font-semibold text-slate-900">Good morning, Felix</h2>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 md:flex">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search"
            className="w-32 border-none bg-transparent outline-none"
          />
        </label>

        <button className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500" />
        </button>

        <button className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-2 pr-3 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 font-semibold text-white">
            F
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800">Felix</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
          <ChevronDown size={16} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}
