'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Ruler, Weight, Save, X, Loader2 } from 'lucide-react';

interface MonthlyCheckinProps {
  userId: string;
  onClose: () => void;
  onUpdate: () => void; // Trigger refresh
}

const MonthlyCheckin: React.FC<MonthlyCheckinProps> = ({ userId, onClose, onUpdate }) => {
  const [weight, setWeight] = useState('');
  const [chest, setChest] = useState('');
  const [biceps, setBiceps] = useState('');
  const [hips, setHips] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('metrics')
        .insert({
          user_id: userId,
          weight: parseFloat(weight),
          chest: chest ? parseFloat(chest) : null,
          biceps: biceps ? parseFloat(biceps) : null,
          hips: hips ? parseFloat(hips) : null,
          date: new Date().toISOString()
        });

      if (error) throw error;
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error saving metrics:', error);
      alert('Failed to save metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Monthly Check-in 📅</h2>
          <p className="text-slate-400 text-sm">Update your stats to track your gains!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Current Weight (kg) *</label>
            <div className="relative">
              <Weight className="absolute left-3 top-2.5 w-5 h-5 text-emerald-500" />
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl py-2 pl-10 text-emerald-400 font-bold focus:border-emerald-500 outline-none transition-colors"
                placeholder="e.g. 74.5"
                required
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">Optional Measurements (in)</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Chest</label>
                <input
                  type="number"
                  step="0.1"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-white text-sm focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Biceps</label>
                <input
                  type="number"
                  step="0.1"
                  value={biceps}
                  onChange={(e) => setBiceps(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-white text-sm focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Hips</label>
                <input
                  type="number"
                  step="0.1"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-1.5 px-2 text-white text-sm focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Progress</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MonthlyCheckin;
