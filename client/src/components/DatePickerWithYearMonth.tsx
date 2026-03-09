import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface DatePickerWithYearMonthProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  mode?: 'single' | 'range' | 'multiple';
}

export function DatePickerWithYearMonth({
  selected,
  onSelect,
  disabled,
  mode = 'single',
}: DatePickerWithYearMonthProps) {
  const [displayMonth, setDisplayMonth] = useState<Date>(selected || new Date());

  const currentYear = displayMonth.getFullYear();
  const currentMonth = displayMonth.getMonth();

  const handleYearChange = (offset: number) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(currentYear + offset);
    setDisplayMonth(newDate);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(month);
    setDisplayMonth(newDate);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year options (current year +/- 50 years)
  const startYear = new Date('1900-01-01').getFullYear();
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <div className="p-3 space-y-3">
      {/* Year and Month Selectors */}
      <div className="grid grid-cols-2 gap-2">
        {/* Year Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground px-2">Year</label>
          <select
            value={currentYear}
            onChange={(e) => {
              const newDate = new Date(displayMonth);
              newDate.setFullYear(parseInt(e.target.value));
              setDisplayMonth(newDate);
            }}
            className="w-full h-8 px-2 py-1 text-sm border border-input rounded-md bg-background text-foreground"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground px-2">Month</label>
          <select
            value={currentMonth}
            onChange={(e) => handleMonthChange(parseInt(e.target.value))}
            className="w-full h-8 px-2 py-1 text-sm border border-input rounded-md bg-background text-foreground"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calendar Component */}
      <CalendarComponent
        mode={mode as any}
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        month={displayMonth}
        onMonthChange={setDisplayMonth}
      />
    </div>
  );
}
