import React from 'react';

const StatCard = ({ title, value, icon: Icon, color, subValue, status }) => {
    const colorMap = {
        blue: 'from-blue-500 to-indigo-500 shadow-blue-500/20 text-blue-400',
        purple: 'from-purple-500 to-pink-500 shadow-purple-500/20 text-purple-400',
        emerald: 'from-emerald-500 to-teal-500 shadow-emerald-500/20 text-emerald-400',
        orange: 'from-orange-500 to-red-500 shadow-orange-500/20 text-orange-400',
    };

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all hover:-translate-y-1">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>

                    {subValue && (
                        <p className="text-xs text-slate-500">{subValue}</p>
                    )}

                    {status && (
                        <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
              ${status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                    'bg-slate-800 text-slate-400 border-slate-700'}
            `}>
                            {status}
                        </span>
                    )}
                </div>

                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color] || colorMap.blue} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
