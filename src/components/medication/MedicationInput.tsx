
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DateTimePicker from '@/components/common/DateTimePicker';

export interface MedicationEntry {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  taken: boolean;
  timestamp: Date;
  notes?: string;
}

interface MedicationInputProps {
  onMedicationLogged: (medication: MedicationEntry) => void;
}

const MedicationInput = ({ onMedicationLogged }: MedicationInputProps) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [taken, setTaken] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));

  const frequencyOptions = [
    { value: 'once-daily', label: 'Once Daily' },
    { value: 'twice-daily', label: 'Twice Daily' },
    { value: 'three-times-daily', label: 'Three Times Daily' },
    { value: 'four-times-daily', label: 'Four Times Daily' },
    { value: 'as-needed', label: 'As Needed' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleSubmit = () => {
    if (!name || !dosage || !frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in medication name, dosage, and frequency.",
        variant: "destructive"
      });
      return;
    }

    // Create proper timestamp from date and time
    const [hours, minutes] = selectedTime.split(':');
    const timestamp = new Date(selectedDate);
    timestamp.setHours(parseInt(hours), parseInt(minutes));

    const medicationEntry: MedicationEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      taken,
      timestamp: timestamp,
      notes: notes.trim() || undefined
    };

    onMedicationLogged(medicationEntry);

    // Reset form
    setName('');
    setDosage('');
    setFrequency('');
    setTaken(false);
    setNotes('');

    toast({
      title: "Medication Logged!",
      description: `${name} (${dosage}) recorded for ${timestamp.toLocaleString()}.`,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Shield className="h-5 w-5" />
          Log Medication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateTimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={setSelectedDate}
          onTimeChange={setSelectedTime}
          label="Medication Time"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="med-name" className="text-sm text-gray-600">Medication Name</Label>
            <Input
              id="med-name"
              type="text"
              placeholder="e.g., Aspirin"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="dosage" className="text-sm text-gray-600">Dosage</Label>
            <Input
              id="dosage"
              type="text"
              placeholder="e.g., 100mg"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label className="text-sm text-gray-600">Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {frequencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="taken"
            checked={taken}
            onCheckedChange={(checked) => setTaken(checked === true)}
          />
          <Label htmlFor="taken" className="text-sm text-gray-600">
            Taken at this time
          </Label>
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm text-gray-600">Notes (Optional)</Label>
          <Input
            id="notes"
            type="text"
            placeholder="Any additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full bg-purple-600 hover:bg-purple-700">
          Log Medication
        </Button>
      </CardContent>
    </Card>
  );
};

export default MedicationInput;
