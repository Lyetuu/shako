// File: screens/Social/SocialSharingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Share,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Avatar,
  Divider,
  Switch,
  TextInput,
  IconButton,
  ActivityIndicator
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { 
  getSharableAchievements, 
  getSharableProgress,
  updateSharingPreferences 
} from '../../services/api/social';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SocialSharingScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [sharableAchievements, setSharableAchievements] = useState([]);
  const [sharableProgress, setSharableProgress] = useState(null);
  const [sharingPreferences, setSharingPreferences] = useState({
    shareProgress: true,
    shareAchievements: true,
    shareChallenges: true
  });
  const [customMessage, setCustomMessage] = useState('');
  
  useEffect(() => {
    loadSharableContent();
  }, []);
  
  const loadSharableContent = async () => {
    try {
      setLoading(true);
      
      // Load user's achievements and progress
      const [achievements, progress, preferences] = await Promise.all([
        getSharableAchievements(),
        getSharableProgress(),
        updateSharingPreferences() // Get current preferences
      ]);
      
      setSharableAchievements(achievements);
      setSharableProgress(progress);
      setSharingPreferences(preferences);
      
      // Set default custom message
      setCustomMessage(
        `I'm saving with the Group Savings app! Join me and start your savings journey today.`
      );
      
    } catch (error) {
      console.error('Error loading sharable content:', error);
      Alert.alert('Error', 'Failed to load sharable content');
    } finally {
      setLoading(false);
    }
  };
  
  const updateSharingPreference = async (key, value) => {
    try {
      // Update locally for responsive UI
      setSharingPreferences(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Update on server
      await updateSharingPreferences({
        ...sharingPreferences,
        [key]: value
      });
    } catch (error) {
      console.error('Error updating sharing preferences:', error);
      Alert.alert('Error', 'Failed to update sharing preferences');
      
      // Revert on error
      setSharingPreferences(prev => ({
        ...prev,
        [key]: !value
      }));
    }
  };
  
  const shareProgress = async () => {
    const message = `${customMessage}\n\n` +
      `I've saved ${formatCurrency(sharableProgress.totalSaved)} ` +
      `toward my goal of ${formatCurrency(sharableProgress.goalAmount)}. ` +
      `That's ${formatPercentage(sharableProgress.progressPercentage)}! ` +
      `\n\nDownload the app: https://groupsavings.app`;
    
    try {
      const result = await Share.share({
        message,
        title: 'My Savings Progress'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share your progress');
    }
  };
  
  const shareAchievement = async (achievement) => {
    const message = `${customMessage}\n\n` +
      `I just earned the "${achievement.name}" achievement! ` +
      `${achievement.description}\n\n` +
      `Download the app: https://groupsavings.app`;
    
    try {
      const result = await Share.share({
        message,
        title: 'My Savings Achievement'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share your achievement');
    }
  };
  
  const shareInvite = async () => {
    const message = `${customMessage}\n\n` +
      `Join me on Group Savings and let's save together. ` +
      `Use my invite code: ${user.inviteCode}\n\n` +
      `Download the app: https://groupsavings.app/invite/${user.inviteCode}`;
    
    try {
      const result = await Share.share({
        message,
        title: 'Join Me on Group Savings'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share your invite');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      {/* Invite Banner */}
      <Card style={styles.inviteCard}>
        <Card.Content>
          <View style={styles.inviteContent}>
            <View>
              <Title style={styles.inviteTitle}>Invite Friends</Title>
              <Text style={styles.inviteText}>
                Share your invite code with friends and both of you will get a reward when they join!
              </Text>
              <Button 
                mode="contained" 
                onPress={shareInvite}
                style={styles.inviteButton}
                icon="share-variant"
              >
                Share Invite
              </Button>
            </View>
            <Icon name="gift" size={64} color="#6200ee" style={styles.inviteIcon} />
          </View>
          
          <View style={styles.inviteCodeContainer}>
            <Text style={styles.inviteCodeLabel}>Your Invite Code:</Text>
            <View style={styles.inviteCodeWrapper}>
              <Text style={styles.inviteCode}>{user.inviteCode}</Text>
              <IconButton 
                icon="content-copy" 
                size={20} 
                onPress={() => {
                  // Copy to clipboard functionality would go here
                  Alert.alert('Copied', 'Invite code copied to clipboard');
                }}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Sharing Preferences */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Sharing Preferences</Title>
          <Divider style={styles.divider} />
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceName}>Share Progress</Text>
              <Text style={styles.preferenceDescription}>
                Share your savings progress in social posts
              </Text>
            </View>
            <Switch
              value={sharingPreferences.shareProgress}
              onValueChange={(value) => updateSharingPreference('shareProgress', value)}
            />
          </View>
          
          <Divider style={styles.itemDivider} />
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceName}>Share Achievements</Text>
              <Text style={styles.preferenceDescription}>
                Share your achievements in social posts
              </Text>
            </View>
            <Switch
              value={sharingPreferences.shareAchievements}
              onValueChange={(value) => updateSharingPreference('shareAchievements', value)}
            />
          </View>
          
          <Divider style={styles.itemDivider} />
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceName}>Share Challenges</Text>
              <Text style={styles.preferenceDescription}>
                Share your challenge participation and progress
              </Text>
            </View>
            <Switch
              value={sharingPreferences.shareChallenges}
              onValueChange={(value) => updateSharingPreference('shareChallenges', value)}
            />
          </View>
        </Card.Content>
      </Card>
      
      {/* Custom Message */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Customize Your Message</Title>
          <Text style={styles.customMessageDescription}>
            Add a personal touch to your social shares:
          </Text>
          
          <TextInput
            value={customMessage}
            onChangeText={setCustomMessage}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.customMessageInput}
            maxLength={200}
          />
          
          <Text style={styles.customMessageCounter}>
            {customMessage.length}/200 characters
          </Text>
        </Card.Content>
      </Card>
      
      {/* Progress Sharing */}
      {sharableProgress && sharingPreferences.shareProgress && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Share Your Progress</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.progressContainer}>
              <View style={styles.progressStats}>
                <View style={styles.progressStat}>
                  <Text style={styles.progressLabel}>Total Saved</Text>
                  <Text style={styles.progressValue}>{formatCurrency(sharableProgress.totalSaved)}</Text>
                </View>
                
                <View style={styles.progressStat}>
                  <Text style={styles.progressLabel}>Savings Goal</Text>
                  <Text style={styles.progressValue}>{formatCurrency(sharableProgress.goalAmount)}</Text>
                </View>
                
                <View style={styles.progressStat}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressValue}>{formatPercentage(sharableProgress.progressPercentage)}</Text>
                </View>
              </View>
              
              <Button
                mode="contained"
                onPress={shareProgress}
                style={styles.shareButton}
                icon="share-variant"
              >
                Share Progress
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
      
      {/* Achievements Sharing */}
      {sharableAchievements.length > 0 && sharingPreferences.shareAchievements && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Share Your Achievements</Title>
            <Divider style={styles.divider} />
            
            {sharableAchievements.map((achievement, index) => (
              <View key={achievement.id}>
                {index > 0 && <Divider style={styles.achievementDivider} />}
                <View style={styles.achievementItem}>
                  <View style={styles.achievementInfo}>
                    <Avatar.Icon 
                      size={40} 
                      icon={achievement.icon || "trophy"} 
                      style={styles.achievementIcon} 
                    />
                    <View style={styles.achievementDetails}>
                      <Text style={styles.achievementName}>{achievement.name}</Text>
                      <Text style={styles.achievementDescription}>{achievement.description}</Text>
                      <Text style={styles.achievementDate}>
                        Earned on {new Date(achievement.dateEarned).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Button
                    mode="outlined"
                    onPress={() => shareAchievement(achievement)}
                    style={styles.achievementShareButton}
                    icon="share-variant"
                    compact
                  >
                    Share
                  </Button>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
      
      {/* Community Features */}
      <Card style={styles.communityCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Join Our Community</Title>
          <Divider style={styles.divider} />
          
          <Text style={styles.communityDescription}>
            Connect with other savers, share tips, and get motivated in our community forums!
          </Text>
          
          <View style={styles.communityButtons}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Community')}
              style={styles.communityButton}
              icon="forum"
            >
              Community Forums
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => {
                // Open social media links
                Alert.alert('Coming Soon', 'Social media integration coming soon!');
              }}
              style={styles.socialButton}
              icon="account-group"
            >
              Social Media
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
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
  inviteCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#f3e5f5',
  },
  inviteContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inviteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inviteText: {
    fontSize: 14,
    marginVertical: 8,
    maxWidth: '80%',
  },
  inviteButton: {
    alignSelf: 'flex-start',
  },
  inviteIcon: {
    opacity: 0.7,
  },
  inviteCodeContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inviteCodeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  inviteCodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteCode: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceName: {
    fontSize: 16,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#757575',
  },
  itemDivider: {
    marginVertical: 4,
  },
  customMessageDescription: {
    marginTop: 8,
    marginBottom: 12,
  },
  customMessageInput: {
    marginBottom: 4,
  },
  customMessageCounter: {
    fontSize: 12,
    color: '#757575',
    alignSelf: 'flex-end',
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressStat: {
    alignItems: 'center',
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    marginTop: 8,
  },
  achievementDivider: {
    marginVertical: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  achievementInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 16,
  },
  achievementIcon: {
    backgroundColor: '#6200ee',
    marginRight: 12,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  achievementShareButton: {
    borderColor: '#6200ee',
  },
  communityCard: {
    margin: 16,
    marginBottom: 16,
  },
  communityDescription: {
    marginBottom: 16,
  },
  communityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  communityButton: {
    flex: 1,
    marginRight: 8,
  },
  socialButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default SocialSharingScreen;
