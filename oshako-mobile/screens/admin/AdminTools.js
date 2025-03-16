import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  DataTable,
  Searchbar,
  Chip,
  Avatar,
  FAB,
  Portal,
  Dialog,
  TextInput,
  Checkbox,
  Divider,
  Menu,
  IconButton
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import {
  getSavedReports,
  getPendingApprovals,
  getDelegatedTasks,
  getGroupMembers,
  getBatchOperations,
  executeBatchOperation,
  createReport,
  delegateTask
} from '../../services/api/admin';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminTools = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedReports, setSavedReports] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [delegatedTasks, setDelegatedTasks] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [batchOperations, setBatchOperations] = useState([]);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showDelegateDialog, setShowDelegateDialog] = useState(false);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportType, setReportType] = useState('');
  const [selectedDelegatee, setSelectedDelegatee] = useState(null);
  const [delegationTaskType, setDelegationTaskType] = useState('');
  const [delegationPeriod, setDelegationPeriod] = useState(7);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [delegationEndDate, setDelegationEndDate] = useState(new Date());
  const [selectedBatchOperation, setSelectedBatchOperation] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const reportTypes = [
    'Financial Summary', 
    'Member Activity', 
    'Contribution Trends', 
    'Loan Performance', 
    'Compliance Status'
  ];
  
  const taskTypes = [
    'Approval Rights',
    'Member Management',
    'Report Generation',
    'Communication',
    'Financial Review'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch saved reports
      const reports = await getSavedReports(user.id);
      setSavedReports(reports);
      
      // Fetch pending approvals
      const approvals = await getPendingApprovals(user.id);
      setPendingApprovals(approvals);
      
      // Fetch delegated tasks
      const tasks = await getDelegatedTasks(user.id);
      setDelegatedTasks(tasks);
      
      // Fetch group members
      const members = await getGroupMembers(user.id);
      setGroupMembers(members);
      
      // Fetch batch operations
      const operations = await getBatchOperations(user.id);
      setBatchOperations(operations);
    } catch (error) {
      console.error('Error fetching admin tools data:', error);
      Alert.alert('Error', 'Failed to load admin tools data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    // In a real app, you would filter content based on the search query
  };

  const handleCreateReport = async () => {
    try {
      if (!reportName.trim()) {
        Alert.alert('Error', 'Please enter a report name.');
        return;
      }
      
      if (!reportType) {
        Alert.alert('Error', 'Please select a report type.');
        return;
      }
      
      // In a real app, this would create a new report
      await createReport(user.id, {
        name: reportName,
        description: reportDescription,
        type: reportType
      });
      
      // Reset form and close dialog
      setReportName('');
      setReportDescription('');
      setReportType('');
      setShowReportDialog(false);
      
      // Refresh reports list
      const reports = await getSavedReports(user.id);
      setSavedReports(reports);
      
      Alert.alert('Success', 'Report created successfully.');
    } catch (error) {
      console.error('Error creating report:', error);
      Alert.alert('Error', 'Failed to create report. Please try again.');
    }
  };

  const handleBatchApprove = async () => {
    if (selectedApprovals.length === 0) {
      Alert.alert('Warning', 'Please select at least one item to approve.');
      return;
    }
    
    try {
      // In a real app, this would process batch approvals
      for (const approvalId of selectedApprovals) {
        // Process approval
      }
      
      // Clear selection
      setSelectedApprovals([]);
      
      // Refresh approvals list
      const approvals = await getPendingApprovals(user.id);
      setPendingApprovals(approvals);
      
      Alert.alert('Success', `${selectedApprovals.length} items approved successfully.`);
    } catch (error) {
      console.error('Error processing batch approvals:', error);
      Alert.alert('Error', 'Failed to process batch approvals. Please try again.');
    }
  };

  const handleDelegateTask = async () => {
    try {
      if (!selectedDelegatee) {
        Alert.alert('Error', 'Please select a member to delegate to.');
        return;
      }
      
      if (!delegationTaskType) {
        Alert.alert('Error', 'Please select a task type.');
        return;
      }
      
      // In a real app, this would delegate the task
      await delegateTask(user.id, {
        delegateeId: selectedDelegatee.id,
        taskType: delegationTaskType,
        endDate: delegationEndDate.toISOString()
      });
      
      // Reset form and close dialog
      setSelectedDelegatee(null);
      setDelegationTaskType('');
      setDelegationPeriod(7);
      setDelegationEndDate(new Date());
      setShowDelegateDialog(false);
      
      // Refresh delegated tasks list
      const tasks = await getDelegatedTasks(user.id);
      setDelegatedTasks(tasks);
      
      Alert.alert('Success', 'Task delegated successfully.');
    } catch (error) {
      console.error('Error delegating task:', error);
      Alert.alert('Error', 'Failed to delegate task. Please try again.');
    }
  };

  const handleExecuteBatchOperation = async () => {
    try {
      if (!selectedBatchOperation) {
        Alert.alert('Error', 'Please select a batch operation.');
        return;
      }
      
      // In a real app, this would execute the batch operation
      await executeBatchOperation(user.id, selectedBatchOperation.id);
      
      // Close dialog
      setShowBatchDialog(false);
      setSelectedBatchOperation(null);
      
      Alert.alert(
        'Success', 
        `${selectedBatchOperation.name} executed successfully for ${selectedBatchOperation.itemCount} items.`
      );
    } catch (error) {
      console.error('Error executing batch operation:', error);
      Alert.alert('Error', 'Failed to execute batch operation. Please try again.');
    }
  };

  const toggleApprovalSelection = (approvalId) => {
    if (selectedApprovals.includes(approvalId)) {
      setSelectedApprovals(selectedApprovals.filter(id => id !== approvalId));
    } else {
      setSelectedApprovals([...selectedApprovals, approvalId]);
    }
  };

  const renderReportDialog = () => (
    <Portal>
      <Dialog visible={showReportDialog} onDismiss={() => setShowReportDialog(false)}>
        <Dialog.Title>Create Custom Report</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Report Name"
            value={reportName}
            onChangeText={setReportName}
            style={styles.textInput}
          />
          
          <TextInput
            label="Description (Optional)"
            value={reportDescription}
            onChangeText={setReportDescription}
            style={styles.textInput}
            multiline
          />
          
          <Text style={styles.inputLabel}>Report Type</Text>
          <View style={styles.chipContainer}>
            {reportTypes.map((type) => (
              <Chip
                key={type}
                selected={reportType === type}
                onPress={() => setReportType(type)}
                style={styles.chip}
              >
                {type}
              </Chip>
            ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowReportDialog(false)}>Cancel</Button>
          <Button onPress={handleCreateReport}>Create</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderDelegateDialog = () => (
    <Portal>
      <Dialog visible={showDelegateDialog} onDismiss={() => setShowDelegateDialog(false)}>
        <Dialog.Title>Delegate Task</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.inputLabel}>Select Member</Text>
          <ScrollView style={styles.memberList}>
            {groupMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberItem,
                  selectedDelegatee?.id === member.id && styles.selectedMemberItem
                ]}
                onPress={() => setSelectedDelegatee(member)}
              >
                <Avatar.Image 
                  source={{ uri: member.avatar }} 
                  size={40}
                  style={styles.memberAvatar}
                />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                </View>
                {selectedDelegatee?.id === member.id && (
                  <Icon name="check-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <Text style={styles.inputLabel}>Task Type</Text>
          <View style={styles.chipContainer}>
            {taskTypes.map((type) => (
              <Chip
                key={type}
                selected={delegationTaskType === type}
                onPress={() => setDelegationTaskType(type)}
                style={styles.chip}
              >
                {type}
              </Chip>
            ))}
          </View>
          
          <Text style={styles.inputLabel}>Delegation Period</Text>
          <View style={styles.delegationPeriodContainer}>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar" size={24} color="#666" style={styles.calendarIcon} />
              <Text style={styles.dateText}>
                Until {delegationEndDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={delegationEndDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDelegationEndDate(selectedDate);
                  }
                }}
              />
            )}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDelegateDialog(false)}>Cancel</Button>
          <Button onPress={handleDelegateTask}>Delegate</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderBatchOperationDialog = () => (
    <Portal>
      <Dialog visible={showBatchDialog} onDismiss={() => setShowBatchDialog(false)}>
        <Dialog.Title>Execute Batch Operation</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.inputLabel}>Select Operation</Text>
          {batchOperations.map((operation) => (
            <TouchableOpacity
              key={operation.id}
              style={[
                styles.batchOperationItem,
                selectedBatchOperation?.id === operation.id && styles.selectedBatchOperation
              ]}
              onPress={() => setSelectedBatchOperation(operation)}
            >
              <View style={styles.batchOperationInfo}>
                <Text style={styles.batchOperationName}>{operation.name}</Text>
                <Text style={styles.batchOperationDescription}>
                  {operation.description}
                </Text>
                <Text style={styles.batchOperationCount}>
                  {operation.itemCount} items will be processed
                </Text>
              </View>
              {selectedBatchOperation?.id === operation.id && (
                <Icon name="check-circle" size={24} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
          
          <View style={styles.batchWarning}>
            <Icon name="alert" size={20} color="#FFC107" style={styles.warningIcon} />
            <Text style={styles.warningText}>
              This operation will affect multiple records. Please confirm before proceeding.
            </Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowBatchDialog(false)}>Cancel</Button>
          <Button onPress={handleExecuteBatchOperation}>Execute</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderReportsTab = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={savedReports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.reportCard} onPress={() => navigation.navigate('ReportDetails', { reportId: item.id })}>
            <Card.Content>
              <View style={styles.reportHeader}>
                <Icon 
                  name={
                    item.type === 'Financial Summary' ? 'chart-line' :
                    item.type === 'Member Activity' ? 'account-group' :
                    item.type === 'Contribution Trends' ? 'trending-up' :
                    item.type === 'Loan Performance' ? 'cash-multiple' :
                    'file-document'
                  } 
                  size={24} 
                  color={theme.colors.primary} 
                />
                <View style={styles.reportInfo}>
                  <Title style={styles.reportTitle}>{item.name}</Title>
                  <Paragraph style={styles.reportType}>{item.type}</Paragraph>
                </View>
              </View>
              
              {item.description && (
                <Paragraph style={styles.reportDescription}>{item.description}</Paragraph>
              )}
              
              <View style={styles.reportMetadata}>
                <View style={styles.reportMetadataItem}>
                  <Icon name="clock-outline" size={16} color="#666" />
                  <Text style={styles.metadataText}>
                    Updated {formatDate(item.lastRun)}
                  </Text>
                </View>
                
                <View style={styles.reportMetadataItem}>
                  <Icon name="refresh" size={16} color="#666" />
                  <Text style={styles.metadataText}>
                    {item.schedule || 'On demand'}
                  </Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button 
                icon="file-export" 
                onPress={() => Alert.alert('Export', `Exporting ${item.name}...`)}
              >
                Export
              </Button>
              <Button 
                icon="pencil" 
                onPress={() => navigation.navigate('EditReport', { reportId: item.id })}
              >
                Edit
              </Button>
              <Button 
                icon="refresh" 
                onPress={() => Alert.alert('Refresh', `Refreshing ${item.name}...`)}
              >
                Refresh
              </Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="file-document-outline" size={60} color="#9E9E9E" />
            <Text style={styles.emptyStateTitle}>No Saved Reports</Text>
            <Text style={styles.emptyStateDescription}>
              Create custom reports to track group finances and activity
            </Text>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => setShowReportDialog(true)}
              style={styles.emptyStateButton}
            >
              Create Report
            </Button>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowReportDialog(true)}
      />
    </View>
  );

  const renderBatchTab = () => (
    <View style={styles.tabContainer}>
      <View style={styles.batchHeader}>
        <Text style={styles.batchHeaderTitle}>Pending Approvals</Text>
        <Text style={styles.batchHeaderSubtitle}>
          {selectedApprovals.length} of {pendingApprovals.length} selected
        </Text>
      </View>
      
      <DataTable style={styles.dataTable}>
        <DataTable.Header>
          <DataTable.Title style={styles.checkboxColumn}>
            <Checkbox
              status={
                pendingApprovals.length > 0 && 
                selectedApprovals.length === pendingApprovals.length ? 
                'checked' : 'unchecked'
              }
              onPress={() => {
                if (selectedApprovals.length === pendingApprovals.length) {
                  setSelectedApprovals([]);
                } else {
                  setSelectedApprovals(pendingApprovals.map(item => item.id));
                }
              }}
            />
          </DataTable.Title>
          <DataTable.Title>Type</DataTable.Title>
          <DataTable.Title>Details</DataTable.Title>
          <DataTable.Title numeric>Amount</DataTable.Title>
          <DataTable.Title numeric>Date</DataTable.Title>
        </DataTable.Header>

        {pendingApprovals.map((approval) => (
          <DataTable.Row key={approval.id}>
            <DataTable.Cell style={styles.checkboxColumn}>
              <Checkbox
                status={selectedApprovals.includes(approval.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleApprovalSelection(approval.id)}
              />
            </DataTable.Cell>
            <DataTable.Cell>
              <View style={styles.approvalTypeContainer}>
                <Icon 
                  name={
                    approval.type === 'Withdrawal' ? 'cash-minus' :
                    approval.type === 'Loan' ? 'cash-multiple' :
                    approval.type === 'Member' ? 'account-plus' :
                    'file-document'
                  } 
                  size={20} 
                  color={
                    approval.type === 'Withdrawal' ? '#F44336' :
                    approval.type === 'Loan' ? '#2196F3' :
                    approval.type === 'Member' ? '#4CAF50' :
                    '#9E9E9E'
                  } 
                />
                <Text style={styles.approvalTypeText}>{approval.type}</Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styles.approvalRequestor}>{approval.requestor}</Text>
              <Text style={styles.approvalDescription}>{approval.description}</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              {approval.amount ? formatCurrency(approval.amount) : '-'}
            </DataTable.Cell>
            <DataTable.Cell numeric>
              {formatDate(approval.date)}
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        {pendingApprovals.length === 0 && (
          <DataTable.Row style={styles.emptyTableRow}>
            <DataTable.Cell style={{ flex: 5, alignItems: 'center' }}>
              <Text style={styles.emptyTableText}>No pending approvals</Text>
            </DataTable.Cell>
          </DataTable.Row>
        )}
      </DataTable>
      
      <View style={styles.batchActions}>
        <Button 
          mode="contained" 
          icon="check-all" 
          onPress={handleBatchApprove}
          disabled={selectedApprovals.length === 0}
          style={styles.batchActionButton}
        >
          Approve Selected
        </Button>
        <Button 
          mode="outlined" 
          icon="close-circle-multiple" 
          onPress={() => Alert.alert('Reject', 'Rejecting selected items...')}
          disabled={selectedApprovals.length === 0}
          style={styles.batchActionButton}
        >
          Reject Selected
        </Button>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.batchOperationsSection}>
        <Text style={styles.batchHeaderTitle}>Saved Batch Operations</Text>
        <Text style={styles.batchHeaderSubtitle}>
          Execute predefined operations on multiple items
        </Text>
        
        {batchOperations.length > 0 ? (
          <View style={styles.batchOperationsGrid}>
            {batchOperations.map((operation) => (
              <TouchableOpacity
                key={operation.id}
                style={styles.batchOperationCard}
                onPress={() => {
                  setSelectedBatchOperation(operation);
                  setShowBatchDialog(true);
                }}
              >
                <Icon 
                  name={operation.icon} 
                  size={36} 
                  color={theme.colors.primary} 
                  style={styles.batchOperationIcon}
                />
                <Text style={styles.batchOperationCardName}>{operation.name}</Text>
                <Text style={styles.batchOperationItemCount}>
                  {operation.itemCount} items
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyBatchOperations}>
            <Icon name="format-list-checks" size={60} color="#9E9E9E" />
            <Text style={styles.emptyStateTitle}>No Batch Operations</Text>
            <Text style={styles.emptyStateDescription}>
              Create batch operations to process multiple tasks at once
            </Text>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => navigation.navigate('CreateBatchOperation')}
              style={styles.emptyStateButton}
            >
              Create Operation
            </Button>
          </View>
        )}
      </View>
    </View>
  );

  const renderDelegationTab = () => (
    <View style={styles.tabContainer}>
      <View style={styles.delegationHeader}>
        <View>
          <Text style={styles.delegationHeaderTitle}>Current Delegations</Text>
          <Text style={styles.delegationHeaderSubtitle}>
            Tasks you've delegated to other members
          </Text>
        </View>
        <Button 
          mode="contained" 
          icon="account-arrow-right" 
          onPress={() => setShowDelegateDialog(true)}
        >
          Delegate
        </Button>
      </View>
      
      {delegatedTasks.length > 0 ? (
        <FlatList
          data={delegatedTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card style={styles.delegationCard}>
              <Card.Content>
                <View style={styles.delegationCardHeader}>
                  <Avatar.Image source={{ uri: item.delegatee.avatar }} size={50} />
                  <View style={styles.delegationCardHeaderInfo}>
                    <Title style={styles.delegateeName}>{item.delegatee.name}</Title>
                    <View style={styles.taskTypeChip}>
                      <Text style={styles.taskTypeText}>{item.taskType}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.delegationPeriodInfo}>
                  <Icon name="calendar-range" size={16} color="#666" />
                  <Text style={styles.delegationPeriodText}>
                    From {formatDate(item.startDate)} to {formatDate(item.endDate)}
                  </Text>
                </View>
                
                {item.notes && (
                  <Paragraph style={styles.delegationNotes}>{item.notes}</Paragraph>
                )}
                
                <View style={styles.delegationActivities}>
                  <Text style={styles.delegationActivitiesTitle}>Recent Activities</Text>
                  {item.recentActivities && item.recentActivities.length > 0 ? (
                    item.recentActivities.map((activity, index) => (
                      <View key={index} style={styles.activityItem}>
                        <View style={styles.activityDot} />
                        <Text style={styles.activityText}>
                          {activity.description} ({formatDate(activity.date)})
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noActivitiesText}>No recent activities</Text>
                  )}
                </View>
              </Card.Content>
              <Card.Actions>
                <Button 
                  icon="history" 
                  onPress={() => navigation.navigate('DelegationHistory', { taskId: item.id })}
                >
                  History
                </Button>
                <Button 
                  icon="account-cancel" 
                  onPress={() => Alert.alert(
                    'Revoke Delegation', 
                    `Are you sure you want to revoke delegation from ${item.delegatee.name}?`,
                    [
                      { text: 'Cancel' },
                      { text: 'Revoke', onPress: () => console.log('Revoke pressed') }
                    ]
                  )}
                >
                  Revoke
                </Button>
              </Card.Actions>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="account-arrow-right" size={60} color="#9E9E9E" />
              <Text style={styles.emptyStateTitle}>No Delegated Tasks</Text>
              <Text style={styles.emptyStateDescription}>
                Delegate specific responsibilities to trusted members
              </Text>
              <Button 
                mode="contained" 
                icon="account-arrow-right" 
                onPress={() => setShowDelegateDialog(true)}
                style={styles.emptyStateButton}
              >
                Delegate Task
              </Button>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="account-arrow-right" size={60} color="#9E9E9E" />
          <Text style={styles.emptyStateTitle}>No Delegated Tasks</Text>
          <Text style={styles.emptyStateDescription}>
            Delegate specific responsibilities to trusted members
          </Text>
          <Button 
            mode="contained" 
            icon="account-arrow-right" 
            onPress={() => setShowDelegateDialog(true)}
            style={styles.emptyStateButton}
          >
            Delegate Task
          </Button>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading admin tools...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Admin Tools</Text>
          <View style={styles.headerActions}>
            <IconButton 
              icon="bell" 
              color="#fff" 
              size={24} 
              onPress={() => navigation.navigate('Notifications')}
            />
            <Menu
              visible={showMenu}
              onDismiss={() => setShowMenu(false)}
              anchor={
                <IconButton 
                  icon="dots-vertical" 
                  color="#fff" 
                  size={24} 
                  onPress={() => setShowMenu(true)}
                />
              }
            >
              <Menu.Item 
                icon="cog" 
                onPress={() => {
                  setShowMenu(false);
                  navigation.navigate('AdminSettings');
                }} 
                title="Settings" 
              />
              <Menu.Item 
                icon="help-circle" 
                onPress={() => {
                  setShowMenu(false);
                  navigation.navigate('AdminHelp');
                }} 
                title="Help" 
              />
            </Menu>
          </View>
        </View>
      </View>
      
      {/* Search Bar */}
      <Searchbar
        placeholder="Search reports, approvals, delegations..."
        onChangeText={onSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {/* Tab Menu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Icon 
            name="file-chart" 
            size={24} 
            color={activeTab === 'reports' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'reports' && styles.activeTabText
            ]}
          >
            Custom Reports
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'batch' && styles.activeTab]}
          onPress={() => setActiveTab('batch')}
        >
          <Icon 
            name="format-list-checks" 
            size={24} 
            color={activeTab === 'batch' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'batch' && styles.activeTabText
            ]}
          >
            Batch Operations
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'delegation' && styles.activeTab]}
          onPress={() => setActiveTab('delegation')}
        >
          <Icon 
            name="account-arrow-right" 
            size={24} 
            color={activeTab === 'delegation' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'delegation' && styles.activeTabText
            ]}
          >
            Delegation
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {activeTab === 'reports' && renderReportsTab()}
      {activeTab === 'batch' && renderBatchTab()}
      {activeTab === 'delegation' && renderDelegationTab()}
      
      {/* Dialogs */}
      {renderReportDialog()}
      {renderDelegateDialog()}
      {renderBatchOperationDialog()}
    </View>
  );
};

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
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  headerActions: {
    flexDirection: 'row'
  },
  searchBar: {
    margin: 16,
    elevation: 2
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
  tabContainer: {
    flex: 1,
    padding: 16
  },
  reportCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  reportHeader: {
    flexDirection: 'row',
    marginBottom: 8
  },
  reportInfo: {
    marginLeft: 12,
    flex: 1
  },
  reportTitle: {
    fontSize: 18
  },
  reportType: {
    fontSize: 14,
    color: '#666'
  },
  reportDescription: {
    fontSize: 14,
    marginBottom: 8
  },
  reportMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  reportMetadataItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  emptyStateButton: {
    paddingHorizontal: 16
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16
  },
  batchHeader: {
    marginBottom: 16
  },
  batchHeaderTitle: {
    fontSize: 18,
    fontWeight: '500'
  },
  batchHeaderSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  dataTable: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  checkboxColumn: {
    maxWidth: 48
  },
  approvalTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  approvalTypeText: {
    marginLeft: 4
  },
  approvalRequestor: {
    fontWeight: '500'
  },
  approvalDescription: {
    fontSize: 12,
    color: '#666'
  },
  emptyTableRow: {
    height: 100
  },
  emptyTableText: {
    color: '#9E9E9E'
  },
  batchActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  batchActionButton: {
    flex: 1,
    marginHorizontal: 4
  },
  divider: {
    marginVertical: 24
  },
  batchOperationsSection: {
    marginBottom: 16
  },
  batchOperationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  },
  batchOperationCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginRight: '4%',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center'
  },
  batchOperationCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginRight: '4%',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  batchOperationIcon: {
    marginBottom: 8
  },
  batchOperationCardName: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4
  },
  batchOperationItemCount: {
    fontSize: 12,
    color: '#666'
  },
  emptyBatchOperations: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  delegationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  delegationHeaderTitle: {
    fontSize: 18,
    fontWeight: '500'
  },
  delegationHeaderSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  delegationCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  delegationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  delegationCardHeaderInfo: {
    marginLeft: 12,
    flex: 1
  },
  delegateeName: {
    fontSize: 18
  },
  taskTypeChip: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  taskTypeText: {
    fontSize: 12,
    color: theme.colors.primary
  },
  delegationPeriodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  delegationPeriodText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8
  },
  delegationNotes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  delegationActivities: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8
  },
  delegationActivitiesTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginRight: 8
  },
  activityText: {
    fontSize: 12,
    color: '#666'
  },
  noActivitiesText: {
    fontSize: 12,
    color: '#9E9E9E',
    fontStyle: 'italic'
  },
  textInput: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 4
  },
  memberList: {
    maxHeight: 150,
    marginBottom: 16
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5'
  },
  selectedMemberItem: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)'
  },
  memberAvatar: {
    marginRight: 12
  },
  memberInfo: {
    flex: 1
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500'
  },
  memberRole: {
    fontSize: 12,
    color: '#666'
  },
  delegationPeriodContainer: {
    marginTop: 8
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4
  },
  calendarIcon: {
    marginRight: 8
  },
  dateText: {
    fontSize: 16
  },
  batchOperationItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedBatchOperation: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  },
  batchOperationInfo: {
    flex: 1
  },
  batchOperationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  batchOperationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  batchOperationCount: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500'
  },
  batchWarning: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  warningIcon: {
    marginRight: 8
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    flex: 1
  }
});

export default AdminTools;