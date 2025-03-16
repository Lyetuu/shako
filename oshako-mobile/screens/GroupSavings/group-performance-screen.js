// File: screens/GroupSavings/GroupPerformanceScreen.js (continued)
        const date = new Date(contribution.timestamp);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        cumulativeAmount += contribution.amount;
        months[monthYear] = cumulativeAmount;
      });
      
      // Convert to chart data format
      const sortedMonths = Object.keys(months).sort();
      
      setChartData({
        labels: sortedMonths.map(key => {
          const [year, month] = key.split('-');
          return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' })}`;
        }),
        datasets: [
          {
            data: sortedMonths.map(key => months[key])
          }
        ]
      });
    }
    
    // Process member contributions for pie chart
    const memberData = {};
    
    filteredContributions.forEach(contribution => {
      const userId = contribution.user?._id;
      const userName = contribution.user?.name || 'Unknown';
      
      if (!userId) return;
      
      if (!memberData[userId]) {
        memberData[userId] = {
          name: userName,
          amount: 0,
          isCurrentUser: userId === user.id
        };
      }
      
      memberData[userId].amount += contribution.amount;
    });
    
    // Convert to array and sort by amount
    const memberContributionsArray = Object.values(memberData)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 contributors
    
    setMemberContributions(memberContributionsArray);
  };
  
  // Helper function to get week number
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };
  
  if (loading && !group) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  const screenWidth = Dimensions.get('window').width - 32;
  
  // Generate colors for pie chart
  const pieChartColors = [
    '#6200ee', '#03dac6', '#ff9800', '#8bc34a', '#f44336',
    '#9c27b0', '#2196f3', '#ffeb3b', '#795548', '#607d8b'
  ];
  
  // Format pie chart data
  const pieChartData = memberContributions.map((member, index) => ({
    name: member.name,
    contribution: member.amount,
    color: pieChartColors[index % pieChartColors.length],
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  }));
  
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Time Range Selector */}
        <Card style={styles.filterCard}>
          <Card.Content>
            <View style={styles.filterRow}>
              <View>
                <Text style={styles.filterLabel}>Time Range:</Text>
                <Button
                  mode="outlined"
                  onPress={() => setTimeRangeMenuVisible(true)}
                  style={styles.filterButton}
                >
                  {timeRange === '1M' ? '1 Month' :
                   timeRange === '3M' ? '3 Months' :
                   timeRange === '6M' ? '6 Months' :
                   timeRange === '1Y' ? '1 Year' : 'All Time'}
                </Button>
                <Menu
                  visible={timeRangeMenuVisible}
                  onDismiss={() => setTimeRangeMenuVisible(false)}
                  anchor={styles.menu}
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
              
              <View style={styles.chartTypeContainer}>
                <Chip
                  selected={chartType === 'MONTHLY'}
                  onPress={() => setChartType('MONTHLY')}
                  style={styles.chartTypeChip}
                >
                  Monthly
                </Chip>
                <Chip
                  selected={chartType === 'WEEKLY'}
                  onPress={() => setChartType('WEEKLY')}
                  style={styles.chartTypeChip}
                >
                  Weekly
                </Chip>
                <Chip
                  selected={chartType === 'CUMULATIVE'}
                  onPress={() => setChartType('CUMULATIVE')}
                  style={styles.chartTypeChip}
                >
                  Cumulative
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Contribution Chart */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>
              {chartType === 'CUMULATIVE' ? 'Cumulative Contributions' : 'Contribution History'}
            </Title>
            
            {chartData.labels.length > 0 ? (
              <View style={styles.chartContainer}>
                {chartType === 'CUMULATIVE' ? (
                  <LineChart
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          data: chartData.datasets[0].data,
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
                  <BarChart
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          data: chartData.datasets[0].data,
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
                      formatYLabel: (value) => formatCurrency(value, 'USD', 'en-US', { 
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }),
                    }}
                    style={styles.chart}
                    fromZero
                  />
                )}
              </View>
            ) : (
              <View style={styles.emptyChartContainer}>
                <Text style={styles.emptyChartText}>
                  No contribution data available for the selected time period
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Member Contribution Distribution */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Member Contribution Distribution</Title>
            
            {memberContributions.length > 0 ? (
              <>
                <View style={styles.chartContainer}>
                  <PieChart
                    data={pieChartData}
                    width={screenWidth}
                    height={200}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="contribution"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.contributorsContainer}>
                  <Text style={styles.contributorsTitle}>Top Contributors</Text>
                  
                  {memberContributions.map((member, index) => (
                    <View key={index} style={styles.contributorRow}>
                      <View style={styles.contributorInfo}>
                        <View 
                          style={[
                            styles.contributorColorIndicator, 
                            { backgroundColor: pieChartColors[index % pieChartColors.length] }
                          ]} 
                        />
                        <Text style={styles.contributorName}>
                          {member.name} {member.isCurrentUser ? '(You)' : ''}
                        </Text>
                      </View>
                      <Text style={styles.contributorAmount}>
                        {formatCurrency(member.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View style={styles.emptyChartContainer}>
                <Text style={styles.emptyChartText}>
                  No member contribution data available for the selected time period
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Group Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Group Statistics</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCurrency(group?.totalSavings || 0)}
                </Text>
                <Text style={styles.statLabel}>Total Savings</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {group?.members?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {contributions.length}
                </Text>
                <Text style={styles.statLabel}>Contributions</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCurrency(
                    contributions.length > 0 
                      ? contributions.reduce((sum, c) => sum + c.amount, 0) / contributions.length 
                      : 0
                  )}
                </Text>
                <Text style={styles.statLabel}>Avg. Contribution</Text>
              </View>
            </View>
            
            {group?.goalAmount > 0 && (
              <View style={styles.goalProgressContainer}>
                <View style={styles.goalProgressHeader}>
                  <Text style={styles.goalProgressTitle}>Goal Progress</Text>
                  <Text style={styles.goalProgressPercentage}>
                    {Math.min(Math.round((group.totalSavings / group.goalAmount) * 100), 100)}%
                  </Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${Math.min(Math.round((group.totalSavings / group.goalAmount) * 100), 100)}%` }
                    ]} 
                  />
                </View>
                
                <Text style={styles.goalAmount}>
                  {formatCurrency(group.totalSavings)} of {formatCurrency(group.goalAmount)}
                </Text>
                
                {group.targetDate && (
                  <Text style={styles.targetDate}>
                    Target Date: {formatDate(group.targetDate)}
                  </Text>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('ContributionHistory', { groupId, groupName })}
            style={styles.button}
            icon="history"
          >
            View All Contributions
          </Button>
        </View>
      </ScrollView>
    </View>
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
  },
  filterCard: {
    margin: 16,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  filterButton: {
    height: 36,
  },
  chartTypeContainer: {
    flexDirection: 'column',
  },
  chartTypeChip: {
    margin: 2,
  },
  menu: {
    position: 'absolute',
    top: 50,
    left: 16,
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyChartContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    padding: 16,
  },
  emptyChartText: {
    color: '#757575',
    textAlign: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  contributorsContainer: {
    marginTop: 8,
  },
  contributorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  contributorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contributorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contributorColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  contributorName: {
    fontSize: 14,
  },
  contributorAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  goalProgressContainer: {
    marginTop: 8,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  goalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalProgressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalProgressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6200ee',
  },
  goalAmount: {
    fontSize: 14,
    marginBottom: 4,
  },
  targetDate: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    margin: 16,
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
  },
});

export default GroupPerformanceScreen;
