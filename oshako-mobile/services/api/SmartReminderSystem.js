import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Dialog,
  Portal,
  TextInput,
  HelperText,
  List,
  Chip,
  ProgressBar,
  IconButton,
  DataTable
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getSmartReminderInsights,
  getOptimalReminderSettings,
  getMemberResponseProfiles,
  getReminderTemplateEffectiveness,
  updateSmartReminderSettings,
  testReminderTemplate,
  generateOptimalCommunicationPlan
} from '../../services/api/smartReminders';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';

const SmartReminderSystem = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [optimalSettings, setOptimalSettings] = useState(null);
  const [memberProfiles, setMemberProfiles] = useState([]);
  const [templateEffectiveness, setTemplateEffectiveness] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');
  const [smartRemindersEnabled, setSmartRemindersEnabled] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(false);
  const [templateText, setTemplateText] = useState('');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  // Get group ID from route params
  const { groupId, groupName } = route.params || {};
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch smart reminder insights
      const insightsData = await getSmartReminderInsights(groupId);
      setInsights(insightsData);
      
      // Fetch optimal reminder settings
      const settingsData = await getOptimalReminderSettings(groupId);
      setOptimalSettings(settingsData);
      setSmartRemindersEnabled(settingsData.enabled);
      
      // Fetch member response profiles
      const profiles = await getMemberResponseProfiles(groupId);
      setMemberProfiles(profiles);
      
      // Fetch template effectiveness data
      const templateData = await getReminderTemplateEffectiveness(groupId);
      setTemplateEffectiveness(templateData);
    } catch (error) {
      console.error('Error fetching smart reminder data:', error);
      Alert.alert('Error', 'Failed to load smart reminder data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleSmartReminders = async (value) => {
    try {
      await updateSmartReminderSettings(groupId, { enabled: value });
      setSmartRemindersEnabled(value);
      Alert.alert(
        value ? 'Smart Reminders Enabled' : 'Smart Reminders Disabled',
        value 
          ? 'The system will now intelligently optimize reminders based on member behavior and preferences.'
          : 'Smart reminders have been disabled. Standard reminder settings will be used instead.'
      );
    } catch (error) {
      console.error('Error toggling smart reminders:', error);
      Alert.alert('Error', 'Failed to update smart reminder settings. Please try again.');
    }
  };
  
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setTemplateText(template.content);
    setEditingTemplate(true);
    setShowTemplateDialog(true);
  };
  
  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setTemplateText(template.content);
    setEditingTemplate(false);
    setShowTemplateDialog(true);
  };
  
  const handleSaveTemplate = async () => {
    try {
      // Update the template content
      await updateSmartReminderSettings(groupId, {
        templateId: selectedTemplate.id,
        templateContent: templateText
      });
      
      // Update local state
      setTemplateEffectiveness(prev => ({
        ...prev,
        templates: prev.templates.map(template => 
          template.id === selectedTemplate.id
            ? { ...template, content: templateText }
            : template
        )
      }));
      
      setShowTemplateDialog(false);
      Alert.alert('Success', 'Template updated successfully');
    } catch (error) {
      console.error('Error saving template:', error);
      Alert.alert('Error', 'Failed to save template. Please try again.');
    }
  };
  
  const handleTestTemplate = async () => {
    try {
      const result = await testReminderTemplate(groupId, {
        templateId: selectedTemplate.id,
        templateContent: templateText
      });
      
      Alert.alert(
        'Template Test Results',
        `Predicted response rate: ${result.predictedResponseRate}%\n\n` +
        `Sentiment analysis: ${result.sentimentScore}/10\n\n` +
        `${result.feedback}`
      );
    } catch (error) {
      console.error('Error testing template:', error);
      Alert.alert('Error', 'Failed to test template. Please try again.');
    }
  };
  
  const handleGenerateCommunicationPlan = async () => {
    setGeneratingPlan(true);
    try {
      await generateOptimalCommunicationPlan(groupId, {
        startDate: scheduledDate
      });
      
      setShowScheduleDialog(false);
      Alert.alert(
        'Communication Plan Generated',
        'An AI-optimized communication plan has been created. Reminders will be scheduled automatically based on member behavior patterns and optimal timing.'
      );
    } catch (error) {
      console.error('Error generating communication plan:', error);
      Alert.alert('Error', 'Failed to generate communication plan. Please try again.');
    } finally {
      setGeneratingPlan(false);
    }
  };
  
  const renderInsightsTab = () => {
    if (!insights) return null;
    
    return (
      <>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>
              Smart Reminder Insights
            </Title>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>AI-Driven Reminders</Text>
              <Switch
                value={smartRemindersEnabled}
                onValueChange={handleToggleSmartReminders}
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.insightMetricsContainer}>
              <View style={styles.insightMetric}>
                <Text style={styles.metricValue}>{insights.responseRateImprovement}%</Text>
                <Text style={styles.metricLabel}>Response Rate Improvement</Text>
              </View>
              
              <View style={styles.insightMetric}>
                <Text style={styles.metricValue}>{insights.averageResponseTime}h</Text>
                <Text style={styles.metricLabel}>Avg. Response Time</Text>
              </View>
              
              <View style={styles.insightMetric}>
                <Text style={styles.metricValue}>{insights.recoveryRateImprovement}%</Text>
                <Text style={styles.metricLabel}>Recovery Improvement</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <Title style={styles.sectionTitle}>Key Insights</Title>
            
            {insights.keyInsights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Icon 
                  name={insight.icon} 
                  size={24} 
                  color={insight.color || theme.colors.primary} 
                  style={styles.insightIcon}
                />
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>
              Optimal Communication Timing
            </Title>
            
            <Text style={styles.sectionDescription}>
              Our AI analysis has identified these optimal times for sending reminders
            </Text>
            
            <View style={styles.timingSection}>
              <View style={styles.timingItem}>
                <View style={styles.timingHeader}>
                  <Icon name="clock-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.timingTitle}>Best Time of Day</Text>
                </View>
                
                <View style={styles.timeBlocks}>
                  {insights.optimalTiming.timeBlocks.map((block, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.timeBlock,
                        { backgroundColor: block.color }
                      ]}
                    >
                      <Text style={styles.timeBlockText}>{block.label}</Text>
                      <Text style={styles.timeBlockValue}>{block.value}%</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.timingItem}>
                <View style={styles.timingHeader}>
                  <Icon name="calendar-week" size={20} color={theme.colors.primary} />
                  <Text style={styles.timingTitle}>Best Day of Week</Text>
                </View>
                
                <View style={styles.dayBlocks}>
                  {insights.optimalTiming.dayBlocks.map((day, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.dayBlock,
                        { 
                          backgroundColor: day.isOptimal 
                            ? 'rgba(3, 169, 244, 0.1)' 
                            : 'transparent',
                          borderColor: day.isOptimal
                            ? theme.colors.primary
                            : '#e0e0e0'
                        }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.dayBlockText,
                          { 
                            color: day.isOptimal
                              ? theme.colors.primary
                              : '#666'
                          }
                        ]}
                      >
                        {day.label}
                      </Text>
                      <Text 
                        style={[
                          styles.dayBlockValue,
                          { 
                            color: day.isOptimal
                              ? theme.colors.primary
                              : '#666'
                          }
                        ]}
                      >
                        {day.value}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Card.Content>
          
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="contained"
              onPress={() => setShowScheduleDialog(true)}
              disabled={!smartRemindersEnabled}
            >
              Generate Communication Plan
            </Button>
          </Card.Actions>
        </Card>
      </>
    );
  };
  
  const renderMemberProfilesTab = () => {
    if (memberProfiles.length === 0) return null;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            Member Response Profiles
          </Title>
          
          <Text style={styles.sectionDescription}>
            AI-generated profiles showing how members respond to different communication approaches
          </Text>
          
          <View style={styles.profilesContainer}>
            {memberProfiles.map((profile, index) => (
              <Card key={index} style={styles.profileCard}>
                <Card.Content>
                  <View style={styles.profileHeader}>
                    <View style={styles.profileNameContainer}>
                      {profile.avatar ? (
                        <Avatar.Image 
                          source={{ uri: profile.avatar }} 
                          size={36}
                          style={styles.profileAvatar}
                        />
                      ) : (
                        <Avatar.Text 
                          label={profile.name.substring(0, 2).toUpperCase()} 
                          size={36}
                          style={styles.profileAvatar}
                        />
                      )}
                      <View>
                        <Text style={styles.profileName}>{profile.name}</Text>
                        <Text style={styles.profileUsername}>@{profile.username}</Text>
                      </View>
                    </View>
                    
                    <Chip 
                      style={[
                        styles.profileTypeChip,
                        { backgroundColor: profile.profileColor }
                      ]}
                    >
                      {profile.responseType}
                    </Chip>
                  </View>
                  
                  <Divider style={styles.profileDivider} />
                  
                  <View style={styles.responseFactors}>
                    <Text style={styles.responseFactorsTitle}>Response Factors</Text>
                    
                    <View style={styles.responseFactor}>
                      <Text style={styles.responseFactorLabel}>Channel Preference</Text>
                      <View style={styles.channelPreferences}>
                        {profile.channelPreferences.map((channel, idx) => (
                          <View key={idx} style={styles.channelItem}>
                            <Icon 
                              name={
                                channel.type === 'app' ? 'cellphone' : 
                                channel.type === 'email' ? 'email' : 
                                channel.type === 'whatsapp' ? 'whatsapp' : 
                                'message'
                              } 
                              size={16} 
                              color={
                                channel.type === 'app' ? theme.colors.primary : 
                                channel.type === 'email' ? '#D81B60' : 
                                channel.type === 'whatsapp' ? '#25D366' : 
                                '#FF9800'
                              } 
                            />
                            <ProgressBar 
                              progress={channel.effectiveness / 100} 
                              color={
                                channel.type === 'app' ? theme.colors.primary : 
                                channel.type === 'email' ? '#D81B60' : 
                                channel.type === 'whatsapp' ? '#25D366' : 
                                '#FF9800'
                              }
                              style={styles.channelProgressBar} 
                            />
                            <Text style={styles.channelEffectiveness}>
                              {channel.effectiveness}%
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    
                    <View style={styles.responseFactor}>
                      <Text style={styles.responseFactorLabel}>Time Sensitivity</Text>
                      <View style={styles.timePreference}>
                        <Icon 
                          name="clock-time-eight-outline" 
                          size={16} 
                          color={theme.colors.primary} 
                        />
                        <Text style={styles.timePreferenceText}>
                          Responds best at {profile.optimalTime}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.responseFactor}>
                      <Text style={styles.responseFactorLabel}>Message Preference</Text>
                      <View style={styles.messageTags}>
                        {profile.messagePreferences.map((pref, idx) => (
                          <Chip 
                            key={idx}
                            style={styles.messageTag}
                            textStyle={styles.messageTagText}
                          >
                            {pref}
                          </Chip>
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  <Divider style={styles.profileDivider} />
                  
                  <View style={styles.recommendedApproach}>
                    <Text style={styles.recommendedApproachTitle}>Recommended Approach</Text>
                    <Text style={styles.recommendedApproachText}>
                      {profile.recommendedApproach}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderTemplatesTab = () => {
    if (!templateEffectiveness) return null;
    
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            Message Template Effectiveness
          </Title>
          
          <Text style={styles.sectionDescription}>
            Analytics on how different message templates perform
          </Text>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Template</DataTable.Title>
              <DataTable.Title numeric>Response Rate</DataTable.Title>
              <DataTable.Title numeric>Avg. Time</DataTable.Title>
              <DataTable.Title>Actions</DataTable.Title>
            </DataTable.Header>
            
            {templateEffectiveness.templates.map((template) => (
              <DataTable.Row key={template.id}>
                <DataTable.Cell>
                  <View>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templateType}>{template.type}</Text>
                  </View>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text 
                    style={[
                      styles.responseRateText,
                      { 
                        color: template.responseRate > 75 ? '#4CAF50' : 
                               template.responseRate > 50 ? '#FF9800' : 
                               '#F44336'
                      }
                    ]}
                  >
                    {template.responseRate}%
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={styles.avgTimeText}>{template.avgResponseTime}h</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <View style={styles.templateActions}>
                    <IconButton
                      icon="eye"
                      size={18}
                      onPress={() => handleViewTemplate(template)}
                    />
                    <IconButton
                      icon="pencil"
                      size={18}
                      onPress={() => handleEditTemplate(template)}
                    />
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          
          <View style={styles.templateInsights}>
            <Title style={styles.templateInsightsTitle}>Key Findings</Title>
            
            <View style={styles.templateInsightItem}>
              <Icon name="lightbulb-on" size={24} color="#4CAF50" style={styles.insightIcon} />
              <View style={styles.templateInsightContent}>
                <Text style={styles.templateInsightTitle}>Effective Elements</Text>
                <Text style={styles.templateInsightText}>
                  {templateEffectiveness.insights.effectiveElements}
                </Text>
              </View>
            </View>
            
            <View style={styles.templateInsightItem}>
              <Icon name="alert-circle" size={24} color="#F44336" style={styles.insightIcon} />
              <View style={styles.templateInsightContent}>
                <Text style={styles.templateInsightTitle}>Less Effective Elements</Text>
                <Text style={styles.templateInsightText}>
                  {templateEffectiveness.insights.ineffectiveElements}
                </Text>
              </View>
            </View>
            
            <View style={styles.templateInsightItem}>
              <Icon name="clock-fast" size={24} color="#FF9800" style={styles.insightIcon} />
              <View style={styles.templateInsightContent}>
                <Text style={styles.templateInsightTitle}>Response Time Factors</Text>
                <Text style={styles.templateInsightText}>
                  {templateEffectiveness.insights.responseTimeFactors}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderTemplateDialog = () => (
    <Portal>
      <Dialog
        visible={showTemplateDialog}
        onDismiss={() => setShowTemplateDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>
          {editingTemplate ? 'Edit Template' : 'View Template'}
        </Dialog.Title>
        <Dialog.Content>
          {selectedTemplate && (
            <>
              <View style={styles.templateDialogHeader}>
                <Text style={styles.templateDialogName}>{selectedTemplate.name}</Text>
                <Chip style={styles.templateDialogType}>{selectedTemplate.type}</Chip>
              </View>
              
              <TextInput
                label="Template Content"
                value={templateText}
                onChangeText={setTemplateText}
                mode="outlined"
                multiline
                numberOfLines={6}
                style={styles.templateTextInput}
                disabled={!editingTemplate}
              />
              
              <View style={styles.variableHelpContainer}>
                <Text style={styles.variableHelpTitle}>Available Variables:</Text>
                <View style={styles.variableList}>
                  <Chip style={styles.variableChip} onPress={() => setTemplateText(templateText + '{{member_name}}')}>
                    {{member_name}}
                  </Chip>
                  <Chip style={styles.variableChip} onPress={() => setTemplateText(templateText + '{{amount_due}}')}>
                    {{amount_due}}
                  </Chip>
                  <Chip style={styles.variableChip} onPress={() => setTemplateText(templateText + '{{due_date}}')}>
                    {{due_date}}
                  </Chip>
                  <Chip style={styles.variableChip} onPress={() => setTemplateText(templateText + '{{days_overdue}}')}>
                    {{days_overdue}}
                  </Chip>
                  <Chip style={styles.variableChip} onPress={() => setTemplateText(templateText + '{{payment_link}}')}>
                    {{payment_link}}
                  </Chip>
                </View>
              </View>
              
              {editingTemplate && (
                <View style={styles.templateStats}>
                  <View style={styles.templateStat}>
                    <Text style={styles.templateStatLabel}>Current Response Rate:</Text>
                    <Text 
                      style={[
                        styles.templateStatValue,
                        { 
                          color: selectedTemplate.responseRate > 75 ? '#4CAF50' : 
                                 selectedTemplate.responseRate > 50 ? '#FF9800' : 
                                 '#F44336'
                        }
                      ]}
                    >
                      {selectedTemplate.responseRate}%
                    </Text>
                  </View>
                  
                  <View style={styles.templateStat}>
                    <Text style={styles.templateStatLabel}>Avg Response Time:</Text>
                    <Text style={styles.templateStatValue}>{selectedTemplate.avgResponseTime}h</Text>
                  </View>
                </View>
              )}
            </>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowTemplateDialog(false)}>
            {editingTemplate ? 'Cancel' : 'Close'}
          </Button>
          {editingTemplate && (
            <>
              <Button onPress={handleTestTemplate}>
                Test
              </Button>
              <Button mode="contained" onPress={handleSaveTemplate}>
                Save
              </Button>
            </>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderScheduleDialog = () => (
    <Portal>
      <Dialog
        visible={showScheduleDialog}
        onDismiss={() => !generatingPlan && setShowScheduleDialog(false)}
        style={styles.scheduleDialog}
      >
        <Dialog.Title>Generate Communication Plan</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.scheduleDescription}>
            The AI will create an optimal communication plan starting from the selected date.
            It will analyze member behavior patterns and schedule reminders at the most effective times.
          </Text>
          
          <Calendar
            current={scheduledDate.toISOString().split('T')[0]}
            minDate={new Date().toISOString().split('T')[0]}
            onDayPress={(day) => {
              const selected = new Date(day.dateString);
              selected.setHours(scheduledDate.getHours());
              selected.setMinutes(scheduledDate.getMinutes());
              setScheduledDate(selected);
            }}
            markedDates={{
              [scheduledDate.toISOString().split('T')[0]]: {
                selected: true,
                selectedColor: theme.colors.primary
              }
            }}
            style={styles.calendar}
          />
          
          <Button 
            mode="outlined"
            onPress={() => setShowTimePicker(true)}
            style={styles.timePickerButton}
          >
            Set Start Time: {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>
          
          {showTimePicker && (
            <DateTimePicker
              value={scheduledDate}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                setShowTimePicker(false);
                if (selectedDate) {
                  setScheduledDate(selectedDate);
                }
              }}
            />
          )}
          
          <View style={styles.planOptions}>
            <Text style={styles.planOptionsTitle}>Communication Plan Options</Text>
            
            <List.Item
              title="Optimize for response rate"
              description="Focus on getting the highest response rate possible"
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            
            <List.Item
              title="Balance response time and rate"
              description="Find the optimal balance between quick responses and high rates"
              left={props => <List.Icon {...props} icon="check-circle" color={theme.colors.primary} />}
            />
            
            <List.Item
              title="Optimize for quick responses"
              description="Focus on getting the fastest possible response"
              left={props => <List.Icon {...props} icon="circle-outline" />}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button 
            onPress={() => setShowScheduleDialog(false)}
            disabled={generatingPlan}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleGenerateCommunicationPlan}
            loading={generatingPlan}
            disabled={generatingPlan}
          >
            Generate Plan
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading smart reminder system...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.screenTitle}>Smart Reminder System</Text>
          <Text style={styles.groupName}>{groupName || 'All Groups'}</Text>
        </View>
        
        {smartRemindersEnabled ? (
          <Chip 
            icon="brain"
            style={styles.aiEnabledChip}
          >
            AI-Driven Reminders Enabled
          </Chip>
        ) : (
          <Chip 
            icon="brain"
            style={styles.aiDisabledChip}
          >
            AI-Driven Reminders Disabled
          </Chip>
        )}
      </View>
      
      {/* Tab navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
          onPress={() => setActiveTab('insights')}
        >
          <Icon 
            name="chart-bar" 
            size={20} 
            color={activeTab === 'insights' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'insights' && styles.activeTabText
            ]}
          >
            Insights
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profiles' && styles.activeTab]}
          onPress={() => setActiveTab('profiles')}
        >
          <Icon 
            name="account-group" 
            size={20} 
            color={activeTab === 'profiles' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'profiles' && styles.activeTabText
            ]}
          >
            Profiles
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'templates' && styles.activeTab]}
          onPress={() => setActiveTab('templates')}
        >
          <Icon 
            name="text-box-check" 
            size={20} 
            color={activeTab === 'templates' ? theme.colors.primary : '#888'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'templates' && styles.activeTabText
            ]}
          >
            Templates
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content section */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'insights' && renderInsightsTab()}
        {activeTab === 'profiles' && renderMemberProfilesTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
      </ScrollView>
      
      {/* Dialogs */}
      {renderTemplateDialog()}
      {renderScheduleDialog()}
    </View>
  );
};

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
    paddingBottom: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  groupName: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9
  },
  aiEnabledChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50'
  },
  aiDisabledChip: {
    backgroundColor: 'rgba(158, 158, 158, 0.2)',
    borderColor: '#9E9E9E'
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888'
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  content: {
    flex: 1
  },
  contentContainer: {
    padding: 16
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8
  },
  switchLabel: {
    fontSize: 16,
    color: theme.colors.text
  },
  divider: {
    marginVertical: 16
  },
  insightMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16
  },
  insightMetric: {
    alignItems: 'center'
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 16
  },
  insightIcon: {
    marginRight: 12,
    marginTop: 2
  },
  insightContent: {
    flex: 1
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  insightDescription: {
    fontSize: 14,
    color: '#444'
  },
  timingSection: {
    marginVertical: 16
  },
  timingItem: {
    marginBottom: 16
  },
  timingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  timingTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8
  },
  timeBlocks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  timeBlock: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 4
  },
  timeBlockText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500'
  },
  timeBlockValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4
  },
  dayBlocks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  dayBlock: {
    width: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1
  },
  dayBlockText: {
    fontSize: 12,
    fontWeight: '500'
  },
  dayBlockValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  profilesContainer: {
    marginTop: 8
  },
  profileCard: {
    marginBottom: 12
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileAvatar: {
    marginRight: 8
  },
  profileName: {
    fontSize: 16,
    fontWeight: '500'
  },
  profileUsername: {
    fontSize: 12,
    color: '#666'
  },
  profileTypeChip: {
    height: 28
  },
  profileDivider: {
    marginVertical: 12
  },
  responseFactors: {
    marginBottom: 12
  },
  responseFactorsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  responseFactor: {
    marginBottom: 12
  },
  responseFactorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  channelPreferences: {
    marginTop: 4
  },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  channelProgressBar: {
    flex: 1,
    height: 8,
    marginHorizontal: 8
  },
  channelEffectiveness: {
    fontSize: 12,
    width: 36,
    textAlign: 'right'
  },
  timePreference: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timePreferenceText: {
    marginLeft: 8,
    fontSize: 14
  },
  messageTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4
  },
  messageTag: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: 'rgba(3, 169, 244, 0.1)'
  },
  messageTagText: {
    fontSize: 12
  },
  recommendedApproach: {
    marginTop: 4
  },
  recommendedApproachTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  recommendedApproachText: {
    fontSize: 14
  },
  templateName: {
    fontSize: 14,
    fontWeight: '500'
  },
  templateType: {
    fontSize: 12,
    color: '#666'
  },
  responseRateText: {
    fontWeight: '500'
  },
  avgTimeText: {
    fontSize: 14
  },
  templateActions: {
    flexDirection: 'row'
  },
  templateInsights: {
    marginTop: 24
  },
  templateInsightsTitle: {
    fontSize: 16,
    marginBottom: 12
  },
  templateInsightItem: {
    flexDirection: 'row',
    marginBottom: 16
  },
  templateInsightContent: {
    flex: 1
  },
  templateInsightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  templateInsightText: {
    fontSize: 14,
    color: '#444'
  },
  dialog: {
    borderRadius: 8,
    padding: 4
  },
  templateDialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  templateDialogName: {
    fontSize: 16,
    fontWeight: '500'
  },
  templateDialogType: {
    height: 28
  },
  templateTextInput: {
    marginBottom: 16
  },
  variableHelpContainer: {
    marginBottom: 16
  },
  variableHelpTitle: {
    fontSize: 14,
    marginBottom: 8
  },
  variableList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  variableChip: {
    marginRight: 8,
    marginBottom: the8,
    backgroundColor: 'rgba(3, 169, 244, 0.1)'
  },
  templateStats: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8
  },
  templateStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  templateStatLabel: {
    fontSize: 14,
    color: '#666'
  },
  templateStatValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  scheduleDialog: {
    borderRadius: 8,
    padding: 4,
    maxHeight: '80%'
  },
  scheduleDescription: {
    fontSize: 14,
    marginBottom: 16
  },
  calendar: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16
  },
  timePickerButton: {
    marginBottom: 16
  },
  planOptions: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8
  },
  planOptionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  }
});

export default SmartReminderSystem;