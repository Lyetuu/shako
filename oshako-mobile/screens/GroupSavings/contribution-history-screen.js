// File: screens/GroupSavings/ContributionHistoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Divider,
  List,
  Avatar,
  Chip,
  Searchbar,
  Menu,
  Button
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getGroupContributions } from '../../services/api/groupSavings';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

const ContributionHistoryScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { groupId, groupName } = route.params;
  
  const [contributions, setContributions] = useState([]);
  const [filteredContributions, setFilteredContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('ALL');
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    loadContributions();
  }, [groupId]);
  
  useEffect(() => {
    navigation.setOptions({
      title: `Contributions${groupName ? ` - ${groupName}` : ''}`
    });
  }, [groupName, navigation]);
  
  const loadContributions = async () => {
    try {
      setLoading(true);
      const data = await getGroupContributions(groupId);
      setContributions(data);
      filterContributions(data, searchQuery, timeFilter);
    } catch (error) {
      console.error('Error loading contributions:', error);
      Alert.alert('Error', 'Failed to load contribution history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadContributions();
  };
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    filterContributions(contributions, query, timeFilter);
  };
  
  const onFilterByTime = (filter) => {
    setTimeFilter(filter);
    setMenuVisible(false);
    filterContributions(contributions, searchQuery, filter);
  };
  
  const filterContributions = (items, query, timeFilter) => {
    let filtered = [...items];
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(item => 
        item.user?.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.note?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by time period
    const now = new Date();
    if (timeFilter !== 'ALL') {
      switch (timeFilter) {
        case 'WEEK':
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(item => new Date(item.timestamp) >= oneWeekAgo);
          break;
        case 'MONTH':
          const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
          filtered = filtered.filter(item => new Date(item.timestamp) >= oneMonthAgo);
          break;
        case 'QUARTER':
          const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
          filtered = filtered.filter(item => new Date(item.timestamp) >= threeMonthsAgo);
          break;
        case 'YEAR':
          const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
          filtered = filtered.filter(item => new Date(item.timestamp) >= oneYearAgo);
          break;
      }
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredContributions(filtered);
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  if (loading && !contributions.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  const totalContributions = filteredContributions.reduce(
    (sum, contribution) => sum + contribution.amount,
    0
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search contributions..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.totalText}>
            Total: <Text style={styles.totalAmount}>{formatCurrency(totalContributions)}</Text>
          </Text>
          
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.filterButton}
          >
            {timeFilter === 'ALL' ? 'All Time' :
             timeFilter === 'WEEK' ? 'Past Week' :
             timeFilter === 'MONTH' ? 'Past Month' :
             timeFilter === 'QUARTER' ? 'Past 3 Months' : 'Past Year'}
          </Button>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={styles.menu}
          >
            <Menu.Item 
              title="All Time" 
              onPress={() => onFilterByTime('ALL')} 
              titleStyle={timeFilter === 'ALL' ? styles.selectedMenuItem : null}
            />
            <Menu.Item 
              title="Past Week" 
              onPress={() => onFilterByTime('WEEK')}
              titleStyle={timeFilter === 'WEEK' ? styles.selectedMenuItem : null}
            />
            <Menu.Item 
              title="Past Month" 
              onPress={() => onFilterByTime('MONTH')}
              titleStyle={timeFilter === 'MONTH' ? styles.selectedMenuItem : null}
            />
            <Menu.Item 
              title="Past 3 Months" 
              onPress={() => onFilterByTime('QUARTER')}
              titleStyle={timeFilter === 'QUARTER' ? styles.selectedMenuItem : null}
            />
            <Menu.Item 
              title="Past Year" 
              onPress={() => onFilterByTime('YEAR')}
              titleStyle={timeFilter === 'YEAR' ? styles.selectedMenuItem : null}
            />
          </Menu>
        </View>
      </View>
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={styles.scrollView}
      >
        {filteredContributions.length > 0 ? (
          filteredContributions.map((contribution, index) => (
            <Card key={contribution._id || index} style={styles.card}>
              <Card.Content>
                <View style={styles.contributionHeader}>
                  <View style={styles.userInfo}>
                    <Avatar.Text 
                      size={40} 
                      label={getInitials(contribution.user?.name)}
                      style={styles.avatar}
                    />
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>
                        {contribution.user?._id === user.id 
                          ? 'You' 
                          : contribution.user?.name || 'Unknown User'}
                      </Text>
                      <Text style={styles.timestamp}>
                        {formatDate(contribution.timestamp, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text style={styles.amount}>
                      {formatCurrency(contribution.amount)}
                    </Text>
                    {contribution.paymentMethod && (
                      <Chip style={styles.methodChip} textStyle={styles.methodChipText}>
                        {contribution.paymentMethod === 'CARD' ? 'Card' : 
                         contribution.paymentMethod === 'BANK' ? 'Bank' : 
                         'Other'}
                      </Chip>
                    )}
                  </View>
                </View>
                
                {contribution.note && (
                  <View style={styles.noteContainer}>
                    <Text style={styles.noteLabel}>Note:</Text>
                    <Text style={styles.noteText}>{contribution.note}</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading contributions...' : 'No contributions found'}
            </Text>
            {!loading && (
              <Button 
                mode="outlined" 
                onPress={handleRefresh}
                style={styles.retryButton}
              >
                Refresh
              </Button>
            )}
          </View>
        )}
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
  header: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  filterContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  filterButton: {
    height: 36,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 16,
  },
  selectedMenuItem: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  contributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
    backgroundColor: '#6200ee',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  methodChip: {
    height: 24,
    marginTop: 4,
    backgroundColor: '#e8f5e9',
  },
  methodChipText: {
    fontSize: 10,
    color: '#2E7D32',
  },
  noteContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#6200ee',
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#666',
  },
  noteText: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    width: 120,
  },
});

export default ContributionHistoryScreen;
