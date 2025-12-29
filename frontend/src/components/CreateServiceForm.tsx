'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { Plus, X, Loader2 } from 'lucide-react';

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface CreateServiceFormProps {
  token: string;
  onSuccess?: () => void;
}

export default function CreateServiceForm({ token, onSuccess }: CreateServiceFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ServiceFormData>();

  const onSubmit = async (data: ServiceFormData) => {
    try {
      await api.post('/services', {
        ...data,
        price: Number(data.price),
        duration: Number(data.duration)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      reset();
      setIsOpen(false);
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error) {
      alert('Failed to create service');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors border border-gray-200 rounded-lg px-4 py-2 hover:bg-white hover:shadow-sm"
      >
        <Plus size={16} />
        Add New Service
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Create New Service</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Service Name</label>
              <input
                {...register('name', { required: true })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
                placeholder="e.g. Full Beard Trim"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Duration (min)</label>
              <input
                type="number"
                {...register('duration', { required: true, min: 1 })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
                placeholder="e.g. 30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Price ($)</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: true, min: 0 })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
                placeholder="e.g. 50.00"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Description</label>
              <input
                {...register('description', { required: true })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-black outline-none"
                placeholder="Short description..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}