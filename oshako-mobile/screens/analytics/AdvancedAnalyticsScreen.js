import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
  Chip,
  SegmentedButtons,
  List,
  ProgressBar,
  IconButton,
  DataTable,
  Menu
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getGroupPredictions,
  getMemberRiskScores,
  getGroupFinancialHealth,
  getSeasonalityAnalysis,
  getPredictionAccuracy,
  getDefaulterPredictions,
  updatePredictionSettings
} from '../../services/api/predictiveAnalytics';
import { formatCurrency, formatDate, formatPercentage } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 40;

const AdvancedAnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('predictions');
  const [timeframe, setTimeframe] = useState('3months'); // 1month, 3months, 6months, 1year
  const [groupHealthData, setGroupHealthData] = useState(null);
  const [seasonalityData, setSeasonalityData] = useState(null);
  const [memberRiskData, setMemberRiskData] = useState([]);
  const [defaulterPredictions, setDefaulterPredictions] = useState([]);
  const [predictionAccuracy, setPredictionAccuracy] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [predictionSettings, setPredictionSettings] = useState({
    enabled: true,
    notifyAdmins: true,
    riskThreshold: 'medium', // low, medium, high
    predictionHorizon: 30 // days
  });
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  // Get group ID from route params
  const { groupId, groupName } = route.params || {};

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch group financial health score
      const healthData = await getGroupFinancialHealth(groupId, timeframe);
      setGroupHealthData(healthData);
      
      // Fetch seasonality analysis
      const seasonality = await getSeasonalityAnalysis(groupId, timeframe);
      setSeasonalityData(seasonality);
      
      // Fetch member risk scores
      const riskScores = await getMemberRiskScores(groupId);
      setMemberRiskData(riskScores);
      
      // Fetch defaulter predictions
      const predictions = await getDefaulterPredictions(groupId);
      setDefaulterPredictions(predictions);
      
      // Fetch prediction accuracy metrics
      const accuracy = await getPredictionAccuracy(groupId);
      setPredictionAccuracy(accuracy);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      Alert.alert('Error', 'Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSettingsMenu = (event) => {
    setMenuPosition({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    });
    setShowSettingsMenu(true);
  };
  
  const handleUpdateSettings = async (setting, value) => {
    try {
      const updatedSettings = { ...predictionSettings, [setting]: value };
      setPredictionSettings(updatedSettings);
      
      // Update on server
      await updatePredictionSettings(groupId, updatedSettings);
      
      setShowSettingsMenu(false);
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    }
  };
  
  const renderHealthScoreTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Health Score Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Financial Health Score</Title>
          
          <View style={styles.healthScoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>{groupHealthData.overallScore}</Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            
            <View style={styles.scoreCategories}>
              <Text style={styles.scoreDescription}>
                {groupHealthData.overallScore >= 80 ? 'Excellent' : 
                 groupHealthData.overallScore >= 65 ? 'Good' : 
                 groupHealthData.overallScore >= 50 ? 'Average' : 
                 groupHealthData.overallScore >= 35 ? 'At Risk' : 
                 'Critical'}
              </Text>
              
              <Text style={styles.trendIndicator}>
                <Icon 
                  name={groupHealthData.trend > 0 ? 'arrow-up' : 'arrow-down'} 
                  size={16} 
                  color={groupHealthData.trend > 0 ? '#4CAF50' : '#F44336'} 
                />
                {' '}
                {Math.abs(groupHealthData.trend)}% from previous period
              </Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Score Components</Text>
          
          <View style={styles.scoreComponentsList}>
            {groupHealthData.components.map((component) => (
              <View key={component.name} style={styles.scoreComponent}>
                <View style={styles.componentHeader}>
                  <Text style={styles.componentName}>{component.name}</Text>
                  <Text 
                    style={[
                      styles.componentScore,
                      { 
                        color: component.score >= 80 ? '#4CAF50' : 
                               component.score >= 60 ? '#8BC34A' : 
                               component.score >= 40 ? '#FFC107' : 
                               component.score >= 20 ? '#FF9800' : 
                               '#F44336' 
                      }
                    ]}
                  >
                    {component.score}/100
                  </Text>
                </View>
                
                <ProgressBar 
                  progress={component.score / 100} 
                  color={
                    component.score >= 80 ? '#4CAF50' : 
                    component.score >= 60 ? '#8BC34A' : 
                    component.score >= 40 ? '#FFC107' : 
                    component.score >= 20 ? '#FF9800' : 
                    '#F44336'
                  }
                  style={styles.componentProgress} 
                />
                
                <Text style={styles.componentDescription}>
                  {component.description}
                </Text>
              </View>
            ))}
          </View>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Health Recommendations</Text>
          
          <View style={styles.recommendationsList}>
            {groupHealthData.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendation}>
                <View 
                  style={[
                    styles.recommendationIcon, 
                    { backgroundColor: recommendation.priority === 'high' ? '#F44336' : '#FFC107' }
                  ]}
                >
                  <Icon name={recommendation.icon} size={20} color="#fff" />
                </View>
                
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                  <Text style={styles.recommendationText}>{recommendation.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
      
      {/* Historical Score Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Health Score History</Title>
          
          <LineChart
            data={{
              labels: groupHealthData.history.map(item => item.month),
              datasets: [
                {
                  data: groupHealthData.history.map(item => item.score),
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  strokeWidth: 2
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
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#2196F3'
              }
            }}
            bezier
            style={styles.chart}
          />
          
          <View style={styles.significantEvents}>
            <Text style={styles.significantEventsTitle}>Significant Events</Text>
            
            {groupHealthData.significantEvents.map((event, index) => (
              <View key={index} style={styles.event}>
                <View 
                  style={[
                    styles.eventMarker, 
                    { backgroundColor: event.impact === 'positive' ? '#4CAF50' : '#F44336' }
                  ]}
                />
                <View style={styles.eventContent}>
                  <Text style={styles.eventDate}>{event.date}</Text>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDescription}>{event.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
  
  const renderPredictionsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Prediction Stats Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.predictionHeader}>
            <Title style={styles.cardTitle}>Defaulter Predictions</Title>
            
            <IconButton
              icon="cog"
              size={24}
              onPress={handleSettingsMenu}
            />
            
            <Menu
              visible={showSettingsMenu}
              onDismiss={() => setShowSettingsMenu(false)}
              anchor={menuPosition}
            >
              <Menu.Item 
                title={`Predictions: ${predictionSettings.enabled ? 'Enabled' : 'Disabled'}`}
                leadingIcon={predictionSettings.enabled ? 'check-circle' : 'cancel'}
                onPress={() => handleUpdateSettings('enabled', !predictionSettings.enabled)}
              />
              <Menu.Item 
                title={`Admin Notifications: ${predictionSettings.notifyAdmins ? 'On' : 'Off'}`}
                leadingIcon={predictionSettings.notifyAdmins ? 'bell' : 'bell-off'}
                onPress={() => handleUpdateSettings('notifyAdmins', !predictionSettings.notifyAdmins)}
              />
              <Menu.Item 
                title="Risk Threshold"
                leadingIcon="alert-circle"
              />
              <Menu.Item 
                title="Low"
                onPress={() => handleUpdateSettings('riskThreshold', 'low')}
                trailingIcon={predictionSettings.riskThreshold === 'low' ? 'check' : undefined}
              />
              <Menu.Item 
                title="Medium"
                onPress={() => handleUpdateSettings('riskThreshold', 'medium')}
                trailingIcon={predictionSettings.riskThreshold === 'medium' ? 'check' : undefined}
              />
              <Menu.Item 
                title="High"
                onPress={() => handleUpdateSettings('riskThreshold', 'high')}
                trailingIcon={predictionSettings.riskThreshold === 'high' ? 'check' : undefined}
              />
              <Divider />
              <Menu.Item 
                title="Prediction Horizon"
                leadingIcon="calendar-range"
              />
              <Menu.Item 
                title="15 days"
                onPress={() => handleUpdateSettings('predictionHorizon', 15)}
                trailingIcon={predictionSettings.predictionHorizon === 15 ? 'check' : undefined}
              />
              <Menu.Item 
                title="30 days"
                onPress={() => handleUpdateSettings('predictionHorizon', 30)}
                trailingIcon={predictionSettings.predictionHorizon === 30 ? 'check' : undefined}
              />
              <Menu.Item 
                title="60 days"
                onPress={() => handleUpdateSettings('predictionHorizon', 60)}
                trailingIcon={predictionSettings.predictionHorizon === 60 ? 'check' : undefined}
              />
            </Menu>
          </View>
          
          <View style={styles.predictionStats}>
            <View style={styles.predictionStat}>
              <Text style={styles.predictionStatValue}>{defaulterPredictions.length}</Text>
              <Text style={styles.predictionStatLabel}>Predicted Defaulters</Text>
            </View>
            
            <View style={styles.predictionStat}>
              <Text 
                style={[
                  styles.predictionStatValue,
                  { color: predictionAccuracy.accuracy >= 80 ? '#4CAF50' : '#FF9800' }
                ]}
              >
                {predictionAccuracy.accuracy}%
              </Text>
              <Text style={styles.predictionStatLabel}>Prediction Accuracy</Text>
            </View>
            
            <View style={styles.predictionStat}>
              <Text style={styles.predictionStatValue}>
                {formatCurrency(defaulterPredictions.reduce((sum, member) => sum + member.predictedAmount, 0))}
              </Text>
              <Text style={styles.predictionStatLabel}>At Risk Amount</Text>
            </View>
          </View>
          
          {predictionAccuracy?.lastPredictions && (
            <View style={styles.accuracyDetails}>
              <Text style={styles.accuracyTitle}>Recent Prediction Results</Text>
              <View style={styles.accuracyStats}>
                <View style={styles.accuracyStat}>
                  <Text style={styles.accuracyValue}>{predictionAccuracy.lastPredictions.correct}</Text>
                  <Text style={styles.accuracyLabel}>Correct</Text>
                </View>
                
                <View style={styles.accuracyStat}>
                  <Text style={styles.accuracyValue}>{predictionAccuracy.lastPredictions.falsePositives}</Text>
                  <Text style={styles.accuracyLabel}>False Positives</Text>
                </View>
                
                <View style={styles.accuracyStat}>
                  <Text style={styles.accuracyValue}>{predictionAccuracy.lastPredictions.falseNegatives}</Text>
                  <Text style={styles.accuracyLabel}>Missed</Text>
                </View>
              </View>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Defaulter Predictions Table */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Predicted Defaulters</Title>
          
          {defaulterPredictions.length > 0 ? (
            <View style={styles.predictionsTable}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Member</DataTable.Title>
                  <DataTable.Title numeric>Risk Score</DataTable.Title>
                  <DataTable.Title numeric>Amount</DataTable.Title>
                  <DataTable.Title numeric>Confidence</DataTable.Title>
                </DataTable.Header>
                
                {defaulterPredictions.map((prediction) => (
                  <DataTable.Row key={prediction.memberId}>
                    <DataTable.Cell>{prediction.memberName}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Chip 
                        style={[
                          styles.riskChip,
                          prediction.riskLevel === 'high' ? styles.highRiskChip :
                          prediction.riskLevel === 'medium' ? styles.mediumRiskChip :
                          styles.lowRiskChip
                        ]}
                      >
                        {prediction.riskLevel.toUpperCase()}
                      </Chip>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{formatCurrency(prediction.predictedAmount)}</DataTable.Cell>
                    <DataTable.Cell numeric>{prediction.confidence}%</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </View>
          ) : (
            <View style={styles.emptyPredictions}>
              <Icon name="check-circle" size={48} color="#4CAF50" />
              <Text style={styles.emptyPredictionsText}>No defaulters predicted</Text>
              <Text style={styles.emptyPredictionsSubtext}>
                All members are predicted to pay on time in the coming {predictionSettings.predictionHorizon} days
              </Text>
            </View>
          )}
        </Card.Content>
        
        {defaulterPredictions.length > 0 && (
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="contained" 
              icon="bell"
              onPress={() => {/* Handle send preemptive reminders */}}
            >
              Send Preemptive Reminders
            </Button>
          </Card.Actions>
        )}
      </Card>
      
      {/* Risk Factors Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Key Risk Factors</Title>
          
          <View style={styles.riskFactorsList}>
            {predictionAccuracy?.riskFactors.map((factor, index) => (
              <View key={index} style={styles.riskFactor}>
                <View style={styles.riskFactorHeader}>
                  <Text style={styles.riskFactorName}>{factor.name}</Text>
                  <Text style={styles.riskFactorWeight}>{factor.weight}% impact</Text>
                </View>
                
                <ProgressBar
                  progress={factor.weight / 100}
                  color={factor.weight > 30 ? '#F44336' : '#FF9800'}
                  style={styles.riskFactorProgress}
                />
                
                <Text style={styles.riskFactorDescription}>
                  {factor.description}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
  
  const renderSeasonalityTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Seasonality Chart Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Payment Seasonality</Title>
          
          <BarChart
            data={{
              labels: seasonalityData.monthlyRates.map(item => item.month),
              datasets: [
                {
                  data: seasonalityData.monthlyRates.map(item => item.onTimeRate)
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
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            style={styles.chart}
            showValuesOnTopOfBars
          />
          
          <View style={styles.seasonalityStats}>
            <View style={styles.seasonalityStat}>
              <Text style={styles.seasonalityStatLabel}>Best Month</Text>
              <Text style={styles.seasonalityStatValue}>{seasonalityData.bestMonth}</Text>
              <Text style={styles.seasonalityStatSubvalue}>
                {seasonalityData.bestMonthRate}% on-time
              </Text>
            </View>
            
            <View style={styles.seasonalityStat}>
              <Text style={styles.seasonalityStatLabel}>Worst Month</Text>
              <Text style={styles.seasonalityStatValue}>{seasonalityData.worstMonth}</Text>
              <Text style={styles.seasonalityStatSubvalue}>
                {seasonalityData.worstMonthRate}% on-time
              </Text>
            </View>
            
            <View style={styles.seasonalityStat}>
              <Text style={styles.seasonalityStatLabel}>Variability</Text>
              <Text 
                style={[
                  styles.seasonalityStatValue,
                  { 
                    color: seasonalityData.variability > 30 ? '#F44336' : 
                           seasonalityData.variability > 15 ? '#FF9800' : 
                           '#4CAF50' 
                  }
                ]}
              >
                {seasonalityData.variability}%
              </Text>
              <Text style={styles.seasonalityStatSubvalue}>
                Month-to-month
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Seasonality Patterns Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Seasonal Patterns</Title>
          
          <View style={styles.patternsList}>
            {seasonalityData.patterns.map((pattern, index) => (
              <View key={index} style={styles.pattern}>
                <View 
                  style={[
                    styles.patternIcon, 
                    { backgroundColor: pattern.impact === 'positive' ? '#4CAF50' : '#F44336' }
                  ]}
                >
                  <Icon name={pattern.icon} size={20} color="#fff" />
                </View>
                
                <View style={styles.patternContent}>
                  <Text style={styles.patternTitle}>{pattern.title}</Text>
                  <Text style={styles.patternDescription}>{pattern.description}</Text>
                  
                  <View style={styles.patternPeriod}>
                    <Icon name="calendar-range" size={16} color="#666" />
                    <Text style={styles.patternPeriodText}>{pattern.period}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
      
      {/* Planning Recommendations Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Planning Recommendations</Title>
          
          <View style={styles.recommendationsList}>
            {seasonalityData.recommendations.map((recommendation, index) => (
              <List.Item
                key={index}
                title={recommendation.title}
                description={recommendation.description}
                left={props => (
                  <List.Icon 
                    {...props} 
                    icon={recommendation.icon} 
                    color={recommendation.priority === 'high' ? '#F44336' : '#FF9800'} 
                  />
                )}
                style={styles.recommendationItem}
              />
            ))}
          </View>
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="contained" 
            icon="calendar-export"
            onPress={() => {/* Create planning calendar */}}
          >
            Create Planning Calendar
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading advanced analytics...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Advanced Analytics</Text>
        <Text style={styles.screenSubtitle}>{groupName || 'All Groups'}</Text>
        
        <SegmentedButtons
          value={timeframe}
          onValueChange={setTimeframe}
          buttons={[
            { value: '1month', label: '1M' },
            { value: '3months', label: '3M' },
            { value: '6months', label: '6M' },
            { value: '1year', label: '1Y' }
          ]}
          style={styles.timeframeSelector}
        />
      </View>
      
      {/* Tab navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'predictions' && styles.activeTab]}
          onPress={() => setActiveTab('predictions')}
        >
          <Icon 
            name="crystal-ball" 
            size={20} 
            color={activeTab === 'predictions' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'predictions' && styles.activeTabText
            ]}
          >
            Predictions
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'health' && styles.activeTab]}
          onPress={() => setActiveTab('health')}
        >
          <Icon 
            name="heart-pulse" 
            size={20} 
            color={activeTab === 'health' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'health' && styles.activeTabText
            ]}
          >
            Financial Health
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'seasonality' && styles.activeTab]}
          onPress={() => setActiveTab('seasonality')}
        >
          <Icon 
            name="calendar-sync" 
            size={20} 
            color={activeTab === 'seasonality' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'seasonality' && styles.activeTabText
            ]}
          >
            Seasonality
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content section */}
      {activeTab === 'predictions' && renderPredictionsTab()}
      {activeTab === 'health' && renderHealthScoreTab()}
      {activeTab === 'seasonality' && renderSeasonalityTab()}
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
  headerSection: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    paddingBottom: 0
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  screenSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16
  },
  timeframeSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
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
  cardTitle: {
    fontSize: 18,
    marginBottom: 16
  },
  divider: {
    marginVertical: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  healthScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 16
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  scoreOutOf: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 7
  },
  scoreCategories: {
    flex: 1
  },
  scoreDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  trendIndicator: {
    fontSize: 14,
    color: '#666'
  },
  scoreComponentsList: {
    marginTop: 8
  },
  scoreComponent: {
    marginBottom: 16
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  componentName: {
    fontSize: 14,
    fontWeight: '500'
  },
  componentScore: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  componentProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  componentDescription: {
    fontSize: 12,
    color: '#666'
  },
  recommendationsList: {
    marginTop: 8
  },
  recommendation: {
    flexDirection: 'row',
    marginBottom: 16
  },
  recommendationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2
  },
  recommendationContent: {
    flex: 1
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  recommendationText: {
    fontSize: 14,
    color: '#444'
  },
  chart: {
    marginVertical: 16,
    borderRadius: 8
  },
  significantEvents: {
    marginTop: 16
  },
  significantEventsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  event: {
    flexDirection: 'row',
    marginBottom: 16
  },
  eventMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    marginTop: 6
  },
  eventContent: {
    flex: 1
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2
  },
  eventDescription: {
    fontSize: 14,
    color: '#444'
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  predictionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  predictionStat: {
    alignItems: 'center'
  },
  predictionStatValue: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  predictionStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center'
  },
  accuracyDetails: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8
  },
  accuracyTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  accuracyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  accuracyStat: {
    alignItems: 'center'
  },
  accuracyValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  accuracyLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  predictionsTable: {
    marginTop: 8
  },
  riskChip: {
    height: 24
  },
  highRiskChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)'
  },
  mediumRiskChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)'
  },
  lowRiskChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  emptyPredictions: {
    alignItems: 'center',
    padding: 24
  },
  emptyPredictionsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  emptyPredictionsSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center'
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  riskFactorsList: {
    marginTop: 8
  },
  riskFactor: {
    marginBottom: 16
  },
  riskFactorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  riskFactorName: {
    fontSize: 14,
    fontWeight: '500'
  },
  riskFactorWeight: {
    fontSize: 14,
    color: '#666'
  },
  riskFactorProgress: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8
  },
  riskFactorDescription: {
    fontSize: 14,
    color: '#444'
  },
  seasonalityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 8
  },
  seasonalityStat: {
    alignItems: 'center'
  },
  seasonalityStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  seasonalityStatValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  seasonalityStatSubvalue: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  patternsList: {
    marginTop: 8
  },
  pattern: {
    flexDirection: 'row',
    marginBottom: 16
  },
  patternIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2
  },
  patternContent: {
    flex: 1
  },
  patternTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  patternDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8
  },
  patternPeriod: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  patternPeriodText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  recommendationItem: {
    paddingHorizontal: 0,
    paddingVertical: 8
  }
});

export default AdvancedAnalyticsScreen;