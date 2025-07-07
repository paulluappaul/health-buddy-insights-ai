
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Search, Filter } from 'lucide-react';

interface FoodEntry {
  id: string;
  text: string;
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    foods: string[];
  };
  timestamp: Date;
}

interface HealthData {
  id: string;
  date: Date;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  pulse?: number;
  mood?: string;
  weight?: number;
  temperature?: number;
  temperatureUnit?: string;
  smoked?: boolean;
  cigaretteCount?: number;
}

interface TabularDataViewProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
}

const TabularDataView = ({ foodEntries, healthData }: TabularDataViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [isLandscape, setIsLandscape] = useState(false);

  // Combine and format all data for table display
  const formatTableData = () => {
    const allData: any[] = [];

    // Add food entries
    foodEntries.forEach(entry => {
      allData.push({
        id: entry.id,
        date: new Date(entry.timestamp).toLocaleDateString(),
        time: new Date(entry.timestamp).toLocaleTimeString(),
        type: 'Food',
        details: entry.text,
        calories: entry.nutrition.calories,
        carbs: entry.nutrition.carbs.toFixed(1),
        protein: entry.nutrition.protein.toFixed(1),
        fat: entry.nutrition.fat.toFixed(1),
        value: entry.nutrition.calories,
        unit: 'kcal'
      });
    });

    // Add health data entries
    healthData.forEach(entry => {
      const entryDate = new Date(entry.date);
      
      if (entry.bloodPressure && entry.bloodPressure.systolic > 0) {
        allData.push({
          id: `${entry.id}-bp`,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Blood Pressure',
          details: `${entry.bloodPressure.systolic}/${entry.bloodPressure.diastolic}`,
          value: entry.bloodPressure.systolic,
          unit: 'mmHg'
        });
      }

      if (entry.pulse && entry.pulse > 0) {
        allData.push({
          id: `${entry.id}-pulse`,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Pulse',
          details: `${entry.pulse}`,
          value: entry.pulse,
          unit: 'bpm'
        });
      }

      if (entry.weight && entry.weight > 0) {
        allData.push({
          id: `${entry.id}-weight`,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Weight',
          details: `${entry.weight.toFixed(1)}`,
          value: entry.weight,
          unit: 'kg'
        });
      }

      if (entry.temperature && entry.temperature > 0) {
        allData.push({
          id: `${entry.id}-temp`,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Temperature',
          details: `${entry.temperature.toFixed(1)}°${entry.temperatureUnit === 'fahrenheit' ? 'F' : 'C'}`,
          value: entry.temperature,
          unit: entry.temperatureUnit === 'fahrenheit' ? '°F' : '°C'
        });
      }

      if (entry.mood && entry.mood !== '') {
        allData.push({
          id: `${entry.id}-mood`,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Mood',
          details: entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1),
          value: entry.mood,
          unit: ''
        });
      }

      if (entry.smoked !== undefined) {
        allData.push({
          id: `${entry.id}-smoking`,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Smoking',
          details: entry.smoked ? `${entry.cigaretteCount || 0} cigarettes` : 'No smoking',
          value: entry.cigaretteCount || 0,
          unit: 'cigarettes'
        });
      }
    });

    return allData.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
  };

  const tableData = formatTableData();

  // Filter data based on search and filters
  const filteredData = tableData.filter(item => {
    const matchesSearch = item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType.toLowerCase();
    const matchesDate = !dateFilter || item.date === new Date(dateFilter).toLocaleDateString();
    
    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <div className={isLandscape ? 'fixed inset-0 z-50 bg-white overflow-auto' : ''}>
      <Card className={isLandscape ? 'h-full rounded-none' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              Complete Data Table
            </div>
            <Button
              onClick={() => setIsLandscape(!isLandscape)}
              variant="outline"
              size="sm"
            >
              {isLandscape ? 'Exit Landscape' : 'Landscape View'}
            </Button>
          </CardTitle>
        </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="blood pressure">Blood Pressure</SelectItem>
              <SelectItem value="pulse">Pulse</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="temperature">Temperature</SelectItem>
              <SelectItem value="mood">Mood</SelectItem>
              <SelectItem value="smoking">Smoking</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:w-[150px]"
          />
          <Button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setDateFilter('');
            }}
            variant="outline"
            size="sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'Food' ? 'bg-orange-100 text-orange-700' :
                        item.type === 'Blood Pressure' ? 'bg-red-100 text-red-700' :
                        item.type === 'Pulse' ? 'bg-pink-100 text-pink-700' :
                        item.type === 'Weight' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'Temperature' ? 'bg-yellow-100 text-yellow-700' :
                        item.type === 'Mood' ? 'bg-purple-100 text-purple-700' :
                        item.type === 'Smoking' ? 'bg-gray-100 text-gray-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell>{item.details}</TableCell>
                    <TableCell className="font-medium">{item.value}</TableCell>
                    <TableCell className="text-gray-600">{item.unit}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No data found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredData.length} of {tableData.length} entries
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default TabularDataView;
