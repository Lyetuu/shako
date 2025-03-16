// File: screens/GroupSavings/InviteMembersScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Share
} from 'react-native';
import {
  TextInput,
  Button,
  List,
  Avatar,
  Chip,
  Divider,
  Snackbar
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchGroupDetails, sendGroupInvitation } from '../../services/api/groupSavings';
import { searchUsers } from '../../services/api/users';
import { useAuth } from '../../contexts/AuthContext';
import { debounce } from 'lodash';

const InviteMembersScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { groupId } = route.params;
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);
  
  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchGroupDetails(groupId);
      setGroup(data);
    } catch (error) {
      console.error('Error loading group details:', error);
      Alert.alert('Error', 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  };
  
  const performSearch = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    try {
      setSearching(true);
      const results = await searchUsers(query);
      
      // Filter out users who are already members
      const existingMemberIds = group.members.map(member => member.user._id);
      const filteredResults = results.filter(user => 
        !existingMemberIds.includes(user._id) && 
        user._id !== user.id &&
        !sentInvitations.some(invite => invite.recipient._id === user._id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };
  
  const debouncedSearch = debounce(performSearch, 500);
  
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };
  
  const toggleUserSelection = (user) => {
    if (selectedUsers.some(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  
  const isUserSelected = (userId) => {
    return selectedUsers.some(u => u._id === userId);
  };
  
  const sendInvitations = async () => {
    if (selectedUsers.length === 0) {
      setSnackbarMessage('Please select at least one user');
      setSnackbarVisible(true);
      return;
    }
    
    try {
      setLoading(true);
      
      const invitationPromises = selectedUsers.map(selectedUser => 
        sendGroupInvitation(groupId, selectedUser._id)
      );
      
      const results = await Promise.all(invitationPromises);
      
      // Update sent invitations
      setSentInvitations([...sentInvitations, ...results]);
      
      // Clear selection
      setSelectedUsers([]);
      
      setSnackbarMessage(`Invitations sent to ${results.length} users`);
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error sending invitations:', error);
      Alert.alert('Error', 'Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };
  
  const shareInvitationLink = async () => {
    try {
      const inviteCode = group.inviteCode || 'NOCODE'; // Fallback if no invite code available
      const message = `Join my savings group "${group.name}" on Oshako! Use invite code: ${inviteCode} or click this link: https://oshako.app/join/${inviteCode}`;
      
      await Share.share({
        message,
        title: 'Join my Oshako savings group',
      });
    } catch (error) {
      console.error('Error sharing invite link:', error);
      Alert.alert('Error', 'Could not share invitation link');
    }
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
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Invite to {group?.name}</Text>
          <Text style={styles.subtitle}>
            Members will contribute {group?.minimumContribution ? `at least ${group.minimumContribution}` : ''} 
            {group?.contributionSchedule ? ` ${group.contributionSchedule}` : ''}
          </Text>
        </View>
        
        <View style={styles.shareSection}>
          <Text style={styles.sectionTitle}>Share Invite</Text>
          <Button
            mode="contained"
            icon="share-variant"
            onPress={shareInvitationLink}
            style={styles.shareButton}
          >
            Share Invitation Link
          </Button>
          
          {group?.inviteCode && (
            <View style={styles.inviteCodeContainer}>
              <Text style={styles.inviteCodeLabel}>Invite Code</Text>
              <View style={styles.inviteCodeWrapper}>
                <Text style={styles.inviteCode}>{group.inviteCode}</Text>
                <TouchableOpacity
                  onPress={() => {
                    // Copy to clipboard functionality would go here
                    setSnackbarMessage('Invite code copied to clipboard');
                    setSnackbarVisible(true);
                  }}
                >
                  <Icon name="content-copy" size={20} color="#6200ee" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Find Users</Text>
          <TextInput
            label="Search by name, email, or phone"
            value={searchQuery}
            onChangeText={handleSearchChange}
            mode="outlined"
            left={<TextInput.Icon name="magnify" />}
            style={styles.searchInput}
          />
          
          {searching && (
            <ActivityIndicator size="small" color="#6200ee" style={styles.searchingIndicator} />
          )}
          
          {searchResults.length > 0 && (
            <View style={styles.searchResults}>
              {searchResults.map(user => (
                <TouchableOpacity
                  key={user._id}
                  onPress={() => toggleUserSelection(user)}
                  style={[
                    styles.userItem,
                    isUserSelected(user._id) && styles.userItemSelected
                  ]}
                >
                  <Avatar.Text
                    size={40}
                    label={user.name.substring(0, 2).toUpperCase()}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <Icon
                    name={isUserSelected(user._id) ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                    size={24}
                    color={isUserSelected(user._id) ? "#6200ee" : "#9e9e9e"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {searchQuery.length > 0 && searchResults.length === 0 && !searching && (
            <Text style={styles.noResults}>No users found</Text>
          )}
        </View>
        
        {selectedUsers.length > 0 && (
          <View style={styles.selectedUsersSection}>
            <Text style={styles.sectionTitle}>Selected Users ({selectedUsers.length})</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectedUsersScroll}
            >
              {selectedUsers.map(user => (
                <Chip
                  key={user._id}
                  mode="outlined"
                  onClose={() => toggleUserSelection(user)}
                  style={styles.userChip}
                >
                  {user.name}
                </Chip>
              ))}
            </ScrollView>
          </View>
        )}
        
        {sentInvitations.length > 0 && (
          <View style={styles.sentInvitationsSection}>
            <Text style={styles.sectionTitle}>Sent Invitations</Text>
            {sentInvitations.map(invitation => (
              <List.Item
                key={invitation._id}
                title={invitation.recipient.name}
                description={`Sent ${new Date(invitation.createdAt).toLocaleDateString()}`}
                left={props => (
                  <Avatar.Text
                    {...props}
                    size={40}
                    label={invitation.recipient.name.substring(0, 2).toUpperCase()}
                  />
                )}
                right={props => (
                  <Chip {...props} mode="outlined" style={styles.statusChip}>
                    {invitation.status}
                  </Chip>
                )}
              />
            ))}
          </View>
        )}
      </ScrollView>
      
      {selectedUsers.length > 0 && (
        <View style={styles.bottomBar}>
          <Button
            mode="contained"
            onPress={sendInvitations}
            style={styles.inviteButton}
            loading={loading}
            disabled={loading}
          >
            Invite {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
          </Button>
        </View>
      )}
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  shareSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 12,
  },
  shareButton: {
    marginBottom: 16,
  },
  inviteCodeContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
  },
  inviteCodeLabel: {
    fontSize: 12,
    color: '#757575',
  },
  inviteCodeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  inviteCode: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#424242',
  },
  divider: {
    marginBottom: 16,
  },
  searchSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  searchInput: {
    marginBottom: 12,
  },
  searchingIndicator: {
    marginVertical: 8,
    alignSelf: 'center',
  },
  searchResults: {
    marginTop: 8,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  userItemSelected: {
    backgroundColor: '#e8f0fe',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
  },
  userEmail: {
    fontSize: 14,
    color: '#757575',
  },
  noResults: {
    textAlign: 'center',
    padding: 16,
    color: '#757575',
  },
  selectedUsersSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  selectedUsersScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  sentInvitationsSection: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  statusChip: {
    alignSelf: 'center',
  },
  bottomBar: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inviteButton: {
    width: '100%',
  },
});

export default InviteMembersScreen;
