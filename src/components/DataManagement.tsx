
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Upload, Shield, AlertTriangle } from 'lucide-react';
import { exportData, importData, ExportData } from '@/utils/dataManager';
import { toast } from '@/hooks/use-toast';

interface DataManagementProps {
  foodEntries: any[];
  healthData: any[];
  medications: any[];
  onDataImported: (data: ExportData) => void;
}

const DataManagement = ({ foodEntries, healthData, medications, onDataImported }: DataManagementProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData(foodEntries, healthData, medications);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await importData(file);
      onDataImported(data);
    } catch (error) {
      console.error('Import failed:', error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('myHealthBuddy_foodEntries');
      localStorage.removeItem('myHealthBuddy_healthData');
      localStorage.removeItem('myHealthBuddy_medications');
      
      toast({
        title: "Data Cleared",
        description: "All your health data has been cleared.",
      });
      
      // Reload the page to refresh the state
      window.location.reload();
    }
  };

  const totalEntries = foodEntries.length + healthData.length + medications.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{foodEntries.length}</p>
              <p className="text-sm text-blue-700">Food Entries</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{healthData.length}</p>
              <p className="text-sm text-green-700">Health Records</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">{medications.length}</p>
              <p className="text-sm text-purple-700">Medication Logs</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-600">{totalEntries}</p>
              <p className="text-sm text-gray-700">Total Entries</p>
            </div>
          </div>

          {/* Export/Import */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Export Data</Label>
              <p className="text-xs text-gray-600">Download all your health data as a backup file</p>
              <Button onClick={handleExport} className="w-full" disabled={totalEntries === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Import Data</Label>
              <p className="text-xs text-gray-600">Restore data from a previously exported backup file</p>
              <Button onClick={handleImportClick} variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t pt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-medium text-red-800">Danger Zone</h3>
              </div>
              <p className="text-sm text-red-700 mb-4">
                This action will permanently delete all your health data. Make sure to export your data first.
              </p>
              <Button 
                onClick={clearAllData} 
                variant="destructive" 
                disabled={totalEntries === 0}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataManagement;
