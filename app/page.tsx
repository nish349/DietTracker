'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Auth from '@/components/Auth';
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Settings,
  Trophy,
  Loader2,
  LogOut,
  TrendingUp,
  User,
  Bell,
  BellOff
} from 'lucide-react';
import Image from 'next/image';
import { useTrackerStore } from '@/hooks/useTrackerStore';
import { useNotifications } from '@/hooks/useNotifications';
import WaterTracker from '@/components/WaterTracker';
import EditScheduleModal from '@/components/EditScheduleModal';
import OnboardingModal from '@/components/OnboardingModal';
import MonthlyCheckin from '@/components/MonthlyCheckin';
import StatsModal from '@/components/StatsModal';
import * as Icons from 'lucide-react';

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={() => {}} />;
  }

  return <LoggedInTracker user={user} />;
}

const LoggedInTracker = ({ user }: { user: any }) => {
  const { 
    schedule, 
    completedTasks, 
    waterIntake, 
    profile,
    metrics,
    toggleTask, 
    addWater, 
    updateSchedule,
    refreshData,
    needsCheckin,
    hydrated,
    loading 
  } = useTrackerStore(user);
  
  const { permission, requestPermission } = useNotifications(schedule);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showEdit, setShowEdit] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (needsCheckin) {
      setShowCheckin(true);
    }
  }, [needsCheckin]);

  const getProgress = () => {
    if (!schedule.length) return 0;
    const completed = Object.values(completedTasks).filter(Boolean).length;
    return Math.round((completed / schedule.length) * 100);
  };

  const isActive = (timeStr: string) => {
    const [hours] = timeStr.split(':').map(Number);
    const currentHours = currentTime.getHours();
    return currentHours === hours || (currentHours === hours + 1 && currentTime.getMinutes() < 30);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading || !hydrated) {
    return (
       <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // Show Onboarding if no profile exists
  if (!profile) {
    return <OnboardingModal userId={user.id} onComplete={refreshData} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans selection:bg-emerald-500/30 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Header Stats */}
        <header className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                <Image 
                  src="/Logo.png" 
                  alt="Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  Hi, {profile.name}
                </h1>
                <p className="text-slate-400 text-xs">Protocol Active</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              {/* Notification Button */}
              {permission !== 'granted' ? (
                 <button 
                   onClick={requestPermission}
                   className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md mt-1 flex items-center gap-1 ml-auto transition-colors"
                 >
                   <BellOff className="w-3 h-3" /> Enable Alerts
                 </button>
              ) : (
                <div className="text-[10px] text-emerald-500/50 mt-1 flex items-center gap-1 justify-end">
                  <Bell className="w-3 h-3" /> Alerts On
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-center text-xs mb-4">
             <div 
               onClick={() => setShowStats(true)}
               className="bg-slate-800 p-2 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
             >
              <div className="text-slate-400">Current Weight</div>
              <div className="font-semibold text-white flex items-center justify-center gap-1">
                {metrics[0]?.weight || '--'} kg
                <TrendingUp className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg">
              <div className="text-slate-400">Protein Goal</div>
              <div className="font-semibold text-emerald-400">150g+</div>
            </div>
          </div>

          <div className="flex justify-between text-xs mb-1 text-slate-400">
            <span>Daily Progress</span>
            <span>{getProgress()}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </header>

        {/* Water Tracker Component */}
        <WaterTracker 
          current={waterIntake} 
          goal={4500} 
          onAdd={addWater} 
        />

        {/* Timeline */}
        <div className="space-y-3 relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800 z-0"></div>

          {schedule.map((slot: any) => {
            const IconComponent = (Icons as any)[slot.icon] || Icons.Circle;

            return (
              <div 
                key={slot.id}
                onClick={() => toggleTask(slot.id)}
                className={`relative z-10 flex gap-4 p-4 rounded-xl border transition-all cursor-pointer
                  ${isActive(slot.time) 
                    ? 'bg-slate-900 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.02]' 
                    : 'bg-slate-900/40 border-slate-800/50 hover:bg-slate-900/60'
                  }
                  ${completedTasks[slot.id] ? 'opacity-50 grayscale-[0.5]' : 'opacity-100'}
                `}
              >
                <div className="flex flex-col items-center pt-1">
                  <button className="bg-slate-950 rounded-full p-1 border border-slate-700 transition-colors hover:border-emerald-500">
                    {completedTasks[slot.id] 
                      ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      : <Circle className="w-6 h-6 text-slate-600" />
                    }
                  </button>
                  <span className="text-xs text-slate-500 mt-1 font-mono">{slot.time}</span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold ${completedTasks[slot.id] ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                      {slot.label}
                    </h3>
                    <IconComponent className="w-5 h-5 text-slate-500" />
                  </div>
                  
                  <ul className="space-y-1 mb-2">
                    {slot.items.map((item: string, i: number) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start">
                        <span className="mr-2 text-slate-600">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {slot.alert && (
                    <div className="flex items-center gap-2 text-xs bg-amber-500/10 text-amber-300 p-2 rounded-lg border border-amber-500/20">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      {slot.alert}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-6 right-6 flex gap-3 z-50">
           <button 
            onClick={handleLogout}
            className="bg-red-900/20 hover:bg-red-900/40 text-red-400 p-4 rounded-full shadow-lg border border-red-900/50 transition-all"
          >
            <LogOut className="w-6 h-6" />
          </button>
           <button 
            onClick={() => setShowStats(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-full shadow-lg border border-slate-700 transition-all"
          >
            <User className="w-6 h-6" />
          </button>
           <button 
            onClick={() => setShowEdit(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-full shadow-lg border border-slate-700 transition-all"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Modals */}
        <EditScheduleModal 
          isOpen={showEdit} 
          onClose={() => setShowEdit(false)} 
          schedule={schedule}
          onSave={updateSchedule}
        />

        <StatsModal 
          isOpen={showStats} 
          onClose={() => setShowStats(false)} 
          profile={profile}
          metrics={metrics}
        />

        {showCheckin && (
          <MonthlyCheckin 
            userId={user.id} 
            onClose={() => setShowCheckin(false)}
            onUpdate={refreshData}
          />
        )}

      </div>
    </div>
  );
};
