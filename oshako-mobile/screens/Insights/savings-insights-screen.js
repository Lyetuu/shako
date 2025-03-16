// File: screens/Insights/SavingsInsightsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Divider,
  ProgressBar,
  Chip,
  Menu
} from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { getSavingsInsights } from '../../services/api/insights';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SavingsInsightsScreen = () => {
  const navigation = useNavigation();
  
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('6M'); // 1M, 3M, 6M, 1Y, ALL
  const [timeRangeMenuVisible, setTimeRangeMenuVisible] = useState(false);
  
  useEffect(() => {
    loadInsights();
  }, [timeRange]);
  
  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await getSavingsInsights(timeRange);
      setInsights(data);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadInsights();
  };
  
  const screenWidth = Dimensions.get('window').width - 32;
  
  if (loading && !insights) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  if (!insights) {
    return (
      <View style={styles.centered}>
        <Text>Unable to load insights</Text>
        <Button
          mode="contained"
          onPress={loadInsights}
          style={{ marginTop: 16 }}
        >
          Retry
        </Button>
      </View>
    );
  }
  
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        <Text style={styles.timeRangeLabel}>Time Range:</Text>
        <Button
          mode="outlined"
          onPress={() => setTimeRangeMenuVisible(true)}
          style={styles.timeRangeButton}
        >
          {timeRange === '1M' ? '1 Month' :
           timeRange === '3M' ? '3 Months' :
           timeRange === '6M' ? '6 Months' :
           timeRange === '1Y' ? '1 Year' : 'All Time'}
        </Button>
        
        <Menu
          visible={timeRangeMenuVisible}
          onDismiss={() => setTimeRangeMenuVisible(false)}
          anchor={{ x: screenWidth - 40, y: 50 }}
        >
          <Menu.Item 
            title="1 Month" 
            onPress={() => {
              setTimeRange('1M');
              setTimeRangeMenuVisible(false);
            }} 
          />
          <Menu.Item 
            title="3 Months" 
            onPress={() => {
              setTimeRange('3M');
              setTimeRangeMenuVisible(false);
            }} 
          />
          <Menu.Item 
            title="6 Months" 
            onPress={() => {
              setTimeRange('6M');
              setTimeRangeMenuVisible(false);
            }} 
          />
          <Menu.Item 
            title="1 Year" 
            onPress={() => {
              setTimeRange('1Y');
              setTimeRangeMenuVisible(false);
            }} 
          />
          <Menu.Item 
            title="All Time" 
            onPress={() => {
              setTimeRange('ALL');
              setTimeRangeMenuVisible(false);
            }} 
          />
        </Menu>
      </View>
      
      {/* Savings Summary Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Savings Summary</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Saved</Text>
              <Text style={styles.summaryValue}>{formatCurrency(insights.totalSaved)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Contribution Count</Text>
              <Text style={styles.summaryValue}>{insights.contributionCount}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Average Contribution</Text>
              <Text style={styles.summaryValue}>{formatCurrency(insights.averageContribution)}</Text>
            </View>
          </View>
          
          <View style={styles.growthContainer}>
            <Text style={styles.growthLabel}>Growth Rate:</Text>
            <View style={styles.growthValueContainer}>
              <Text style={[
                styles.growthValue,
                insights.savingsGrowthRate >= 0 ? styles.positiveGrowth : styles.negativeGrowth
              ]}>
                {insights.savingsGrowthRate >= 0 ? '+' : ''}{formatPercentage(insights.savingsGrowthRate)}
              </Text>
              <Icon 
                name={insights.savingsGrowthRate >= 0 ? 'arrow-up' : 'arrow-down'} 
                size={16}
                color={insights.savingsGrowthRate >= 0 ? '#4CAF50' : '#F44336'}
                style={styles.growthIcon}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Savings Trend Chart */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Savings Trend</Title>
          <Divider style={styles.divider} />
          
          {insights.savingsTrend && insights.savingsTrend.labels.length > 0 ? (
            <LineChart
              data={{
                labels: insights.savingsTrend.labels,
                datasets: [
                  {
                    data: insights.savingsTrend.data,
                    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                    strokeWidth: 2,
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
                color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#6200ee',
                },
                formatYLabel: (value) => formatCurrency(value, 'USD', 'en-US', { 
                  notation: 'compact',
                  maximumFractionDigits: 1
                }),
              }}
              bezier
              style={styles.chart}
              fromZero
            />
          ) : (
            <View style={styles.emptyChartContainer}>
              <Text style={styles.emptyChartText}>
                Not enough data to display savings trend
              </Text>
            </View>
          )}
          
          <View style={styles.trendInsightContainer}>
            <Icon name="lightbulb-outline" size={20} color="#FF9800" style={styles.insightIcon} />
            <Text style={styles.trendInsightText}>
              {insights.savingsTrendInsight || 'Keep contributing regularly to see your savings grow over time.'}
            </Text>
          </View>
        </Card.Content>
      </Card>
      
      {/* Goal Progress Card */}
      {insights.activeGoals && insights.activeGoals.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Goal Progress</Title>
            <Divider style={styles.divider} />
            
            {insights.activeGoals.map((goal, index) => (
              <View key={index} style={styles.goalContainer}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalPercentage}>{Math.round(goal.progress * 100)}%</Text>
                </View>
                
                <ProgressBar 
                  progress={goal.progress} 
                  color="#6200ee" 
                  style={styles.goalProgressBar} 
                />
                
                <View style={styles.goalDetails}>
                  <Text style={styles.goalAmount}>
                    {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                  </Text>
                  
                  {goal.estimatedCompletionDate && (
                    <Chip style={styles.goalDateChip}>
                      Est. completion: {goal.estimatedCompletionDate}
                    </Chip>
                  )}
                </View>
                
                {index < insights.activeGoals.length - 1 && (
                  <Divider style={styles.goalDivider} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
      
      {/* Savings Distribution */}
      {insights.savingsDistribution && insights.savingsDistribution.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Savings Distribution</Title>
            <Divider style={styles.divider} />
            
            <PieChart
              data={insights.savingsDistribution.map((item, index) => ({
                name: item.category,
                population: item.amount,
                color: item.color || `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                legendFontColor: '#7F7F7F',
                legendFontSize: 12
              }))}
              width={screenWidth}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            
            <View style={styles.distributionLegend}>
              {insights.savingsDistribution.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.category}: {formatCurrency(item.amount)}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}
      
      {/* Personalized Insights Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Personalized Insights</Title>
          <Divider style={styles.divider} />
          
          {insights.personalizedInsights && insights.personalizedInsights.length > 0 ? (
            insights.personalizedInsights.map((insight, index) => (
              <View key={index} style={styles.insightContainer}>
                <View style={styles.insightIconContainer}>
                  <Icon 
                    name={insight.icon || 'lightbulb-outline'} 
                    size={24} 
                    color={insight.iconColor || '#FF9800'} 
                  />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                  {insight.actionLink && (
                    <Button 
                      mode="text" 
                      compact 
                      onPress={() => navigation.navigate(insight.actionLink.screen, insight.actionLink.params)}
                      style={styles.insightAction}
                    >
                      {insight.actionLink.label}
                    </Button>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyInsightsContainer}>
              <Text style={styles.emptyInsightsText}>
                Continue saving to receive personalized insights about your financial habits.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Achievement Card */}
      {insights.achievements && insights.achievements.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Your Achievements</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.achievementsContainer}>
              {insights.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <View style={[
                    styles.achievementIcon, 
                    achievement.unlocked ? styles.unlockedAchievement : styles.lockedAchievement
                  ]}>
                    <Icon 
                      name={achievement.icon || 'trophy'} 
                      size={24} 
                      color={achievement.unlocked ? '#FFD700' : '#9E9E9E'} 
                    />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={[
                      styles.achievementTitle,
                      achievement.unlocked ? styles.unlockedTitle : styles.lockedTitle
                    ]}>
                      {achievement.name}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    {achievement.unlocked && achievement.unlockedDate && (
                      <Text style={styles.achievementDate}>
                        Unlocked on {achievement.unlockedDate}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
            
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('Achievements')}
              style={styles.viewAllButton}
            >
              View All Achievements
            </Button>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  timeRangeLabel: {
    fontSize: 16,
    marginRight: 12,
  },
  timeRangeButton: {
    height: 36,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  growthLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  growthValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveGrowth: {
    color: '#4CAF50',
  },
  negativeGrowth: {
    color: '#F44336',
  },
  growthIcon: {
    marginLeft: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyChartContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyChartText: {
    color: '#757575',
    textAlign: 'center',
  },
  trendInsightContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
    alignItems: 'flex-start',
  },
  insightIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  trendInsightText: {
    color: '#FF9800',
    flex: 1,
    lineHeight: 20,
  },
  goalContainer: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  goalProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalAmount: {
    fontSize: 14,
    color: '#666',
  },
  goalDateChip: {
    height: 24,
    backgroundColor: '#e8eaf6',
  },
  goalDivider: {
    marginVertical: 16,
  },
  distributionLegend: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  insightContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  insightAction: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 0,
  },
  emptyInsightsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyInsightsText: {
    textAlign: 'center',
    color: '#757575',
  },
  achievementsContainer: {
    marginBottom: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unlockedAchievement: {
    backgroundColor: '#FFF9C4',
  },
  lockedAchievement: {
    backgroundColor: '#EEEEEE',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  unlockedTitle: {
    color: '#333',
  },
  lockedTitle: {
    color: '#9E9E9E',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  achievementDate: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  viewAllButton: {
    marginTop: 8,
  },
});

export default SavingsInsightsScreen;
