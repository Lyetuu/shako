// src/screens/data/DataExportBackup.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  DataTable,
  Divider,
  Portal,
  Dialog,
  TextInput,
  ProgressBar,
  Menu,
  Chip
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import {
  getExportHistory,
  getBackupHistory,
  getScheduledBackups,
  getMigrationOptions,
  exportData,
  createBackup,
  scheduleBackup,
  restoreBackup,
  startMigration
} from '../../services/api/data-management';
import { formatDate, formatTime, formatFileSize } from '../../utils/formatters';
import styles from './DataExportBackupStyles';

const DataExportBackup = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('export');
  const [exportHistory, setExportHistory] = useState([]);
  const [backupHistory, setBackupHistory] = useState([]);
  const [scheduledBackups, setScheduledBackups] = useState([]);
  const [migrationOptions, setMigrationOptions] = useState([]);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportDataTypes, setExportDataTypes] = useState([]);
  const [backupName, setBackupName] = useState('');
  const [backupDescription, setBackupDescription] = useState('');
  const [backupEncrypted, setBackupEncrypted] = useState(true);
  const [backupPassword, setBackupPassword] = useState('');
  const [scheduledFrequency, setScheduledFrequency] = useState('weekly');
  const [scheduledRetention, setScheduledRetention] = useState(4);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduledNextDate, setScheduledNextDate] = useState(new Date());
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [restorePassword, setRestorePassword] = useState('');
  const [migrationTarget, setMigrationTarget] = useState(null);
  const [migrationDataTypes, setMigrationDataTypes] = useState([]);
  const [showMigrationDataMenu, setShowMigrationDataMenu] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [migrationInProgress, setMigrationInProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  
  const navigation = useNavigation();
  const { user } = useAuth();
  
  // Available data types for export
  const dataTypes = [
    { id: 'members', name: 'Member Data', description: 'Member profiles and contact information' },
    { id: 'transactions', name: 'Transactions', description: 'All financial transactions' },
    { id: 'meetings', name: 'Meetings', description: 'Meeting records and minutes' },
    { id: 'documents', name: 'Documents', description: 'Uploaded documents and files' },
    { id: 'settings', name: 'Group Settings', description: 'Group configuration and preferences' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch export history
      const exports = await getExportHistory(user.groupId);
      setExportHistory(exports);
      
      // Fetch backup history
      const backups = await getBackupHistory(user.groupId);
      setBackupHistory(backups);
      
      // Fetch scheduled backups
      const scheduled = await getScheduledBackups(user.groupId);
      setScheduledBackups(scheduled);
      
      // Fetch migration options
      const migrations = await getMigrationOptions(user.groupId);
      setMigrationOptions(migrations);
    } catch (error) {
      console.error('Error fetching data management info:', error);
      Alert.alert('Error', 'Failed to load data management information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExportDataType = (typeId) => {
    if (exportDataTypes.includes(typeId)) {
      setExportDataTypes(exportDataTypes.filter(id => id !== typeId));
    } else {
      setExportDataTypes([...exportDataTypes, typeId]);
    }
  };

  const toggleMigrationDataType = (typeId) => {
    if (migrationDataTypes.includes(typeId)) {
      setMigrationDataTypes(migrationDataTypes.filter(id => id !== typeId));
    } else {
      setMigrationDataTypes([...migrationDataTypes, typeId]);
    }
  };

  const handleExportData = async () => {
    try {
      if (exportDataTypes.length === 0) {
        Alert.alert('Error', 'Please select at least one data type to export.');
        return;
      }
      
      // In a real app, this would export the selected data
      await exportData(user.groupId, {
        format: exportFormat,
        dataTypes: exportDataTypes
      });
      
      // Reset form and close dialog
      setExportFormat('csv');
      setExportDataTypes([]);
      setShowExportDialog(false);
      
      // Refresh export history
      const exports = await getExportHistory(user.groupId);
      setExportHistory(exports);
      
      Alert.alert('Success', 'Data exported successfully. Check your downloads folder.');
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const handleCreateBackup = async () => {
    try {
      if (!backupName.trim()) {
        Alert.alert('Error', 'Please enter a backup name.');
        return;
      }
      
      if (backupEncrypted && !backupPassword.trim()) {
        Alert.alert('Error', 'Please enter a password for the encrypted backup.');
        return;
      }
      
      setBackupInProgress(true);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + (0.1 * Math.random());
          return newValue > 0.95 ? 0.95 : newValue;
        });
      }, 500);
      
      // In a real app, this would create a backup
      await createBackup(user.groupId, {
        name: backupName,
        description: backupDescription,
        encrypted: backupEncrypted,
        password: backupEncrypted ? backupPassword : null
      });
      
      clearInterval(progressInterval);
      setProgressValue(1);
      
      // Reset form and close dialog after a short delay
      setTimeout(() => {
        setBackupName('');
        setBackupDescription('');
        setBackupEncrypted(true);
        setBackupPassword('');
        setBackupInProgress(false);
        setProgressValue(0);
        setShowBackupDialog(false);
        
        // Refresh backup history
        fetchData();
      }, 1000);
      
      Alert.alert('Success', 'Backup created successfully.');
    } catch (error) {
      console.error('Error creating backup:', error);
      setBackupInProgress(false);
      setProgressValue(0);
      Alert.alert('Error', 'Failed to create backup. Please try again.');
    }
  };

  const handleScheduleBackup = async () => {
    try {
      // In a real app, this would schedule a backup
      await scheduleBackup(user.groupId, {
        frequency: scheduledFrequency,
        retention: scheduledRetention,
        nextDate: scheduledNextDate.toISOString(),
        encrypted: true // Always encrypt scheduled backups
      });
      
      // Reset form and close dialog
      setScheduledFrequency('weekly');
      setScheduledRetention(4);
      setScheduledNextDate(new Date());
      setShowScheduleDialog(false);
      
      // Refresh scheduled backups
      const scheduled = await getScheduledBackups(user.groupId);
      setScheduledBackups(scheduled);
      
      Alert.alert('Success', 'Backup schedule created successfully.');
    } catch (error) {
      console.error('Error scheduling backup:', error);
      Alert.alert('Error', 'Failed to schedule backup. Please try again.');
    }
  };

  const handleRestoreBackup = async () => {
    try {
      if (!selectedBackup) {
        return;
      }
      
      if (selectedBackup.encrypted && !restorePassword.trim()) {
        Alert.alert('Error', 'Please enter the password for this encrypted backup.');
        return;
      }
      
      setRestoreInProgress(true);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + (0.08 * Math.random());
          return newValue > 0.95 ? 0.95 : newValue;
        });
      }, 500);
      
      // In a real app, this would restore the backup
      await restoreBackup(user.groupId, selectedBackup.id, {
        password: selectedBackup.encrypted ? restorePassword : null
      });
      
      clearInterval(progressInterval);
      setProgressValue(1);
      
      // Reset form and close dialog after a short delay
      setTimeout(() => {
        setSelectedBackup(null);
        setRestorePassword('');
        setRestoreInProgress(false);
        setProgressValue(0);
        setShowRestoreDialog(false);
      }, 1000);
      
      Alert.alert('Success', 'Backup restored successfully. The app will now reload with the restored data.');
    } catch (error) {
      console.error('Error restoring backup:', error);
      setRestoreInProgress(false);
      setProgressValue(0);
      Alert.alert('Error', 'Failed to restore backup. Please try again.');
    }
  };

  const handleStartMigration = async () => {
    try {
      if (!migrationTarget) {
        Alert.alert('Error', 'Please select a migration target.');
        return;
      }
      
      if (migrationDataTypes.length === 0) {
        Alert.alert('Error', 'Please select at least one data type to migrate.');
        return;
      }
      
      setMigrationInProgress(true);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgressValue(prev => {
          const newValue = prev + (0.05 * Math.random());
          return newValue > 0.95 ? 0.95 : newValue;
        });
      }, 500);
      
      // In a real app, this would start the migration
      await startMigration(user.groupId, {
        targetId: migrationTarget.id,
        dataTypes: migrationDataTypes
      });
      
      clearInterval(progressInterval);
      setProgressValue(1);
      
      // Reset form and close dialog after a short delay
      setTimeout(() => {
        setMigrationTarget(null);
        setMigrationDataTypes([]);
        setMigrationInProgress(false);
        setProgressValue(0);
        setShowMigrationDialog(false);
      }, 1000);
      
      Alert.alert('Success', 'Migration started successfully. You will receive an email when it is complete.');
    } catch (error) {
      console.error('Error starting migration:', error);
      setMigrationInProgress(false);
      setProgressValue(0);
      Alert.alert('Error', 'Failed to start migration. Please try again.');
    }
  };

  const renderExportDialog = () => (
    <Portal>
      <Dialog visible={showExportDialog} onDismiss={() => setShowExportDialog(false)}>
        <Dialog.Title>Export Data</Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <ScrollView style={styles.dialogScrollView}>
            <View style={styles.exportDialogContent}>
              <Text style={styles.exportFormatTitle}>Export Format</Text>
              
              <View style={styles.exportFormatOptions}>
                <TouchableOpacity
                  style={[
                    styles.formatOption,
                    exportFormat === 'csv' && styles.selectedFormatOption
                  ]}
                  onPress={() => setExportFormat('csv')}
                >
                  <Icon name="file-delimited" size={36} color="#4CAF50" style={styles.formatIcon} />
                  <Text style={styles.formatName}>CSV</Text>
                  <Text style={styles.formatDescription}>
                    Plain text format that can be opened in spreadsheet applications
                  </Text>
                  {exportFormat === 'csv' && (
                    <Icon name="check-circle" size={24} color={theme.colors.primary} style={styles.selectedFormatIcon} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.formatOption,
                    exportFormat === 'excel' && styles.selectedFormatOption
                  ]}
                  onPress={() => setExportFormat('excel')}
                >
                  <Icon name="microsoft-excel" size={36} color="#217346" style={styles.formatIcon} />
                  <Text style={styles.formatName}>Excel</Text>
                  <Text style={styles.formatDescription}>
                    Microsoft Excel format with formatted tables and sheets
                  </Text>
                  {exportFormat === 'excel' && (
                    <Icon name="check-circle" size={24} color={theme.colors.primary} style={styles.selectedFormatIcon} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.formatOption,
                    exportFormat === 'json' && styles.selectedFormatOption
                  ]}
                  onPress={() => setExportFormat('json')}
                >
                  <Icon name="code-json" size={36} color="#F57C00" style={styles.formatIcon} />
                  <Text style={styles.formatName}>JSON</Text>
                  <Text style={styles.formatDescription}>
                    Data format for developers and system integrations
                  </Text>
                  {exportFormat === 'json' && (
                    <Icon name="check-circle" size={24} color={theme.colors.primary} style={styles.selectedFormatIcon} />
                  )}
                </TouchableOpacity>
              </View>
              
              <Text style={styles.dataTypesTitle}>Select Data to Export</Text>
              
              <View style={styles.dataTypesContainer}>
                {dataTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.dataTypeOption,
                      exportDataTypes.includes(type.id) && styles.selectedDataTypeOption
                    ]}
                    onPress={() => toggleExportDataType(type.id)}
                  >
                    <View style={styles.dataTypeCheckbox}>
                      {exportDataTypes.includes(type.id) && (
                        <Icon name="check" size={16} color="#fff" />
                      )}
                    </View>
                    <View style={styles.dataTypeInfo}>
                      <Text style={styles.dataTypeName}>{type.name}</Text>
                      <Text style={styles.dataTypeDescription}>{type.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.exportWarning}>
                <Icon name="information" size={24} color="#2196F3" style={styles.warningIcon} />
                <Text style={styles.warningText}>
                  Exported data may contain sensitive information. Please store it securely and in compliance with data protection regulations.
                </Text>
              </View>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowExportDialog(false)}>Cancel</Button>
          <Button 
            onPress={handleExportData}
            disabled={exportDataTypes.length === 0}
          >
            Export
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderMigrationTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Migration Overview Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Data Migration</Title>
            <Button 
              mode="contained" 
              icon="database-export"
              onPress={() => setShowMigrationDialog(true)}
            >
              Start Migration
            </Button>
          </View>
          <Paragraph style={styles.cardDescription}>
            Transfer your group's data to another savings platform or financial system.
          </Paragraph>
          
          <View style={styles.migrationOverview}>
            <View style={styles.migrationStep}>
              <View style={styles.migrationStepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.migrationStepInfo}>
                <Text style={styles.migrationStepTitle}>Select Target Platform</Text>
                <Text style={styles.migrationStepDescription}>
                  Choose the destination system for your data
                </Text>
              </View>
            </View>
            
            <View style={styles.migrationStepConnector} />
            
            <View style={styles.migrationStep}>
              <View style={styles.migrationStepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.migrationStepInfo}>
                <Text style={styles.migrationStepTitle}>Select Data to Migrate</Text>
                <Text style={styles.migrationStepDescription}>
                  Choose which data types you want to transfer
                </Text>
              </View>
            </View>
            
            <View style={styles.migrationStepConnector} />
            
            <View style={styles.migrationStep}>
              <View style={styles.migrationStepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.migrationStepInfo}>
                <Text style={styles.migrationStepTitle}>Review and Confirm</Text>
                <Text style={styles.migrationStepDescription}>
                  Verify your migration details before proceeding
                </Text>
              </View>
            </View>
            
            <View style={styles.migrationStepConnector} />
            
            <View style={styles.migrationStep}>
              <View style={styles.migrationStepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.migrationStepInfo}>
                <Text style={styles.migrationStepTitle}>Migration Completed</Text>
                <Text style={styles.migrationStepDescription}>
                  You'll receive a notification when migration is complete
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.migrationNote}>
            <Icon name="information" size={24} color="#2196F3" style={styles.noteIcon} />
            <Text style={styles.noteText}>
              Your original data remains unchanged during and after migration. You can continue using this platform while the migration is in progress.
            </Text>
          </View>
        </Card.Content>
      </Card>
      
      {/* Available Migration Options Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Available Migration Options</Title>
          
          {migrationOptions.length > 0 ? (
            <View style={styles.migrationOptionsList}>
              {migrationOptions.map((option, index) => (
                <View key={index} style={styles.migrationOptionItem}>
                  <View style={styles.migrationOptionHeader}>
                    <Icon 
                      name={option.icon} 
                      size={36} 
                      color={option.color} 
                      style={styles.migrationOptionIcon} 
                    />
                    <View style={styles.migrationOptionInfo}>
                      <Text style={styles.migrationOptionName}>{option.name}</Text>
                      <Text style={styles.migrationOptionDescription}>{option.description}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.migrationOptionDetails}>
                    <View style={styles.compatibilitySection}>
                      <Text style={styles.compatibilityHeaderText}>Compatibility</Text>
                      <View style={styles.compatibilityItems}>
                        {option.compatibilityDetails.map((item, i) => (
                          <View key={i} style={styles.compatibilityItem}>
                            <Icon 
                              name={item.compatible ? 'check-circle' : 'alert-circle'} 
                              size={20} 
                              color={item.compatible ? '#4CAF50' : '#FF9800'} 
                              style={styles.compatibilityIcon}
                            />
                            <Text style={styles.compatibilityItemText}>{item.feature}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.migrationOptionActions}>
                    <Button 
                      mode="contained" 
                      icon="database-export"
                      onPress={() => {
                        setMigrationTarget(option);
                        setShowMigrationDialog(true);
                      }}
                    >
                      Migrate
                    </Button>
                    <Button 
                      mode="text" 
                      icon="information"
                      onPress={() => navigation.navigate('MigrationDetails', { optionId: option.id })}
                    >
                      Learn More
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="database-export" size={48} color="#9E9E9E" />
              <Text style={styles.emptyStateTitle}>No Migration Options</Text>
              <Text style={styles.emptyStateDescription}>
                There are currently no available migration options for your group.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading data management options...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data Management</Text>
        <Text style={styles.headerSubtitle}>Export, backup, and migrate your data</Text>
      </View>
      
      {/* Tab Menu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'export' && styles.activeTab]}
          onPress={() => setActiveTab('export')}
        >
          <Icon 
            name="file-export" 
            size={24} 
            color={activeTab === 'export' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'export' && styles.activeTabText
            ]}
          >
            Export
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'backup' && styles.activeTab]}
          onPress={() => setActiveTab('backup')}
        >
          <Icon 
            name="backup-restore" 
            size={24} 
            color={activeTab === 'backup' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'backup' && styles.activeTabText
            ]}
          >
            Backup
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'migration' && styles.activeTab]}
          onPress={() => setActiveTab('migration')}
        >
          <Icon 
            name="database-export" 
            size={24} 
            color={activeTab === 'migration' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'migration' && styles.activeTabText
            ]}
          >
            Migration
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {activeTab === 'export' && renderExportTab()}
      {activeTab === 'backup' && renderBackupTab()}
      {activeTab === 'migration' && renderMigrationTab()}
      
      {/* Dialogs */}
      {renderExportDialog()}
      {renderBackupDialog()}
      {renderScheduleDialog()}
      {renderRestoreDialog()}
      {renderMigrationDialog()}
    </View>
  );
};

