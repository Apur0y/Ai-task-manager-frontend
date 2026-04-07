"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export default function DatePicker({
  onDateSelect,
  selectedDate,
}: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState(selectedDate || "");

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const selectDate = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = selected.toISOString().split("T")[0];
    setSelected(dateString);
    onDateSelect(dateString);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  );
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-white">{monthYear}</h3>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-3">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="text-center text-xs text-slate-400 font-medium h-8 flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }, () => null).map((_, i) => (
            <div key={`empty-${i}`} className="h-8"></div>
          ))}
          {days.map((day) => {
            const dateStr = `${currentDate.getFullYear()}-${String(
              currentDate.getMonth() + 1
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = selected === dateStr;
            const isToday =
              dateStr ===
              new Date().toISOString().split("T")[0];

            return (
              <button
                key={day}
                onClick={() => selectDate(day)}
                className={`h-8 rounded text-sm font-medium transition ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : isToday
                    ? "bg-slate-700 text-yellow-400 border border-yellow-400/50"
                    : "hover:bg-slate-700 text-slate-300"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="text-xs text-slate-400 text-center">
          Selected: {new Date(selected).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
