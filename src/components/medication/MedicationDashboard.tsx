
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import { MedicationEntry } from './MedicationInput';

interface MedicationDashboardProps {
  medications: MedicationEntry[];
}

const MedicationDashboard = ({ medications }: MedicationDashboardProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysMedications = medications.filter(med => {
    const medDate = new Date(med.timestamp);
    medDate.setHours(0, 0, 0, 0);
    return medDate.getTime() === today.getTime();
  });

  const takenToday = todaysMedications.filter(med => med.taken).length;
  const totalToday = todaysMedications.length;
  const adherenceRate = totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 0;

  // Group medications by name for overview
  const medicationSummary = medications.reduce((acc, med) => {
    if (!acc[med.name]) {
      acc[med.name] = {
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        lastTaken: med.timestamp,
        totalEntries: 0,
        takenCount: 0
      };
    }
    acc[med.name].totalEntries++;
    if (med.taken) acc[med.name].takenCount++;
    if (new Date(med.timestamp) > new Date(acc[med.name].lastTaken)) {
      acc[med.name].lastTaken = med.timestamp;
    }
    return acc;
  }, {} as Record<string, any>);

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      'once-daily': 'bg-green-100 text-green-800',
      'twice-daily': 'bg-blue-100 text-blue-800',
      'three-times-daily': 'bg-orange-100 text-orange-800',
      'four-times-daily': 'bg-red-100 text-red-800',
      'as-needed': 'bg-gray-100 text-gray-800',
      'weekly': 'bg-purple-100 text-purple-800',
      'monthly': 'bg-pink-100 text-pink-800'
    };
    return colors[frequency as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">{takenToday}</p>
                <p className="text-xs text-green-600">Taken Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700">{totalToday}</p>
                <p className="text-xs text-blue-600">Total Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-700">{adherenceRate}%</p>
                <p className="text-xs text-purple-600">Adherence Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medication Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Medication Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(medicationSummary).length > 0 ? (
            <div className="space-y-4">
              {Object.values(medicationSummary).map((med: any) => (
                <div key={med.name} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{med.name}</h3>
                      <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                    </div>
                    <Badge className={getFrequencyBadge(med.frequency)}>
                      {med.frequency.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Adherence: {med.takenCount}/{med.totalEntries} ({Math.round((med.takenCount / med.totalEntries) * 100)}%)
                    </span>
                    <span className="text-gray-500">
                      Last: {new Date(med.lastTaken).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No medications logged yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {medications.length > 0 ? (
            <div className="space-y-3">
              {medications.slice(0, 5).map((med) => (
                <div key={med.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{med.name} - {med.dosage}</p>
                      <p className="text-sm text-gray-600">{med.frequency.replace('-', ' ')}</p>
                      {med.notes && <p className="text-xs text-gray-500">Note: {med.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {med.taken ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(med.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No medication entries yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationDashboard;
