'use client';

import React from 'react';
import { X, TrendingUp, Calendar } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  metrics: any[];
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, profile, metrics }) => {
  if (!isOpen) return null;

  // Sort metrics by date desc
  const sortedMetrics = [...metrics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const current = sortedMetrics[0] || {};
  const starting = sortedMetrics[sortedMetrics.length - 1] || {};

  const weightDiff = current.weight && starting.weight 
    ? (current.weight - starting.weight).toFixed(1) 
    : '0';

  const isGain = parseFloat(weightDiff) >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">{profile?.name || 'User'}'s Progress</h2>
            <p className="text-xs text-slate-400">Successfully tracking since {new Date(profile?.created_at).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Hero Stat */}
          <div className={`p-4 rounded-xl border ${isGain ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'} flex items-center justify-between`}>
            <div>
              <div className="text-sm text-slate-400">Total Change</div>
              <div className={`text-3xl font-bold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                {isGain ? '+' : ''}{weightDiff} kg
              </div>
            </div>
            <TrendingUp className={`w-8 h-8 ${isGain ? 'text-emerald-500' : 'text-red-500'}`} />
          </div>

          {/* History List */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              History Log
            </h3>
            <div className="space-y-2">
              {sortedMetrics.map((entry: any) => (
                <div key={entry.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                  <div className="text-sm text-slate-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                  <div className="flex gap-4 text-sm">
                    {entry.chest && <span className="text-slate-500">Chest: <span className="text-slate-300">{entry.chest}"</span></span>}
                    {entry.biceps && <span className="text-slate-500">Arms: <span className="text-slate-300">{entry.biceps}"</span></span>}
                    <span className="font-bold text-white">{entry.weight} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StatsModal;
