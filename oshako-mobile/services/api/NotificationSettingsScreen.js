import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Switch,
  Divider,
  TextInput,
  HelperText,
  List,
  Dialog,
  Portal
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getUserNotificationPreferences, 
  updateNotificationPreferences,
  connectWhatsAppNotifications,
  verifyWhatsAppOTP,
  getGroupNotificationSettings,
  configureGroupNotificationSettings
} from '../../services/api/multiChannelNotification';
import theme from '../../config/theme';

const NotificationSettingsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [groupSettings, setGroupSettings] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [otpCode, setOTPCode] = useState('');
  const [otpError, setOTPError] = useState(null);
  const [connectingWhatsApp, setConnectingWhatsApp] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  const { groupId } = route.params || {};
  const isGroupSettings = !!groupId; // Determine if we're configuring group notifications

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isGroupSettings) {
        // Fetch group notification settings
        const settings = await getGroupNotificationSettings(groupId);
        setGroupSettings(settings);
      } else {
        // Fetch user notification preferences
        const prefs = await getUserNotificationPreferences(user.id);
        setPreferences(prefs);
        
        // Set phone number if available
        if (prefs.whatsAppNumber) {
          setPhoneNumber(prefs.whatsAppNumber);
        }
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      Alert.alert('Error', 'Failed to load notification settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUserPreferences = async () => {
    setSaving(true);
    try {
      await updateNotificationPreferences(user.id, preferences);
      Alert.alert('Success', 'Notification preferences updated successfully.');
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      Alert.alert('Error', 'Failed to save notification preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGroupSettings = async () => {
    setSaving(true);
    try {
      await configureGroupNotificationSettings(groupId, groupSettings);
      Alert.alert('Success', 'Group notification settings updated successfully.');
    } catch (error) {
      console.error('Error saving group notification settings:', error);
      Alert.alert('Error', 'Failed to save group notification settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleConnectWhatsApp = async () => {
    // Validate phone number
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setPhoneNumberError('Please enter a valid phone number with country code');
      return;
    }
    
    setConnectingWhatsApp(true);
    try {
      await connectWhatsAppNotifications(user.id, phoneNumber);
      setShowWhatsAppDialog(false);
      setShowOTPDialog(true);
    } catch (error) {
      console.error('Error connecting WhatsApp:', error);
      setPhoneNumberError('Failed to connect WhatsApp. Please check the number and try again.');
    } finally {
      setConnectingWhatsApp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.trim().length !== 6) {
      setOTPError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setConnectingWhatsApp(true);
    try {
      await verifyWhatsAppOTP(user.id, otpCode);
      
      // Update preferences to reflect WhatsApp connection
      setPreferences(prev => ({
        ...prev,
        whatsAppConnected: true,
        whatsAppNumber: phoneNumber
      }));
      
      setShowOTPDialog(false);
      Alert.alert('Success', 'WhatsApp notifications have been enabled successfully.');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOTPError('Invalid OTP. Please try again.');
    } finally {
      setConnectingWhatsApp(false);
    }
  };

  const renderUserPreferences = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Notification Channels</Title>
          
          <List.Item
            title="In-App Notifications"
            description="Receive notifications within the app"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => (
              <Switch
                value={preferences.enableAppNotifications}
                onValueChange={value => 
                  setPreferences(prev => ({
                    ...prev,
                    enableAppNotifications: value
                  }))
                }
                disabled={saving}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Email Notifications"
            description={user.email}
            left={props => <List.Icon {...props} icon="email" />}
            right={props => (
              <Switch
                value={preferences.enableEmailNotifications}
                onValueChange={value => 
                  setPreferences(prev => ({
                    ...prev,
                    enableEmailNotifications: value
                  }))
                }
                disabled={saving}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="WhatsApp Notifications"
            description={preferences.whatsAppConnected ? preferences.whatsAppNumber : "Not connected"}
            left={props => <List.Icon {...props} icon="whatsapp" color="#25D366" />}
            right={props => (
              <View style={styles.whatsappButtonContainer}>
                {preferences.whatsAppConnected ? (
                  <Switch
                    value={preferences.enableWhatsAppNotifications}
                    onValueChange={value => 
                      setPreferences(prev => ({
                        ...prev,
                        enableWhatsAppNotifications: value
                      }))
                    }
                    disabled={saving}
                  />
                ) : (
                  <Button 
                    mode="contained" 
                    onPress={() => setShowWhatsAppDialog(true)}
                    style={styles.connectButton}
                    disabled={saving}
                  >
                    Connect
                  </Button>
                )}
              </View>
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Notification Types</Title>
          
          <List.Item
            title="Payment Reminders"
            description="Get notified about payment due dates"
            left={props => <List.Icon {...props} icon="calendar-check" />}
            right={props => (
              <Switch
                value={preferences.enablePaymentReminders}
                onValueChange={value => 
                  setPreferences(prev => ({
                    ...prev,
                    enablePaymentReminders: value
                  }))
                }
                disabled={saving}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Defaulter Notifications"
            description="Get notified when someone misses a payment"
            left={props => <List.Icon {...props} icon="account-alert" />}
            right={props => (
              <Switch
                value={preferences.enableDefaulterNotifications}
                onValueChange={value => 
                  setPreferences(prev => ({
                    ...prev,
                    enableDefaulterNotifications: value
                  }))
                }
                disabled={saving}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Group Updates"
            description="Get notified about changes in your groups"
            left={props => <List.Icon {...props} icon="account-group" />}
            right={props => (
              <Switch
                value={preferences.enableGroupUpdates}
                onValueChange={value => 
                  setPreferences(prev => ({
                    ...prev,
                    enableGroupUpdates: value
                  }))
                }
                disabled={saving}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Transaction Notifications"
            description="Get notified about wallet transactions"
            left={props => <List.Icon {...props} icon="cash" />}
            right={props => (
              <Switch
                value={preferences.enableTransactionNotifications}
                onValueChange={value => 
                  setPreferences(prev => ({
                    ...prev,
                    enableTransactionNotifications: value
                  }))
                }
                disabled={saving}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Button
        mode="contained"
        onPress={handleSaveUserPreferences}
        style={styles.saveButton}
        loading={saving}
        disabled={saving}
      >
        Save Preferences
      </Button>
    </View>
  );

  const renderGroupSettings = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Group Notification Channels</Title>
          <Paragraph style={styles.cardDescription}>
            Configure which channels to use for group notifications
          </Paragraph>
          
          <List.Item
            title="In-App Notifications"
            description="Send notifications within the app"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => (
              <Switch
                value={groupSettings.defaultChannels.includes('app')}
                onValueChange={value => {
                  const channels = [...groupSettings.defaultChannels];
                  if (value) {
                    if (!channels.includes('app')) channels.push('app');
                  } else {
                    const index = channels.indexOf('app');
                    if (index !== -1) channels.splice(index, 1);
                  }
                  setGroupSettings(prev => ({
                    ...prev,
                    defaultChannels: channels
                  }));
                }}
                disabled={saving}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Email Notifications"
            description="Send notifications via email"
            left={props => <List.Icon {...props} icon="email" />}
            right={props => (
              <Switch
                value={groupSettings.defaultChannels.includes('email')}
                onValueChange={value => {
                  const channels = [...groupSettings.defaultChannels];
                  if (value) {
                    if (!channels.includes('email')) channels.push('email');
                  } else {
                    const index = channels.indexOf('email');
                    if (index !== -1) channels.splice(index, 1);
                  }
                  setGroupSettings(prev => ({
                    ...prev,
                    defaultChannels: channels
                  }));
                }}
                disabled={saving}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="WhatsApp Notifications"
            description="Send notifications via WhatsApp"
            left={props => <List.Icon {...props} icon="whatsapp" color="#25D366" />}
            right={props => (
              <Switch
                value={groupSettings.defaultChannels.includes('whatsapp')}
                onValueChange={value => {
                  const channels = [...groupSettings.defaultChannels];
                  if (value) {
                    if (!channels.includes('whatsapp')) channels.push('whatsapp');
                  } else {
                    const index = channels.indexOf('whatsapp');
                    if (index !== -1) channels.splice(index, 1);
                  }
                  setGroupSettings(prev => ({
                    ...prev,
                    defaultChannels: channels
                  }));
                }}
                disabled={saving}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Payment Notification Settings</Title>
          
          <List.Item
            title="Send Payment Reminders"
            description="Automatically send payment reminders to group members"
            left={props => <List.Icon {...props} icon="calendar-clock" />}
            right={props => (
              <Switch
                value={groupSettings.sendPaymentReminders}
                onValueChange={value => 
                  setGroupSettings(prev => ({
                    ...prev,
                    sendPaymentReminders: value
                  }))
                }
                disabled={saving}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Notify About Defaulters"
            description="Notify all members when someone misses a payment"
            left={props => <List.Icon {...props} icon="account-alert" />}
            right={props => (
              <Switch
                value={groupSettings.sendDefaulterNotifications}
                onValueChange={value => 
                  setGroupSettings(prev => ({
                    ...prev,
                    sendDefaulterNotifications: value
                  }))
                }
                disabled={saving}
              />
            )}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="Allow Member Opt-Out"
            description="Allow members to opt out of group notifications"
            left={props => <List.Icon {...props} icon="account-cancel" />}
            right={props => (
              <Switch
                value={groupSettings.allowMemberOptOut}
                onValueChange={value => 
                  setGroupSettings(prev => ({
                    ...prev,
                    allowMemberOptOut: value
                  }))
                }
                disabled={saving}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Button
        mode="contained"
        onPress={handleSaveGroupSettings}
        style={styles.saveButton}
        loading={saving}
        disabled={saving}
      >
        Save Group Settings
      </Button>
    </View>
  );

  const renderWhatsAppDialog = () => (
    <Portal>
      <Dialog
        visible={showWhatsAppDialog}
        onDismiss={() => !connectingWhatsApp && setShowWhatsAppDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Connect WhatsApp</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogInfo}>
            Enter your WhatsApp phone number with country code to receive notifications.
          </Paragraph>
          
          <TextInput
            label="WhatsApp Number"
            value={phoneNumber}
            onChangeText={text => {
              setPhoneNumber(text);
              setPhoneNumberError(null);
            }}
            mode="outlined"
            keyboardType="phone-pad"
            placeholder="+1234567890"
            style={styles.input}
            error={!!phoneNumberError}
            disabled={connectingWhatsApp}
          />
          {phoneNumberError && (
            <HelperText type="error">{phoneNumberError}</HelperText>
          )}
          
          <Paragraph style={styles.dialogNote}>
            We will send a one-time verification code to this WhatsApp number.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button 
            onPress={() => setShowWhatsAppDialog(false)}
            disabled={connectingWhatsApp}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleConnectWhatsApp}
            loading={connectingWhatsApp}
            disabled={connectingWhatsApp}
          >
            Connect
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderOTPDialog = () => (
    <Portal>
      <Dialog
        visible={showOTPDialog}
        onDismiss={() => !connectingWhatsApp && setShowOTPDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Verify WhatsApp</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogInfo}>
            Enter the 6-digit verification code sent to your WhatsApp number.
          </Paragraph>
          
          <TextInput
            label="Verification Code"
            value={otpCode}
            onChangeText={text => {
              setOTPCode(text);
              setOTPError(null);
            }}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            error={!!otpError}
            disabled={connectingWhatsApp}
          />
          {otpError && (
            <HelperText type="error">{otpError}</HelperText>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button 
            onPress={() => {
              setShowOTPDialog(false);
              setShowWhatsAppDialog(true);
            }}
            disabled={connectingWhatsApp}
          >
            Back
          </Button>
          <Button 
            mode="contained" 
            onPress={handleVerifyOTP}
            loading={connectingWhatsApp}
            disabled={connectingWhatsApp}
          >
            Verify
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading notification settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {isGroupSettings ? 'Group Notification Settings' : 'Notification Settings'}
          </Text>
          <Text style={styles.subtitle}>
            {isGroupSettings 
              ? 'Configure how members receive notifications from this group'
              : 'Manage how you receive notifications from the app'
            }
          </Text>
        </View>
        
        {isGroupSettings ? renderGroupSettings() : renderUserPreferences()}
      </View>
      
      {renderWhatsAppDialog()}
      {renderOTPDialog()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 4,
  },
  whatsappButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectButton: {
    marginVertical: 4,
  },
  saveButton: {
    marginVertical: 24,
  },
  dialog: {
    borderRadius: 8,
  },
  dialogInfo: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  dialogNote: {
    marginTop: 8,
    fontStyle: 'italic',
    fontSize: 12,
    color: '#666',
  },
});

export default NotificationSettingsScreen;
