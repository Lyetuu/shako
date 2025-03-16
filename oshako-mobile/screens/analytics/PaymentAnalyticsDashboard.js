import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  SegmentedButtons
} from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  getGroupPaymentAnalytics, 
  getChannelEffectivenessData,
  getDefaulterTrends,
  getReminderEffectiveness,
  getPaymentRecoveryTimelines
} from '../../services/api/analytics';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import theme from '../../config/theme';

const screenWidth = Dimensions.get('window').width - 40;

const PaymentAnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('3months'); // 1month, 3months, 6months, 1year
  const [currentView, setCurrentView] = useState('overview'); // overview, channels, trends, predictions
  const [analyticsData, setAnalyticsData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [defaulterTrends, setDefaulterTrends] = useState(null);
  const [reminderData, setReminderData] = useState(null);
  const [recoveryData, setRecoveryData] = useState(null);
  
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get group ID from route params
  const { groupId, groupName } = route.params || {};
  
  useEffect(() => {
    fetchData();
  }, [timeframe]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all the required analytics data
      const analytics = await getGroupPaymentAnalytics(groupId, timeframe);
      setAnalyticsData(analytics);
      
      const channelEffectiveness = await getChannelEffectivenessData(groupId, timeframe);
      setChannelData(channelEffectiveness);
      
      const trends = await getDefaulterTrends(groupId, timeframe);
      setDefaulterTrends(trends);
      
      const reminderEffectiveness = await getReminderEffectiveness(groupId, timeframe);
      setReminderData(reminderEffectiveness);
      
      const recoveryTimelines = await getPaymentRecoveryTimelines(groupId, timeframe);
      setRecoveryData(recoveryTimelines);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: theme.colors.primary
    }
  };
  
  const renderOverviewCards = () => {
    if (!analyticsData) return null;
    
    return (
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Card.Content>
            <Text style={styles.metricLabel}>Current Defaulters</Text>
            <Text style={styles.metricValue}>{analyticsData.currentDefaulters}</Text>
            <View style={styles.metricChangeRow}>
              <Icon 
                name={analyticsData.defaulterChange >= 0 ? 'arrow-up' : 'arrow-down'} 
                size={16} 
                color={analyticsData.defaulterChange >= 0 ? '#F44336' : '#4CAF50'} 
              />
              <Text 
                style={[
                  styles.metricChangeText, 
                  { color: analyticsData.defaulterChange >= 0 ? '#F44336' : '#4CAF50' }
                ]}
              >
                {Math.abs(analyticsData.defaulterChange)}% from previous {timeframe === '1month' ? 'month' : 'period'}
              </Text>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.metricCard}>
          <Card.Content>
            <Text style={styles.metricLabel}>Outstanding Amount</Text>
            <Text style={styles.metricValue}>{formatCurrency(analyticsData.totalOutstanding)}</Text>
            <View style={styles.metricChangeRow}>
              <Icon 
                name={analyticsData.outstandingChange >= 0 ? 'arrow-up' : 'arrow-down'} 
                size={16} 
                color={analyticsData.outstandingChange >= 0 ? '#F44336' : '#4CAF50'} 
              />
              <Text 
                style={[
                  styles.metricChangeText, 
                  { color: analyticsData.outstandingChange >= 0 ? '#F44336' : '#4CAF50' }
                ]}
              >
                {Math.abs(analyticsData.outstandingChange)}% from previous {timeframe === '1month' ? 'month' : 'period'}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };
  
  const renderDefaulterTrends = () => {
    if (!defaulterTrends) return null;
    
    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>Defaulter Trends</Title>
          <Paragraph style={styles.chartDescription}>Monthly defaulter count over time</Paragraph>
          
          <LineChart
            data={{
              labels: defaulterTrends.months,
              datasets: [
                {
                  data: defaulterTrends.counts,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  strokeWidth: 2
                }
              ]
            }}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          
          <View style={styles.chartInsightsBox}>
            <Text style={styles.insightTitle}>Key Insights</Text>
            {defaulterTrends.insights.map((insight, index) => (
              <View key={index} style={styles.insightRow}>
                <Icon name="information" size={16} color={theme.colors.primary} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderChannelEffectiveness = () => {
    if (!channelData) return null;
    
    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>Channel Effectiveness</Title>
          <Paragraph style={styles.chartDescription}>Response rate by notification channel</Paragraph>
          
          <BarChart
            data={{
              labels: channelData.channels,
              datasets: [
                {
                  data: channelData.responseRates
                }
              ]
            }}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            style={styles.chart}
          />
          
          <View style={styles.channelDetails}>
            {channelData.channels.map((channel, index) => (
              <View key={channel} style={styles.channelRow}>
                <View style={styles.channelLabelRow}>
                  <Icon 
                    name={
                      channel === 'App' ? 'cellphone' : 
                      channel === 'Email' ? 'email' : 
                      channel === 'WhatsApp' ? 'whatsapp' : 
                      'message'
                    } 
                    size={20} 
                    color={
                      channel === 'App' ? theme.colors.primary : 
                      channel === 'Email' ? '#D81B60' : 
                      channel === 'WhatsApp' ? '#25D366' : 
                      '#FF9800'
                    } 
                  />
                  <Text style={styles.channelLabel}>{channel}</Text>
                </View>
                <Text style={styles.channelValue}>
                  {channelData.responseRates[index]}% response rate
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.bestPracticeBox}>
            <Text style={styles.bestPracticeTitle}>Recommended Channel Strategy</Text>
            <Text style={styles.bestPracticeText}>{channelData.recommendation}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderReminderEffectiveness = () => {
    if (!reminderData) return null;
    
    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>Reminder Effectiveness</Title>
          <Paragraph style={styles.chartDescription}>Average days to payment after reminder</Paragraph>
          
          <View style={styles.reminderStats}>
            <View style={styles.reminderStatItem}>
              <Text style={styles.reminderStatValue}>{reminderData.avgDaysToPayment}</Text>
              <Text style={styles.reminderStatLabel}>Avg. Days to Payment</Text>
            </View>
            
            <View style={styles.reminderStatItem}>
              <Text style={styles.reminderStatValue}>{formatPercentage(reminderData.paymentRate)}</Text>
              <Text style={styles.reminderStatLabel}>Payment Conversion</Text>
            </View>
            
            <View style={styles.reminderStatItem}>
              <Text style={styles.reminderStatValue}>{reminderData.avgRemindersNeeded}</Text>
              <Text style={styles.reminderStatLabel}>Reminders Needed</Text>
            </View>
          </View>
          
          <View style={styles.timeBrackets}>
            <Text style={styles.timeBracketsTitle}>Payment Response Time</Text>
            
            {reminderData.timeBrackets.map((bracket, index) => (
              <View key={index} style={styles.bracketRow}>
                <Text style={styles.bracketLabel}>{bracket.label}</Text>
                <View style={styles.bracketBarContainer}>
                  <View 
                    style={[
                      styles.bracketBar, 
                      { width: `${bracket.percentage}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.bracketPercentage}>{bracket.percentage}%</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.optimalTimingBox}>
            <Text style={styles.optimalTimingTitle}>Optimal Reminder Timing</Text>
            <View style={styles.optimalTiming}>
              <View style={styles.timingItem}>
                <Icon name="clock-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.timingValue}>{reminderData.optimalTiming.timeOfDay}</Text>
                <Text style={styles.timingLabel}>Best Time</Text>
              </View>
              
              <View style={styles.timingItem}>
                <Icon name="calendar" size={24} color={theme.colors.primary} />
                <Text style={styles.timingValue}>{reminderData.optimalTiming.dayOfWeek}</Text>
                <Text style={styles.timingLabel}>Best Day</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderRecoveryTimelines = () => {
    if (!recoveryData) return null;
    
    return (
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>Payment Recovery Timeline</Title>
          <Paragraph style={styles.chartDescription}>Payment recovery rate over time</Paragraph>
          
          <LineChart
            data={{
              labels: recoveryData.daysLabels,
              datasets: [
                {
                  data: recoveryData.recoveryRates,
                  color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
                  strokeWidth: 2
                }
              ]
            }}
            width={screenWidth}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`
            }}
            bezier
            style={styles.chart}
          />
          
          <View style={styles.recoveryInsightsBox}>
            <Text style={styles.recoveryInsightsTitle}>Recovery Insights</Text>
            
            <View style={styles.insightRow}>
              <Icon name="arrow-up-bold" size={16} color="#4CAF50" />
              <Text style={styles.insightText}>
                <Text style={{ fontWeight: 'bold' }}>{recoveryData.criticalPoint.day} days</Text> is the critical point where payment recovery 
                rates increase significantly
              </Text>
            </View>
            
            <View style={styles.insightRow}>
              <Icon name="arrow-down-bold" size={16} color="#F44336" />
              <Text style={styles.insightText}>
                After <Text style={{ fontWeight: 'bold' }}>{recoveryData.dropoffPoint.day} days</Text>, recovery 
                chances drop below {recoveryData.dropoffPoint.rate}%
              </Text>
            </View>
            
            <View style={styles.insightRow}>
              <Icon name="check-circle" size={16} color={theme.colors.primary} />
              <Text style={styles.insightText}>
                Maximum recovery rate of <Text style={{ fontWeight: 'bold' }}>{recoveryData.maxRecoveryRate}%</Text> typically achieved 
                within {recoveryData.maxRecoveryDays} days
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
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
      {/* Header section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.screenTitle}>Payment Analytics</Text>
          <Text style={styles.groupName}>{groupName || 'All Groups'}</Text>
        </View>
        
        <SegmentedButtons
          value={timeframe}
          onValueChange={setTimeframe}
          buttons={[
            { value: '1month', label: '1 Month' },
            { value: '3months', label: '3 Months' },
            { value: '6months', label: '6 Months' },
            { value: '1year', label: '1 Year' }
          ]}
          style={styles.timeframeSelector}
        />
      </View>
      
      {/* Tab navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, currentView === 'overview' && styles.activeTab]}
          onPress={() => setCurrentView('overview')}
        >
          <Icon 
            name="view-dashboard" 
            size={20} 
            color={currentView === 'overview' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              currentView === 'overview' && styles.activeTabText
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentView === 'channels' && styles.activeTab]}
          onPress={() => setCurrentView('channels')}
        >
          <Icon 
            name="message-text" 
            size={20} 
            color={currentView === 'channels' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              currentView === 'channels' && styles.activeTabText
            ]}
          >
            Channels
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentView === 'trends' && styles.activeTab]}
          onPress={() => setCurrentView('trends')}
        >
          <Icon 
            name="chart-line" 
            size={20} 
            color={currentView === 'trends' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              currentView === 'trends' && styles.activeTabText
            ]}
          >
            Trends
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentView === 'recovery' && styles.activeTab]}
          onPress={() => setCurrentView('recovery')}
        >
          <Icon 
            name="cash-refund" 
            size={20} 
            color={currentView === 'recovery' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              currentView === 'recovery' && styles.activeTabText
            ]}
          >
            Recovery
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content section */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {currentView === 'overview' && (
          <>
            {renderOverviewCards()}
            {renderDefaulterTrends()}
            <View style={styles.actionButtonsContainer}>
              <Button 
                mode="contained" 
                icon="download" 
                onPress={() => {/* Download report functionality */}}
                style={styles.actionButton}
              >
                Export Report
              </Button>
              
              <Button 
                mode="outlined"
                icon="share-variant"
                onPress={() => {/* Share analytics functionality */}}
                style={styles.actionButton}
              >
                Share Insights
              </Button>
            </View>
          </>
        )}
        
        {currentView === 'channels' && (
          <>
            {renderChannelEffectiveness()}
          </>
        )}
        
        {currentView === 'trends' && (
          <>
            {renderDefaulterTrends()}
            {renderReminderEffectiveness()}
          </>
        )}
        
        {currentView === 'recovery' && (
          <>
            {renderRecoveryTimelines()}
          </>
        )}
      </ScrollView>
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
    padding: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  groupName: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9
  },
  timeframeSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888'
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  content: {
    flex: 1
  },
  contentContainer: {
    padding: 16
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 16
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 4
  },
  metricLabel: {
    fontSize: 12,
    color: '#666'
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4
  },
  metricChangeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  metricChangeText: {
    fontSize: 12,
    marginLeft: 4
  },
  chartCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  chartTitle: {
    fontSize: 18
  },
  chartDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8
  },
  chartInsightsBox: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  insightText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1
  },
  channelDetails: {
    marginTop: 16
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  channelLabelRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  channelLabel: {
    marginLeft: 8,
    fontSize: 14
  },
  channelValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  bestPracticeBox: {
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  bestPracticeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  bestPracticeText: {
    fontSize: 12
  },
  reminderStats: {
    flexDirection: 'row',
    marginVertical: 16
  },
  reminderStatItem: {
    flex: 1,
    alignItems: 'center'
  },
  reminderStatValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  reminderStatLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  timeBrackets: {
    marginVertical: 16
  },
  timeBracketsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  bracketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  bracketLabel: {
    width: 80,
    fontSize: 12
  },
  bracketBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 8
  },
  bracketBar: {
    height: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 5
  },
  bracketPercentage: {
    width: a40,
    fontSize: 12,
    textAlign: 'right'
  },
  optimalTimingBox: {
    backgroundColor: '#f3e5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  optimalTimingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  optimalTiming: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8
  },
  timingItem: {
    alignItems: 'center'
  },
  timingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4
  },
  timingLabel: {
    fontSize: 12,
    color: '#666'
  },
  recoveryInsightsBox: {
    backgroundColor: '#f3e5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  recoveryInsightsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 24
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4
  }
});

export default PaymentAnalyticsDashboard;
