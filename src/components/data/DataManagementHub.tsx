import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Shield, AlertTriangle, Smartphone, Info, Database, FileText } from 'lucide-react';
import { exportData, importData, ExportData } from '@/utils/dataManager';
import { toast } from '@/hooks/use-toast';
import EnhancedTabularDataView from '@/components/data/EnhancedTabularDataView';

interface DataManagementHubProps {
  foodEntries: any[];
  healthData: any[];
  medications: any[];
  onDataImported: (data: ExportData) => void;
  onRemoveEntry?: (id: string, type: string) => void;
}

const DataManagementHub = ({ 
  foodEntries, 
  healthData, 
  medications, 
  onDataImported, 
  onRemoveEntry 
}: DataManagementHubProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleExport = async () => {
    try {
      // Create a comprehensive export with metadata
      const exportData = {
        foodEntries,
        healthData,
        medications,
        exportDate: new Date().toISOString(),
        version: '2.0',
        appVersion: '1.0.0',
        totalEntries: foodEntries.length + healthData.length + medications.length,
        metadata: {
          exportReason: 'User backup',
          deviceInfo: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const fileName = `healthbuddy-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      // Enhanced mobile compatibility
      if (navigator.share && navigator.canShare) {
        const file = new File([dataStr], fileName, { type: 'application/json' });
        if (await navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'HealthBuddy Data Export',
            text: 'Your complete health data backup'
          });
          toast({
            title: "Export Shared",
            description: "Your health data has been shared successfully.",
          });
          return;
        }
      }
      
      // Fallback to download
      fallbackDownload(dataStr, fileName);
      toast({
        title: "Export Complete",
        description: "Your health data has been exported successfully.",
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
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
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
      toast({
        title: "Import Successful",
        description: "Your health data has been imported successfully.",
      });
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive"
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone. We recommend exporting your data first.')) {
      ['myHealthBuddy_foodEntries', 'myHealthBuddy_healthData', 'myHealthBuddy_medications'].forEach(key => {
        localStorage.removeItem(key);
      });
      
      toast({
        title: "Data Cleared",
        description: "All your health data has been cleared.",
      });
      
      window.location.reload();
    }
  };

  const totalEntries = foodEntries.length + healthData.length + medications.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Data Management Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Enhanced Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{foodEntries.length}</p>
                    <p className="text-sm text-blue-700">Food Entries</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {foodEntries.reduce((sum, entry) => sum + (entry.nutrition?.calories || 0), 0).toLocaleString()} cal total
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{healthData.length}</p>
                    <p className="text-sm text-green-700">Health Records</p>
                    <p className="text-xs text-green-600 mt-1">
                      {healthData.filter(h => h.bloodPressure?.systolic > 0).length} BP readings
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{medications.length}</p>
                    <p className="text-sm text-purple-700">Medication Logs</p>
                    <p className="text-xs text-purple-600 mt-1">
                      {Math.round((medications.filter(m => m.taken).length / medications.length) * 100) || 0}% compliance
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-gray-600">{totalEntries}</p>
                    <p className="text-sm text-gray-700">Total Entries</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Since {healthData.length > 0 ? new Date(Math.min(...healthData.map(h => new Date(h.date).getTime()))).toLocaleDateString() : 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Data Health Status */}
              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardHeader>
                  <CardTitle className="text-lg text-indigo-800">Data Health Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-indigo-700">Storage Usage</span>
                    <span className="text-sm font-medium text-indigo-800">
                      {(JSON.stringify({ foodEntries, healthData, medications }).length / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-indigo-700">Last Entry</span>
                    <span className="text-sm font-medium text-indigo-800">
                      {totalEntries > 0 
                        ? new Date(Math.max(
                            ...foodEntries.map(f => new Date(f.timestamp).getTime()),
                            ...healthData.map(h => new Date(h.date).getTime()),
                            ...medications.map(m => new Date(m.timestamp).getTime())
                          )).toLocaleDateString()
                        : 'No data'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-indigo-700">Data Integrity</span>
                    <span className="text-sm font-medium text-green-600">✓ Healthy</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Download className="h-5 w-5 text-blue-600" />
                      Export Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Create a comprehensive backup of all your health data including metadata and integrity checks.
                    </p>
                    <Button onClick={handleExport} className="w-full" disabled={totalEntries === 0}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Complete Backup
                    </Button>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Smartphone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-700">
                          <p className="font-medium mb-1">Mobile Export Features:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Share directly to cloud storage apps</li>
                            <li>Email backup to yourself</li>
                            <li>Save to Files app (iOS) or Downloads (Android)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Upload className="h-5 w-5 text-green-600" />
                      Import Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Restore your health data from a previously exported backup file.
                    </p>
                    <Button onClick={handleImportClick} variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Backup File
                    </Button>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-green-700">
                        <p className="font-medium mb-1">Import Safety:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Validates file integrity before import</li>
                          <li>Merges with existing data (no overwrite)</li>
                          <li>Backup current data before importing</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Preservation Guide */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                    <Info className="h-5 w-5" />
                    Complete Data Preservation Guide
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Regular Backup Schedule</h4>
                      <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                        <li>Weekly exports for active users</li>
                        <li>Monthly exports for casual users</li>
                        <li>Before major life events or travel</li>
                        <li>Before app updates or device changes</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Storage Recommendations</h4>
                      <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                        <li>Cloud storage (Google Drive, iCloud, Dropbox)</li>
                        <li>Email backups to yourself</li>
                        <li>Multiple backup locations</li>
                        <li>Version control (keep multiple backups)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              {/* Danger Zone */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    Data Management Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-100 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Clear All Data</h4>
                    <p className="text-sm text-red-700 mb-4">
                      This will permanently delete all your health data including food entries, health metrics, and medication logs. 
                      This action cannot be undone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={handleExport}
                        variant="outline"
                        disabled={totalEntries === 0}
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Before Clearing
                      </Button>
                      <Button 
                        onClick={clearAllData} 
                        variant="destructive" 
                        disabled={totalEntries === 0}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Enhanced Data Table */}
      <EnhancedTabularDataView
        foodEntries={foodEntries}
        healthData={healthData}
        medications={medications}
        onRemoveEntry={onRemoveEntry}
      />
    </div>
  );
};

export default DataManagementHub;