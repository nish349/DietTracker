'use client';

import React, { useState } from 'react';
import { X, Save, Trash2, Plus } from 'lucide-react';

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: any[];
  onSave: (newSchedule: any[]) => void;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({ isOpen, onClose, schedule, onSave }) => {
  const [items, setItems] = useState(schedule);

  if (!isOpen) return null;

  const handleUpdate = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSave = () => {
    onSave(items);
    onClose();
  };

  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this slot?')) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">Edit Schedule</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.map((slot, index) => (
            <div key={slot.id || index} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex gap-3 mb-2">
                <input
                  type="time"
                  value={slot.time}
                  onChange={(e) => handleUpdate(index, 'time', e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm w-24"
                />
                <input
                  type="text"
                  value={slot.label}
                  onChange={(e) => handleUpdate(index, 'label', e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-sm flex-1"
                  placeholder="Task Name"
                />
                <button 
                  onClick={() => handleDelete(index)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={Array.isArray(slot.items) ? slot.items.join(', ') : slot.items}
                onChange={(e) => handleUpdate(index, 'items', e.target.value.split(', '))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-400 text-xs h-16"
                placeholder="Items (comma separated)"
              />
            </div>
          ))}

          <button className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Slot
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditScheduleModal;
