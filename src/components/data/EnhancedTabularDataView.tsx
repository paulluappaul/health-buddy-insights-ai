import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Search, Filter, Trash2, Download, ArrowUpDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  painLevel?: number;
  painNotes?: string;
  movementLevel?: string;
  sport?: boolean;
}

interface MedicationEntry {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  taken: boolean;
  timestamp: Date;
  notes?: string;
}

interface TableDataRow {
  id: string;
  originalId: string;
  date: string;
  time: string;
  type: string;
  details: string;
  value: any;
  unit: string;
  sourceType: 'food' | 'health' | 'medication';
  sortKey: number;
  [key: string]: any;
}

interface EnhancedTabularDataViewProps {
  foodEntries: FoodEntry[];
  healthData: HealthData[];
  medications: MedicationEntry[];
  onRemoveEntry?: (id: string, type: string) => void;
}

const EnhancedTabularDataView = ({ 
  foodEntries, 
  healthData, 
  medications, 
  onRemoveEntry 
}: EnhancedTabularDataViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [isLandscape, setIsLandscape] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const formatTableData = (): TableDataRow[] => {
    const allData: TableDataRow[] = [];

    // Add food entries
    foodEntries.forEach(entry => {
      const timestamp = new Date(entry.timestamp);
      allData.push({
        id: `food-${entry.id}`,
        originalId: entry.id,
        date: timestamp.toLocaleDateString(),
        time: timestamp.toLocaleTimeString(),
        type: 'Food',
        details: entry.text,
        calories: entry.nutrition.calories,
        carbs: entry.nutrition.carbs.toFixed(1),
        protein: entry.nutrition.protein.toFixed(1),
        fat: entry.nutrition.fat.toFixed(1),
        value: entry.nutrition.calories,
        unit: 'kcal',
        sourceType: 'food',
        sortKey: timestamp.getTime()
      });
    });

    // Add health data entries
    healthData.forEach(entry => {
      const entryDate = new Date(entry.date);
      const baseSortKey = entryDate.getTime();
      
      // Only add blood pressure if both values are meaningful
      if (entry.bloodPressure && entry.bloodPressure.systolic > 0 && entry.bloodPressure.diastolic > 0) {
        allData.push({
          id: `bp-${entry.id}`,
          originalId: entry.id,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Blood Pressure',
          details: `${entry.bloodPressure.systolic}/${entry.bloodPressure.diastolic}`,
          value: entry.bloodPressure.systolic,
          unit: 'mmHg',
          sourceType: 'health',
          sortKey: baseSortKey
        });
      }

      if (entry.pulse && entry.pulse > 0) {
        allData.push({
          id: `pulse-${entry.id}`,
          originalId: entry.id,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Pulse',
          details: `${entry.pulse}`,
          value: entry.pulse,
          unit: 'bpm',
          sourceType: 'health',
          sortKey: baseSortKey + 1
        });
      }

      if (entry.weight && entry.weight > 0) {
        allData.push({
          id: `weight-${entry.id}`,
          originalId: entry.id,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Weight',
          details: `${entry.weight.toFixed(1)}`,
          value: entry.weight,
          unit: 'kg',
          sourceType: 'health',
          sortKey: baseSortKey + 2
        });
      }

      if (entry.temperature && entry.temperature > 0) {
        allData.push({
          id: `temp-${entry.id}`,
          originalId: entry.id,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Temperature',
          details: `${entry.temperature.toFixed(1)}°${entry.temperatureUnit === 'fahrenheit' ? 'F' : 'C'}`,
          value: entry.temperature,
          unit: entry.temperatureUnit === 'fahrenheit' ? '°F' : '°C',
          sourceType: 'health',
          sortKey: baseSortKey + 3
        });
      }

      if (entry.mood && entry.mood.trim() !== '') {
        allData.push({
          id: `mood-${entry.id}`,
          originalId: entry.id,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Mood',
          details: entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1),
          value: entry.mood,
          unit: '',
          sourceType: 'health',
          sortKey: baseSortKey + 4
        });
      }

      if (entry.painLevel && entry.painLevel > 0) {
        allData.push({
          id: `pain-${entry.id}`,
          originalId: entry.id,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Pain Level',
          details: `${entry.painLevel}/10${entry.painNotes ? ` - ${entry.painNotes}` : ''}`,
          value: entry.painLevel,
          unit: '/10',
          sourceType: 'health',
          sortKey: baseSortKey + 5
        });
      }

      if (entry.movementLevel && entry.movementLevel.trim() !== '') {
        allData.push({
          id: `movement-${entry.id}`,
          originalId: entry.id,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Movement',
          details: entry.movementLevel,
          value: entry.movementLevel,
          unit: '',
          sourceType: 'health',
          sortKey: baseSortKey + 6
        });
      }

      if (entry.smoked !== undefined) {
        allData.push({
          id: `smoking-${entry.id}`,
          originalId: entry.id,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Smoking',
          details: entry.smoked ? `${entry.cigaretteCount || 0} cigarettes` : 'No smoking',
          value: entry.cigaretteCount || 0,
          unit: 'cigarettes',
          sourceType: 'health',
          sortKey: baseSortKey + 7
        });
      }

      if (entry.sport) {
        allData.push({
          id: `sport-${entry.id}`,
          originalId: entry.id,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString(),
          type: 'Exercise',
          details: 'Sports/Exercise Activity',
          value: 'Yes',
          unit: '',
          sourceType: 'health',
          sortKey: baseSortKey + 8
        });
      }
    });

    // Add medication entries
    medications.forEach(entry => {
      const timestamp = new Date(entry.timestamp);
      allData.push({
        id: `med-${entry.id}`,
        originalId: entry.id,
        date: timestamp.toLocaleDateString(),
        time: timestamp.toLocaleTimeString(),
        type: 'Medication',
        details: `${entry.name} (${entry.dosage}) - ${entry.taken ? 'Taken' : 'Missed'}`,
        value: entry.taken ? 'Taken' : 'Missed',
        unit: '',
        sourceType: 'medication',
        sortKey: timestamp.getTime()
      });
    });

    return allData;
  };

  const tableData = useMemo(() => formatTableData(), [foodEntries, healthData, medications]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = tableData.filter(item => {
      const matchesSearch = item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType.toLowerCase();
      const matchesDate = !dateFilter || item.date === new Date(dateFilter).toLocaleDateString();
      
      return matchesSearch && matchesType && matchesDate;
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'date' || sortConfig.key === 'time') {
          aValue = a.sortKey;
          bValue = b.sortKey;
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort by date descending
      filtered.sort((a, b) => b.sortKey - a.sortKey);
    }

    return filtered;
  }, [tableData, searchTerm, filterType, dateFilter, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleRemoveEntry = (id: string, type: string) => {
    if (onRemoveEntry) {
      // Extract the original ID and source type for proper removal
      const row = tableData.find(r => r.id === id);
      if (row) {
        onRemoveEntry(row.originalId, row.sourceType);
        toast({
          title: "Entry Removed",
          description: `${type} entry has been deleted successfully.`,
        });
      }
    } else {
      toast({
        title: "Remove Failed",
        description: "Unable to remove entry. Please try refreshing the page.",
        variant: "destructive"
      });
    }
  };

  const handleExportData = () => {
    const csvContent = [
      ['Date', 'Time', 'Type', 'Details', 'Value', 'Unit'],
      ...filteredAndSortedData.map(row => [
        row.date,
        row.time,
        row.type,
        row.details,
        row.value,
        row.unit
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your health data has been exported to CSV.",
    });
  };

  return (
    <div className={isLandscape ? 'fixed inset-0 z-50 bg-white overflow-auto' : ''}>
      <Card className={isLandscape ? 'h-full rounded-none' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              Enhanced Data Table
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExportData}
                variant="outline"
                size="sm"
                disabled={filteredAndSortedData.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => setIsLandscape(!isLandscape)}
                variant="outline"
                size="sm"
              >
                {isLandscape ? 'Exit Landscape' : 'Landscape View'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enhanced Filters */}
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
                <SelectItem value="pain level">Pain Level</SelectItem>
                <SelectItem value="movement">Movement</SelectItem>
                <SelectItem value="smoking">Smoking</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
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
                setSortConfig(null);
              }}
              variant="outline"
              size="sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Enhanced Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('date')}
                      className="font-semibold p-0 h-auto"
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('time')}
                      className="font-semibold p-0 h-auto"
                    >
                      Time
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('type')}
                      className="font-semibold p-0 h-auto"
                    >
                      Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('value')}
                      className="font-semibold p-0 h-auto"
                    >
                      Value
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Unit</TableHead>
                  {onRemoveEntry && <TableHead>Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.length > 0 ? (
                  filteredAndSortedData.map((item) => (
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
                          item.type === 'Pain Level' ? 'bg-red-100 text-red-700' :
                          item.type === 'Movement' ? 'bg-green-100 text-green-700' :
                          item.type === 'Exercise' ? 'bg-green-100 text-green-700' :
                          item.type === 'Smoking' ? 'bg-gray-100 text-gray-700' :
                          item.type === 'Medication' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={item.details}>
                        {item.details}
                      </TableCell>
                      <TableCell className="font-medium">{item.value}</TableCell>
                      <TableCell className="text-gray-600">{item.unit}</TableCell>
                      {onRemoveEntry && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEntry(item.id, item.type)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={onRemoveEntry ? 7 : 6} className="text-center py-8 text-gray-500">
                      No data found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Showing {filteredAndSortedData.length} of {tableData.length} entries</span>
            {sortConfig && (
              <span>Sorted by {sortConfig.key} ({sortConfig.direction})</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTabularDataView;