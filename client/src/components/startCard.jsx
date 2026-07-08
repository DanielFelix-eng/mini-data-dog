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
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-5 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                        {value}
                    </h2>

                    {trend && (
                        <div className="flex items-center gap-1 mt-2 text-sm">
                            {trend > 0 ? (
                                <>
                                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                                    <span className="text-green-500">
                                        +{trend}%
                                    </span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                                    <span className="text-red-500">
                                        {trend}%
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div
                    className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
};
