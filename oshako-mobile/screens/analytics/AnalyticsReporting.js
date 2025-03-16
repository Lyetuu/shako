import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Menu,
  Chip,
  DataTable,
  Searchbar,
  Portal,
  Dialog,
  ToggleButton,
  List,
  IconButton,
  ProgressBar
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import {
  getGroupMetrics,
  getSavingsPerformance,
  getMemberActivity,
  getFinancialHealth,
  getPredictiveAnalysis,
  exportReport,
  scheduledReport,
  saveCustomReport
} from '../../services/api/analytics';
import { formatCurrency, formatDate } from '../../utils/formatters';
import styles from './styles';

const { width } = Dimensions.get('window');

const AnalyticsReporting = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('metrics');
  const [groupMetrics, setGroupMetrics] = useState(null);
  const [savingsPerformance, setSavingsPerformance] = useState(null);
  const [memberActivity, setMemberActivity] = useState(null);
  const [financialHealth, setFinancialHealth] = useState(null);
  const [predictiveAnalysis, setPredictiveAnalysis] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [scheduledReports, setScheduledReports] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('date');
  const [scheduledStartDate, setScheduledStartDate] = useState(new Date());
  const [scheduledFrequency, setScheduledFrequency] = useState('monthly');
  const [scheduledReportType, setScheduledReportType] = useState('summary');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch group metrics
      const metrics = await getGroupMetrics(user.groupId, timeRange);
      setGroupMetrics(metrics);
      
      // Fetch savings performance
      const performance = await getSavingsPerformance(user.groupId, timeRange);
      setSavingsPerformance(performance);
      
      // Fetch member activity
      const activity = await getMemberActivity(user.groupId, timeRange);
      setMemberActivity(activity);
      
      // Fetch financial health
      const health = await getFinancialHealth(user.groupId);
      setFinancialHealth(health);
      
      // Fetch predictive analysis
      const predictions = await getPredictiveAnalysis(user.groupId);
      setPredictiveAnalysis(predictions);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      Alert.alert('Error', 'Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    // In a real app, you would filter content based on the search query
  };

  const handleExportReport = async () => {
    try {
      await exportReport(user.groupId, {
        reportType: activeTab,
        timeRange,
        format: exportFormat
      });
      
      setShowExportDialog(false);
      Alert.alert('Success', `Report exported as ${exportFormat.toUpperCase()}.`);
    } catch (error) {
      console.error('Error exporting report:', error);
      Alert.alert('Error', 'Failed to export report. Please try again.');
    }
  };

  const handleScheduleReport = async () => {
    try {
      const report = await scheduledReport(user.groupId, {
        reportType: scheduledReportType,
        frequency: scheduledFrequency,
        startDate: scheduledStartDate.toISOString()
      });
      
      // Add the new scheduled report to the list
      setScheduledReports([...scheduledReports, report]);
      
      // Reset form and close dialog
      setScheduledReportType('summary');
      setScheduledFrequency('monthly');
      setScheduledStartDate(new Date());
      setShowScheduleDialog(false);
      
      Alert.alert('Success', 'Report scheduled successfully.');
    } catch (error) {
      console.error('Error scheduling report:', error);
      Alert.alert('Error', 'Failed to schedule report. Please try again.');
    }
  };

  const handleSaveCustomReport = async () => {
    try {
      await saveCustomReport(user.groupId, {
        name: `Custom ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report`,
        type: activeTab,
        timeRange,
        filters: {} // In a real app, you would include any active filters
      });
      
      Alert.alert('Success', 'Custom report saved successfully.');
    } catch (error) {
      console.error('Error saving custom report:', error);
      Alert.alert('Error', 'Failed to save custom report. Please try again.');
    }
  };

  const renderExportDialog = () => (
    <Portal>
      <Dialog visible={showExportDialog} onDismiss={() => setShowExportDialog(false)}>
        <Dialog.Title>Export Report</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.exportTitle}>Export Format</Text>
          
          <View style={styles.exportOptions}>
            <ToggleButton.Row 
              onValueChange={value => setExportFormat(value)} 
              value={exportFormat}
            >
              <ToggleButton icon="file-pdf-box" value="pdf" />
              <ToggleButton icon="microsoft-excel" value="excel" />
              <ToggleButton icon="file-delimited" value="csv" />
            </ToggleButton.Row>
          </View>
          
          <Text style={styles.exportDescription}>
            {exportFormat === 'pdf' 
              ? 'PDF format includes all visualizations and data tables. Best for sharing and printing.'
              : exportFormat === 'excel'
              ? 'Excel format includes all data in spreadsheet format with embedded charts. Best for further analysis.'
              : 'CSV format includes raw data in plain text format. Best for importing into other systems.'}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowExportDialog(false)}>Cancel</Button>
          <Button onPress={handleExportReport}>Export</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AnalyticsReporting;

  const renderScheduleDialog = () => (
    <Portal>
      <Dialog visible={showScheduleDialog} onDismiss={() => setShowScheduleDialog(false)}>
        <Dialog.Title>Schedule Report</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.scheduleTitle}>Report Type</Text>
          
          <View style={styles.reportTypeOptions}>
            <ToggleButton.Row 
              onValueChange={value => setScheduledReportType(value)} 
              value={scheduledReportType}
            >
              <ToggleButton 
                icon="file-chart" 
                value="summary" 
                style={styles.reportTypeButton}
              />
              <ToggleButton 
                icon="chart-line" 
                value="performance" 
                style={styles.reportTypeButton}
              />
              <ToggleButton 
                icon="account-group" 
                value="activity" 
                style={styles.reportTypeButton}
              />
            </ToggleButton.Row>
            
            <Text style={styles.selectedReportType}>
              {scheduledReportType === 'summary' 
                ? 'Group Summary Report'
                : scheduledReportType === 'performance'
                ? 'Savings Performance Report'
                : 'Member Activity Report'}
            </Text>
          </View>
          
          <Text style={styles.scheduleTitle}>Frequency</Text>
          
          <View style={styles.frequencyOptions}>
            <ToggleButton.Row 
              onValueChange={value => setScheduledFrequency(value)} 
              value={scheduledFrequency}
            >
              <ToggleButton 
                icon="calendar-week" 
                value="weekly" 
                style={styles.frequencyButton}
              />
              <ToggleButton 
                icon="calendar-month" 
                value="monthly" 
                style={styles.frequencyButton}
              />
              <ToggleButton 
                icon="calendar-range" 
                value="quarterly" 
                style={styles.frequencyButton}
              />
            </ToggleButton.Row>
            
            <Text style={styles.selectedFrequency}>
              {scheduledFrequency === 'weekly' 
                ? 'Weekly (Every Monday)'
                : scheduledFrequency === 'monthly'
                ? 'Monthly (First day of month)'
                : 'Quarterly (First day of quarter)'}
            </Text>
          </View>
          
          <Text style={styles.scheduleTitle}>Start Date</Text>
          
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => {
              setDatePickerMode('date');
              setShowDatePicker(true);
            }}
          >
            <Icon name="calendar" size={24} color="#666" style={styles.dateIcon} />
            <Text style={styles.dateText}>
              {formatDate(scheduledStartDate)}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={scheduledStartDate}
              mode={datePickerMode}
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setScheduledStartDate(selectedDate);
                }
              }}
            />
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowScheduleDialog(false)}>Cancel</Button>
          <Button onPress={handleScheduleReport}>Schedule</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderMetricsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {groupMetrics && (
        <>
          {/* Key Performance Indicators Card */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>Key Performance Indicators</Title>
                <View style={styles.timeRangeSelector}>
                  <TouchableOpacity 
                    style={styles.timeRangeButton}
                    onPress={() => setShowTimeMenu(true)}
                  >
                    <Text style={styles.timeRangeText}>
                      {timeRange === 'week' ? 'This Week' :
                       timeRange === 'month' ? 'This Month' :
                       timeRange === 'quarter' ? 'This Quarter' :
                       'This Year'}
                    </Text>
                    <Icon name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                  
                  <Menu
                    visible={showTimeMenu}
                    onDismiss={() => setShowTimeMenu(false)}
                    anchor={<View />}
                    style={styles.timeMenu}
                  >
                    <Menu.Item 
                      onPress={() => {
                        setTimeRange('week');
                        setShowTimeMenu(false);
                      }} 
                      title="This Week" 
                    />
                    <Menu.Item 
                      onPress={() => {
                        setTimeRange('month');
                        setShowTimeMenu(false);
                      }} 
                      title="This Month" 
                    />
                    <Menu.Item 
                      onPress={() => {
                        setTimeRange('quarter');
                        setShowTimeMenu(false);
                      }} 
                      title="This Quarter" 
                    />
                    <Menu.Item 
                      onPress={() => {
                        setTimeRange('year');
                        setShowTimeMenu(false);
                      }} 
                      title="This Year" 
                    />
                  </Menu>
                </View>
              </View>
              
              <View style={styles.kpiContainer}>
                <View style={styles.kpiCard}>
                  <View style={styles.kpiHeader}>
                    <Icon name="cash-plus" size={24} color="#4CAF50" style={styles.kpiIcon} />
                    <Text style={styles.kpiTitle}>Total Savings</Text>
                  </View>
                  <Text style={styles.kpiValue}>{formatCurrency(groupMetrics.totalSavings)}</Text>
                  <View style={styles.kpiTrend}>
                    <Icon 
                      name={groupMetrics.savingsTrend >= 0 ? "arrow-up" : "arrow-down"} 
                      size={16} 
                      color={groupMetrics.savingsTrend >= 0 ? "#4CAF50" : "#F44336"} 
                    />
                    <Text 
                      style={[
                        styles.kpiTrendValue,
                        { color: groupMetrics.savingsTrend >= 0 ? "#4CAF50" : "#F44336" }
                      ]}
                    >
                      {Math.abs(groupMetrics.savingsTrend)}%
                    </Text>
                    <Text style={styles.kpiTrendPeriod}>vs. prev. period</Text>
                  </View>
                </View>
                
                <View style={styles.kpiCard}>
                  <View style={styles.kpiHeader}>
                    <Icon name="account-group" size={24} color="#2196F3" style={styles.kpiIcon} />
                    <Text style={styles.kpiTitle}>Active Members</Text>
                  </View>
                  <Text style={styles.kpiValue}>{groupMetrics.activeMembers}</Text>
                  <View style={styles.kpiTrend}>
                    <Icon 
                      name={groupMetrics.membersTrend >= 0 ? "arrow-up" : "arrow-down"} 
                      size={16} 
                      color={groupMetrics.membersTrend >= 0 ? "#4CAF50" : "#F44336"} 
                    />
                    <Text 
                      style={[
                        styles.kpiTrendValue,
                        { color: groupMetrics.membersTrend >= 0 ? "#4CAF50" : "#F44336" }
                      ]}
                    >
                      {Math.abs(groupMetrics.membersTrend)}%
                    </Text>
                    <Text style={styles.kpiTrendPeriod}>vs. prev. period</Text>
                  </View>
                </View>
                
                <View style={styles.kpiCard}>
                  <View style={styles.kpiHeader}>
                    <Icon name="bank-transfer" size={24} color="#FF9800" style={styles.kpiIcon} />
                    <Text style={styles.kpiTitle}>Transactions</Text>
                  </View>
                  <Text style={styles.kpiValue}>{groupMetrics.transactionsCount}</Text>
                  <View style={styles.kpiTrend}>
                    <Icon 
                      name={groupMetrics.transactionsTrend >= 0 ? "arrow-up" : "arrow-down"} 
                      size={16} 
                      color={groupMetrics.transactionsTrend >= 0 ? "#4CAF50" : "#F44336"} 
                    />
                    <Text 
                      style={[
                        styles.kpiTrendValue,
                        { color: groupMetrics.transactionsTrend >= 0 ? "#4CAF50" : "#F44336" }
                      ]}
                    >
                      {Math.abs(groupMetrics.transactionsTrend)}%
                    </Text>
                    <Text style={styles.kpiTrendPeriod}>vs. prev. period</Text>
                  </View>
                </View>
                
                <View style={styles.kpiCard}>
                  <View style={styles.kpiHeader}>
                    <Icon name="percent" size={24} color="#9C27B0" style={styles.kpiIcon} />
                    <Text style={styles.kpiTitle}>Growth Rate</Text>
                  </View>
                  <Text style={styles.kpiValue}>{groupMetrics.growthRate}%</Text>
                  <View style={styles.kpiTrend}>
                    <Icon 
                      name={groupMetrics.growthRateTrend >= 0 ? "arrow-up" : "arrow-down"} 
                      size={16} 
                      color={groupMetrics.growthRateTrend >= 0 ? "#4CAF50" : "#F44336"} 
                    />
                    <Text 
                      style={[
                        styles.kpiTrendValue,
                        { color: groupMetrics.growthRateTrend >= 0 ? "#4CAF50" : "#F44336" }
                      ]}
                    >
                      {Math.abs(groupMetrics.growthRateTrend)}%
                    </Text>
                    <Text style={styles.kpiTrendPeriod}>vs. prev. period</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
          
          {/* Group Financial Summary Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Group Financial Summary</Title>
              
              <LineChart
                data={{
                  labels: groupMetrics.savingsHistory.map(d => d.label),
                  datasets: [
                    {
                      data: groupMetrics.savingsHistory.map(d => d.value)
                    }
                  ]
                }}
                width={width - 48}
                height={220}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#2196F3'
                  }
                }}
                bezier
                style={styles.chart}
              />
              
              <View style={styles.segmentTabs}>
                <TouchableOpacity 
                  style={[styles.segmentTab, styles.activeSegmentTab]}
                  onPress={() => console.log('Savings history tab')}
                >
                  <Text style={styles.activeSegmentText}>Savings History</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.segmentTab}
                  onPress={() => console.log('Contributions tab')}
                >
                  <Text style={styles.segmentText}>Contributions</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.segmentTab}
                  onPress={() => console.log('Withdrawals tab')}
                >
                  <Text style={styles.segmentText}>Withdrawals</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.statLabel}>Total Balance</Text>
                  <Text style={styles.statValue}>{formatCurrency(groupMetrics.totalBalance)}</Text>
                </View>
                
                <View style={styles.summaryStatItem}>
                  <Text style={styles.statLabel}>Avg. per Member</Text>
                  <Text style={styles.statValue}>{formatCurrency(groupMetrics.averagePerMember)}</Text>
                </View>
                
                <View style={styles.summaryStatItem}>
                  <Text style={styles.statLabel}>Monthly Growth</Text>
                  <Text 
                    style={[
                      styles.statValue,
                      { color: groupMetrics.monthlyGrowth >= 0 ? "#4CAF50" : "#F44336" }
                    ]}
                  >
                    {groupMetrics.monthlyGrowth >= 0 ? '+' : ''}{groupMetrics.monthlyGrowth}%
                  </Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button 
                icon="eye" 
                onPress={() => navigation.navigate('FinancialSummaryDetails')}
              >
                View Details
              </Button>
              <Button 
                icon="file-export" 
                onPress={() => setShowExportDialog(true)}
              >
                Export
              </Button>
            </Card.Actions>
          </Card>
        </>
      )}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading analytics data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
        <Text style={styles.headerSubtitle}>Insights into your group's performance</Text>
      </View>
      
      {/* Tab Menu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'metrics' && styles.activeTab]}
          onPress={() => setActiveTab('metrics')}
        >
          <Icon 
            name="chart-box" 
            size={24} 
            color={activeTab === 'metrics' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'metrics' && styles.activeTabText
            ]}
          >
            Metrics
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'performance' && styles.activeTab]}
          onPress={() => setActiveTab('performance')}
        >
          <Icon 
            name="chart-line" 
            size={24} 
            color={activeTab === 'performance' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'performance' && styles.activeTabText
            ]}
          >
            Performance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'members' && styles.activeTab]}
          onPress={() => setActiveTab('members')}
        >
          <Icon 
            name="account-group" 
            size={24} 
            color={activeTab === 'members' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'members' && styles.activeTabText
            ]}
          >
            Members
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <Icon 
            name="lightbulb-on" 
            size={24} 
            color={activeTab === 'insights' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'insights' && styles.activeTabText
            ]}
          >
            Insights
          </Text>
        </TouchableOpacity>
        
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
            Reports
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {activeTab === 'metrics' && renderMetricsTab()}
      {activeTab === 'performance' && renderPerformanceTab()}
      {activeTab === 'members' && renderMembersTab()}
      {activeTab === 'insights' && renderInsightsTab()}
      {activeTab === 'reports' && renderReportsTab()}
      
      {/* Dialogs */}
      {renderExportDialog()}
      {renderScheduleDialog()}
    </View>
  );

  const renderReportsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Scheduled Reports Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.reportsHeader}>
            <Title style={styles.cardTitle}>Scheduled Reports</Title>
            <Button 
              mode="contained" 
              icon="plus"
              onPress={() => setShowScheduleDialog(true)}
            >
              Schedule
            </Button>
          </View>
          
          {scheduledReports.length > 0 ? (
            <View style={styles.scheduledReportsList}>
              {scheduledReports.map((report, index) => (
                <View key={index} style={styles.scheduledReport}>
                  <View style={styles.reportInfo}>
                    <View style={styles.reportTypeIcon}>
                      <Icon 
                        name={
                          report.type === 'summary' ? 'file-chart' :
                          report.type === 'performance' ? 'chart-line' :
                          report.type === 'activity' ? 'account-group' :
                          'file-document'
                        } 
                        size={24} 
                        color="#fff" 
                      />
                    </View>
                    <View style={styles.reportDetails}>
                      <Text style={styles.reportName}>{report.name}</Text>
                      <Text style={styles.reportFrequency}>
                        {report.frequency.charAt(0).toUpperCase() + report.frequency.slice(1)} • 
                        Next: {formatDate(report.nextScheduled)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reportActions}>
                    <IconButton 
                      icon="pencil" 
                      size={20} 
                      onPress={() => console.log('Edit report', report.id)} 
                    />
                    <IconButton 
                      icon="delete" 
                      size={20} 
                      onPress={() => console.log('Delete report', report.id)} 
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyReports}>
              <Icon name="calendar-clock" size={48} color="#9E9E9E" />
              <Text style={styles.emptyReportsTitle}>No Scheduled Reports</Text>
              <Text style={styles.emptyReportsText}>
                Schedule automated reports to be delivered to your email on a recurring basis
              </Text>
              <Button 
                mode="contained" 
                icon="plus"
                onPress={() => setShowScheduleDialog(true)}
                style={styles.emptyReportsButton}
              >
                Schedule Report
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Custom Reports Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Custom Reports</Title>
          <Paragraph style={styles.customReportsDescription}>
            Create and save custom reports for your specific needs
          </Paragraph>
          
          <List.Section>
            <List.Item
              title="Member Contribution Report"
              description="Breakdown of individual member contributions over time"
              left={props => <List.Icon {...props} icon="account-cash" color="#2196F3" />}
              right={props => (
                <Button 
                  mode="text" 
                  onPress={() => navigation.navigate('CustomReport', { reportId: 'member-contributions' })}
                >
                  View
                </Button>
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Savings Goal Tracking"
              description="Progress towards group and individual savings goals"
              left={props => <List.Icon {...props} icon="target" color="#4CAF50" />}
              right={props => (
                <Button 
                  mode="text" 
                  onPress={() => navigation.navigate('CustomReport', { reportId: 'savings-goals' })}
                >
                  View
                </Button>
              )}
            />
            
            <Divider />
            
            <List.Item
              title="Transaction History"
              description="Detailed log of all financial transactions"
              left={props => <List.Icon {...props} icon="bank-transfer" color="#FF9800" />}
              right={props => (
                <Button 
                  mode="text" 
                  onPress={() => navigation.navigate('CustomReport', { reportId: 'transactions' })}
                >
                  View
                </Button>
              )}
            />
          </List.Section>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained" 
            icon="file-plus"
            onPress={() => navigation.navigate('CreateCustomReport')}
          >
            Create New Report
          </Button>
          <Button 
            mode="outlined" 
            icon="content-save"
            onPress={handleSaveCustomReport}
          >
            Save Current View
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );

  const renderInsightsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}
      {financialHealth && (
        <>
          {/* Financial Health Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Group Financial Health</Title>
              
              <View style={styles.healthScoreContainer}>
                <View style={styles.healthScoreCircle}>
                  <Text style={styles.healthScoreValue}>{financialHealth.overallScore}</Text>
                  <Text style={styles.healthScoreLabel}>out of 100</Text>
                </View>
                
                <View style={styles.healthRating}>
                  <Text 
                    style={[
                      styles.healthRatingText,
                      { 
                        color: 
                          financialHealth.overallScore >= 80 ? '#4CAF50' :
                          financialHealth.overallScore >= 60 ? '#2196F3' :
                          financialHealth.overallScore >= 40 ? '#FF9800' :
                          '#F44336'
                      }
                    ]}
                  >
                    {financialHealth.overallScore >= 80 ? 'Excellent' :
                     financialHealth.overallScore >= 60 ? 'Good' :
                     financialHealth.overallScore >= 40 ? 'Fair' :
                     'Needs Improvement'}
                  </Text>
                  <Text style={styles.healthRatingDescription}>
                    {financialHealth.overallScore >= 80 ? 'Your group is in excellent financial health.' :
                     financialHealth.overallScore >= 60 ? 'Your group is in good financial health with a few areas to improve.' :
                     financialHealth.overallScore >= 40 ? 'Your group has some financial challenges to address.' :
                     'Your group needs to take action to improve financial health.'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.healthCategories}>
                {financialHealth.categories.map((category, index) => (
                  <View key={index} style={styles.healthCategory}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryTitleContainer}>
                        <Icon 
                          name={category.icon} 
                          size={20} 
                          color={
                            category.score >= 80 ? '#4CAF50' :
                            category.score >= 60 ? '#2196F3' :
                            category.score >= 40 ? '#FF9800' :
                            '#F44336'
                          } 
                          style={styles.categoryIcon}
                        />
                        <Text style={styles.categoryTitle}>{category.name}</Text>
                      </View>
                      <Text style={styles.categoryScore}>{category.score}</Text>
                    </View>
                    
                    <ProgressBar 
                      progress={category.score / 100} 
                      color={
                        category.score >= 80 ? '#4CAF50' :
                        category.score >= 60 ? '#2196F3' :
                        category.score >= 40 ? '#FF9800' :
                        '#F44336'
                      }
                      style={styles.categoryProgressBar}
                    />
                  </View>
                ))}
              </View>
            </Card.Content>
            <Card.Actions>
              <Button 
                icon="lightbulb-on" 
                onPress={() => navigation.navigate('FinancialHealthRecommendations')}
              >
                Recommendations
              </Button>
              <Button 
                icon="chart-line" 
                onPress={() => navigation.navigate('FinancialHealthHistory')}
              >
                Historical Trends
              </Button>
            </Card.Actions>
          </Card>
          
          {/* Risk Assessment Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Risk Assessment</Title>
              
              <View style={styles.riskFactors}>
                {financialHealth.riskFactors.map((factor, index) => (
                  <View key={index} style={styles.riskFactor}>
                    <View style={styles.riskFactorHeader}>
                      <View style={styles.riskFactorTitleContainer}>
                        <Icon 
                          name={factor.icon} 
                          size={20} 
                          color={
                            factor.risk === 'low' ? '#4CAF50' :
                            factor.risk === 'medium' ? '#FF9800' :
                            '#F44336'
                          } 
                          style={styles.riskIcon}
                        />
                        <Text style={styles.riskTitle}>{factor.name}</Text>
                      </View>
                      <Chip 
                        style={[
                          styles.riskChip,
                          {
                            backgroundColor: 
                              factor.risk === 'low' ? 'rgba(76, 175, 80, 0.1)' :
                              factor.risk === 'medium' ? 'rgba(255, 152, 0, 0.1)' :
                              'rgba(244, 67, 54, 0.1)'
                          }
                        ]}
                      >
                        {factor.risk.charAt(0).toUpperCase() + factor.risk.slice(1)}
                      </Chip>
                    </View>
                    
                    <Text style={styles.riskDescription}>{factor.description}</Text>
                    
                    {factor.recommendation && (
                      <View style={styles.riskRecommendation}>
                        <Icon name="lightbulb-on" size={16} color="#2196F3" style={styles.recommendationIcon} />
                        <Text style={styles.recommendationText}>{factor.recommendation}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        </>
      )}
      
      {predictiveAnalysis && (
        <>
          {/* Predictive Analysis Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Predictive Analysis</Title>
              <Paragraph style={styles.predictionDescription}>
                Based on your group's current trends, here are projections for the next 6 months
              </Paragraph>
              
              <View style={styles.predictionChartContainer}>
                <LineChart
                  data={{
                    labels: predictiveAnalysis.projections.labels,
                    datasets: [
                      {
                        data: predictiveAnalysis.projections.historical,
                        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`
                      },
                      {
                        data: predictiveAnalysis.projections.predicted,
                        color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`
                      }
                    ],
                    legend: ['Historical', 'Projected']
                  }}
                  width={width - 48}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: '5',
                      strokeWidth: '2'
                    }
                  }}
                  bezier
                  style={styles.chart}
                  legend={true}
                />
              </View>
              
              <View style={styles.predictionInsights}>
                <Text style={styles.insightsTitle}>Key Insights</Text>
                
                {predictiveAnalysis.insights.map((insight, index) => (
                  <View key={index} style={styles.insightItem}>
                    <Icon 
                      name={
                        insight.type === 'positive' ? 'arrow-up-bold-circle' :
                        insight.type === 'negative' ? 'arrow-down-bold-circle' :
                        'information-circle'
                      } 
                      size={20} 
                      color={
                        insight.type === 'positive' ? '#4CAF50' :
                        insight.type === 'negative' ? '#F44336' :
                        '#2196F3'
                      } 
                      style={styles.insightIcon}
                    />
                    <Text style={styles.insightText}>{insight.message}</Text>
                  </View>
                ))}
              </View>
            </Card.Content>
            <Card.Actions>
              <Button 
                icon="chart-sankey" 
                onPress={() => navigation.navigate('PredictiveAnalysisDetails')}
              >
                Advanced Analysis
              </Button>
              <Button 
                icon="gauge" 
                onPress={() => navigation.navigate('ScenarioSimulator')}
              >
                Run Scenarios
              </Button>
            </Card.Actions>
          </Card>
        </>
      )}
    </ScrollView>
  );

  const renderPerformanceTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {savingsPerformance && (
        <>
          {/* Performance Overview Card */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>Savings Performance</Title>
                <View style={styles.timeRangeSelector}>
                  <TouchableOpacity 
                    style={styles.timeRangeButton}
                    onPress={() => setShowTimeMenu(true)}
                  >
                    <Text style={styles.timeRangeText}>
                      {timeRange === 'week' ? 'This Week' :
                       timeRange === 'month' ? 'This Month' :
                       timeRange === 'quarter' ? 'This Quarter' :
                       'This Year'}
                    </Text>
                    <Icon name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.performanceMetrics}>
                <View style={styles.performanceMetric}>
                  <Text style={styles.metricLabel}>Contribution Rate</Text>
                  <View style={styles.metricValueContainer}>
                    <Text style={styles.metricValue}>{savingsPerformance.contributionRate}%</Text>
                    <View style={styles.metricTrend}>
                      <Icon 
                        name={savingsPerformance.contributionRateTrend >= 0 ? "arrow-up" : "arrow-down"} 
                        size={14} 
                        color={savingsPerformance.contributionRateTrend >= 0 ? "#4CAF50" : "#F44336"} 
                      />
                      <Text 
                        style={[
                          styles.metricTrendValue,
                          { color: savingsPerformance.contributionRateTrend >= 0 ? "#4CAF50" : "#F44336" }
                        ]}
                      >
                        {Math.abs(savingsPerformance.contributionRateTrend)}%
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.performanceMetric}>
                  <Text style={styles.metricLabel}>Savings Goal Progress</Text>
                  <View style={styles.metricValueContainer}>
                    <Text style={styles.metricValue}>{savingsPerformance.goalProgress}%</Text>
                    <View style={styles.metricTrend}>
                      <Icon 
                        name={savingsPerformance.goalProgressTrend >= 0 ? "arrow-up" : "arrow-down"} 
                        size={14} 
                        color={savingsPerformance.goalProgressTrend >= 0 ? "#4CAF50" : "#F44336"} 
                      />
                      <Text 
                        style={[
                          styles.metricTrendValue,
                          { color: savingsPerformance.goalProgressTrend >= 0 ? "#4CAF50" : "#F44336" }
                        ]}
                      >
                        {Math.abs(savingsPerformance.goalProgressTrend)}%
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.performanceMetric}>
                  <Text style={styles.metricLabel}>On-Time Payments</Text>
                  <View style={styles.metricValueContainer}>
                    <Text style={styles.metricValue}>{savingsPerformance.onTimePayments}%</Text>
                    <View style={styles.metricTrend}>
                      <Icon 
                        name={savingsPerformance.onTimePaymentsTrend >= 0 ? "arrow-up" : "arrow-down"} 
                        size={14} 
                        color={savingsPerformance.onTimePaymentsTrend >= 0 ? "#4CAF50" : "#F44336"} 
                      />
                      <Text 
                        style={[
                          styles.metricTrendValue,
                          { color: savingsPerformance.onTimePaymentsTrend >= 0 ? "#4CAF50" : "#F44336" }
                        ]}
                      >
                        {Math.abs(savingsPerformance.onTimePaymentsTrend)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.performanceChartContainer}>
                <Text style={styles.performanceChartTitle}>Savings Growth vs. Target</Text>
                
                <LineChart
                  data={{
                    labels: savingsPerformance.growthChart.labels,
                    datasets: [
                      {
                        data: savingsPerformance.growthChart.actual,
                        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`
                      },
                      {
                        data: savingsPerformance.growthChart.target,
                        color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`
                      }
                    ],
                    legend: ['Actual', 'Target']
                  }}
                  width={width - 48}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: '5',
                      strokeWidth: '2'
                    }
                  }}
                  bezier
                  style={styles.chart}
                  legend={true}
                />
              </View>
            </Card.Content>
            <Card.Actions>
              <Button 
                icon="eye" 
                onPress={() => navigation.navigate('SavingsPerformanceDetails')}
              >
                View Details
              </Button>
              <Button 
                icon="file-export" 
                onPress={() => setShowExportDialog(true)}
              >
                Export
              </Button>
            </Card.Actions>
          </Card>
          
          {/* Savings Distribution Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Savings Distribution</Title>
              
              <View style={styles.distributionContainer}>
                <PieChart
                  data={savingsPerformance.distribution.map((item) => ({
                    name: item.category,
                    population: item.amount,
                    color: item.color,
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  }))}
                  width={width - 48}
                  height={180}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  style={styles.chart}
                />
              </View>
              
              <View style={styles.distributionStats}>
                {savingsPerformance.distribution.map((item, index) => (
                  <View key={index} style={styles.distributionStatItem}>
                    <View style={styles.distributionLabelContainer}>
                      <View 
                        style={[
                          styles.distributionColorIndicator,
                          { backgroundColor: item.color }
                        ]}
                      />
                      <Text style={styles.distributionLabel}>{item.category}</Text>
                    </View>
                    <Text style={styles.distributionValue}>{formatCurrency(item.amount)}</Text>
                    <Text style={styles.distributionPercentage}>{item.percentage}%</Text>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );

  const renderMembersTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {memberActivity && (
        <>
          {/* Member Activity Overview Card */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.cardTitle}>Member Activity</Title>
                <View style={styles.timeRangeSelector}>
                  <TouchableOpacity 
                    style={styles.timeRangeButton}
                    onPress={() => setShowTimeMenu(true)}
                  >
                    <Text style={styles.timeRangeText}>
                      {timeRange === 'week' ? 'This Week' :
                       timeRange === 'month' ? 'This Month' :
                       timeRange === 'quarter' ? 'This Quarter' :
                       'This Year'}
                    </Text>
                    <Icon name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.memberMetrics}>
                <View style={styles.memberMetric}>
                  <View style={styles.memberMetricHeader}>
                    <Icon name="account-check" size={24} color="#4CAF50" style={styles.memberMetricIcon} />
                    <Text style={styles.memberMetricTitle}>Active Members</Text>
                  </View>
                  <Text style={styles.memberMetricValue}>{memberActivity.activeMembers}</Text>
                  <Text style={styles.memberMetricPercent}>
                    {Math.round((memberActivity.activeMembers / memberActivity.totalMembers) * 100)}% of total
                  </Text>
                </View>
                
                <View style={styles.memberMetric}>
                  <View style={styles.memberMetricHeader}>
                    <Icon name="account-alert" size={24} color="#F44336" style={styles.memberMetricIcon} />
                    <Text style={styles.memberMetricTitle}>Inactive Members</Text>
                  </View>
                  <Text style={styles.memberMetricValue}>
                    {memberActivity.totalMembers - memberActivity.activeMembers}
                  </Text>
                  <Text style={styles.memberMetricPercent}>
                    {Math.round(((memberActivity.totalMembers - memberActivity.activeMembers) / memberActivity.totalMembers) * 100)}% of total
                  </Text>
                </View>
                
                <View style={styles.memberMetric}>
                  <View style={styles.memberMetricHeader}>
                    <Icon name="account-plus" size={24} color="#2196F3" style={styles.memberMetricIcon} />
                    <Text style={styles.memberMetricTitle}>New Members</Text>
                  </View>
                  <Text style={styles.memberMetricValue}>{memberActivity.newMembers}</Text>
                  <Text style={styles.memberMetricPercent}>
                    in the past {timeRange === 'week' ? 'week' : timeRange === 'month' ? 'month' : timeRange === 'quarter' ? 'quarter' : 'year'}
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.memberDivider} />
              
              <View style={styles.activityChartContainer}>
                <Text style={styles.activityChartTitle}>Member Contribution Activity</Text>
                
                <BarChart
                  data={{
                    labels: memberActivity.activityChart.labels,
                    datasets: [
                      {
                        data: memberActivity.activityChart.data
                      }
                    ]
                  }}
                  width={width - 48}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    barPercentage: 0.7
                  }}
                  style={styles.chart}
                  showValuesOnTopOfBars
                />
              </View>
            </Card.Content>
            <Card.Actions>
              <Button 
                icon="eye" 
                onPress={() => navigation.navigate('MemberActivityDetails')}
              >
                View Details
              </Button>
              <Button 
                icon="file-export" 
                onPress={() => setShowExportDialog(true)}
              >
                Export
              </Button>
            </Card.Actions>
          </Card>
          
          {/* Top Contributors Card */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Top Contributors</Title>
              
              <Searchbar
                placeholder="Search members..."
                onChangeText={onSearch}
                value={searchQuery}
                style={styles.searchBar}
              />
              
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Member</DataTable.Title>
                  <DataTable.Title numeric>Contributions</DataTable.Title>
                  <DataTable.Title numeric>Consistency</DataTable.Title>
                </DataTable.Header>
                
                {memberActivity.topContributors.map((member, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell>{member.name}</DataTable.Cell>
                    <DataTable.Cell numeric>{formatCurrency(member.contributions)}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <View style={styles.consistencyContainer}>
                        <Text style={styles.consistencyValue}>{member.consistency}%</Text>
                        {member.trend > 0 && <Icon name="arrow-up" size={14} color="#4CAF50" />}
                        {member.trend < 0 && <Icon name="arrow-down" size={14} color="#F44336" />}
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </Card.Content>
            <Card.Actions>
              <Button 
                icon="account-group" 
                onPress={() => navigation.navigate('AllMembersActivity')}
              >
                View All Members
              </Button>
            </Card.Actions>
          </Card>
        </>
      )}