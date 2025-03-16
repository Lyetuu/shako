import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  List,
  Divider,
  Avatar,
  Dialog,
  Portal,
  TextInput
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import {
  getUserSecuritySettings,
  updateBiometricSettings,
  updateMfaSettings,
  getComplianceRequirements,
  getUserSecurityLog
} from '../../services/api/security';

const SecuritySettings = () => {
  const [loading, setLoading] = useState(true);
  const [securitySettings, setSecuritySettings] = useState(null);
  const [complianceRequirements, setComplianceRequirements] = useState([]);
  const [securityLog, setSecurityLog] = useState([]);
  const [showMfaDialog, setShowMfaDialog] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [showBiometricDialog, setShowBiometricDialog] = useState(false);
  
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user security settings
      const settings = await getUserSecuritySettings(user.id);
      setSecuritySettings(settings);
      
      // Fetch compliance requirements
      const requirements = await getComplianceRequirements();
      setComplianceRequirements(requirements);
      
      // Fetch security log
      const log = await getUserSecurityLog(user.id);
      setSecurityLog(log);
    } catch (error) {
      console.error('Error fetching security settings:', error);
      Alert.alert('Error', 'Failed to load security settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBiometric = async (type, value) => {
    try {
      if (value) {
        // Show dialog to set up biometric authentication
        setShowBiometricDialog(true);
      } else {
        // Disable biometric authentication
        await updateBiometricSettings(user.id, type, false);
        
        // Update local state
        setSecuritySettings({
          ...securitySettings,
          biometricSettings: {
            ...securitySettings.biometricSettings,
            [type]: false
          }
        });
        
        Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} authentication disabled.`);
      }
    } catch (error) {
      console.error('Error updating biometric settings:', error);
      Alert.alert('Error', 'Failed to update biometric settings. Please try again.');
    }
  };

  const handleSetupBiometric = async () => {
    try {
      // In a real app, this would trigger native biometric setup
      // For this mockup, we'll just simulate success
      
      // Close dialog
      setShowBiometricDialog(false);
      
      // Update local state (assuming fingerprint is being setup)
      setSecuritySettings({
        ...securitySettings,
        biometricSettings: {
          ...securitySettings.biometricSettings,
          fingerprint: true
        }
      });
      
      Alert.alert('Success', 'Biometric authentication has been enabled.');
    } catch (error) {
      console.error('Error setting up biometric:', error);
      Alert.alert('Error', 'Failed to set up biometric authentication. Please try again.');
    }
  };

  const handleToggleMfa = async (type, value) => {
    try {
      if (value) {
        // Show dialog to set up MFA
        setShowMfaDialog(true);
      } else {
        // Disable MFA
        await updateMfaSettings(user.id, type, false);
        
        // Update local state
        setSecuritySettings({
          ...securitySettings,
          mfaSettings: {
            ...securitySettings.mfaSettings,
            [type]: false
          }
        });
        
        Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} MFA disabled.`);
      }
    } catch (error) {
      console.error('Error updating MFA settings:', error);
      Alert.alert('Error', 'Failed to update MFA settings. Please try again.');
    }
  };

  const handleSetupMfa = async () => {
    try {
      if (mfaCode.trim() === '') {
        Alert.alert('Error', 'Please enter the verification code.');
        return;
      }
      
      // In a real app, this would validate the MFA code
      // For this mockup, we'll just simulate success
      
      // Close dialog
      setShowMfaDialog(false);
      setMfaCode('');
      
      // Update local state (assuming SMS MFA is being setup)
      setSecuritySettings({
        ...securitySettings,
        mfaSettings: {
          ...securitySettings.mfaSettings,
          sms: true
        }
      });
      
      Alert.alert('Success', 'Multi-factor authentication has been enabled.');
    } catch (error) {
      console.error('Error setting up MFA:', error);
      Alert.alert('Error', 'Failed to set up multi-factor authentication. Please try again.');
    }
  };

  const renderMfaDialog = () => (
    <Portal>
      <Dialog visible={showMfaDialog} onDismiss={() => setShowMfaDialog(false)}>
        <Dialog.Title>Set Up Multi-Factor Authentication</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            We've sent a verification code to your phone. Please enter it below to complete setup.
          </Paragraph>
          <TextInput
            label="Verification Code"
            value={mfaCode}
            onChangeText={setMfaCode}
            keyboardType="number-pad"
            style={styles.textInput}
            maxLength={6}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowMfaDialog(false)}>Cancel</Button>
          <Button onPress={handleSetupMfa}>Verify</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderBiometricDialog = () => (
    <Portal>
      <Dialog visible={showBiometricDialog} onDismiss={() => setShowBiometricDialog(false)}>
        <Dialog.Title>Set Up Biometric Authentication</Dialog.Title>
        <Dialog.Content>
          <View style={styles.biometricDialogContent}>
            <Icon name="fingerprint" size={60} color={theme.colors.primary} />
            <Paragraph style={styles.biometricText}>
              Use your fingerprint for faster, easier access to your account.
            </Paragraph>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowBiometricDialog(false)}>Cancel</Button>
          <Button onPress={handleSetupBiometric}>Set Up</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading security settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Security Status Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.securityStatusHeader}>
              <View>
                <Title style={styles.cardTitle}>Security Status</Title>
                <Paragraph style={styles.securityStatusScore}>
                  Score: {securitySettings.securityScore}/100
                </Paragraph>
              </View>
              
              <View 
                style={[
                  styles.securityScoreBadge,
                  securitySettings.securityScore >= 80 ? styles.highSecurityBadge :
                  securitySettings.securityScore >= 50 ? styles.mediumSecurityBadge :
                  styles.lowSecurityBadge
                ]}
              >
                <Text style={styles.securityScoreBadgeText}>
                  {securitySettings.securityScore >= 80 ? 'High' :
                   securitySettings.securityScore >= 50 ? 'Medium' :
                   'Low'}
                </Text>
              </View>
            </View>
            
            <View style={styles.securityRecommendations}>
              {securitySettings.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Icon 
                    name="alert-circle" 
                    size={20} 
                    color="#FFC107" 
                    style={styles.recommendationIcon}
                  />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
        
        {/* Biometric Authentication Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Biometric Authentication</Title>
            <Paragraph style={styles.cardDescription}>
              Use biometric methods for more secure and convenient authentication.
            </Paragraph>
            
            <List.Item
              title="Fingerprint Authentication"
              description="Use your fingerprint to login and approve sensitive transactions"
              left={props => <List.Icon {...props} icon="fingerprint" />}
              right={props => (
                <Switch
                  value={securitySettings.biometricSettings.fingerprint}
                  onValueChange={(value) => handleToggleBiometric('fingerprint', value)}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Face ID Authentication"
              description="Use facial recognition to login and approve sensitive transactions"
              left={props => <List.Icon {...props} icon="face-recognition" />}
              right={props => (
                <Switch
                  value={securitySettings.biometricSettings.faceId}
                  onValueChange={(value) => handleToggleBiometric('faceId', value)}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>
        
        {/* Multi-Factor Authentication Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Multi-Factor Authentication</Title>
            <Paragraph style={styles.cardDescription}>
              Add an extra layer of security with multi-factor authentication.
            </Paragraph>
            
            <List.Item
              title="SMS Verification"
              description="Receive verification codes via text message"
              left={props => <List.Icon {...props} icon="message-text" />}
              right={props => (
                <Switch
                  value={securitySettings.mfaSettings.sms}
                  onValueChange={(value) => handleToggleMfa('sms', value)}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Email Verification"
              description="Receive verification codes via email"
              left={props => <List.Icon {...props} icon="email" />}
              right={props => (
                <Switch
                  value={securitySettings.mfaSettings.email}
                  onValueChange={(value) => handleToggleMfa('email', value)}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
            
            <Divider />
            
            <List.Item
              title="Authenticator App"
              description="Use an authenticator app for verification codes"
              left={props => <List.Icon {...props} icon="cellphone-key" />}
              right={props => (
                <Switch
                  value={securitySettings.mfaSettings.authenticator}
                  onValueChange={(value) => handleToggleMfa('authenticator', value)}
                  color={theme.colors.primary}
                />
              )}
              style={styles.listItem}
            />
          </Card.Content>
          
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="text" 
              icon="shield-key"
              onPress={() => navigation.navigate('RecoveryCodes')}
            >
              Manage Recovery Codes
            </Button>
          </Card.Actions>
        </Card>
        
        {/* Compliance Requirements Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Compliance Requirements</Title>
            <Paragraph style={styles.cardDescription}>
              Ensure your account meets local financial regulations.
            </Paragraph>
            
            {complianceRequirements.map((requirement, index) => (
              <React.Fragment key={requirement.id}>
                {index > 0 && <Divider />}
                <List.Item
                  title={requirement.title}
                  description={requirement.description}
                  left={props => (
                    <List.Icon 
                      {...props} 
                      icon={requirement.completed ? "check-circle" : "alert-circle-outline"} 
                      color={requirement.completed ? "#4CAF50" : "#FFC107"}
                    />
                  )}
                  right={props => (
                    requirement.completed ? (
                      <Text style={styles.completedText}>Completed</Text>
                    ) : (
                      <Button 
                        mode="text" 
                        onPress={() => navigation.navigate('CompleteRequirement', { requirementId: requirement.id })}
                      >
                        Complete
                      </Button>
                    )
                  )}
                  style={styles.listItem}
                />
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>
        
        {/* Security Log Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Security Activity Log</Title>
            
            {securityLog.slice(0, 5).map((activity, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider />}
                <List.Item
                  title={activity.action}
                  description={`${activity.date} • ${activity.location}`}
                  left={props => (
                    <List.Icon 
                      {...props} 
                      icon={activity.suspicious ? "alert" : "check-circle"} 
                      color={activity.suspicious ? "#F44336" : "#4CAF50"}
                    />
                  )}
                  style={styles.listItem}
                />
              </React.Fragment>
            ))}
          </Card.Content>
          
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="text" 
              icon="history"
              onPress={() => navigation.navigate('SecurityLog')}
            >
              View Full Log
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
      
      {/* Dialogs */}
      {renderMfaDialog()}
      {renderBiometricDialog()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  scrollContent: {
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  card: {
    marginBottom: 16,
    borderRadius: 8
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  cardActions: {
    justifyContent: 'flex-end'
  },
  securityStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  securityStatusScore: {
    fontSize: 16,
    color: '#666'
  },
  securityScoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  highSecurityBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  mediumSecurityBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)'
  },
  lowSecurityBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)'
  },
  securityScoreBadgeText: {
    fontWeight: '500'
  },
  securityRecommendations: {
    marginTop: 8
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8
  },
  recommendationIcon: {
    marginRight: 8
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#666'
  },
  listItem: {
    paddingVertical: 8
  },
  completedText: {
    color: '#4CAF50',
    fontWeight: '500',
    alignSelf: 'center'
  },
  textInput: {
    marginTop: 16
  },
  biometricDialogContent: {
    alignItems: 'center',
    padding: 16
  },
  biometricText: {
    textAlign: 'center',
    marginTop: 16
  }
});

export default SecuritySettings;