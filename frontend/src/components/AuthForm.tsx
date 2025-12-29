"use client";

import { useForm } from "react-hook-form";

export interface AdminFormData {
  email: string;
  password: string;
}

interface AdminFormProps {
  onSubmit: (data: AdminFormData) => void;
}

export default function AdminForm({ onSubmit }: AdminFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <input
          {...register("email", { required: true, minLength: 3 })}
          className="w-full p-2 border rounded-md"
          placeholder="john@example.com"
        />
        {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <input
          {...register("password", { required: true, minLength: 6 })}
          className="w-full p-2 border rounded-md"
          placeholder="********"
        />
        {errors.password && <span className="text-red-500 text-xs">Password is required</span>}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </div>
    </form>
  );
}
