import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Switch,
  Dimensions,
  Alert,
  Animated
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Portal,
  Modal,
  Searchbar,
  ProgressBar,
  IconButton,
  List,
  Checkbox,
  Chip
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import {
  getTutorials,
  getOnboardingProgress,
  getDashboardWidgets,
  getNotificationSettings,
  getFeatureFlags,
  markTutorialComplete,
  updateDashboardLayout,
  updateNotificationSettings,
  enableFeature
} from '../../services/api/user-experience';

const { width } = Dimensions.get('window');

const OnboardingUserExperience = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tutorials');
  const [tutorials, setTutorials] = useState([]);
  const [onboardingProgress, setOnboardingProgress] = useState(null);
  const [dashboardWidgets, setDashboardWidgets] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState([]);
  const [featureFlags, setFeatureFlags] = useState([]);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingDashboard, setEditingDashboard] = useState(false);
  
  const tutorialScrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    if (showTutorialModal) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [showTutorialModal, tutorialStep]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch tutorials
      const tutorialsData = await getTutorials();
      setTutorials(tutorialsData);
      
      // Fetch onboarding progress
      const progressData = await getOnboardingProgress(user.id);
      setOnboardingProgress(progressData);
      
      // Fetch dashboard widgets
      const widgetsData = await getDashboardWidgets(user.id);
      setDashboardWidgets(widgetsData);
      
      // Fetch notification settings
      const notificationsData = await getNotificationSettings(user.id);
      setNotificationSettings(notificationsData);
      
      // Fetch feature flags
      const flagsData = await getFeatureFlags(user.id);
      setFeatureFlags(flagsData);
    } catch (error) {
      console.error('Error fetching user experience data:', error);
      Alert.alert('Error', 'Failed to load user experience data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    // In a real app, you would filter content based on the search query
  };

  const handleStartTutorial = (tutorial) => {
    setSelectedTutorial(tutorial);
    setTutorialStep(0);
    setShowTutorialModal(true);
  };

  const handleNextTutorialStep = () => {
    if (tutorialStep < selectedTutorial.steps.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => {
        setTutorialStep(tutorialStep + 1);
        
        // Scroll to the top when changing steps
        if (tutorialScrollRef.current) {
          tutorialScrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }).start();
      });
    } else {
      // Tutorial completed
      handleCompleteTutorial();
    }
  };

  const handlePreviousTutorialStep = () => {
    if (tutorialStep > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => {
        setTutorialStep(tutorialStep - 1);
        
        // Scroll to the top when changing steps
        if (tutorialScrollRef.current) {
          tutorialScrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }).start();
      });
    }
  };

  const handleCompleteTutorial = async () => {
    try {
      await markTutorialComplete(user.id, selectedTutorial.id);
      
      // Update local tutorials data
      setTutorials(tutorials.map(tutorial => 
        tutorial.id === selectedTutorial.id 
          ? { ...tutorial, completed: true } 
          : tutorial
      ));
      
      // Close tutorial modal
      setShowTutorialModal(false);
      setSelectedTutorial(null);
      setTutorialStep(0);
      
      // Update onboarding progress
      const progressData = await getOnboardingProgress(user.id);
      setOnboardingProgress(progressData);
      
      Alert.alert('Success', 'Tutorial completed! You earned points for your progress.');
    } catch (error) {
      console.error('Error marking tutorial as complete:', error);
      Alert.alert('Error', 'Failed to mark tutorial as complete. Please try again.');
    }
  };

  const handleToggleWidget = (widgetId) => {
    // Update local dashboard widgets data
    setDashboardWidgets(dashboardWidgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, enabled: !widget.enabled } 
        : widget
    ));
  };

  const handleSaveDashboard = async () => {
    try {
      await updateDashboardLayout(user.id, dashboardWidgets);
      setEditingDashboard(false);
      Alert.alert('Success', 'Dashboard layout saved successfully.');
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
      Alert.alert('Error', 'Failed to save dashboard layout. Please try again.');
    }
  };

  const handleToggleNotification = async (settingId) => {
    try {
      // Update local notification settings data
      const updatedSettings = notificationSettings.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled } 
          : setting
      );
      
      setNotificationSettings(updatedSettings);
      
      // Update notification settings on the server
      await updateNotificationSettings(user.id, updatedSettings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings. Please try again.');
      
      // Revert the change if there's an error
      fetchData();
    }
  };

  const handleEnableFeature = async (featureId) => {
    try {
      await enableFeature(user.id, featureId);
      
      // Update local feature flags data
      setFeatureFlags(featureFlags.map(feature => 
        feature.id === featureId 
          ? { ...feature, enabled: true } 
          : feature
      ));
      
      Alert.alert('Success', 'Feature enabled successfully.');
    } catch (error) {
      console.error('Error enabling feature:', error);
      Alert.alert('Error', 'Failed to enable feature. Please try again.');
    }
  };

  const renderTutorialModal = () => (
    <Portal>
      <Modal 
        visible={showTutorialModal} 
        dismissable={true}
        onDismiss={() => setShowTutorialModal(false)}
        contentContainerStyle={styles.tutorialModal}
      >
        {selectedTutorial && (
          <View style={styles.tutorialContainer}>
            <View style={styles.tutorialHeader}>
              <Text style={styles.tutorialTitle}>{selectedTutorial.title}</Text>
              <IconButton 
                icon="close" 
                size={24} 
                onPress={() => setShowTutorialModal(false)} 
              />
            </View>
            
            <View style={styles.tutorialProgress}>
              <Text style={styles.stepIndicator}>
                Step {tutorialStep + 1} of {selectedTutorial.steps.length}
              </Text>
              <ProgressBar 
                progress={(tutorialStep + 1) / selectedTutorial.steps.length} 
                color={theme.colors.primary}
                style={styles.tutorialProgressBar}
              />
            </View>
            
            <ScrollView 
              ref={tutorialScrollRef}
              style={styles.tutorialContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View style={[styles.tutorialStep, { opacity: fadeAnim }]}>
                <Text style={styles.stepTitle}>
                  {selectedTutorial.steps[tutorialStep].title}
                </Text>
                
                {selectedTutorial.steps[tutorialStep].image && (
                  <Image 
                    source={{ uri: selectedTutorial.steps[tutorialStep].image }} 
                    style={styles.stepImage}
                    resizeMode="contain"
                  />
                )}
                
                <Text style={styles.stepDescription}>
                  {selectedTutorial.steps[tutorialStep].description}
                </Text>
                
                {selectedTutorial.steps[tutorialStep].tips && (
                  <View style={styles.stepTips}>
                    <Text style={styles.tipsTitle}>Tips:</Text>
                    {selectedTutorial.steps[tutorialStep].tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <Icon name="lightbulb-on" size={16} color="#FFC107" style={styles.tipIcon} />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Animated.View>
            </ScrollView>
            
            <View style={styles.tutorialActions}>
              <Button 
                mode="text" 
                onPress={handlePreviousTutorialStep}
                disabled={tutorialStep === 0}
              >
                Previous
              </Button>
              <Button 
                mode="contained" 
                onPress={handleNextTutorialStep}
              >
                {tutorialStep < selectedTutorial.steps.length - 1 ? 'Next' : 'Complete'}
              </Button>
            </View>
          </View>
        )}
      </Modal>
    </Portal>
  );

  const renderTutorialsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Onboarding Progress Card */}
      {onboardingProgress && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.onboardingHeader}>
              <View>
                <Title style={styles.cardTitle}>Onboarding Progress</Title>
                <Paragraph style={styles.onboardingDescription}>
                  Complete the recommended steps to get the most out of the platform
                </Paragraph>
              </View>
              
              <View style={styles.onboardingScoreBadge}>
                <Text style={styles.onboardingScoreText}>{onboardingProgress.completedSteps}</Text>
                <Text style={styles.onboardingScoreTotal}>/{onboardingProgress.totalSteps}</Text>
              </View>
            </View>
            
            <View style={styles.overallProgressContainer}>
              <Text style={styles.overallProgressText}>
                {Math.round((onboardingProgress.completedSteps / onboardingProgress.totalSteps) * 100)}% Complete
              </Text>
              <ProgressBar 
                progress={onboardingProgress.completedSteps / onboardingProgress.totalSteps} 
                color={theme.colors.primary}
                style={styles.overallProgressBar}
              />
            </View>
            
            <View style={styles.onboardingCategories}>
              {onboardingProgress.categories.map((category) => (
                <View key={category.id} style={styles.onboardingCategory}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryTitleContainer}>
                      <Icon 
                        name={category.icon} 
                        size={20} 
                        color={theme.colors.primary} 
                        style={styles.categoryIcon}
                      />
                      <Text style={styles.categoryTitle}>{category.name}</Text>
                    </View>
                    <Text style={styles.categoryProgress}>
                      {category.completed}/{category.total}
                    </Text>
                  </View>
                  
                  <ProgressBar 
                    progress={category.completed / category.total} 
                    color={theme.colors.primary}
                    style={styles.categoryProgressBar}
                  />
                </View>
              ))}
            </View>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              icon="play"
              onPress={() => navigation.navigate('GuidedOnboarding')}
            >
              Continue Onboarding
            </Button>
          </Card.Actions>
        </Card>
      )}
      
      {/* Tutorials Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Interactive Tutorials</Title>
          <Paragraph style={styles.tutorialsDescription}>
            Learn how to use the platform with step-by-step guides
          </Paragraph>
          
          <Searchbar
            placeholder="Search tutorials..."
            onChangeText={onSearch}
            value={searchQuery}
            style={styles.tutorialSearchBar}
          />
          
          <View style={styles.tutorialFilters}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Chip 
                selected={true} 
                style={styles.filterChip}
                onPress={() => console.log('All tutorials')}
              >
                All
              </Chip>
              <Chip 
                selected={false} 
                style={styles.filterChip}
                onPress={() => console.log('New tutorials')}
              >
                New
              </Chip>
              <Chip 
                selected={false} 
                style={styles.filterChip}
                onPress={() => console.log('Recommended tutorials')}
              >
                Recommended
              </Chip>
              <Chip 
                selected={false} 
                style={styles.filterChip}
                onPress={() => console.log('Basic tutorials')}
              >
                Basic
              </Chip>
              <Chip 
                selected={false} 
                style={styles.filterChip}
                onPress={() => console.log('Advanced tutorials')}
              >
                Advanced
              </Chip>
            </ScrollView>
          </View>
          
          <View style={styles.tutorialsList}>
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} style={styles.tutorialCard}>
                <Card.Cover source={{ uri: tutorial.coverImage }} style={styles.tutorialCover} />
                {tutorial.completed && (
                  <View style={styles.completedBadge}>
                    <Icon name="check-circle" size={20} color="#fff" />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                )}
                <Card.Content style={styles.tutorialCardContent}>
                  <Title style={styles.tutorialCardTitle}>{tutorial.title}</Title>
                  <Paragraph style={styles.tutorialCardDescription} numberOfLines={2}>
                    {tutorial.description}
                  </Paragraph>
                  
                  <View style={styles.tutorialMeta}>
                    <View style={styles.tutorialMetaItem}>
                      <Icon name="clock-outline" size={16} color="#666" />
                      <Text style={styles.tutorialMetaText}>{tutorial.duration}</Text>
                    </View>
                    <View style={styles.tutorialMetaItem}>
                      <Icon name="school" size={16} color="#666" />
                      <Text style={styles.tutorialMetaText}>{tutorial.level}</Text>
                    </View>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    mode={tutorial.completed ? "outlined" : "contained"} 
                    onPress={() => handleStartTutorial(tutorial)}
                  >
                    {tutorial.completed ? 'Review' : 'Start'}
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
  const renderDashboardTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Dashboard Preview Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.dashboardHeader}>
            <Title style={styles.cardTitle}>Personalized Dashboard</Title>
            <Button 
              mode={editingDashboard ? "outlined" : "contained"} 
              icon={editingDashboard ? "check" : "pencil"}
              onPress={() => {
                if (editingDashboard) {
                  handleSaveDashboard();
                } else {
                  setEditingDashboard(true);
                }
              }}
            >
              {editingDashboard ? 'Save Layout' : 'Customize'}
            </Button>
          </View>
          <Paragraph style={styles.dashboardDescription}>
            {editingDashboard 
              ? 'Toggle widgets on or off to customize your dashboard' 
              : 'Your personalized dashboard shows the information most relevant to you'}
          </Paragraph>
          
          <View style={styles.dashboardPreview}>
            {dashboardWidgets.map((widget) => (
              <View 
                key={widget.id} 
                style={[
                  styles.dashboardWidget,
                  { 
                    opacity: editingDashboard && !widget.enabled ? 0.5 : 1,
                    width: widget.size === 'large' ? '100%' : '48%'
                  }
                ]}
              >
                <View style={styles.widgetHeader}>
                  <View style={styles.widgetTitleContainer}>
                    <Icon name={widget.icon} size={20} color={theme.colors.primary} />
                    <Text style={styles.widgetTitle}>{widget.title}</Text>
                  </View>
                  {editingDashboard && (
                    <Switch
                      value={widget.enabled}
                      onValueChange={() => handleToggleWidget(widget.id)}
                      color={theme.colors.primary}
                    />
                  )}
                </View>
                
                <View style={styles.widgetContent}>
                  {/* Widget content would be rendered here based on widget type */}
                  <Text style={styles.widgetPlaceholder}>Widget Content</Text>
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
        
        {editingDashboard && (
          <Card.Actions>
            <Button 
              mode="text" 
              onPress={() => setEditingDashboard(false)}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSaveDashboard}
            >
              Save Changes
            </Button>
          </Card.Actions>
        )}
      </Card>
      
      {/* Quick Access Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Quick Access</Title>
          <Paragraph style={styles.quickAccessDescription}>
            Customize shortcuts to your most frequently used features
          </Paragraph>
          
          <View style={styles.quickAccessGrid}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <TouchableOpacity key={item} style={styles.quickAccessItem}>
                <View style={styles.quickAccessIcon}>
                  <Icon 
                    name={
                      item === 1 ? "bank-transfer" :
                      item === 2 ? "account-cash" :
                      item === 3 ? "chart-line" :
                      item === 4 ? "calendar-check" :
                      item === 5 ? "account-group" :
                      "cog"
                    } 
                    size={24} 
                    color="#fff" 
                  />
                </View>
                <Text style={styles.quickAccessText}>
                  {item === 1 ? "Transfer Funds" :
                   item === 2 ? "Pay Loan" :
                   item === 3 ? "Financial Report" :
                   item === 4 ? "Schedule Meeting" :
                   item === 5 ? "Member Directory" :
                   "Settings"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="outlined" 
            icon="pencil"
            onPress={() => navigation.navigate('EditQuickAccess')}
          >
            Edit Shortcuts
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );

  const renderNotificationsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Notification Settings Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Notification Preferences</Title>
          <Paragraph style={styles.notificationsDescription}>
            Control which notifications you receive and how they are delivered
          </Paragraph>
          
          <View style={styles.notificationCategories}>
            {notificationSettings.map((category) => (
              <View key={category.id} style={styles.notificationCategory}>
                <Text style={styles.notificationCategoryTitle}>{category.name}</Text>
                
                {category.settings.map((setting) => (
                  <View key={setting.id} style={styles.notificationSetting}>
                    <View style={styles.notificationInfo}>
                      <Text style={styles.notificationTitle}>{setting.title}</Text>
                      <Text style={styles.notificationDescription}>{setting.description}</Text>
                    </View>
                    <Switch
                      value={setting.enabled}
                      onValueChange={() => handleToggleNotification(setting.id)}
                      color={theme.colors.primary}
                    />
                  </View>
                ))}
                
                <Divider style={styles.notificationDivider} />
              </View>
            ))}
          </View>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="outlined" 
            icon="bell-off"
            onPress={() => Alert.alert('Disable All', 'Are you sure you want to disable all notifications?')}
          >
            Disable All
          </Button>
          <Button 
            mode="outlined" 
            icon="bell"
            onPress={() => Alert.alert('Reset', 'Are you sure you want to reset to default notification settings?')}
          >
            Reset to Default
          </Button>
        </Card.Actions>
      </Card>
      
      {/* Delivery Methods Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Delivery Methods</Title>
          <Paragraph style={styles.deliveryDescription}>
            Choose how you want to receive different types of notifications
          </Paragraph>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Notification Type</DataTable.Title>
              <DataTable.Title style={styles.centerColumn}>In-App</DataTable.Title>
              <DataTable.Title style={styles.centerColumn}>Email</DataTable.Title>
              <DataTable.Title style={styles.centerColumn}>SMS</DataTable.Title>
            </DataTable.Header>
            
            <DataTable.Row>
              <DataTable.Cell>Transaction Alerts</DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="checked" 
                  onPress={() => console.log('Toggle in-app for transactions')}
                />
              </DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="checked" 
                  onPress={() => console.log('Toggle email for transactions')}
                />
              </DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="checked" 
                  onPress={() => console.log('Toggle SMS for transactions')}
                />
              </DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Meeting Reminders</DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="checked" 
                  onPress={() => console.log('Toggle in-app for meetings')}
                />
              </DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="checked" 
                  onPress={() => console.log('Toggle email for meetings')}
                />
              </DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="unchecked" 
                  onPress={() => console.log('Toggle SMS for meetings')}
                />
              </DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Payment Reminders</DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="checked" 
                  onPress={() => console.log('Toggle in-app for payments')}
                />
              </DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="checked" 
                  onPress={() => console.log('Toggle email for payments')}
                />
              </DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="checked" 
                  onPress={() => console.log('Toggle SMS for payments')}
                />
              </DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>System Updates</DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="checked" 
                  onPress={() => console.log('Toggle in-app for system')}
                />
              </DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="unchecked" 
                  onPress={() => console.log('Toggle email for system')}
                />
              </DataTable.Cell>
              <DataTable.Cell style={styles.centerColumn}>
                <Checkbox 
                  status="unchecked" 
                  onPress={() => console.log('Toggle SMS for system')}
                />
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderFeaturesTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Feature Flags Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Early Access Features</Title>
          <Paragraph style={styles.featuresDescription}>
            Try out new features before they're released to everyone
          </Paragraph>
          
          <View style={styles.featuresList}>
            {featureFlags.map((feature) => (
              <View key={feature.id} style={styles.featureItem}>
                <View style={styles.featureInfo}>
                  <View style={styles.featureHeader}>
                    <Text style={styles.featureTitle}>{feature.name}</Text>
                    <Chip 
                      style={[
                        styles.featureStatus,
                        { backgroundColor: feature.status === 'beta' ? 'rgba(255, 193, 7, 0.1)' : 'rgba(76, 175, 80, 0.1)' }
                      ]}
                    >
                      {feature.status === 'beta' ? 'Beta' : 'Preview'}
                    </Chip>
                  </View>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                  
                  {feature.enabled ? (
                    <View style={styles.featureEnabled}>
                      <Icon name="check-circle" size={16} color="#4CAF50" />
                      <Text style={styles.featureEnabledText}>Enabled</Text>
                    </View>
                  ) : (
                    <Button 
                      mode="outlined" 
                      onPress={() => handleEnableFeature(feature.id)}
                      style={styles.enableFeatureButton}
                    >
                      Enable Feature
                    </Button>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
      
      {/* User Feedback Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Provide Feedback</Title>
          <Paragraph style={styles.feedbackDescription}>
            Your input helps us improve the platform and develop new features
          </Paragraph>
          
          <View style={styles.feedbackOptions}>
            <TouchableOpacity 
              style={styles.feedbackOption}
              onPress={() => navigation.navigate('FeatureRequest')}
            >
              <Icon name="lightbulb-on" size={36} color={theme.colors.primary} style={styles.feedbackIcon} />
              <Text style={styles.feedbackOptionTitle}>Suggest Feature</Text>
              <Text style={styles.feedbackOptionDescription}>
                Share your ideas for new features or improvements
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.feedbackOption}
              onPress={() => navigation.navigate('ReportIssue')}
            >
              <Icon name="bug" size={36} color="#F44336" style={styles.feedbackIcon} />
              <Text style={styles.feedbackOptionTitle}>Report Issue</Text>
              <Text style={styles.feedbackOptionDescription}>
                Let us know if you encounter any problems
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.feedbackOption}
              onPress={() => navigation.navigate('SatisfactionSurvey')}
            >
              <Icon name="star" size={36} color="#FFC107" style={styles.feedbackIcon} />
              <Text style={styles.feedbackOptionTitle}>Rate Experience</Text>
              <Text style={styles.feedbackOptionDescription}>
                Tell us about your experience with the platform
              </Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading user experience settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personalization</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>
      
      {/* Tab Menu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tutorials' && styles.activeTab]}
          onPress={() => setActiveTab('tutorials')}
        >
          <Icon 
            name="school" 
            size={24} 
            color={activeTab === 'tutorials' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'tutorials' && styles.activeTabText
            ]}
          >
            Tutorials
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Icon 
            name="view-dashboard" 
            size={24} 
            color={activeTab === 'dashboard' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'dashboard' && styles.activeTabText
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
        >
          <Icon 
            name="bell" 
            size={24} 
            color={activeTab === 'notifications' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'notifications' && styles.activeTabText
            ]}
          >
            Notifications
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'features' && styles.activeTab]}
          onPress={() => setActiveTab('features')}
        >
          <Icon 
            name="star" 
            size={24} 
            color={activeTab === 'features' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'features' && styles.activeTabText
            ]}
          >
            Features
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {activeTab === 'tutorials' && renderTutorialsTab()}
      {activeTab === 'dashboard' && renderDashboardTab()}
      {activeTab === 'notifications' && renderNotificationsTab()}
      {activeTab === 'features' && renderFeaturesTab()}
      
      {/* Tutorial Modal */}
      {renderTutorialModal()}
    </View>
  );
  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
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
  header: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    paddingTop: 48,
    paddingBottom: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666'
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  tabContent: {
    padding: 16
  },
  card: {
    marginBottom: 16,
    borderRadius: 8
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8
  },
  onboardingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  onboardingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  onboardingScoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  onboardingScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  onboardingScoreTotal: {
    fontSize: 14,
    color: '#666'
  },
  overallProgressContainer: {
    marginBottom: 16
  },
  overallProgressText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'right'
  },
  overallProgressBar: {
    height: 8,
    borderRadius: 4
  },
  onboardingCategories: {
    marginTop: 8
  },
  onboardingCategory: {
    marginBottom: 12
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  categoryIcon: {
    marginRight: 8
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  categoryProgress: {
    fontSize: 14,
    color: '#666'
  },
  categoryProgressBar: {
    height: 6,
    borderRadius: 3
  },
  tutorialsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  tutorialSearchBar: {
    marginBottom: 12,
    elevation: 0,
    backgroundColor: '#f5f5f5'
  },
  tutorialFilters: {
    marginBottom: 16
  },
  filterChip: {
    marginRight: 8
  },
  tutorialsList: {
    
  },
  tutorialCard: {
    marginBottom: 12
  },
  tutorialCover: {
    height: 150
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center'
  },
  completedText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500'
  },
  tutorialCardContent: {
    paddingVertical: 12
  },
  tutorialCardTitle: {
    fontSize: 16
  },
  tutorialCardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  tutorialMeta: {
    flexDirection: 'row',
    marginTop: 8
  },
  tutorialMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  tutorialMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  tutorialModal: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    borderRadius: 12,
    maxHeight: '80%'
  },
  tutorialContainer: {
    paddingTop: 16
  },
  tutorialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  tutorialProgress: {
    paddingHorizontal: 16,
    marginBottom: 16
  },
  stepIndicator: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center'
  },
  tutorialProgressBar: {
    height: 6,
    borderRadius: 3
  },
  tutorialContent: {
    paddingHorizontal: 16,
    maxHeight: 400
  },
  tutorialStep: {
    paddingBottom: 16
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12
  },
  stepImage: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8
  },
  stepDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16
  },
  stepTips: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2
  },
  tipText: {
    fontSize: 14,
    flex: 1
  },
  tutorialActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  dashboardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  dashboardPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  dashboardWidget: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  widgetTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8
  },
  widgetContent: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  widgetPlaceholder: {
    fontSize: 14,
    color: '#9E9E9E'
  },
  quickAccessDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  quickAccessItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16
  },
  quickAccessIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  quickAccessText: {
    fontSize: 12,
    textAlign: 'center'
  },
  notificationsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  notificationCategories: {
    
  },
  notificationCategory: {
    marginBottom: 16
  },
  notificationCategoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  notificationSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  notificationDescription: {
    fontSize: 12,
    color: '#666'
  },
  notificationDivider: {
    marginTop: 8
  },
  deliveryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  centerColumn: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  featuresDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  featuresList: {
    
  },
  featureItem: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden'
  },
  featureInfo: {
    padding: 16
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  featureStatus: {
    height: 24
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  featureEnabled: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  featureEnabledText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 6
  },
  enableFeatureButton: {
    alignSelf: 'flex-start'
  },
  feedbackDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  feedbackOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  feedbackOption: {
    width: '32%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center'
  },
  feedbackIcon: {
    marginBottom: 8
  },
  feedbackOptionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center'
  },
  feedbackOptionDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  }
});

export default OnboardingUserExperience;