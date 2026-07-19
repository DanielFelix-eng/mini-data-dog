// components/dashboard/StatCard.jsx

import { ArrowUpRight, ArrowDownRight } from "lucide-react";


export const StatCard = ({
    title,
    value,
    icon,
    color = "bg-blue-500",
    trend,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-slate-900">
                        {value}
                    </h2>

                    {trend && (
                        <div className="flex items-center gap-1 mt-2 text-sm">
                            {trend > 0 ? (
                                <>
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                    <span className="text-emerald-500">
                                        +{trend}%
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="w-4 h-4 text-rose-500" />
                                    <span className="text-rose-500">
                                        {trend}%
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div
                    className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};
