import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Activity, Download, Calendar, StickyNote } from 'lucide-react';
import { format } from 'date-fns';

interface HealthData {
  id: string;
  date: Date;
  painLevel?: number;
  painNotes?: string;
}

interface PainTableViewProps {
  healthData: HealthData[];
}

const PainTableView = ({ healthData }: PainTableViewProps) => {
  const [sortBy, setSortBy] = useState<'date' | 'painLevel'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter only entries with pain data
  const painEntries = healthData.filter(entry => 
    entry.painLevel !== undefined && entry.painLevel > 0
  );

  // Sort pain entries
  const sortedPainEntries = [...painEntries].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'painLevel') {
      const painA = a.painLevel || 0;
      const painB = b.painLevel || 0;
      return sortOrder === 'asc' ? painA - painB : painB - painA;
    }
    return 0;
  });

  const handleSort = (column: 'date' | 'painLevel') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Pain Level', 'Notes'];
    const csvData = sortedPainEntries.map(entry => [
      format(new Date(entry.date), 'yyyy-MM-dd'),
      format(new Date(entry.date), 'HH:mm'),
      entry.painLevel?.toString() || '',
      entry.painNotes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pain-diary-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const getPainLevelDescription = (level: number) => {
    if (level <= 2) return "Minimal";
    if (level <= 4) return "Mild";
    if (level <= 6) return "Moderate";
    if (level <= 8) return "Severe";
    return "Extreme";
  };

  const getPainLevelColor = (level: number) => {
    if (level <= 2) return "text-green-600 bg-green-50";
    if (level <= 4) return "text-yellow-600 bg-yellow-50";
    if (level <= 6) return "text-orange-600 bg-orange-50";
    if (level <= 8) return "text-red-600 bg-red-50";
    return "text-red-800 bg-red-100";
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Activity className="h-5 w-5" />
            Pain Diary
            <span className="text-sm font-normal text-gray-500">
              ({painEntries.length} entries)
            </span>
          </CardTitle>
          <Button 
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={painEntries.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {painEntries.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No pain entries yet</p>
            <p className="text-gray-400 text-sm">Start tracking your pain to see data here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date & Time
                      {sortBy === 'date' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('painLevel')}
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Pain Level
                      {sortBy === 'painLevel' && (
                        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <StickyNote className="h-4 w-4" />
                      Notes
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPainEntries.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <div>{format(new Date(entry.date), 'MMM dd, yyyy')}</div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(entry.date), 'HH:mm')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getPainLevelColor(entry.painLevel!)}`}>
                        {entry.painLevel}/10 ({getPainLevelDescription(entry.painLevel!)})
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {entry.painNotes ? (
                          <p className="text-sm text-gray-700 truncate" title={entry.painNotes}>
                            {entry.painNotes}
                          </p>
                        ) : (
                          <span className="text-gray-400 text-sm italic">No notes</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PainTableView;