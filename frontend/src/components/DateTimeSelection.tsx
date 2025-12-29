"use client";

import { useEffect, useState } from "react";
import { format, addHours, startOfDay, parseISO } from "date-fns";
import { Service } from "@/types";
import { getAvailableSlots } from "@/services/api";

interface DateTimeSelectionProps {
  onSelect?: (date: Date) => void;
  selectedService?: Service | null;
}

export default function DateTimeSelection({ onSelect, selectedService }: DateTimeSelectionProps) {
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const handleTimeClick = (time: string) => {
    if (!selectedDateStr) return;

    setSelectedTime(time);

    const [hours, minutes] = time.split(":").map(Number);

    const dateBase = parseISO(selectedDateStr);
    const finalDate = addHours(startOfDay(dateBase), hours);

    if (onSelect) onSelect(finalDate);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    if (selectedDateStr && selectedService && selectedDateStr >= today) {
      getAvailableSlots(selectedDateStr, selectedService.id).then((slots: string[]) => {
        setTimeSlots(slots);
      });
    }
  }, [selectedDateStr, selectedService]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-center">Select Date & Time</h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          min={today}
          value={selectedDateStr}
          onChange={(e) => {
            setSelectedDateStr(e.target.value);
            setSelectedTime(null);
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Available Time Slots</label>

        {!selectedDateStr ? (
          <p className="text-sm text-gray-400 italic">Please select a date first.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  selectedTime === time
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-white border border-gray-200 hover:border-black hover:bg-gray-50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
