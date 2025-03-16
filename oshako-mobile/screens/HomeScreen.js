// screens/HomeScreen.js - Main dashboard screen
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { getGroups } from '../redux/actions/groupActions';
import { getSavingsGoals } from '../redux/actions/savingsActions';
import { formatCurrency } from '../utils/formatting';
import Card from '../components/Card';
import PieChart from '../components/PieChart';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const groups = useSelector(state => state.groups.groups);
  const savingsGoals = useSelector(state => state.savings.goals);
  
  const [refreshing, setRefreshing] = useState(false);
  const [totalSavings, setTotalSavings] = useState(0);
  const [savingsBreakdown, setSavingsBreakdown] = useState([]);

  // Calculate total savings and prepare chart data
  useEffect(() => {
    let total = 0;
    let breakdown = [];
    
    // Add personal savings
    if (savingsGoals && savingsGoals.length > 0) {
      const personalTotal = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
      total += personalTotal;
      
      if (personalTotal > 0) {
        breakdown.push({
          name: 'Personal',
          value: personalTotal,
          color: '#3498db'
        });
      }
    }
    
    // Add group savings
    if (groups && groups.length > 0) {
      const groupTotal = groups.reduce((sum, group) => sum + group.currentAmount, 0);
      total += groupTotal;
      
      if (groupTotal > 0) {
        breakdown.push({
          name: 'Group',
          value: groupTotal,
          color: '#2ecc71'
        });
      }
    }
    
    setTotalSavings(total);
    setSavingsBreakdown(breakdown);
  }, [savingsGoals, groups]);

  // Load data
  const loadData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(getGroups()),
        dispatch(getSavingsGoals())
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName || 'User'}</Text>
            <Text style={styles.subtitle}>Your financial summary</Text>
          </View>
          {!user?.kycVerified && (
            <TouchableOpacity
              style={styles.kycButton}
              onPress={() => navigation.navigate('ProfileTab', { screen: 'KYC' })}
            >
              <Icon name="shield-checkmark-outline" size={16} color="#fff" />
              <Text style={styles.kycButtonText}>Verify ID</Text>
            </TouchableOpacity>
          )}
        </View>

        <Card style={styles.totalSavingsCard}>
          <Text style={styles.cardLabel}>Total Savings</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalSavings)}</Text>
          
          {savingsBreakdown.length > 0 && (
            <View style={styles.chartContainer}>
              <PieChart data={savingsBreakdown} />
              <View style={styles.legendContainer}>
                {savingsBreakdown.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.name}: {formatCurrency(item.value)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Savings Goals</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SaveGoal')}
            style={styles.addButton}
          >
            <Icon name="add-circle" size={24} color="#3498db" />
          </TouchableOpacity>
        </View>

        {savingsGoals && savingsGoals.length > 0 ? (
          savingsGoals.slice(0, 3).map((goal) => (
            <Card key={goal._id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Icon name={goal.icon || 'flag'} size={24} color="#3498db" />
                <Text style={styles.goalName}>{goal.name}</Text>
              </View>
              <View style={styles.goalProgress}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          (goal.currentAmount / goal.targetAmount) * 100,
                          100
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                </Text>
              </View>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyText}>
            You don't have any savings goals yet. Create one!
          </Text>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Groups</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('GroupsTab', { screen: 'CreateGroup' })}
            style={styles.addButton}
          >
            <Icon name="add-circle" size={24} color="#3498db" />
          </TouchableOpacity>
        </View>

        {groups && groups.length > 0 ? (
          groups.slice(0, 3).map((group) => (
            <TouchableOpacity
              key={group._id}
              onPress={() =>
                navigation.navigate('GroupsTab', {
                  screen: 'GroupDetail',
                  params: { groupId: group._id, groupName: group.name },
                })
              }
            >
              <Card style={styles.groupCard}>
                <View style={styles.groupHeader}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <View style={styles.memberCount}>
                    <Icon name="people" size={16} color="#666" />
                    <Text style={styles.memberCountText}>
                      {group.members.length}
                    </Text>
                  </View>
                </View>
                <View style={styles.groupProgress}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${Math.min(
                            (group.currentAmount / group.targetAmount) * 100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>