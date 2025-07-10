
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Upload, Shield, AlertTriangle, Smartphone, Info } from 'lucide-react';
import { exportData, importData, ExportData } from '@/utils/dataManager';
import { toast } from '@/hooks/use-toast';
import TabularDataView from '@/components/data/TabularDataView';

interface DataManagementProps {
  foodEntries: any[];
  healthData: any[];
  medications: any[];
  onDataImported: (data: ExportData) => void;
  onRemoveEntry?: (id: string, type: string) => void;
}

const DataManagement = ({ foodEntries, healthData, medications, onDataImported, onRemoveEntry }: DataManagementProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      // Create a more mobile-friendly export for iOS/Android
      const exportData = {
        foodEntries,
        healthData,
        medications,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const fileName = `healthbuddy-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      // Try multiple methods for better mobile compatibility
      if (navigator.share && navigator.canShare) {
        // Use Web Share API if available (mobile browsers)
        const file = new File([dataStr], fileName, { type: 'application/json' });
        navigator.share({
          files: [file],
          title: 'HealthBuddy Data Export',
          text: 'Your health data backup'
        }).catch(err => {
          console.log('Share failed, falling back to download:', err);
          fallbackDownload(dataStr, fileName);
        });
      } else {
        fallbackDownload(dataStr, fileName);
      }
      
      toast({
        title: "Data Export Initiated",
        description: "Your health data export has been prepared. Check your downloads or share menu.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fallbackDownload = (dataStr: string, fileName: string) => {
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Create a temporary link for download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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

          {/* Mobile-optimized Export/Import */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Export Data</Label>
              <p className="text-xs text-gray-600">Download or share your health data backup</p>
              <Button onClick={handleExport} className="w-full" disabled={totalEntries === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                <Smartphone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  On mobile: Data will be shared or downloaded to your device. Check your Downloads folder or share menu.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Import Data</Label>
              <p className="text-xs text-gray-600">Restore from a backup file</p>
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

          {/* Data Preservation Instructions */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-green-600" />
                Data Preservation During Updates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-green-800">
                <p className="font-medium mb-2">To preserve your data during app updates:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Export your data regularly using the button above</li>
                  <li>Store the backup file in a safe location (cloud storage, email to yourself)</li>
                  <li>After app updates, import your data if needed</li>
                  <li>Your data is stored locally on your device and should persist through updates</li>
                </ol>
              </div>
              <div className="p-2 bg-green-100 rounded text-xs text-green-700">
                <strong>Tip:</strong> Regular backups ensure you never lose your health tracking progress, even if you switch devices or reinstall the app.
              </div>
            </CardContent>
          </Card>

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

      {/* Data Table with Remove Functionality */}
      <TabularDataView
        foodEntries={foodEntries}
        healthData={healthData}
        onRemoveEntry={onRemoveEntry}
      />
    </div>
  );
};

export default DataManagement;
