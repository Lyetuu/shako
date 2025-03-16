// File: screens/Profile/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import {
  Avatar,
  Title,
  Text,
  Button,
  Card,
  Divider,
  List,
  Switch,
  Portal,
  Dialog,
  Paragraph,
  ActivityIndicator
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { getUserProfile, updateProfile } from '../../services/api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatters';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout, refreshProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoContributionEnabled, setAutoContributionEnabled] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [profileStats, setProfileStats] = useState({
    totalSaved: 0,
    totalContributions: 0,
    groupsJoined: 0
  });
  
  useEffect(() => {
    loadProfileData();
  }, []);
  
  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile data
      const profileData = await getUserProfile();
      
      // Update auth context with latest user data
      refreshProfile();
      
      // Set user preferences from profile data
      setNotificationsEnabled(profileData.preferences?.notifications ?? true);
      setBiometricEnabled(profileData.preferences?.biometric ?? false);
      setAutoContributionEnabled(profileData.preferences?.autoContribution ?? false);
      
      // Set user stats
      setProfileStats({
        totalSaved: profileData.stats?.totalSaved || 0,
        totalContributions: profileData.stats?.totalContributions || 0,
        groupsJoined: profileData.stats?.groupsJoined || 0
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
  
  const updatePreference = async (preference, value) => {
    try {
      // Update locally first for responsive UI
      switch (preference) {
        case 'notifications':
          setNotificationsEnabled(value);
          break;
        case 'biometric':
          setBiometricEnabled(value);
          break;
        case 'autoContribution':
          setAutoContributionEnabled(value);
          break;
      }
      
      // Send update to API
      await updateProfile({
        preferences: {
          [preference]: value
        }
      });
    } catch (error) {
      console.error('Error updating preference:', error);
      Alert.alert('Error', 'Failed to update preference');
      
      // Revert on error
      switch (preference) {
        case 'notifications':
          setNotificationsEnabled(!value);
          break;
        case 'biometric':
          setBiometricEnabled(!value);
          break;
        case 'autoContribution':
          setAutoContributionEnabled(!value);
          break;
      }
    }
  };
  
  const handleEditProfile = () => {
    // Navigate to edit profile screen
    Alert.alert('Feature Coming Soon', 'Profile editing will be available in a future update');
  };
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  
  if (loading && !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleEditProfile}>
            <Avatar.Image 
              size={100} 
              source={user?.profileImage ? { uri: user.profileImage } : require('../../assets/default-avatar.png')}
              style={styles.avatar}
            />
            <View style={styles.editIconContainer}>
              <Icon name="pencil" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <Title style={styles.userName}>{user?.name || 'User'}</Title>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          
          <Button 
            mode="outlined" 
            icon="account-edit" 
            onPress={handleEditProfile}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </View>
        
        {/* Stats Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Your Stats</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {formatCurrency(profileStats.totalSaved)}
                </Text>
                <Text style={styles.statLabel}>Total Saved</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profileStats.totalContributions}</Text>
                <Text style={styles.statLabel}>Contributions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profileStats.groupsJoined}</Text>
                <Text style={styles.statLabel}>Groups Joined</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Settings Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Settings</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Notifications"
              description="Receive updates about your groups"
              left={props => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={(value) => updatePreference('notifications', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Biometric Authentication"
              description="Use fingerprint or face ID to log in"
              left={props => <List.Icon {...props} icon="fingerprint" />}
              right={() => (
                <Switch
                  value={biometricEnabled}
                  onValueChange={(value) => updatePreference('biometric', value)}
                />
              )}
            />
            <Divider />
            
            <List.Item
              title="Auto Contributions"
              description="Automatically contribute on schedule"
              left={props => <List.Icon {...props} icon="calendar-clock" />}
              right={() => (
                <Switch
                  value={autoContributionEnabled}
                  onValueChange={(value) => updatePreference('autoContribution', value)}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        {/* Account Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Account</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="Payment Methods"
              description="Manage your cards and bank accounts"
              left={props => <List.Icon {...props} icon="credit-card-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('PaymentMethods')}
            />
            <Divider />
            
            {/* Added Banking Details Item */}
            <List.Item
              title="Banking Details"
              description="Manage your withdrawal bank accounts"
              left={props => <List.Icon {...props} icon="bank" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('BankingDetails')}
            />
            <Divider />
            
            <List.Item
              title="Security"
              description="Password, 2FA, and privacy settings"
              left={props => <List.Icon {...props} icon="shield-account-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Security')}
            />
            <Divider />
            
            <List.Item
              title="Notifications Settings"
              description="Configure how you receive updates"
              left={props => <List.Icon {...props} icon="bell-ring-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Feature Coming Soon', 'Notification settings will be available in a future update')}
            />
          </Card.Content>
        </Card>
        
        {/* Help Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Help & Support</Title>
            <Divider style={styles.divider} />
            
            <List.Item
              title="FAQs"
              description="Frequently asked questions"
              left={props => <List.Icon {...props} icon="help-circle-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Feature Coming Soon', 'FAQs will be available in a future update')}
            />
            <Divider />
            
            <List.Item
              title="Contact Support"
              description="Get help with any issues"
              left={props => <List.Icon {...props} icon="headset" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Feature Coming Soon', 'Support contact will be available in a future update')}
            />
            <Divider />
            
            {/* Added Fees & Commission Item */}
            <List.Item
              title="Fees & Commission"
              description="Learn about our fee structure"
              left={props => <List.Icon {...props} icon="cash" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('FeesAndCommission')}
            />
            <Divider />
            
            <List.Item
              title="Terms & Privacy"
              description="Review our terms and privacy policy"
              left={props => <List.Icon {...props} icon="file-document-outline" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => Alert.alert('Feature Coming Soon', 'Terms and Privacy will be available in a future update')}
            />
          </Card.Content>
        </Card>
        
        {/* Logout Button */}
        <Button 
          mode="contained" 
          icon="logout" 
          onPress={() => setLogoutDialogVisible(true)}
          style={styles.logoutButton}
          color="#F44336"
        >
          Log Out
        </Button>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
      
      {/* Logout Dialog */}
      <Portal>
        <Dialog
          visible={logoutDialogVisible}
          onDismiss={() => setLogoutDialogVisible(false)}
        >
          <Dialog.Title>Log Out</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to log out of your account?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleLogout} color="#F44336">Log Out</Button>
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
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200ee',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    borderColor: '#6200ee',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
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
  logoutButton: {
    margin: 16,
    marginTop: 24,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#aaa',
  },
});

export default ProfileScreen;