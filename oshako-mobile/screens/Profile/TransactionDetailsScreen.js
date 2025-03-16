// File: screens/Profile/TransactionDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Share
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Divider,
  Avatar,
  List,
  IconButton,
  Menu
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getTransactionDetails } from '../../services/api/payment';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TransactionDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { transactionId } = route.params;
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    loadTransactionDetails();
  }, [transactionId]);
  
  const loadTransactionDetails = async () => {
    try {
      setLoading(true);
      const data = await getTransactionDetails(transactionId);
      setTransaction(data);
      
      // Set the title
      navigation.setOptions({
        title: getTransactionTypeTitle(data.type),
        headerRight: () => (
          <IconButton
            icon="dots-vertical"
            size={24}
            onPress={() => setMenuVisible(true)}
          />
        )
      });
    } catch (error) {
      console.error('Error loading transaction details:', error);
      Alert.alert('Error', 'Failed to load transaction details');
    } finally {
      setLoading(false);
    }
  };
  
  const getTransactionTypeTitle = (type) => {
    switch (type) {
      case 'CONTRIBUTION':
        return 'Contribution Details';
      case 'WITHDRAWAL':
        return 'Withdrawal Details';
      case 'REFUND':
        return 'Refund Details';
      case 'CHARGE':
        return 'Charge Details';
      default:
        return 'Transaction Details';
    }
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
  
  const handleShareTransaction = async () => {
    if (!transaction) return;
    
    setMenuVisible(false);
    
    const message = `
Transaction Details:
Type: ${transaction.type}
Amount: ${formatCurrency(transaction.amount)}
Date: ${formatDate(transaction.timestamp)}
Status: ${transaction.status}
${transaction.description ? `Description: ${transaction.description}` : ''}
${transaction.groupName ? `Group: ${transaction.groupName}` : ''}
    `.trim();
    
    try {
      await Share.share({
        message,
        title: 'Transaction Details',
      });
    } catch (error) {
      console.error('Error sharing transaction:', error);
      Alert.alert('Error', 'Failed to share transaction details');
    }
  };
  
  const navigateToGroup = () => {
    if (!transaction?.groupId) return;
    
    setMenuVisible(false);
    
    navigation.navigate('Groups', {
      screen: 'GroupDetails',
      params: {
        groupId: transaction.groupId,
        groupName: transaction.groupName
      }
    });
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  if (!transaction) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Could not load transaction details
        </Text>
        <Button 
          mode="contained" 
          onPress={loadTransactionDetails}
          style={styles.retryButton}
        >
          Retry
        </Button>
      </View>
    );
  }
  
  const isNegative = ['WITHDRAWAL', 'CHARGE'].includes(transaction.type);
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Transaction Overview Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.transactionOverview}>
              <Avatar.Icon 
                size={64} 
                icon={getTransactionIcon(transaction.type)}
                style={{ backgroundColor: getTransactionColor(transaction.type) }}
              />
              <View style={styles.transactionAmount}>
                <Text 
                  style={[
                    styles.amountText,
                    isNegative ? styles.negativeAmount : styles.positiveAmount
                  ]}
                >
                  {isNegative ? '-' : '+'}{formatCurrency(transaction.amount)}
                </Text>
                {getStatusChip(transaction.status)}
              </View>
            </View>
            
            <Text style={styles.description}>
              {transaction.description}
            </Text>
            
            <View style={styles.timestampContainer}>
              <Icon name="clock-outline" size={16} color="#666" />
              <Text style={styles.timestamp}>
                {formatDate(transaction.timestamp, { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </Card.Content>
        </Card>
        
        {/* Details Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Transaction Details</Text>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Transaction ID"
              description={transaction.id}
              left={props => <List.Icon {...props} icon="pound" />}
              style={styles.listItem}
            />
            
            <List.Item
              title="Type"
              description={transaction.type}
              left={props => <List.Icon {...props} icon="tag" />}
              style={styles.listItem}
            />
            
            {transaction.groupName && (
              <List.Item
                title="Group"
                description={transaction.groupName}
                left={props => <List.Icon {...props} icon="account-group" />}
                onPress={navigateToGroup}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                style={styles.listItem}
              />
            )}
            
            {transaction.reference && (
              <List.Item
                title="Reference"
                description={transaction.reference}
                left={props => <List.Icon {...props} icon="pound-box" />}
                style={styles.listItem}
              />
            )}
            
            {transaction.note && (
              <List.Item
                title="Note"
                description={transaction.note}
                left={props => <List.Icon {...props} icon="note-text" />}
                style={styles.listItem}
              />
            )}
          </Card.Content>
        </Card>
        
        {/* Payment Method Card */}
        {transaction.paymentMethod && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <Divider style={styles.divider} />
              
              <List.Item
                title={
                  transaction.paymentMethod.type === 'CARD'
                    ? `${transaction.paymentMethod.brand} Card`
                    : 'Bank Account'
                }
                description={
                  transaction.paymentMethod.type === 'CARD'
                    ? `•••• •••• •••• ${transaction.paymentMethod.last4}`
                    : `•••••${transaction.paymentMethod.last4}`
                }
                left={props => (
                  <List.Icon 
                    {...props} 
                    icon={transaction.paymentMethod.type === 'CARD' ? 'credit-card' : 'bank'} 
                  />
                )}
                style={styles.listItem}
              />
              
              {transaction.paymentMethod.type === 'CARD' && transaction.paymentMethod.expiryMonth && (
                <List.Item
                  title="Expiry Date"
                  description={`${transaction.paymentMethod.expiryMonth}/${transaction.paymentMethod.expiryYear}`}
                  left={props => <List.Icon {...props} icon="calendar" />}
                  style={styles.listItem}
                />
              )}
            </Card.Content>
          </Card>
        </Card>
        
        {/* Status Timeline Card */}
        {transaction.statusHistory && transaction.statusHistory.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Status History</Text>
              <Divider style={styles.divider} />
              
              {transaction.statusHistory.map((status, index) => (
                <List.Item
                  key={index}
                  title={status.status}
                  description={formatDate(status.timestamp, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  left={props => (
                    <List.Icon 
                      {...props} 
                      icon={
                        status.status === 'COMPLETED' ? 'check-circle' :
                        status.status === 'PENDING' ? 'clock' :
                        status.status === 'FAILED' ? 'alert-circle' :
                        'cancel'
                      } 
                    />
                  )}
                  style={styles.listItem}
                />
              ))}
            </Card.Content>
          </Card>
        </Card>
        
        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon="share-variant"
            onPress={handleShareTransaction}
            style={styles.actionButton}
          >
            Share Receipt
          </Button>
          
          <Button
            mode="outlined"
            icon="help-circle"
            onPress={() => Alert.alert('Feature Coming Soon', 'Support for this transaction will be available in a future update')}
            style={styles.actionButton}
          >
            Get Help
          </Button>
        </View>
      </ScrollView>
      
      {/* Options Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 0, y: 0 }}
        style={styles.menu}
      >
        <Menu.Item 
          icon="share-variant" 
          title="Share" 
          onPress={handleShareTransaction} 
        />
        {transaction?.groupId && (
          <Menu.Item 
            icon="account-group" 
            title="View Group" 
            onPress={navigateToGroup} 
          />
        )}
        <Menu.Item 
          icon="help-circle" 
          title="Get Help" 
          onPress={() => {
            setMenuVisible(false);
            Alert.alert('Feature Coming Soon', 'Support for this transaction will be available in a future update');
          }} 
        />
        <Divider />
        <Menu.Item 
          title="Close" 
          onPress={() => setMenuVisible(false)} 
        />
      </Menu>
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
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    width: 120,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  transactionOverview: {
    alignItems: 'center',
    marginVertical: 16,
  },
  transactionAmount: {
    alignItems: 'center',
    marginTop: 16,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  positiveAmount: {
    color: '#4CAF50',
  },
  negativeAmount: {
    color: '#F44336',
  },
  statusChip: {
    height: 28,
    paddingHorizontal: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  timestampContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  listItem: {
    paddingLeft: 0,
  },
  actionsContainer: {
    margin: 16,
  },
  actionButton: {
    marginVertical: 8,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 16,
  },
});

export default TransactionDetailsScreen;
