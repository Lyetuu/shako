// File: screens/GroupSavings/GroupDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Text,
  Divider,
  List,
  Avatar,
  Portal,
  Dialog
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchGroupDetails } from '../../services/api/groupSavings';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import ContributionChart from '../../components/GroupSavings/ContributionChart';

const GroupDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, isGroupAdmin } = useAuth();
  const { groupId } = route.params;
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [userMemberData, setUserMemberData] = useState(null);
  const [fabOpen, setFabOpen] = useState(false);
  
  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);
  
  // Update header title when group name is available
  useEffect(() => {
    if (group) {
      navigation.setOptions({
        title: group.name
      });
    }
  }, [group, navigation]);
  
  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchGroupDetails(groupId);
      setGroup(data);
      
      // Find the current user's member data
      const memberData = data.members.find(m => m.user._id === user.id);
      setUserMemberData(memberData);
    } catch (error) {
      console.error('Error loading group details:', error);
      Alert.alert('Error', 'Failed to load group details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadGroupDetails();
  };
  
  const openContributionScreen = () => {
    navigation.navigate('Contribute', { groupId, groupName: group.name });
  };
  
  const openWithdrawalScreen = () => {
    navigation.navigate('RequestWithdrawal', { groupId });
  };
  
  const openMembersScreen = () => {
    navigation.navigate('GroupMembers', { groupId, groupName: group.name });
  };
  
  const openWithdrawalRequestsScreen = () => {
    navigation.navigate('WithdrawalRequests', { groupId, groupName: group.name });
  };
  
  const isAdmin = () => isGroupAdmin(groupId);
  
  if (loading && !group) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  if (!group) {
    return (
      <View style={styles.centered}>
        <Text>Could not load group details</Text>
        <Button mode="contained" onPress={loadGroupDetails} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }
  
  const pendingWithdrawalRequests = group.withdrawalRequests?.filter(req => req.status === 'PENDING') || [];
  
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Group Overview Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.groupName}>{group.name}</Title>
            <Paragraph style={styles.description}>{group.description}</Paragraph>
            <Divider style={styles.divider} />
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Savings</Text>
                <Text style={styles.statValue}>{formatCurrency(group.totalSavings)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Members</Text>
                <Text style={styles.statValue}>{group.members.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Created</Text>
                <Text style={styles.statValue}>{formatDate(group.createdAt, { year: 'numeric', month: 'short' })}</Text>
              </View>
            </View>
            
            {/* Goal Lock Indicator */}
            {group.goalAmount > 0 && group.settings?.lockWithdrawalsUntilGoal && (
              <View style={styles.lockBannerContainer}>
                <Icon name="lock" size={20} color="#F44336" style={styles.lockIcon} />
                <Text style={styles.lockBannerText}>
                  Withdrawals locked until goal of {formatCurrency(group.goalAmount)} is reached
                </Text>
              </View>
            )}
            
            {/* Group Withdrawal Button */}
            {group.totalSavings > 0 && (
              <View style={styles.groupWithdrawalContainer}>
                <Button 
                  mode="contained" 
                  icon="cash-multiple" 
                  onPress={() => navigation.navigate('GroupWithdrawalRequest', { groupId: group._id })}
                  style={styles.groupWithdrawalButton}
                  color="#4CAF50"
                >
                  Request Group Withdrawal
                </Button>
                <Text style={styles.groupWithdrawalNote}>
                  Request a withdrawal of the entire group savings (requires approval from all members)
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Your Contribution Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Your Contribution</Title>
              <Button
                mode="contained"
                onPress={openContributionScreen}
                style={styles.actionButton}
              >
                Contribute
              </Button>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.contributionStats}>
              <View style={styles.contributionItem}>
                <Text style={styles.contributionLabel}>Total Contributed</Text>
                <Text style={styles.contributionValue}>
                  {formatCurrency(userMemberData?.totalContributed || 0)}
                </Text>
              </View>
              <View style={styles.contributionItem}>
                <Text style={styles.contributionLabel}>Last Contribution</Text>
                <Text style={styles.contributionValue}>
                  {userMemberData?.lastContribution ? 
                    formatDate(userMemberData.lastContribution) : 'None'}
                </Text>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              <ContributionChart 
                data={userMemberData?.contributionHistory || []} 
                currency="USD"
              />
            </View>
            
            <Button
              mode="outlined"
              onPress={() => setShowWithdrawDialog(true)}
              style={styles.withdrawButton}
              icon="cash-multiple"
            >
              Request Withdrawal
            </Button>
          </Card.Content>
        </Card>
        
        {/* Quick Actions Card */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Quick Actions</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={openContributionScreen}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
                  <Icon name="cash-plus" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Contribute</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowWithdrawDialog(true)}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                  <Icon name="cash-minus" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Withdraw</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('TransactionHistory', { groupId: groupId })}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
                  <Icon name="history" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>History</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('GroupMembers', { groupId, groupName: group.name })}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' }]}>
                  <Icon name="account-plus" size={24} color="white" />
                </View>
                <Text style={styles.actionText}>Invite</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
        
        {/* Recent Activity Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Activity</Title>
            <Divider style={styles.divider} />
            
            {group.recentActivity && group.recentActivity.length > 0 ? (
              group.recentActivity.map((activity, index) => (
                <List.Item
                  key={index}
                  title={activity.description}
                  description={formatDate(activity.timestamp)}
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
                />
              ))
            ) : (
              <Paragraph style={styles.emptyState}>No recent activity</Paragraph>
            )}
          </Card.Content>
        </Card>
        
        {/* Withdrawal Settings Card */}
        <Card style={styles.withdrawalSettingsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Withdrawal Settings</Text>
            
            <View style={styles.settingItem}>
              <Icon name="shield-check" size={20} color="#6200ee" />
              <Text style={styles.settingText}>
                {group.settings?.requireAllApprovals 
                  ? 'All members must approve withdrawals' 
                  : `At least ${group.settings?.minimumApprovalPercentage || 50}% of members must approve withdrawals`}
              </Text>
            </View>
            
            {group.settings?.autoSplitOnDispute && (
              <View style={styles.settingItem}>
                <Icon name="account-switch" size={20} color="#6200ee" />
                <Text style={styles.settingText}>
                  Funds will be split equally in case of disputes
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Admin Section */}
        {isAdmin() && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Admin Controls</Title>
              <Divider style={styles.divider} />
              
              <Button 
                mode="contained" 
                icon="account-group" 
                style={styles.adminButton}
                onPress={openMembersScreen}
              >
                Manage Members
              </Button>
              
              <Button 
                mode="contained" 
                icon="cash-refund" 
                style={styles.adminButton}
                onPress={openWithdrawalRequestsScreen}
              >
                Withdrawal Requests
                {pendingWithdrawalRequests.length > 0 && (
                  <Text style={styles.badge}> {pendingWithdrawalRequests.length}</Text>
                )}
              </Button>
              
              <Button 
                mode="contained" 
                icon="cog" 
                style={styles.adminButton}
                onPress={() => setVisibleDialog(true)}
              >
                Group Settings
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      
      {/* Settings Dialog */}
      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={() => setVisibleDialog(false)}
        >
          <Dialog.Title>Group Settings</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Group settings functionality coming soon!</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisibleDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Withdrawal Dialog */}
      <Portal>
        <Dialog
          visible={showWithdrawDialog}
          onDismiss={() => setShowWithdrawDialog(false)}
        >
          <Dialog.Title>Request Withdrawal</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Withdrawal requests require approval from {group.settings?.requireAllApprovals 
                ? 'all members' 
                : `at least ${group.settings?.minimumApprovalPercentage || 50}% of members`}.
            </Paragraph>
            <Paragraph style={{ marginTop: 8 }}>
              Do you want to continue?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowWithdrawDialog(false)}>Cancel</Button>
            <Button 
              onPress={() => {
                setShowWithdrawDialog(false);
                openWithdrawalScreen();
              }}
            >
              Continue
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* FAB Group for quick actions */}
      <FAB.Group
        open={fabOpen}
        icon={fabOpen ? 'close' : 'dots-vertical'}
        actions={[
          {
            icon: 'account-plus',
            label: 'Invite Members',
            onPress: () => navigation.navigate('GroupMembers', { groupId, groupName: group.name }),
          },
          {
            icon: 'cash-plus',
            label: 'Contribute',
            onPress: openContributionScreen,
          },
          isAdmin() && {
            icon: 'cog',
            label: 'Group Settings',
            onPress: () => setVisibleDialog(true),
          },
        ].filter(Boolean)}
        onStateChange={({ open }) => setFabOpen(open)}
        style={styles.fab}
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
    padding: 20,
  },
  retryButton: {
    marginTop: 16,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  groupName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
  divider: {
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButton: {
    minWidth: 120,
  },
  contributionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  contributionItem: {
    flex: 1,
  },
  contributionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contributionValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 20,
    height: 200,
  },
  withdrawButton: {
    marginTop: 16,
  },
  emptyState: {
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  adminButton: {
    marginVertical: 8,
  },
  badge: {
    backgroundColor: '#e53935',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  // Lock banner styles
  lockBannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 4,
    marginTop: 12,
  },
  lockIcon: {
    marginRight: 8,
  },
  lockBannerText: {
    color: '#F44336',
    fontSize: 14,
    flex: 1,
  },
  // Group withdrawal styles
  groupWithdrawalContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  groupWithdrawalButton: {
    marginBottom: 8,
  },
  groupWithdrawalNote: {
    fontSize: 12,
    color: '#2E7D32',
    textAlign: 'center',
  },
  // Quick actions styles
  actionsCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    width: '22%',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#424242',
    textAlign: 'center',
  },
  // Withdrawal settings styles
  withdrawalSettingsCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingText: {
    fontSize: 14,
    color: '#424242',
    marginLeft: 8,
    flex: 1,
  },
});

export default GroupDetailsScreen;