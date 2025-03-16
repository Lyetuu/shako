// File: screens/Profile/TransactionHistoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Divider,
  Avatar,
  Searchbar,
  Menu,
  IconButton
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getTransactionHistory } from '../../services/api/payment';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TransactionHistoryScreen = () => {
  const navigation = useNavigation();
  
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    loadTransactions();
  }, []);
  
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactionHistory();
      setTransactions(data);
      filterTransactions(data, searchQuery, typeFilter);
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'Failed to load transaction history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    filterTransactions(transactions, query, typeFilter);
  };
  
  const filterByType = (type) => {
    setTypeFilter(type);
    setMenuVisible(false);
    filterTransactions(transactions, searchQuery, type);
  };
  
  const filterTransactions = (items, query, type) => {
    let filtered = [...items];
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(item => 
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.groupName?.toLowerCase().includes(query.toLowerCase()) ||
        item.amount?.toString().includes(query.toLowerCase())
      );
    }
    
    // Filter by type
    if (type !== 'ALL') {
      filtered = filtered.filter(item => item.type === type);
    }
    
    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredTransactions(filtered);
  };
  
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'CONTRIBUTION':
        return 'cash-plus';
      case 'WITHDRAWAL':
        return 'cash-minus';
      case 'REFUND':
        return 'cash-refund';
      case 'CHARGE':
        return 'credit-card';
      default:
        return 'cash';
    }
  };
  
  const getTransactionColor = (type) => {
    switch (type) {
      case 'CONTRIBUTION':
        return '#4CAF50'; // Green
      case 'WITHDRAWAL':
        return '#F44336'; // Red
      case 'REFUND':
        return '#2196F3'; // Blue
      case 'CHARGE':
        return '#FF9800'; // Orange
      default:
        return '#9E9E9E'; // Grey
    }
  };
  
  const getStatusChip = (status) => {
    let color, backgroundColor, text;
    
    switch (status) {
      case 'COMPLETED':
        color = '#4CAF50';
        backgroundColor = '#E8F5E9';
        text = 'Completed';
        break;
      case 'PENDING':
        color = '#FF9800';
        backgroundColor = '#FFF3E0';
        text = 'Pending';
        break;
      case 'FAILED':
        color = '#F44336';
        backgroundColor = '#FFEBEE';
        text = 'Failed';
        break;
      case 'CANCELLED':
        color = '#9E9E9E';
        backgroundColor = '#F5F5F5';
        text = 'Cancelled';
        break;
      default:
        color = '#9E9E9E';
        backgroundColor = '#F5F5F5';
        text = status;
    }
    
    return (
      <Chip 
        style={[styles.statusChip, { backgroundColor }]}
        textStyle={{ color }}
      >
        {text}
      </Chip>
    );
  };
  
  const viewTransactionDetails = (transactionId) => {
    navigation.navigate('TransactionDetails', { transactionId });
  };
  
  const renderTransactionItem = ({ item }) => {
    const isNegative = ['WITHDRAWAL', 'CHARGE'].includes(item.type);
    
    return (
      <Card 
        style={styles.transactionCard}
        onPress={() => viewTransactionDetails(item.id)}
      >
        <Card.Content>
          <View style={styles.transactionHeader}>
            <View style={styles.transactionIcon}>
              <Avatar.Icon 
                size={40} 
                icon={getTransactionIcon(item.type)}
                style={{ backgroundColor: getTransactionColor(item.type) }}
              />
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionDescription}>
                {item.description}
              </Text>
              <Text style={styles.transactionDate}>
                {formatDate(item.timestamp, { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              {item.groupName && (
                <Text style={styles.groupName}>{item.groupName}</Text>
              )}
            </View>
            <View style={styles.transactionAmount}>
              <Text 
                style={[
                  styles.amountText,
                  isNegative ? styles.negativeAmount : styles.positiveAmount
                ]}
              >
                {isNegative ? '-' : '+'}{formatCurrency(item.amount)}
              </Text>
              {getStatusChip(item.status)}
            </View>
          </View>
          
          {item.paymentMethod && (
            <View style={styles.paymentMethodContainer}>
              <Icon 
                name={item.paymentMethod.type === 'CARD' ? 'credit-card' : 'bank'} 
                size={16} 
                color="#666"
                style={styles.paymentMethodIcon}
              />
              <Text style={styles.paymentMethodText}>
                {item.paymentMethod.type === 'CARD'
                  ? `${item.paymentMethod.brand} •••• ${item.paymentMethod.last4}`
                  : `Bank •••••${item.paymentMethod.last4}`}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };
  
  if (loading && !transactions.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search transactions..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.filterButton}
          >
            {typeFilter === 'ALL' ? 'All Transactions' :
             typeFilter === 'CONTRIBUTION' ? 'Contributions' :
             typeFilter === 'WITHDRAWAL' ? 'Withdrawals' :
             typeFilter === 'REFUND' ? 'Refunds' : 'Charges'}
          </Button>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={styles.menu}
          >
            <Menu.Item 
              title="All Transactions" 
              onPress={() => filterByType('ALL')} 
              titleStyle={typeFilter === 'ALL' ? styles.selectedMenuItem : null}
            />
            <Menu.Item 
              title="Contributions" 
              onPress={() => filterByType('CONTRIBUTION')}
              titleStyle={typeFilter === 'CONTRIBUTION' ? styles.selectedMenuItem : null}
            />
            <Menu.Item 
              title="Withdrawals" 
              onPress={() => filterByType('WITHDRAWAL')}
              titleStyle={typeFilter === 'WITHDRAWAL' ? styles.selectedMenuItem : null}
            />
            <Menu.Item 
              title="Refunds" 
              onPress={() => filterByType('REFUND')}
              titleStyle={typeFilter === 'REFUND' ? styles.selectedMenuItem : null}
            />
            <Menu.Item 
              title="Charges" 
              onPress={() => filterByType('CHARGE')}
              titleStyle={typeFilter === 'CHARGE' ? styles.selectedMenuItem : null}
            />
          </Menu>
        </View>
      </View>
      
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="cash-remove" size={64} color="#9E9E9E" />
            <Text style={styles.emptyTitle}>No Transactions Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? `No transactions match "${searchQuery}"`
                : typeFilter !== 'ALL'
                  ? `You don't have any ${typeFilter.toLowerCase()} transactions`
                  : "You haven't made any transactions yet"}
            </Text>
            <Button 
              mode="outlined" 
              onPress={handleRefresh}
              style={styles.refreshButton}
            >
              Refresh
            </Button>
          </View>
        )}
      />
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
    alignItems: 'center',
  },
  filterLabel: {
    marginRight: 8,
    fontSize: 16,
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
  listContent: {
    padding: 8,
  },
  transactionCard: {
    marginBottom: 8,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  groupName: {
    fontSize: 14,
    color: '#6200ee',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  positiveAmount: {
    color: '#4CAF50',
  },
  negativeAmount: {
    color: '#F44336',
  },
  statusChip: {
    height: 24,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  paymentMethodIcon: {
    marginRight: 8,
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    width: 120,
  },
});

export default TransactionHistoryScreen;
