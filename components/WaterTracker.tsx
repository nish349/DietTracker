'use client';

import React from 'react';
import { Droplet, Plus, Minus } from 'lucide-react';

interface WaterTrackerProps {
  current: number;
  goal: number;
  onAdd: (amount: number) => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ current, goal, onAdd }) => {
  const percentage = Math.min(100, Math.round((current / goal) * 100));

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 mb-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <Droplet className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">Hydration</h3>
            <p className="text-xs text-slate-400">{current}ml / {goal}ml Goal</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">{percentage}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-4 relative">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 relative z-10"
          style={{ width: `${percentage}%` }}
        ></div>
        {/* Milestones lines */}
        <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-slate-700/50"></div>
        <div className="absolute top-0 bottom-0 left-2/4 w-0.5 bg-slate-700/50"></div>
        <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-slate-700/50"></div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => onAdd(250)}
          className="bg-slate-800 hover:bg-blue-600/20 hover:border-blue-500/50 border border-slate-700 rounded-xl p-2 transition-all group"
        >
          <div className="text-xs text-slate-400 group-hover:text-blue-300 mb-1">+250ml</div>
          <div className="text-lg font-bold text-slate-200 group-hover:text-white">Glass</div>
        </button>
        <button 
          onClick={() => onAdd(500)}
          className="bg-slate-800 hover:bg-blue-600/20 hover:border-blue-500/50 border border-slate-700 rounded-xl p-2 transition-all group"
        >
          <div className="text-xs text-slate-400 group-hover:text-blue-300 mb-1">+500ml</div>
          <div className="text-lg font-bold text-slate-200 group-hover:text-white">Bottle</div>
        </button>
        <button 
          onClick={() => onAdd(1000)}
          className="bg-slate-800 hover:bg-blue-600/20 hover:border-blue-500/50 border border-slate-700 rounded-xl p-2 transition-all group"
        >
          <div className="text-xs text-slate-400 group-hover:text-blue-300 mb-1">+1000ml</div>
          <div className="text-lg font-bold text-slate-200 group-hover:text-white">Jug</div>
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
