import { Bell, ChevronDown, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div>
        <p className="text-sm font-medium text-indigo-500">Overview</p>
        <h2 className="text-xl font-semibold text-slate-900">Good morning, Felix</h2>
      </div>

      <div className="flex items-center gap-3">
        

       

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