export default DataExportBackup;
  
  const renderBackupTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Create Backup Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Create Backup</Title>
            <Button 
              mode="contained" 
              icon="backup-restore"
              onPress={() => setShowBackupDialog(true)}
            >
              Backup Now
            </Button>
          </View>
          <Paragraph style={styles.cardDescription}>
            Create a complete backup of your group's data that can be restored if needed.
          </Paragraph>
          
          <View style={styles.backupFeatures}>
            <View style={styles.backupFeatureItem}>
              <Icon name="shield-lock" size={24} color="#2196F3" style={styles.backupFeatureIcon} />
              <View style={styles.backupFeatureInfo}>
                <Text style={styles.backupFeatureName}>Encrypted Backups</Text>
                <Text style={styles.backupFeatureDescription}>
                  Protect your data with password encryption
                </Text>
              </View>
            </View>
            
            <View style={styles.backupFeatureItem}>
              <Icon name="calendar-clock" size={24} color="#4CAF50" style={styles.backupFeatureIcon} />
              <View style={styles.backupFeatureInfo}>
                <Text style={styles.backupFeatureName}>Scheduled Backups</Text>
                <Text style={styles.backupFeatureDescription}>
                  Set automatic backup schedules for peace of mind
                </Text>
              </View>
            </View>
            
            <View style={styles.backupFeatureItem}>
              <Icon name="cloud-upload" size={24} color="#9C27B0" style={styles.backupFeatureIcon} />
              <View style={styles.backupFeatureInfo}>
                <Text style={styles.backupFeatureName}>Cloud Storage</Text>
                <Text style={styles.backupFeatureDescription}>
                  Backups are securely stored in the cloud
                </Text>
              </View>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.scheduleBackupSection}>
            <View style={styles.scheduleBackupHeader}>
              <Text style={styles.scheduleBackupTitle}>Scheduled Backups</Text>
              <Button 
                mode="outlined" 
                icon="plus"
                onPress={() => setShowScheduleDialog(true)}
              >
                Schedule
              </Button>
            </View>
            
            {scheduledBackups.length > 0 ? (
              <View style={styles.scheduledBackupsList}>
                {scheduledBackups.map((schedule, index) => (
                  <View key={index} style={styles.scheduledBackupItem}>
                    <View style={styles.scheduleInfo}>
                      <View style={styles.scheduleIconContainer}>
                        <Icon name="calendar-clock" size={24} color="#fff" />
                      </View>
                      <View style={styles.scheduleDetails}>
                        <Text style={styles.scheduleFrequency}>
                          {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} Backup
                        </Text>
                        <Text style={styles.scheduleNextBackup}>
                          Next backup: {formatDate(schedule.nextBackup)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.scheduleActions}>
                      <Button 
                        icon="pencil" 
                        compact
                        onPress={() => console.log('Edit schedule', index)}
                      />
                      <Button 
                        icon="delete" 
                        compact
                        onPress={() => Alert.alert(
                          'Delete Schedule',
                          'Are you sure you want to delete this backup schedule?',
                          [
                            { text: 'Cancel' },
                            { 
                              text: 'Delete',
                              onPress: () => console.log('Delete schedule', index),
                              style: 'destructive'
                            }
                          ]
                        )}
                      />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptySchedules}>
                <Text style={styles.emptySchedulesText}>
                  No scheduled backups. Set up automatic backups to protect your data.
                </Text>
                <Button 
                  mode="outlined" 
                  icon="plus"
                  onPress={() => setShowScheduleDialog(true)}
                  style={styles.emptySchedulesButton}
                >
                  Create Schedule
                </Button>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
      
      {/* Backup History Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Backup History</Title>
          
          {backupHistory.length > 0 ? (
            <View style={styles.backupHistoryList}>
              {backupHistory.map((backup, index) => (
                <View key={index} style={styles.backupHistoryItem}>
                  <TouchableOpacity 
                    style={styles.backupHistoryInfo}
                    onPress={() => {
                      setSelectedBackup(backup);
                      setShowRestoreDialog(true);
                    }}
                  >
                    <View style={styles.backupHistoryHeader}>
                      <Text style={styles.backupHistoryName}>{backup.name}</Text>
                      <Chip 
                        style={[
                          styles.backupStatusChip,
                          { backgroundColor: backup.verified ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)' }
                        ]}
                      >
                        {backup.verified ? 'Verified' : 'Unverified'}
                      </Chip>
                    </View>
                    
                    <Text style={styles.backupHistoryDate}>
                      Created on {formatDate(backup.createdAt)} at {formatTime(backup.createdAt)}
                    </Text>
                    
                    <View style={styles.backupHistoryDetails}>
                      <View style={styles.backupHistoryDetail}>
                        <Icon name="database" size={16} color="#666" />
                        <Text style={styles.backupHistoryDetailText}>{formatFileSize(backup.size)}</Text>
                      </View>
                      
                      <View style={styles.backupHistoryDetail}>
                        <Icon 
                          name={backup.encrypted ? 'lock' : 'lock-open'} 
                          size={16} 
                          color="#666" 
                        />
                        <Text style={styles.backupHistoryDetailText}>
                          {backup.encrypted ? 'Encrypted' : 'Unencrypted'}
                        </Text>
                      </View>
                      
                      <View style={styles.backupHistoryDetail}>
                        <Icon name="calendar" size={16} color="#666" />
                        <Text style={styles.backupHistoryDetailText}>
                          {backup.expiresAt ? `Expires ${formatDate(backup.expiresAt)}` : 'No expiration'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  
                  <View style={styles.backupHistoryActions}>
                    <Button 
                      icon="restore" 
                      mode="contained"
                      onPress={() => {
                        setSelectedBackup(backup);
                        setShowRestoreDialog(true);
                      }}
                    >
                      Restore
                    </Button>
                    <Button 
                      icon="download" 
                      mode="outlined"
                      onPress={() => Alert.alert('Download', 'Downloading backup...')}
                      style={styles.downloadButton}
                    >
                      Download
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="backup-restore" size={48} color="#9E9E9E" />
              <Text style={styles.emptyStateTitle}>No Backup History</Text>
              <Text style={styles.emptyStateDescription}>
                Your previous backups will appear here.
              </Text>
              <Button 
                mode="contained" 
                icon="backup-restore"
                onPress={() => setShowBackupDialog(true)}
                style={styles.emptyStateButton}
              >
                Create Backup
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderExportTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Data Export Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Export Group Data</Title>
            <Button 
              mode="contained" 
              icon="file-export"
              onPress={() => setShowExportDialog(true)}
            >
              Export
            </Button>
          </View>
          <Paragraph style={styles.cardDescription}>
            Export your group's data in various formats for reporting, analysis, or backup purposes.
          </Paragraph>
          
          <View style={styles.exportFormats}>
            <View style={styles.exportFormatItem}>
              <Icon name="file-delimited" size={32} color="#4CAF50" style={styles.exportFormatIcon} />
              <View style={styles.exportFormatInfo}>
                <Text style={styles.exportFormatName}>CSV Format</Text>
                <Text style={styles.exportFormatDescription}>
                  Comma-separated values format, ideal for spreadsheet applications
                </Text>
              </View>
            </View>
            
            <View style={styles.exportFormatItem}>
              <Icon name="microsoft-excel" size={32} color="#217346" style={styles.exportFormatIcon} />
              <View style={styles.exportFormatInfo}>
                <Text style={styles.exportFormatName}>Excel Format</Text>
                <Text style={styles.exportFormatDescription}>
                  Formatted spreadsheets with tabs for different data types
                </Text>
              </View>
            </View>
            
            <View style={styles.exportFormatItem}>
              <Icon name="code-json" size={32} color="#F57C00" style={styles.exportFormatIcon} />
              <View style={styles.exportFormatInfo}>
                <Text style={styles.exportFormatName}>JSON Format</Text>
                <Text style={styles.exportFormatDescription}>
                  Structured data format for developers and integrations
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Export History Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Export History</Title>
          
          {exportHistory.length > 0 ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Format</DataTable.Title>
                <DataTable.Title>Data Types</DataTable.Title>
                <DataTable.Title numeric>Size</DataTable.Title>
                <DataTable.Title numeric>Actions</DataTable.Title>
              </DataTable.Header>
              
              {exportHistory.map((export_item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{formatDate(export_item.createdAt)}</DataTable.Cell>
                  <DataTable.Cell>
                    <Chip style={styles.formatChip}>
                      {export_item.format.toUpperCase()}
                    </Chip>
                  </DataTable.Cell>
                  <DataTable.Cell>{export_item.dataTypes.length} types</DataTable.Cell>
                  <DataTable.Cell numeric>{formatFileSize(export_item.size)}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <View style={styles.exportActions}>
                      <Button 
                        icon="download" 
                        compact
                        onPress={() => Alert.alert('Download', 'Downloading export...')}
                      />
                      <Button 
                        icon="delete" 
                        compact
                        onPress={() => Alert.alert(
                          'Delete Export',
                          'Are you sure you want to delete this export? This action cannot be undone.',
                          [
                            { text: 'Cancel' },
                            { 
                              text: 'Delete',
                              onPress: () => console.log('Delete export', index),
                              style: 'destructive'
                            }
                          ]
                        )}
                      />
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="file-export" size={48} color="#9E9E9E" />
              <Text style={styles.emptyStateTitle}>No Export History</Text>
              <Text style={styles.emptyStateDescription}>
                Your previous data exports will appear here.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderBackupDialog = () => (
    <Portal>
      <Dialog visible={showBackupDialog} onDismiss={() => !backupInProgress && setShowBackupDialog(false)}>
        <Dialog.Title>Create Backup</Dialog.Title>
        {backupInProgress ? (
          <Dialog.Content>
            <Text style={styles.backupProgressTitle}>Creating Backup...</Text>
            <ProgressBar 
              progress={progressValue} 
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.backupProgressText}>
              {Math.round(progressValue * 100)}% complete
            </Text>
            <Text style={styles.backupProgressDescription}>
              Please wait while we create a backup of your group data. This may take a few minutes.
            </Text>
          </Dialog.Content>
        ) : (
          <>
            <Dialog.Content>
              <TextInput
                label="Backup Name"
                value={backupName}
                onChangeText={setBackupName}
                style={styles.textInput}
                placeholder="E.g., Monthly Backup, Year-End Backup"
              />
              
              <TextInput
                label="Description (Optional)"
                value={backupDescription}
                onChangeText={setBackupDescription}
                style={styles.textInput}
                multiline
                numberOfLines={2}
              />
              
              <View style={styles.encryptionContainer}>
                <View style={styles.encryptionHeader}>
                  <Text style={styles.encryptionTitle}>Encrypt Backup</Text>
                  <Switch
                    value={backupEncrypted}
                    onValueChange={setBackupEncrypted}
                    color={theme.colors.primary}
                  />
                </View>
                
                <Text style={styles.encryptionDescription}>
                  Encryption adds an extra layer of security to your backup. You'll need the password to restore.
                </Text>
                
                {backupEncrypted && (
                  <TextInput
                    label="Backup Password"
                    value={backupPassword}
                    onChangeText={setBackupPassword}
                    secureTextEntry
                    style={styles.textInput}
                  />
                )}
              </View>
              
              <View style={styles.backupInfo}>
                <Text style={styles.backupInfoTitle}>What gets backed up?</Text>
                <Text style={styles.backupInfoText}>
                  Backups include all group data: members, transactions, meetings, documents, settings, and configurations.
                </Text>
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowBackupDialog(false)}>Cancel</Button>
              <Button onPress={handleCreateBackup}>Create Backup</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );

  const renderScheduleDialog = () => (
    <Portal>
      <Dialog visible={showScheduleDialog} onDismiss={() => setShowScheduleDialog(false)}>
        <Dialog.Title>Schedule Backups</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.scheduleTitle}>Backup Frequency</Text>
          
          <View style={styles.frequencyOptions}>
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                scheduledFrequency === 'daily' && styles.selectedFrequencyOption
              ]}
              onPress={() => setScheduledFrequency('daily')}
            >
              <Icon 
                name="calendar-today" 
                size={28} 
                color={scheduledFrequency === 'daily' ? theme.colors.primary : '#666'} 
              />
              <Text 
                style={[
                  styles.frequencyText,
                  scheduledFrequency === 'daily' && styles.selectedFrequencyText
                ]}
              >
                Daily
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                scheduledFrequency === 'weekly' && styles.selectedFrequencyOption
              ]}
              onPress={() => setScheduledFrequency('weekly')}
            >
              <Icon 
                name="calendar-week" 
                size={28} 
                color={scheduledFrequency === 'weekly' ? theme.colors.primary : '#666'} 
              />
              <Text 
                style={[
                  styles.frequencyText,
                  scheduledFrequency === 'weekly' && styles.selectedFrequencyText
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.frequencyOption,
                scheduledFrequency === 'monthly' && styles.selectedFrequencyOption
              ]}
              onPress={() => setScheduledFrequency('monthly')}
            >
              <Icon 
                name="calendar-month" 
                size={28} 
                color={scheduledFrequency === 'monthly' ? theme.colors.primary : '#666'} 
              />
              <Text 
                style={[
                  styles.frequencyText,
                  scheduledFrequency === 'monthly' && styles.selectedFrequencyText
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.scheduleTitle}>Start Date</Text>
          
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowDatePicker(true)}
          >
            <Icon name="calendar" size={24} color="#666" style={styles.dateIcon} />
            <Text style={styles.dateText}>
              {formatDate(scheduledNextDate)}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={scheduledNextDate}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setScheduledNextDate(selectedDate);
                }
              }}
            />
          )}
          
          <Text style={styles.scheduleTitle}>Retention Policy</Text>
          
          <View style={styles.retentionContainer}>
            <Text style={styles.retentionLabel}>Keep</Text>
            <View style={styles.retentionSelector}>
              <TouchableOpacity 
                style={styles.retentionButton}
                onPress={() => setScheduledRetention(prev => Math.max(1, prev - 1))}
              >
                <Icon name="minus" size={20} color="#666" />
              </TouchableOpacity>
              <Text style={styles.retentionValue}>{scheduledRetention}</Text>
              <TouchableOpacity 
                style={styles.retentionButton}
                onPress={() => setScheduledRetention(prev => Math.min(12, prev + 1))}
              >
                <Icon name="plus" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.retentionLabel}>backups</Text>
          </View>
          
          <Text style={styles.retentionDescription}>
            When the limit is reached, the oldest backup will be deleted automatically.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowScheduleDialog(false)}>Cancel</Button>
          <Button onPress={handleScheduleBackup}>Schedule</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderRestoreDialog = () => (
    <Portal>
      <Dialog visible={showRestoreDialog} onDismiss={() => !restoreInProgress && setShowRestoreDialog(false)}>
        <Dialog.Title>Restore Backup</Dialog.Title>
        {restoreInProgress ? (
          <Dialog.Content>
            <Text style={styles.backupProgressTitle}>Restoring Backup...</Text>
            <ProgressBar 
              progress={progressValue} 
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.backupProgressText}>
              {Math.round(progressValue * 100)}% complete
            </Text>
            <Text style={styles.backupProgressDescription}>
              Please wait while we restore your group data. This may take a few minutes. Do not close the app during this process.
            </Text>
          </Dialog.Content>
        ) : (
          <>
            <Dialog.Content>
              {selectedBackup && (
                <View style={styles.selectedBackupInfo}>
                  <Text style={styles.selectedBackupName}>{selectedBackup.name}</Text>
                  <Text style={styles.selectedBackupDate}>
                    Created on {formatDate(selectedBackup.createdAt)}
                  </Text>
                  
                  {selectedBackup.description && (
                    <Text style={styles.selectedBackupDescription}>
                      {selectedBackup.description}
                    </Text>
                  )}
                  
                  <View style={styles.selectedBackupDetails}>
                    <View style={styles.backupDetailItem}>
                      <Text style={styles.backupDetailLabel}>Size:</Text>
                      <Text style={styles.backupDetailValue}>{formatFileSize(selectedBackup.size)}</Text>
                    </View>
                    
                    <View style={styles.backupDetailItem}>
                      <Text style={styles.backupDetailLabel}>Status:</Text>
                      <Chip 
                        style={[
                          styles.backupStatusChip,
                          { backgroundColor: selectedBackup.verified ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)' }
                        ]}
                      >
                        {selectedBackup.verified ? 'Verified' : 'Unverified'}
                      </Chip>
                    </View>
                    
                    <View style={styles.backupDetailItem}>
                      <Text style={styles.backupDetailLabel}>Encryption:</Text>
                      <Text style={styles.backupDetailValue}>
                        {selectedBackup.encrypted ? 'Encrypted' : 'Unencrypted'}
                      </Text>
                    </View>
                  </View>
                  
                  {selectedBackup.encrypted && (
                    <TextInput
                      label="Backup Password"
                      value={restorePassword}
                      onChangeText={setRestorePassword}
                      secureTextEntry
                      style={styles.textInput}
                    />
                  )}
                  
                  <View style={styles.restoreWarning}>
                    <Icon name="alert" size={24} color="#F44336" style={styles.warningIcon} />
                    <Text style={styles.restoreWarningText}>
                      Restoring this backup will replace all current data. This action cannot be undone. Make sure to export or backup your current data first if needed.
                    </Text>
                  </View>
                </View>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowRestoreDialog(false)}>Cancel</Button>
              <Button 
                onPress={handleRestoreBackup}
                disabled={selectedBackup?.encrypted && !restorePassword}
              >
                Restore
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );

  const renderMigrationDialog = () => (
    <Portal>
      <Dialog visible={showMigrationDialog} onDismiss={() => !migrationInProgress && setShowMigrationDialog(false)}>
        <Dialog.Title>Migrate Data</Dialog.Title>
        {migrationInProgress ? (
          <Dialog.Content>
            <Text style={styles.backupProgressTitle}>Migration in Progress...</Text>
            <ProgressBar 
              progress={progressValue} 
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.backupProgressText}>
              {Math.round(progressValue * 100)}% complete
            </Text>
            <Text style={styles.backupProgressDescription}>
              Please wait while we migrate your data. This process may take some time depending on the amount of data. You will receive an email when the migration is complete.
            </Text>
          </Dialog.Content>
        ) : (
          <>
            <Dialog.ScrollArea style={styles.dialogScrollArea}>
              <ScrollView style={styles.dialogScrollView}>
                <View style={styles.migrationDialogContent}>
                  <Text style={styles.migrationTargetTitle}>Select Migration Target</Text>
                  
                  <View style={styles.migrationTargets}>
                    {migrationOptions.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.migrationTargetOption,
                          migrationTarget?.id === option.id && styles.selectedMigrationOption
                        ]}
                        onPress={() => setMigrationTarget(option)}
                      >
                        <View style={styles.migrationTargetHeader}>
                          <Icon 
                            name={option.icon} 
                            size={32} 
                            color={option.color} 
                            style={styles.migrationTargetIcon} 
                          />
                          <View style={styles.migrationTargetInfo}>
                            <Text style={styles.migrationTargetName}>{option.name}</Text>
                            <Text style={styles.migrationTargetDescription}>{option.description}</Text>
                          </View>
                          {migrationTarget?.id === option.id && (
                            <Icon name="check-circle" size={24} color={theme.colors.primary} />
                          )}
                        </View>
                        
                        {option.compatibilityNotes && (
                          <View style={styles.compatibilityNotes}>
                            <Text style={styles.compatibilityTitle}>Compatibility Notes:</Text>
                            <Text style={styles.compatibilityText}>{option.compatibilityNotes}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  {migrationTarget && (
                    <>
                      <Text style={styles.migrationDataTitle}>Select Data to Migrate</Text>
                      
                      <View style={styles.migrationDataOptions}>
                        <TouchableOpacity 
                          style={styles.dataSelectButton}
                          onPress={() => setShowMigrationDataMenu(true)}
                        >
                          <Text style={styles.dataSelectButtonText}>
                            {migrationDataTypes.length > 0 
                              ? `${migrationDataTypes.length} data types selected` 
                              : 'Select data types'}
                          </Text>
                          <Icon name="chevron-down" size={20} color="#666" />
                        </TouchableOpacity>
                        
                        <Menu
                          visible={showMigrationDataMenu}
                          onDismiss={() => setShowMigrationDataMenu(false)}
                          anchor={<View />}
                          style={styles.migrationDataMenu}
                        >
                          {dataTypes.map((type) => (
                            <Menu.Item
                              key={type.id}
                              title={type.name}
                              onPress={() => toggleMigrationDataType(type.id)}
                              leadingIcon={
                                migrationDataTypes.includes(type.id) 
                                  ? "check-circle" 
                                  : "circle-outline"
                              }
                            />
                          ))}
                        </Menu>
                      </View>
                      
                      {migrationDataTypes.length > 0 && (
                        <View style={styles.selectedDataTypes}>
                          {migrationDataTypes.map((typeId) => {
                            const type = dataTypes.find(t => t.id === typeId);
                            return (
                              <Chip 
                                key={typeId}
                                style={styles.selectedDataChip}
                                onClose={() => toggleMigrationDataType(typeId)}
                              >
                                {type?.name || typeId}
                              </Chip>
                            );
                          })}
                        </View>
                      )}
                    </>
                  )}
                  
                  <View style={styles.migrationInfoBox}>
                    <Icon name="information" size={24} color="#2196F3" style={styles.infoIcon} />
                    <Text style={styles.migrationInfoText}>
                      Data migration transfers your group's information to another platform. The process may take some time and you'll be notified when complete. Your original data will remain unchanged.
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setShowMigrationDialog(false)}>Cancel</Button>
              <Button 
                onPress={handleStartMigration}
                disabled={!migrationTarget || migrationDataTypes.length === 0}
              >
                Start Migration
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );