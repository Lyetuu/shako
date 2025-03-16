// File: screens/GroupSavings/WithdrawalRequestsScreen.js
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
  Text,
  Button,
  Chip,
  Divider,
  List,
  Avatar,
  Menu,
  Searchbar,
  Dialog,
  Portal,
  TextInput
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  getGroupWithdrawals,
  processWithdrawalRequest
} from '../../services/api/groupSavings';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Added Icon import

const WithdrawalRequestsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, isGroupAdmin } = useAuth();
  const { groupId, groupName } = route.params;
  
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [actionType, setActionType] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    loadWithdrawals();
  }, [groupId]);
  
  useEffect(() => {
    navigation.setOptions({
      title: `Withdrawal Requests${groupName ? ` - ${groupName}` : ''}`
    });
  }, [groupName, navigation]);
  
  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const data = await getGroupWithdrawals(groupId);
      setWithdrawals(data);
      filterWithdrawals(data, searchQuery, statusFilter);
    } catch (error) {
      console.error('Error loading withdrawals:', error);
      Alert.alert('Error', 'Failed to load withdrawal requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadWithdrawals();
  };
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    filterWithdrawals(withdrawals, query, statusFilter);
  };
  
  const filterByStatus = (status) => {
    setStatusFilter(status);
    filterWithdrawals(withdrawals, searchQuery, status);
  };
  
  const filterWithdrawals = (items, query, status) => {
    let filtered = [...items];
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(item => 
        item.user?.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.reason?.toLowerCase().includes(query.toLowerCase()) ||
        item.amount?.toString().includes(query.toLowerCase())
      );
    }
    
    // Filter by status
    if (status !== 'ALL') {
      filtered = filtered.filter(item => item.status === status);
    }
    
    setFilteredWithdrawals(filtered);
  };
  
  const handleAction = (withdrawal, action) => {
    setSelectedWithdrawal(withdrawal);
    setActionType(action);
    setAdminComment('');
    setDialogVisible(true);
  };
  
  const processAction = async () => {
    if (!selectedWithdrawal) return;
    
    try {
      setSubmitting(true);
      
      const actionData = {
        approved: actionType === 'APPROVE',
        comment: adminComment
      };
      
      await processWithdrawalRequest(groupId, selectedWithdrawal._id, actionData);
      
      Alert.alert(
        'Success',
        `Withdrawal request ${actionType === 'APPROVE' ? 'approved' : 'rejected'} successfully`,
        [{ text: 'OK' }]
      );
      
      setDialogVisible(false);
      loadWithdrawals();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      Alert.alert('Error', `Failed to ${actionType.toLowerCase()} withdrawal request`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStatusChip = (status) => {
    let color, icon;
    
    switch (status) {
      case 'PENDING':
        color = '#FFC107';
        icon = 'clock-outline';
        break;
      case 'APPROVED':
        color = '#4CAF50';
        icon = 'check-circle-outline';
        break;
      case 'REJECTED':
        color = '#F44336';
        icon = 'close-circle-outline';
        break;
      case 'COMPLETED':
        color = '#2196F3';
        icon = 'check-circle';
        break;
      default:
        color = '#9E9E9E';
        icon = 'help-circle-outline';
    }
    
    return (
      <Chip 
        icon={icon} 
        style={[styles.statusChip, { backgroundColor: color }]}
        textStyle={{ color: 'white' }}
      >
        {status}
      </Chip>
    );
  };
  
  if (loading && !withdrawals.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  const isAdmin = isGroupAdmin(groupId);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search withdrawals..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={statusFilter === 'ALL'}
            onPress={() => filterByStatus('ALL')}
            style={styles.filterChip}
          >
            All
          </Chip>
          <Chip
            selected={statusFilter === 'PENDING'}
            onPress={() => filterByStatus('PENDING')}
            style={styles.filterChip}
          >
            Pending
          </Chip>
          <Chip
            selected={statusFilter === 'APPROVED'}
            onPress={() => filterByStatus('APPROVED')}
            style={styles.filterChip}
          >
            Approved
          </Chip>
          <Chip
            selected={statusFilter === 'REJECTED'}
            onPress={() => filterByStatus('REJECTED')}
            style={styles.filterChip}
          >
            Rejected
          </Chip>
          <Chip
            selected={statusFilter === 'COMPLETED'}
            onPress={() => filterByStatus('COMPLETED')}
            style={styles.filterChip}
          >
            Completed
          </Chip>
        </ScrollView>
      </View>
      
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        style={styles.scrollView}
      >
        {filteredWithdrawals.length > 0 ? (
          filteredWithdrawals.map((withdrawal) => (
            <Card key={withdrawal._id} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.memberName}>
                      {withdrawal.user?.name || 'Unknown User'}
                    </Text>
                    <Text style={styles.dateText}>
                      Requested: {formatDate(withdrawal.createdAt)}
                    </Text>
                  </View>
                  {getStatusChip(withdrawal.status)}
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Amount:</Text>
                  <Text style={styles.amountValue}>
                    {formatCurrency(withdrawal.amount)}
                  </Text>
                </View>
                
                <View style={styles.reasonContainer}>
                  <Text style={styles.reasonLabel}>Reason:</Text>
                  <Text style={styles.reasonText}>{withdrawal.reason}</Text>
                </View>
                
                {withdrawal.bankAccount && (
                  <View style={styles.bankAccountContainer}>
                    <Text style={styles.bankAccountLabel}>Withdrawal Account:</Text>
                    <View style={styles.bankAccountInfo}>
                      <Icon 
                        name="bank" 
                        size={16} 
                        color="#2E7D32"
                        style={styles.bankIcon}
                      />
                      <Text style={styles.bankAccountText}>
                        {withdrawal.bankAccount.nickname || withdrawal.bankAccount.bankName} (
                        {withdrawal.bankAccount.accountType === 'CHECKING' ? 'Checking' : 'Savings'} 
                        •••• {withdrawal.bankAccount.last4})
                      </Text>
                    </View>
                    {withdrawal.bankAccount.swiftCode && (
                      <View style={styles.swiftCodeContainer}>
                        <Icon 
                          name="earth" 
                          size={14} 
                          color="#1565C0"
                          style={styles.swiftIcon}
                        />
                        <Text style={styles.swiftCodeText}>
                          SWIFT: {withdrawal.bankAccount.swiftCode}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                
                {withdrawal.adminComment && (
                  <View style={styles.commentContainer}>
                    <Text style={styles.commentLabel}>Admin Comment:</Text>
                    <Text style={styles.commentText}>{withdrawal.adminComment}</Text>
                  </View>
                )}
                
                {isAdmin && withdrawal.status === 'PENDING' && (
                  <View style={styles.actionContainer}>
                    <Button 
                      mode="contained" 
                      onPress={() => handleAction(withdrawal, 'APPROVE')}
                      style={[styles.actionButton, styles.approveButton]}
                      icon="check"
                    >
                      Approve
                    </Button>
                    <Button 
                      mode="contained" 
                      onPress={() => handleAction(withdrawal, 'REJECT')}
                      style={[styles.actionButton, styles.rejectButton]}
                      icon="close"
                    >
                      Reject
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading withdrawal requests...' : 'No withdrawal requests found'}
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
      
      {/* Action Dialog */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>
            {actionType === 'APPROVE' ? 'Approve' : 'Reject'} Withdrawal Request
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              {actionType === 'APPROVE' 
                ? 'Are you sure you want to approve this withdrawal request?' 
                : 'Are you sure you want to reject this withdrawal request?'}
            </Text>
            
            {selectedWithdrawal && (
              <View style={styles.dialogDetailsContainer}>
                <Text style={styles.dialogDetailLabel}>Amount:</Text>
                <Text style={styles.dialogDetailValue}>
                  {formatCurrency(selectedWithdrawal.amount)}
                </Text>
                
                <Text style={styles.dialogDetailLabel}>Requested by:</Text>
                <Text style={styles.dialogDetailValue}>
                  {selectedWithdrawal.user?.name || 'Unknown User'}
                </Text>
              </View>
            )}
            
            <TextInput
              label="Admin Comment (optional)"
              value={adminComment}
              onChangeText={setAdminComment}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.commentInput}
              placeholder={actionType === 'REJECT' 
                ? 'Provide a reason for rejecting this request' 
                : 'Add any notes about this approval'}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setDialogVisible(false)} 
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              mode="contained"
              onPress={processAction}
              loading={submitting}
              disabled={submitting}
              style={actionType === 'APPROVE' ? styles.approveButton : styles.rejectButton}
            >
              {actionType === 'APPROVE' ? 'Approve' : 'Reject'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  filterChip: {
    marginHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
  divider: {
    marginVertical: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 70,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reasonContainer: {
    marginBottom: 8,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
  },
  bankAccountContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f0f8ff',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  bankAccountLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2196F3',
  },
  bankAccountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIcon: {
    marginRight: 8,
  },
  bankAccountText: {
    fontSize: 14,
  },
  swiftCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E3F2FD',
  },
  swiftIcon: {
    marginRight: 8,
  },
  swiftCodeText: {
    fontSize: 12,
    color: '#1565C0',
    fontFamily: 'monospace',
  },
  commentContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  commentLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    margin: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
  dialogText: {
    marginBottom: 16,
  },
  dialogDetailsContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  dialogDetailLabel: {
    fontSize: 14,
    color: '#666',
  },
  dialogDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentInput: {
    marginTop: 8,
  },
});

export default WithdrawalRequestsScreen;