'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Ruler, Weight, ArrowRight, Loader2 } from 'lucide-react';

interface OnboardingModalProps {
  userId: string;
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ userId, onComplete }) => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          name,
          height
        });

      if (profileError) throw profileError;

      // 2. Save Initial Metrics
      const { error: metricsError } = await supabase
        .from('metrics')
        .insert({
          user_id: userId,
          weight: parseFloat(weight),
          date: new Date().toISOString()
        });

      if (metricsError) throw metricsError;

      onComplete();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome!</h2>
          <p className="text-slate-400">Let's set up your profile to track your transformation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-10 text-white focus:border-emerald-500 outline-none transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Height</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-10 text-white focus:border-emerald-500 outline-none transition-colors"
                  placeholder="5'11"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Weight (kg)</label>
              <div className="relative">
                <Weight className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-10 text-white focus:border-emerald-500 outline-none transition-colors"
                  placeholder="75.5"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Get Started <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;
