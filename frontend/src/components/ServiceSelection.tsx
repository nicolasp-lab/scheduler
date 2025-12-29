"use client";
import { Service } from "@/types";
import { useState } from "react";

export interface ServiceSelectionProps {
  services: Array<Service>;
  onSelect?: (service: Service) => void;
}

export default function ServiceSelection({ services, onSelect }: ServiceSelectionProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  const handleContinue = () => {
    const service = services.find((s) => s.id === selectedServiceId);
    if (service && onSelect) {
      onSelect(service);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Select a Service</h2>

      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedServiceId(service.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedServiceId === service.id
                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-blue-400"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.duration} min</p>
              </div>
              <p className="font-bold text-lg">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(service.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedServiceId}
        className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
