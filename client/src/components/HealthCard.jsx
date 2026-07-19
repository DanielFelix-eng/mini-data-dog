import { ChevronDown, AlertTriangle, CheckCircle, XCircle, HelpCircle, Server, Database, Globe, Wifi, Loader2, ShieldAlert } from 'lucide-react';

const statusIcons = {
  up: CheckCircle,
  down: XCircle,
  degraded: AlertTriangle,
  unknown: HelpCircle,
};

const statusColors = {
  up: 'bg-emerald-500',
  down: 'bg-rose-500',
  degraded: 'bg-amber-500',
  unknown: 'bg-slate-500',
};

const statusBgColors = {
  up: 'bg-emerald-50 border-emerald-100',
  down: 'bg-rose-50 border-rose-100',
  degraded: 'bg-amber-50 border-amber-100',
  unknown: 'bg-slate-50 border-slate-100',
};

const statusTextColors = {
  up: 'text-emerald-700 bg-emerald-100',
  down: 'text-rose-700 bg-rose-100',
  degraded: 'text-amber-700 bg-amber-100',
  unknown: 'text-slate-700 bg-slate-100',
};

const typeIcons = {
  http: Globe,
  ssl: ShieldAlert,
  ping: Wifi,
  database: Database,
  server: Server,
  api: Loader2,
};

export function HealthCard({
  title,
  content,
  image,
  status = 'unknown',
  type = 'http',
  onDetailsClick,
  details,
  showDetails = false,
}) {
  const StatusIcon = statusIcons[status] || statusIcons.unknown;
  const TypeIcon = typeIcons[type] || typeIcons.http;
  const statusColor = statusColors[status] || statusColors.unknown;
  const statusBg = statusBgColors[status] || statusBgColors.unknown;
  const statusText = statusTextColors[status] || statusTextColors.unknown;

  return (
    <div className="rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className={`p-5 ${statusBg}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${statusColor} flex items-center justify-center text-white flex-shrink-0`}>
                <StatusIcon size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-slate-900 truncate">{title}</h3>
                <p className="mt-1 text-sm text-slate-500 truncate">{content}</p>
              </div>
            </div>
            
            {image && (
              <div className="mt-4 rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            {details && showDetails && (
              <div className="mt-4 rounded-xl bg-white p-4 border border-slate-200 animate-fade-in">
                <div className="space-y-3 text-sm text-slate-600">
                  {Object.entries(details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className={`rounded-xl px-3 py-1 text-xs font-medium ${statusText} capitalize`}>
              {status}
            </span>
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <TypeIcon size={16} />
            </div>
          </div>
        </div>

        {onDetailsClick && (
          <button
            onClick={onDetailsClick}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 backdrop-blur hover:bg-white transition-all border border-slate-100"
          >
            {showDetails ? (
              <>
                <ChevronDown size={16} className="rotate-180" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Show Details
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function HealthCardGrid({ cards, columns = 3 }) {
  return (
    <div className={`grid gap-4 ${columns === 1 ? 'grid-cols-1' : columns === 2 ? 'md:grid-cols-2' : columns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
      {cards.map((card, index) => (
        <HealthCard key={index} {...card} />
      ))}
    </div>
  );
}