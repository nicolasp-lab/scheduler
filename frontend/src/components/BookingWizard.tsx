"use client";

import { useState } from "react";
import { addMinutes } from "date-fns";
import { Service } from "@/types";
import { api } from "@/services/api";
import ServiceSelection from "./ServiceSelection";
import DateTimeSelection from "./DateTimeSelection";
import ClientForm from "./ClientForm";

interface BookingWizardProps {
  services: Service[];
}

export default function BookingWizard({ services }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setBookingDate(date);
    setStep(3);
  };

  const handleBookingSubmit = async (formData: { name: string; email: string }) => {
    if (!selectedService || !bookingDate) return;

    try {
      await api.post("/bookings", {
        clientName: formData.name,
        clientEmail: formData.email,
        serviceId: selectedService.id,
        startTime: bookingDate,
        endTime: addMinutes(bookingDate, selectedService.duration),
      });

      setStep(4);
    } catch (error) {
      alert("Failed to create booking. Please try again.");
      console.error("Booking error:", error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-xl shadow-sm border border-gray-100">
      {step === 1 && <ServiceSelection services={services} onSelect={handleServiceSelect} />}

      {step === 2 && (
        <div className="space-y-4">
          <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-black">
            ← Back to Services
          </button>
          <DateTimeSelection onSelect={handleDateSelect} selectedService={selectedService} />
        </div>
      )}

      {step === 3 && selectedService && bookingDate && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <h3 className="font-semibold text-gray-900">Summary</h3>
            <div className="flex justify-between">
              <span>Service</span>
              <span className="font-medium">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date</span>
              <span className="font-medium">
                {bookingDate.toLocaleDateString()} at{" "}
                {bookingDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Total</span>
              <span className="font-bold">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
                  selectedService.price
                )}
              </span>
            </div>
          </div>

          <ClientForm onSubmit={handleBookingSubmit} onCancel={() => setStep(2)} />
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-10 space-y-4">
          <div className="text-5xl">🎉</div>
          <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
          <p className="text-gray-500">We sent a confirmation email to you.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Book another appointment
          </button>
        </div>
      )}
    </div>
  );
}
