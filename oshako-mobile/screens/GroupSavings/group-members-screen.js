// File: screens/GroupSavings/GroupMembersScreen.js
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
  Title,
  Paragraph,
  Button,
  Divider,
  Text,
  Avatar,
  IconButton,
  Searchbar,
  Menu,
  Dialog,
  Portal,
  TextInput,
  List,
  Chip
} from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchGroupDetails, inviteToGroup, removeGroupMember } from '../../services/api/groupSavings';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

const GroupMembersScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, isGroupAdmin } = useAuth();
  const { groupId, groupName } = route.params;
  
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Menu and dialog states
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [inviteDialogVisible, setInviteDialogVisible] = useState(false);
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);
  
  useEffect(() => {
    navigation.setOptions({
      title: `Members${groupName ? ` - ${groupName}` : ''}`
    });
  }, [groupName, navigation]);
  
  useEffect(() => {
    if (group && group.members) {
      setMembers(group.members);
      filterMembers(group.members, searchQuery);
    }
  }, [group]);
  
  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchGroupDetails(groupId);
      setGroup(data);
    } catch (error) {
      console.error('Error loading group details:', error);
      Alert.alert('Error', 'Failed to load group members');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadGroupDetails();
  };
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    filterMembers(members, query);
  };
  
  const filterMembers = (items, query) => {
    if (!query.trim()) {
      setFilteredMembers(items);
      return;
    }
    
    const filtered = items.filter(member => 
      member.user.name.toLowerCase().includes(query.toLowerCase()) ||
      member.user.email.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredMembers(filtered);
  };
  
  const openMemberMenu = (member) => {
    setSelectedMember(member);
    setMenuVisible(true);
  };
  
  const closeMemberMenu = () => {
    setMenuVisible(false);
  };
  
  const openInviteDialog = () => {
    setInviteEmail('');
    setInviteMessage(`Join our savings group "${groupName || 'Group'}"!`);
    setInviteDialogVisible(true);
  };
  
  const openRemoveDialog = (member) => {
    setSelectedMember(member);
    setRemoveDialogVisible(true);
    closeMemberMenu();
  };
  
  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const inviteData = {
        email: inviteEmail.trim(),
        message: inviteMessage
      };
      
      await inviteToGroup(groupId, inviteData);
      
      Alert.alert(
        'Invitation Sent',
        `An invitation has been sent to ${inviteEmail}`,
        [{ text: 'OK' }]
      );
      
      setInviteDialogVisible(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
      Alert.alert('Error', error.message || 'Failed to send invitation');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      setSubmitting(true);
      
      await removeGroupMember(groupId, selectedMember.user._id);
      
      Alert.alert(
        'Member Removed',
        `${selectedMember.user.name} has been removed from the group`,
        [{ text: 'OK' }]
      );
      
      setRemoveDialogVisible(false);
      loadGroupDetails();
    } catch (error) {
      console.error('Error removing member:', error);
      Alert.alert('Error', error.message || 'Failed to remove member');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getMemberInitials = (name) => {
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  const renderMemberItem = ({ item }) => {
    const isCurrentUser = item.user._id === user.id;
    const isAdmin = item.isAdmin;
    
    return (
      <Card style={styles.memberCard}>
        <Card.Content>
          <View style={styles.memberHeader}>
            <View style={styles.memberInfo}>
              <Avatar.Text 
                size={50} 
                label={getMemberInitials(item.user.name)}
                style={[
                  styles.avatar,
                  isAdmin && styles.adminAvatar
                ]}
              />
              <View style={styles.memberDetails}>
                <View style={styles.nameContainer}>
                  <Text style={styles.memberName}>{item.user.name}</Text>
                  {isCurrentUser && (
                    <Chip style={styles.youChip} textStyle={styles.youChipText}>You</Chip>
                  )}
                  {isAdmin && (
                    <Chip style={styles.adminChip} textStyle={styles.adminChipText}>Admin</Chip>
                  )}
                </View>
                <Text style={styles.memberEmail}>{item.user.email}</Text>
                <Text style={styles.joinDate}>
                  Joined: {formatDate(item.joinedAt)}
                </Text>
              </View>
            </View>
            
            {isAdmin && !isCurrentUser && isGroupAdmin(groupId) && (
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={() => openMemberMenu(item)}
              />
            )}
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.contributionInfo}>
            <View style={styles.contributionItem}>
              <Text style={styles.contributionLabel}>Total Contributed</Text>
              <Text style={styles.contributionValue}>
                {formatCurrency(item.totalContributed)}
              </Text>
            </View>
            <View style={styles.contributionItem}>
              <Text style={styles.contributionLabel}>Last Contribution</Text>
              <Text style={styles.contributionValue}>
                {item.lastContribution ? 
                  formatDate(item.lastContribution) : 'None'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderHeader = () => {
    if (!group) return null;
    
    return (
      <View style={styles.headerContainer}>
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Members</Text>
                <Text style={styles.statValue}>{members.length}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Group Created</Text>
                <Text style={styles.statValue}>{formatDate(group.createdAt, { year: 'numeric', month: 'short' })}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Admins</Text>
                <Text style={styles.statValue}>{members.filter(m => m.isAdmin).length}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {isGroupAdmin(groupId) && (
          <Button 
            mode="contained" 
            icon="account-plus" 
            onPress={openInviteDialog}
            style={styles.inviteButton}
          >
            Invite Member
          </Button>
        )}
      </View>
    );
  };
  
  if (loading && !group) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search members..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <FlatList
        data={filteredMembers}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.user._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading members...' : 'No members found'}
            </Text>
          </View>
        )}
      />
      
      {/* Member Actions Menu */}
      <Menu
        visible={menuVisible}
        onDismiss={closeMemberMenu}
        anchor={{ x: 0, y: 0 }}
        style={styles.menu}
      >
        <Menu.Item 
          title="Remove from Group" 
          icon="account-remove"
          onPress={() => openRemoveDialog(selectedMember)}
        />
        <Menu.Item 
          title="Make Admin" 
          icon="shield-account"
          onPress={() => {
            // Logic to make admin
            closeMemberMenu();
          }}
        />
        <Menu.Item 
          title="View Profile" 
          icon="account-details"
          onPress={() => {
            // Navigate to member profile
            closeMemberMenu();
          }}
        />
        <Divider />
        <Menu.Item 
          title="Cancel" 
          onPress={closeMemberMenu}
        />
      </Menu>
      
      {/* Invite Member Dialog */}
      <Portal>
        <Dialog
          visible={inviteDialogVisible}
          onDismiss={() => setInviteDialogVisible(false)}
        >
          <Dialog.Title>Invite Member</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Email Address"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.dialogInput}
            />
            <TextInput
              label="Invitation Message"
              value={inviteMessage}
              onChangeText={setInviteMessage}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setInviteDialogVisible(false)} 
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              mode="contained"
              onPress={handleInviteMember}
              loading={submitting}
              disabled={submitting}
            >
              Send Invite
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Remove Member Dialog */}
      <Portal>
        <Dialog
          visible={removeDialogVisible}
          onDismiss={() => setRemoveDialogVisible(false)}
        >
          <Dialog.Title>Remove Member</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Are you sure you want to remove {selectedMember?.user.name} from this group?
            </Text>
            <Text style={styles.dialogWarning}>
              This action cannot be undone. The member will lose access to the group, but their contribution data will be preserved.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setRemoveDialogVisible(false)} 
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              mode="contained"
              onPress={handleRemoveMember}
              loading={submitting}
              disabled={submitting}
              color="#F44336"
            >
              Remove
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  headerContainer: {
    marginBottom: 16,
  },
  statsCard: {
    margin: 16,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inviteButton: {
    margin: 16,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  memberCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memberInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
    backgroundColor: '#6200ee',
  },
  adminAvatar: {
    backgroundColor: '#f57c00',
  },
  memberDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  joinDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  youChip: {
    height: 24,
    backgroundColor: '#e0e0e0',
    marginRight: 4,
  },
  youChipText: {
    fontSize: 10,
  },
  adminChip: {
    height: 24,
    backgroundColor: '#fff3e0',
    borderColor: '#f57c00',
    borderWidth: 1,
  },
  adminChipText: {
    fontSize: 10,
    color: '#f57c00',
  },
  divider: {
    marginVertical: 12,
  },
  contributionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contributionItem: {
    flex: 1,
  },
  contributionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  contributionValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 16,
  },
  dialogInput: {
    marginBottom: 12,
  },
  dialogText: {
    marginBottom: 16,
  },
  dialogWarning: {
    color: '#F44336',
    fontStyle: 'italic',
  },
});

export default GroupMembersScreen;
