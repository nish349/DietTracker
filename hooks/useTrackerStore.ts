'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Helper to debounce updates
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const DEFAULT_SCHEDULE = [
  {
    id: 'wake',
    time: '06:30',
    label: 'Wake Up & Gut Health',
    items: ['Water (500ml)', 'Isabgol (1 tsp)'],
    icon: 'Sun',
    alert: 'Wait 45 mins before eating',
    type: 'health'
  },
  {
    id: 'pre-workout',
    time: '07:15',
    label: 'Pre-Workout Fuel',
    items: ['Black Coffee (No Sugar)', '1 Banana'],
    icon: 'Coffee',
    type: 'food'
  },
  {
    id: 'gym',
    time: '08:00',
    label: 'Gym Session',
    items: ['Hypertrophy Training', 'Sip Water intra-workout'],
    icon: 'Dumbbell',
    type: 'workout'
  },
  {
    id: 'post-workout',
    time: '09:30',
    label: 'Immediate Recovery',
    items: ['Whey Protein (1 Scoop)', 'Creatine (5g)'],
    icon: 'Droplet',
    alert: 'Drink 4L water today for Creatine',
    type: 'food'
  },
  {
    id: 'breakfast',
    time: '10:30',
    label: 'Breakfast (B12 Fix)',
    items: ['Sprouts / Paneer (100g)', 'Vit B12 (Methylcobalamin)'],
    icon: 'Utensils',
    alert: 'Must be Methyl- form',
    type: 'meal'
  },
  {
    id: 'liver-1',
    time: '13:00',
    label: 'Liver Primer',
    items: ['Liv.52 (2 Tabs)'],
    icon: 'Clock',
    alert: '20 mins BEFORE Lunch',
    type: 'meds'
  },
  {
    id: 'lunch',
    time: '13:30',
    label: 'Lunch (D3 Loading)',
    items: ['3 Rotis + Dal + Curd + Veg', 'Vit K2 + Omega-3'],
    icon: 'Utensils',
    alert: 'Add Lemon to Dal for Iron',
    type: 'meal'
  },
  {
    id: 'snack',
    time: '17:00',
    label: 'Protein Snack',
    items: ['Soya Chunks Bhurji (50g)'],
    icon: 'Utensils',
    type: 'meal'
  },
  {
    id: 'liver-2',
    time: '20:30',
    label: 'Liver Primer',
    items: ['Liv.52 (2 Tabs)'],
    icon: 'Clock',
    alert: '20 mins BEFORE Dinner',
    type: 'meds'
  },
  {
    id: 'dinner',
    time: '21:00',
    label: 'Dinner',
    items: ['Rice/Roti', 'Tofu or Paneer Curry'],
    icon: 'Utensils',
    type: 'meal'
  },
  {
    id: 'bedtime',
    time: '22:30',
    label: 'Sleep & Recovery',
    items: ['Magnesium Glycinate', 'Warm Milk (optional)'],
    icon: 'Moon',
    type: 'health'
  }
];

export const useTrackerStore = (user: any) => {
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [waterIntake, setWaterIntake] = useState(0);
  const [time, setTime] = useState(new Date()); // Added time here
  const [profile, setProfile] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Data
  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const today = new Date().toLocaleDateString();

    try {
      // 1. Fetch User Data (Schedule, Tasks, Water)
      const { data: userData } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userData) {
        if (userData.date !== today) {
           setCompletedTasks({});
           setWaterIntake(0);
           setSchedule(userData.schedule || DEFAULT_SCHEDULE);
        } else {
           setCompletedTasks(userData.completed_tasks || {});
           setWaterIntake(userData.water_intake || 0);
           setSchedule(userData.schedule || DEFAULT_SCHEDULE);
        }
      }

      // 2. Fetch Profile
      const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (profileData) setProfile(profileData);

      // 3. Fetch Metrics
      const { data: metricsData } = await supabase.from('metrics').select('*').eq('user_id', user.id).order('date', { ascending: false });
      if (metricsData) setMetrics(metricsData);

    } catch (e) {
      console.error("Load Error", e);
    } finally {
      setHydrated(true);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData, user]);

  // Debounce state
  const debouncedTasks = useDebounce(completedTasks, 1000);
  const debouncedWater = useDebounce(waterIntake, 1000);
  const debouncedSchedule = useDebounce(schedule, 2000);

  // Sync User Data
  useEffect(() => {
    if (!user || !hydrated) return;

    const saveData = async () => {
      const today = new Date().toLocaleDateString();
      await supabase.from('user_data').upsert({
        user_id: user.id,
        date: today,
        completed_tasks: debouncedTasks,
        water_intake: debouncedWater,
        schedule: debouncedSchedule,
        last_updated: new Date().toISOString()
      });
    };
    saveData();
  }, [debouncedTasks, debouncedWater, debouncedSchedule, user, hydrated]);

  // Actions
  const toggleTask = (id: string) => {
    setCompletedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addWater = (amount: number) => {
    setWaterIntake(prev => prev + amount);
  };

  const updateSchedule = (newSchedule: any[]) => {
    setSchedule(newSchedule);
  };

  const refreshData = () => {
    loadData();
  };

  // Derived state for checkin
  const needsCheckin = metrics.length > 0 && 
    (new Date().getTime() - new Date(metrics[0].date).getTime()) > (30 * 24 * 60 * 60 * 1000);

  return {
    schedule,
    completedTasks,
    waterIntake,
    profile,
    metrics,
    toggleTask,
    addWater,
    updateSchedule,
    refreshData,
    hydrated,
    loading,
    needsCheckin
  };
};
