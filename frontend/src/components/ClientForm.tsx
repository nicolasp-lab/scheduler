"use client";

import { useForm } from "react-hook-form";

interface ClientFormData {
  name: string;
  email: string;
}

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
}

export default function ClientForm({ onSubmit, onCancel }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <input
          {...register("name", { required: true, minLength: 3 })}
          className="w-full p-2 border rounded-md"
          placeholder="John Doe"
        />
        {errors.name && <span className="text-red-500 text-xs">Name is required</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <input
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          className="w-full p-2 border rounded-md"
          placeholder="john@example.com"
        />
        {errors.email && <span className="text-red-500 text-xs">Valid email is required</span>}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 border rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
}
