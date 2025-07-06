
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock } from 'lucide-react';

interface DateTimePickerProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  label?: string;
  maxDate?: string;
}

const DateTimePicker = ({ 
  selectedDate, 
  selectedTime, 
  onDateChange, 
  onTimeChange, 
  label = "Date & Time",
  maxDate
}: DateTimePickerProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {label}
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="entry-date" className="text-xs text-gray-600">Date</Label>
          <Input
            id="entry-date"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            max={maxDate || new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <Label htmlFor="entry-time" className="text-xs text-gray-600 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Time
          </Label>
          <Input
            id="entry-time"
            type="time"
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
