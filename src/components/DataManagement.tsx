
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Upload, Shield, AlertTriangle, Smartphone, Info } from 'lucide-react';
import { exportData, importData, ExportData } from '@/utils/dataManager';
import { toast } from '@/hooks/use-toast';
import DataManagementHub from '@/components/data/DataManagementHub';

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

  const handleRemoveEntry = (id: string, type: string) => {
    console.log('DataManagement handling remove entry:', { id, type });
    
    if (onRemoveEntry) {
      onRemoveEntry(id, type);
      toast({
        title: "Entry Removed",
        description: `${type} entry has been deleted successfully.`,
      });
    } else {
      console.warn('onRemoveEntry handler not provided to DataManagement');
      toast({
        title: "Remove Failed",
        description: "Unable to remove entry. Please try refreshing the page.",
        variant: "destructive"
      });
    }
  };

  const totalEntries = foodEntries.length + healthData.length + medications.length;

  return (
    <DataManagementHub
      foodEntries={foodEntries}
      healthData={healthData}
      medications={medications}
      onDataImported={onDataImported}
      onRemoveEntry={handleRemoveEntry}
    />
  );
};

export default DataManagement;
