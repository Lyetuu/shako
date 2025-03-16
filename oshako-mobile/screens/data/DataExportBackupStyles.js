// src/screens/data/DataExportBackupStyles.js
import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  migrationDataTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  migrationDataOptions: {
    marginBottom: 12
  },
  dataSelectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4
  },
  dataSelectButtonText: {
    fontSize: 16
  },
  migrationDataMenu: {
    minWidth: 200
  },
  selectedDataTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  selectedDataChip: {
    margin: 4
  },
  migrationInfoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 12,
    borderRadius: 8
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2
  },
  migrationInfoText: {
    fontSize: 14,
    color: '#2196F3',
    flex: 1
  }
});

export default styles;
  header: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    paddingTop: 48,
    paddingBottom: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666'
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  tabContent: {
    padding: 16
  },
  card: {
    marginBottom: 16,
    borderRadius: 8
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  exportFormats: {
    marginTop: 16
  },
  exportFormatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  exportFormatIcon: {
    marginRight: 16
  },
  exportFormatInfo: {
    flex: 1
  },
  exportFormatName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  exportFormatDescription: {
    fontSize: 14,
    color: '#666'
  },
  formatChip: {
    height: 24
  },
  exportActions: {
    flexDirection: 'row'
  },
  emptyState: {
    alignItems: 'center',
    padding: 24
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16
  },
  emptyStateButton: {
    marginTop: 8
  },
  dialogScrollArea: {
    maxHeight: 400
  },
  dialogScrollView: {
    paddingVertical: 8
  },
  exportDialogContent: {
    paddingBottom: 8
  },
  exportFormatTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  frequencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  frequencyOption: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8
  },
  selectedFrequencyOption: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  },
  frequencyText: {
    marginTop: 8,
    fontSize: 14
  },
  selectedFrequencyText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4
  },
  dateIcon: {
    marginRight: 8
  },
  dateText: {
    fontSize: 16
  },
  retentionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  retentionLabel: {
    fontSize: 16,
    marginRight: 8
  },
  retentionSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4
  },
  retentionButton: {
    padding: 8
  },
  retentionValue: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16
  },
  retentionDescription: {
    fontSize: 14,
    color: '#666'
  },
  selectedBackupInfo: {
    
  },
  selectedBackupName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4
  },
  selectedBackupDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  selectedBackupDescription: {
    fontSize: 14,
    marginBottom: 16
  },
  selectedBackupDetails: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  backupDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  backupDetailLabel: {
    fontSize: 14,
    color: '#666'
  },
  backupDetailValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  restoreWarning: {
    flexDirection: 'row',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8
  },
  restoreWarningText: {
    fontSize: 14,
    color: '#F44336',
    flex: 1
  },
  migrationOverview: {
    marginTop: 8
  },
  migrationStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  migrationStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  migrationStepInfo: {
    flex: 1
  },
  migrationStepTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  migrationStepDescription: {
    fontSize: 14,
    color: '#666'
  },
  migrationStepConnector: {
    width: 2,
    height: 20,
    backgroundColor: theme.colors.primary,
    marginLeft: 16,
    marginBottom: 12
  },
  migrationNote: {
    flexDirection: 'row',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  noteIcon: {
    marginRight: 8,
    marginTop: 2
  },
  noteText: {
    fontSize: 14,
    color: '#2196F3',
    flex: 1
  },
  migrationOptionsList: {
    
  },
  migrationOptionItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden'
  },
  migrationOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  migrationOptionIcon: {
    marginRight: 16
  },
  migrationOptionInfo: {
    flex: 1
  },
  migrationOptionName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4
  },
  migrationOptionDescription: {
    fontSize: 14,
    color: '#666'
  },
  migrationOptionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16
  },
  compatibilitySection: {
    
  },
  compatibilityHeaderText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  compatibilityItems: {
    
  },
  compatibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  compatibilityIcon: {
    marginRight: 8
  },
  compatibilityItemText: {
    fontSize: 14
  },
  migrationOptionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 12
  },
  migrationDialogContent: {
    paddingBottom: 8
  },
  migrationTargetTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  migrationTargets: {
    marginBottom: 24
  },
  migrationTargetOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedMigrationOption: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  },
  migrationTargetHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  migrationTargetIcon: {
    marginRight: 16
  },
  migrationTargetInfo: {
    flex: 1,
    marginRight: 16
  },
  migrationTargetName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  migrationTargetDescription: {
    fontSize: 14,
    color: '#666'
  },
  compatibilityNotes: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: 12,
    borderRadius: 8
  },
  compatibilityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  compatibilityText: {
    fontSize: 14,
    color: '#666'
  },
  exportFormatOptions: {
    marginBottom: 24
  },
  formatOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedFormatOption: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  },
  formatIcon: {
    marginRight: 16
  },
  formatName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  formatDescription: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 24
  },
  selectedFormatIcon: {
    position: 'absolute',
    top: 12,
    right: 12
  },
  dataTypesTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  dataTypesContainer: {
    marginBottom: 16
  },
  dataTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  selectedDataTypeOption: {
    
  },
  dataTypeCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff'
  },
  dataTypeInfo: {
    flex: 1
  },
  dataTypeName: {
    fontSize: 16,
    marginBottom: 2
  },
  dataTypeDescription: {
    fontSize: 14,
    color: '#666'
  },
  exportWarning: {
    flexDirection: 'row',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 12,
    borderRadius: 8
  },
  warningIcon: {
    marginRight: 8,
    marginTop: 2
  },
  warningText: {
    fontSize: 14,
    color: '#2196F3',
    flex: 1
  },
  backupFeatures: {
    marginTop: 8
  },
  backupFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  backupFeatureIcon: {
    marginRight: 16
  },
  backupFeatureInfo: {
    flex: 1
  },
  backupFeatureName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  backupFeatureDescription: {
    fontSize: 14,
    color: '#666'
  },
  divider: {
    marginVertical: 16
  },
  scheduleBackupSection: {
    
  },
  scheduleBackupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  scheduleBackupTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  scheduledBackupsList: {
    
  },
  scheduledBackupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  scheduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  scheduleDetails: {
    flex: 1
  },
  scheduleFrequency: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  scheduleNextBackup: {
    fontSize: 14,
    color: '#666'
  },
  scheduleActions: {
    flexDirection: 'row'
  },
  emptySchedules: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center'
  },
  emptySchedulesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12
  },
  emptySchedulesButton: {
    
  },
  backupHistoryList: {
    
  },
  backupHistoryItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden'
  },
  backupHistoryInfo: {
    padding: 16
  },
  backupHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  backupHistoryName: {
    fontSize: 16,
    fontWeight: '500'
  },
  backupStatusChip: {
    height: 24
  },
  backupHistoryDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  backupHistoryDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  backupHistoryDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4
  },
  backupHistoryDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4
  },
  backupHistoryActions: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 12,
    justifyContent: 'flex-end'
  },
  downloadButton: {
    marginLeft: 8
  },
  textInput: {
    marginBottom: 16
  },
  encryptionContainer: {
    marginVertical: 8
  },
  encryptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  encryptionTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  encryptionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  backupInfo: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  backupInfoTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  backupInfoText: {
    fontSize: 14,
    color: '#2196F3'
  },
  backupProgressTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center'
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  backupProgressText: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 16
  },
  backupProgressDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 12
  },