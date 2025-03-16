// File: screens/Home/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Avatar,
  Divider,
  List,
  ActivityIndicator
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getUserSavingsGroups } from '../../services/api/groupSavings';
import { getUserProfile } from '../../services/api/auth';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    groups: [],
    recentActivity: [],
    upcomingPayments: [],
    savingsGoals: [],
    totalSaved: 0
  });
  
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user groups
      const groupsData = await getUserSavingsGroups();
      
      // Calculate total saved across all groups
      const totalSaved = groupsData.reduce(
        (sum, group) => sum + (group.userContribution || 0), 
        0
      );
      
      // Get top groups (by user contribution)
      const topGroups = [...groupsData]
        .sort((a, b) => (b.userContribution || 0) - (a.userContribution || 0))
        .slice(0, 3);
      
      // Extract recent activity from all groups
      let allActivity = [];
      groupsData.forEach(group => {
        if (group.recentActivity && group.recentActivity.length) {
          const groupActivity = group.recentActivity.map(act => ({
            ...act,
            groupId: group._id,
            groupName: group.name
          }));
          allActivity = [...allActivity, ...groupActivity];
        }
      });
      
      // Sort activity by timestamp
      allActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Mock upcoming payments for now - would come from API in real app
      const upcomingPayments = [
        {
          _id: 'payment1',
          groupId: groupsData.length > 0 ? groupsData[0]._id : 'group1',
          groupName: groupsData.length > 0 ? groupsData[0].name : 'Main Savings',
          amount: 50,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          frequency: 'MONTHLY'
        },
        {
          _id: 'payment2',
          groupId: groupsData.length > 1 ? groupsData[1]._id : 'group2',
          groupName: groupsData.length > 1 ? groupsData[1].name : 'Emergency Fund',
          amount: 25,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          frequency: 'BIWEEKLY'
        }
      ];
      
      // Extract savings goals from groups
      const savingsGoals = groupsData
        .filter(group => group.goalAmount && group.goalAmount > 0)
        .map(group => ({
          _id: group._id,
          groupName: group.name,
          currentAmount: group.totalSavings || 0,
          goalAmount: group.goalAmount,
          targetDate: group.targetDate,
          progress: group.totalSavings / group.goalAmount
        }))
        .sort((a, b) => b.progress - a.progress);
      
      setDashboardData({
        groups: topGroups,
        recentActivity: allActivity.slice(0, 5),
        upcomingPayments,
        savingsGoals: savingsGoals.slice(0, 3),
        totalSaved
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };
  
  const navigateToGroupDetails = (groupId, groupName) => {
    navigation.navigate('Groups', { 
      screen: 'GroupDetails', 
      params: { groupId, groupName } 
    });
  };
  
  const navigateToAllGroups = () => {
    navigation.navigate('Groups', { screen: 'GroupsList' });
  };
  
  const navigateToCreateGroup = () => {
    navigation.navigate('Groups', { screen: 'CreateGroup' });
  };
  
  if (loading && !dashboardData.groups.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <View style={styles.welcomeHeader}>
              <View>
                <Title style={styles.welcomeTitle}>
                  Hello, {user?.name?.split(' ')[0] || 'there'}!
                </Title>
                <Paragraph style={styles.welcomeSubtitle}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Paragraph>
              </View>
              <Avatar.Image 
                size={60} 
                source={user?.profileImage ? { uri: user.profileImage } : require('../../assets/default-avatar.png')} 
              />
            </View>
          </Card.Content>
        </Card>
        
        {/* Total Savings Card */}
        <Card style={styles.savingsCard}>
          <Card.Content>
            <Text style={styles.savingsLabel}>Total Savings</Text>
            <Text style={styles.savingsAmount}>
              {formatCurrency(dashboardData.totalSaved)}
            </Text>
            
            <View style={styles.actionsContainer}>
              <Button 
                mode="contained" 
                icon="bank-plus" 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Groups')}
              >
                Contribute
              </Button>
              <Button 
                mode="outlined" 
                icon="cash-multiple" 
                style={styles.actionButton}
                onPress={() => navigation.navigate('Groups')}
              >
                Withdraw
              </Button>
            </View>
          </Card.Content>
        </Card>
        
        {/* Top Groups Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Your Groups</Title>
              <Button 
                mode="text" 
                onPress={navigateToAllGroups}
              >
                See All
              </Button>
            </View>
            
            {dashboardData.groups.length > 0 ? (
              dashboardData.groups.map((group) => (
                <List.Item
                  key={group._id}
                  title={group.name}
                  description={`Your contribution: ${formatCurrency(group.userContribution || 0)}`}
                  left={props => (
                    <Avatar.Icon 
                      {...props} 
                      icon="account-group" 
                      size={48}
                      style={{ backgroundColor: '#6200ee' }}
                    />
                  )}
                  right={props => (
                    <List.Icon {...props} icon="chevron-right" />
                  )}
                  onPress={() => navigateToGroupDetails(group._id, group.name)}
                  style={styles.listItem}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  You haven't joined any savings groups yet
                </Text>
                <Button 
                  mode="contained" 
                  icon="plus" 
                  onPress={navigateToCreateGroup}
                  style={styles.emptyStateButton}
                >
                  Create a Group
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Savings Goals Card */}
        {dashboardData.savingsGoals.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Savings Goals</Title>
              
              {dashboardData.savingsGoals.map((goal) => (
                <View key={goal._id} style={styles.goalItem}>
                  <View style={styles.goalHeader}>
                    <Text style={styles.goalName}>{goal.groupName}</Text>
                    <Text style={styles.goalPercentage}>
                      {Math.round(goal.progress * 100)}%
                    </Text>
                  </View>
                  
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${Math.min(Math.round(goal.progress * 100), 100)}%` }
                      ]} 
                    />
                  </View>
                  
                  <View style={styles.goalDetails}>
                    <Text style={styles.goalAmount}>
                      {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.goalAmount)}
                    </Text>
                    {goal.targetDate && (
                      <Text style={styles.goalDate}>
                        Target: {formatDate(goal.targetDate)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
        
        {/* Upcoming Payments Card */}
        {dashboardData.upcomingPayments.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Upcoming Payments</Title>
              
              {dashboardData.upcomingPayments.map((payment) => (
                <List.Item
                  key={payment._id}
                  title={formatCurrency(payment.amount)}
                  description={payment.groupName}
                  left={props => (
                    <Avatar.Icon 
                      {...props} 
                      icon="calendar-clock" 
                      size={40}
                      style={{ backgroundColor: '#4CAF50' }}
                    />
                  )}
                  right={() => (
                    <View style={styles.paymentDue}>
                      <Text style={styles.paymentDueText}>
                        {formatDate(payment.dueDate, { month: 'short', day: 'numeric' })}
                      </Text>
                      <Text style={styles.paymentFrequency}>
                        {payment.frequency === 'MONTHLY' ? 'Monthly' : 
                         payment.frequency === 'BIWEEKLY' ? 'Bi-weekly' : 'Weekly'}
                      </Text>
                    </View>
                  )}
                  style={styles.listItem}
                  onPress={() => navigateToGroupDetails(payment.groupId, payment.groupName)}
                />
              ))}
            </Card.Content>
          </Card>
        )}
        
        {/* Recent Activity Card */}
        <Card style={[styles.card, styles.lastCard]}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Activity</Title>
            
            {dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider style={styles.activityDivider} />}
                  <List.Item
                    title={activity.description}
                    description={`${activity.groupName} • ${formatDate(activity.timestamp)}`}
                    left={props => (
                      <Avatar.Icon
                        {...props}
                        size={40}
                        icon={
                          activity.type === 'CONTRIBUTION' ? 'cash-plus' :
                          activity.type === 'WITHDRAWAL' ? 'cash-minus' :
                          activity.type === 'MEMBER_JOINED' ? 'account-plus' :
                          'information'
                        }
                        style={{
                          backgroundColor: 
                            activity.type === 'CONTRIBUTION' ? '#4CAF50' :
                            activity.type === 'WITHDRAWAL' ? '#F44336' :
                            activity.type === 'MEMBER_JOINED' ? '#2196F3' :
                            '#9E9E9E'
                        }}
                      />
                    )}
                    style={styles.listItem}
                    onPress={() => navigateToGroupDetails(activity.groupId, activity.groupName)}
                  />
                </React.Fragment>
              ))
            ) : (
              <Paragraph style={styles.emptyStateText}>
                No recent activity to display
              </Paragraph>
            )}
          </Card.Content>
        </Card>
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
  welcomeCard: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#6200ee',
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  savingsCard: {
    margin: 16,
    marginTop: -20,
    borderRadius: 16,
    elevation: 4,
  },
  savingsLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  savingsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  card: {
    margin: 16,
    marginBottom: 0,
  },
  lastCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItem: {
    paddingLeft: 0,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 8,
  },
  emptyStateButton: {
    marginTop: 16,
  },
  goalItem: {
    marginVertical: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '500',
  },
  goalPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6200ee',
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
  goalDate: {
    fontSize: 14,
    color: '#666',
  },
  paymentDue: {
    alignItems: 'flex-end',
  },
  paymentDueText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentFrequency: {
    fontSize: 12,
    color: '#666',
  },
  activityDivider: {
    marginVertical: 8,
  },
});

export default HomeScreen;
