  const renderEventsTab = () => (
    <View style={styles.tabContainer}>
      <View style={styles.upcomingEventsSection}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        
        {groupEvents.filter(event => new Date(event.date) >= new Date()).length > 0 ? (
          <FlatList
            data={groupEvents.filter(event => new Date(event.date) >= new Date())}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.eventCard}>
                <Card.Content>
                  <View style={styles.eventCardHeader}>
                    <View 
                      style={[
                        styles.eventTypeIndicator, 
                        { 
                          backgroundColor: 
                            item.type === 'Meeting' ? '#2196F3' :
                            item.type === 'Workshop' ? '#4CAF50' :
                            item.type === 'Social Gathering' ? '#FFC107' :
                            item.type === 'Financial Planning' ? '#9C27B0' :
                            '#FF9800'
                        }
                      ]}
                    />
                    <Title style={styles.eventCardTitle}>{item.title}</Title>
                  </View>
                  
                  <Paragraph style={styles.eventCardDescription} numberOfLines={2}>
                    {item.description}
                  </Paragraph>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <Icon name="calendar" size={16} color="#666" />
                      <Text style={styles.eventDetailText}>
                        {formatDate(item.date)}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetail}>
                      <Icon name="clock-outline" size={16} color="#666" />
                      <Text style={styles.eventDetailText}>
                        {formatTime(item.date)}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetail}>
                      <Icon 
                        name={item.isVirtual ? "video" : "map-marker"} 
                        size={16} 
                        color="#666" 
                      />
                      <Text style={styles.eventDetailText}>
                        {item.isVirtual ? "Virtual Event" : item.location}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.eventAttendees}>
                    <Text style={styles.attendeesCount}>
                      {item.attendees ? item.attendees.length : 0} attending
                    </Text>
                    <View style={styles.attendeeAvatars}>
                      {item.attendees && item.attendees.slice(0, 5).map((attendee, index) => (
                        <Avatar.Image
                          key={index}
                          source={{ uri: attendee.avatar }}
                          size={24}
                          style={styles.attendeeAvatar}
                        />
                      ))}
                      {item.attendees && item.attendees.length > 5 && (
                        <View style={styles.moreAttendees}>
                          <Text style={styles.moreAttendeesText}>
                            +{item.attendees.length - 5}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    mode={item.userResponse === 'going' ? "contained" : "outlined"} 
                    icon="check-circle"
                    onPress={() => handleRSVP(item.id, 'going')}
                    style={item.userResponse === 'going' ? styles.activeRsvpButton : null}
                  >
                    Going
                  </Button>
                  <Button 
                    mode={item.userResponse === 'not_going' ? "contained" : "outlined"} 
                    icon="close-circle"
                    onPress={() => handleRSVP(item.id, 'not_going')}
                    style={item.userResponse === 'not_going' ? styles.declineRsvpButton : null}
                  >
                    Not Going
                  </Button>
                  <Button 
                    mode="text" 
                    icon="information"
                    onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
                  >
                    Details
                  </Button>
                </Card.Actions>
              </Card>
            )}
          />
        ) : (
          <View style={styles.emptyUpcomingEvents}>
            <Icon name="calendar-blank" size={40} color="#9E9E9E" />
            <Text style={styles.emptyUpcomingEventsText}>No upcoming events</Text>
          </View>
        )}
      </View>
      
      <View style={styles.pastEventsSection}>
        <Text style={styles.sectionTitle}>Past Events</Text>
        
        {groupEvents.filter(event => new Date(event.date) < new Date()).length > 0 ? (
          <FlatList
            data={groupEvents.filter(event => new Date(event.date) < new Date())}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={[styles.eventCard, styles.pastEventCard]}>
                <Card.Content>
                  <View style={styles.eventCardHeader}>
                    <View 
                      style={[
                        styles.eventTypeIndicator, 
                        styles.pastEventTypeIndicator,
                        { 
                          backgroundColor: 
                            item.type === 'Meeting' ? '#2196F3' :
                            item.type === 'Workshop' ? '#4CAF50' :
                            item.type === 'Social Gathering' ? '#FFC107' :
                            item.type === 'Financial Planning' ? '#9C27B0' :
                            '#FF9800'
                        }
                      ]}
                    />
                    <Title style={[styles.eventCardTitle, styles.pastEventTitle]}>
                      {item.title}
                    </Title>
                  </View>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <Icon name="calendar" size={16} color="#9E9E9E" />
                      <Text style={[styles.eventDetailText, styles.pastEventDetailText]}>
                        {formatDate(item.date)}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetail}>
                      <Icon 
                        name={item.isVirtual ? "video" : "map-marker"} 
                        size={16} 
                        color="#9E9E9E" 
                      />
                      <Text style={[styles.eventDetailText, styles.pastEventDetailText]}>
                        {item.isVirtual ? "Virtual Event" : item.location}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetail}>
                      <Icon name="account-group" size={16} color="#9E9E9E" />
                      <Text style={[styles.eventDetailText, styles.pastEventDetailText]}>
                        {item.attendeesCount} attended
                      </Text>
                    </View>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    mode="text" 
                    icon="file-document"
                    onPress={() => navigation.navigate('EventSummary', { eventId: item.id })}
                  >
                    View Summary
                  </Button>
                </Card.Actions>
              </Card>
            )}
          />
        ) : (
          <View style={styles.emptyPastEvents}>
            <Text style={styles.emptyPastEventsText}>No past events</Text>
          </View>
        )}
      </View>
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowEventDialog(true)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading community features...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with your group members</Text>
      </View>
      
      {/* Search Bar */}
      <Searchbar
        placeholder="Search discussions, goals and events..."
        onChangeText={onSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {/* Tab Menu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'forum' && styles.activeTab]}
          onPress={() => setActiveTab('forum')}
        >
          <Icon 
            name="forum" 
            size={24} 
            color={activeTab === 'forum' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'forum' && styles.activeTabText
            ]}
          >
            Discussion Forum
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'goals' && styles.activeTab]}
          onPress={() => setActiveTab('goals')}
        >
          <Icon 
            name="target" 
            size={24} 
            color={activeTab === 'goals' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'goals' && styles.activeTabText
            ]}
          >
            Savings Goals
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <Icon 
            name="calendar" 
            size={24} 
            color={activeTab === 'events' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'events' && styles.activeTabText
            ]}
          >
            Group Events
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {activeTab === 'forum' && renderForumTab()}
      {activeTab === 'goals' && renderGoalsTab()}
      {activeTab === 'events' && renderEventsTab()}
      
      {/* Dialogs */}
      {renderTopicDialog()}
      {renderEventDialog()}
      {renderGoalDialog()}
      {renderTopicDetailsDialog()}
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
  searchBar: {
    margin: 16,
    elevation: 2
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
  tabContainer: {
    flex: 1,
    padding: 16
  },
  topicCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  topicCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  topicCardTitle: {
    fontSize: 18
  },
  topicCardCategoryChip: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  topicCardCategoryText: {
    fontSize: 12,
    color: theme.colors.primary
  },
  topicCardStats: {
    flexDirection: 'row'
  },
  topicCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12
  },
  topicCardStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  topicCardExcerpt: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 12
  },
  topicCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topicCardAuthor: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  topicCardAuthorAvatar: {
    marginRight: 8
  },
  topicCardAuthorName: {
    fontSize: 12,
    fontWeight: '500'
  },
  topicCardTimestamp: {
    fontSize: 12,
    color: '#9E9E9E'
  },
  goalCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  goalCardTitle: {
    fontSize: 18
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4
  },
  goalProgress: {
    fontSize: 16,
    fontWeight: '500'
  },
  goalPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  goalProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12
  },
  goalDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  goalDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4
  },
  goalDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  goalMilestones: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8
  },
  milestonesTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  milestoneDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9E9E9E',
    marginTop: 4,
    marginRight: 8
  },
  completedMilestoneDot: {
    backgroundColor: '#4CAF50'
  },
  milestoneContent: {
    flex: 1
  },
  milestoneText: {
    fontSize: 14
  },
  completedMilestoneText: {
    textDecorationLine: 'line-through',
    color: '#4CAF50'
  },
  milestoneCompletedDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  eventTypeIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: 8
  },
  eventCardTitle: {
    fontSize: 18
  },
  eventCardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4
  },
  eventAttendees: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  attendeesCount: {
    fontSize: 14,
    color: '#666'
  },
  attendeeAvatars: {
    flexDirection: 'row'
  },
  attendeeAvatar: {
    marginLeft: -4
  },
  moreAttendees: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4
  },
  moreAttendeesText: {
    fontSize: 10,
    fontWeight: '500'
  },
  activeRsvpButton: {
    backgroundColor: '#4CAF50'
  },
  declineRsvpButton: {
    backgroundColor: '#F44336'
  },
  pastEventCard: {
    opacity: 0.7
  },
  pastEventTypeIndicator: {
    opacity: 0.5
  },
  pastEventTitle: {
    color: '#9E9E9E'
  },
  pastEventDetailText: {
    color: '#9E9E9E'
  },
  upcomingEventsSection: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12
  },
  emptyUpcomingEvents: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyUpcomingEventsText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 8
  },
  emptyPastEvents: {
    padding: 16,
    alignItems: 'center'
  },
  emptyPastEventsText: {
    fontSize: 14,
    color: '#9E9E9E'
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  emptyStateButton: {
    paddingHorizontal: 16
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16
  },
  textInput: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 4
  },
  dialogContent: {
    paddingVertical: 8
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  dateTimeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    width: '48%'
  },
  dateTimeIcon: {
    marginRight: 8
  },
  dateTimeText: {
    fontSize: 14
  },
  virtualEventSwitch: {
    marginVertical: 16
  },
  eventTypeButton: {
    marginTop: 8,
    marginRight: 8
  },
  activeEventTypeButton: {
    marginTop: 8
  },
  goalDialogTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8
  },
  goalDialogCurrentAmount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16
  },
  topicDetailsDialog: {
    maxWidth: '90%',
    borderRadius: 8
  },
  topicScrollArea: {
    maxHeight: 400
  },
  topicAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  topicAuthorAvatar: {
    marginRight: 12
  },
  topicAuthorName: {
    fontSize: 16,
    fontWeight: '500'
  },
  topicTimestamp: {
    fontSize: 12,
    color: '#666'
  },
  topicCategoryChip: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12
  },
  topicCategoryText: {
    fontSize: 12,
    color: theme.colors.primary
  },
  topicContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16
  },
  topicDivider: {
    marginBottom: 16
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  commentItem: {
    marginBottom: 16
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  commentAuthorAvatar: {
    marginRight: 8
  },
  commentHeaderInfo: {
    flex: 1
  },
  commentAuthorName: {
    fontSize: 14,
    fontWeight: '500'
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666'
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 38
  },
  addCommentSection: {
    marginTop: 16,
    marginBottom: 8
  },
  addCommentTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  commentInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  addCommentButton: {
    alignSelf: 'flex-end'
  }
});

export default CommunityFeatures;import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Searchbar,
  Chip,
  Avatar,
  FAB,
  Portal,
  Dialog,
  TextInput,
  IconButton,
  ProgressBar,
  List
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import {
  getDiscussionTopics,
  getSavingsGoals,
  getGroupEvents,
  createDiscussionTopic,
  createEvent,
  updateSavingsGoal,
  getTopicComments,
  addComment,
  rsvpToEvent
} from '../../services/api/community';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';

const CommunityFeatures = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('forum');
  const [searchQuery, setSearchQuery] = useState('');
  const [discussionTopics, setDiscussionTopics] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [groupEvents, setGroupEvents] = useState([]);
  const [showTopicDialog, setShowTopicDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showTopicDetailsDialog, setShowTopicDetailsDialog] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicContent, setTopicContent] = useState('');
  const [topicCategory, setTopicCategory] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [eventLocation, setEventLocation] = useState('');
  const [isVirtualEvent, setIsVirtualEvent] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalAmount, setGoalAmount] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('date');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicComments, setTopicComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const forumCategories = [
    'General Discussion', 
    'Financial Tips', 
    'Group Governance', 
    'Investment Ideas', 
    'Announcements'
  ];
  
  const eventTypes = [
    'Meeting',
    'Workshop',
    'Social Gathering',
    'Financial Planning',
    'Training'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch discussion topics
      const topics = await getDiscussionTopics();
      setDiscussionTopics(topics);
      
      // Fetch savings goals
      const goals = await getSavingsGoals();
      setSavingsGoals(goals);
      
      // Fetch group events
      const events = await getGroupEvents();
      setGroupEvents(events);
    } catch (error) {
      console.error('Error fetching community data:', error);
      Alert.alert('Error', 'Failed to load community features data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    // In a real app, you would filter content based on the search query
  };

  const handleCreateTopic = async () => {
    try {
      if (!topicTitle.trim()) {
        Alert.alert('Error', 'Please enter a topic title.');
        return;
      }
      
      if (!topicContent.trim()) {
        Alert.alert('Error', 'Please enter topic content.');
        return;
      }
      
      if (!topicCategory) {
        Alert.alert('Error', 'Please select a category.');
        return;
      }
      
      // In a real app, this would create a new event
      await createEvent({
        title: eventTitle,
        description: eventDescription,
        type: eventType,
        date: eventDate.toISOString(),
        isVirtual: isVirtualEvent,
        location: isVirtualEvent ? null : eventLocation,
        meetingLink: isVirtualEvent ? meetingLink : null,
        organizerId: user.id
      });
      
      // Reset form and close dialog
      setEventTitle('');
      setEventDescription('');
      setEventType('');
      setEventDate(new Date());
      setEventLocation('');
      setIsVirtualEvent(false);
      setMeetingLink('');
      setShowEventDialog(false);
      
      // Refresh events list
      const events = await getGroupEvents();
      setGroupEvents(events);
      
      Alert.alert('Success', 'Event created successfully.');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  const handleUpdateGoal = async () => {
    try {
      if (!selectedGoal) {
        return;
      }
      
      if (!goalAmount.trim() || isNaN(parseFloat(goalAmount))) {
        Alert.alert('Error', 'Please enter a valid goal amount.');
        return;
      }
      
      // In a real app, this would update the savings goal
      await updateSavingsGoal(selectedGoal.id, {
        targetAmount: parseFloat(goalAmount)
      });
      
      // Reset form and close dialog
      setSelectedGoal(null);
      setGoalAmount('');
      setShowGoalDialog(false);
      
      // Refresh goals list
      const goals = await getSavingsGoals();
      setSavingsGoals(goals);
      
      Alert.alert('Success', 'Savings goal updated successfully.');
    } catch (error) {
      console.error('Error updating goal:', error);
      Alert.alert('Error', 'Failed to update goal. Please try again.');
    }
  };

  const handleViewTopicDetails = async (topic) => {
    try {
      setSelectedTopic(topic);
      
      // Fetch topic comments
      const comments = await getTopicComments(topic.id);
      setTopicComments(comments);
      
      setShowTopicDetailsDialog(true);
    } catch (error) {
      console.error('Error fetching topic details:', error);
      Alert.alert('Error', 'Failed to load topic details. Please try again.');
    }
  };

  const handleAddComment = async () => {
    try {
      if (!newComment.trim()) {
        Alert.alert('Error', 'Please enter a comment.');
        return;
      }
      
      // In a real app, this would add a comment to the topic
      await addComment(selectedTopic.id, {
        content: newComment,
        authorId: user.id
      });
      
      // Reset comment input
      setNewComment('');
      
      // Refresh comments list
      const comments = await getTopicComments(selectedTopic.id);
      setTopicComments(comments);
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    }
  };

  const handleRSVP = async (eventId, status) => {
    try {
      // In a real app, this would RSVP to the event
      await rsvpToEvent(eventId, user.id, status);
      
      // Refresh events list
      const events = await getGroupEvents();
      setGroupEvents(events);
      
      Alert.alert('Success', `You have ${status === 'going' ? 'confirmed' : 'declined'} your attendance.`);
    } catch (error) {
      console.error('Error updating RSVP:', error);
      Alert.alert('Error', 'Failed to update RSVP status. Please try again.');
    }
  };

  const renderTopicDialog = () => (
    <Portal>
      <Dialog visible={showTopicDialog} onDismiss={() => setShowTopicDialog(false)}>
        <Dialog.Title>Create New Discussion</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Title"
            value={topicTitle}
            onChangeText={setTopicTitle}
            style={styles.textInput}
          />
          
          <TextInput
            label="Content"
            value={topicContent}
            onChangeText={setTopicContent}
            style={styles.textInput}
            multiline
            numberOfLines={5}
          />
          
          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.chipContainer}>
            {forumCategories.map((category) => (
              <Chip
                key={category}
                selected={topicCategory === category}
                onPress={() => setTopicCategory(category)}
                style={styles.chip}
              >
                {category}
              </Chip>
            ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowTopicDialog(false)}>Cancel</Button>
          <Button onPress={handleCreateTopic}>Post</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderEventDialog = () => (
    <Portal>
      <Dialog visible={showEventDialog} onDismiss={() => setShowEventDialog(false)}>
        <Dialog.Title>Create New Event</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            <View style={styles.dialogContent}>
              <TextInput
                label="Event Title"
                value={eventTitle}
                onChangeText={setEventTitle}
                style={styles.textInput}
              />
              
              <TextInput
                label="Description"
                value={eventDescription}
                onChangeText={setEventDescription}
                style={styles.textInput}
                multiline
                numberOfLines={3}
              />
              
              <Text style={styles.inputLabel}>Event Type</Text>
              <View style={styles.chipContainer}>
                {eventTypes.map((type) => (
                  <Chip
                    key={type}
                    selected={eventType === type}
                    onPress={() => setEventType(type)}
                    style={styles.chip}
                  >
                    {type}
                  </Chip>
                ))}
              </View>
              
              <Text style={styles.inputLabel}>Date & Time</Text>
              <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                  style={styles.dateTimeSelector}
                  onPress={() => {
                    setDatePickerMode('date');
                    setShowDatePicker(true);
                  }}
                >
                  <Icon name="calendar" size={24} color="#666" style={styles.dateTimeIcon} />
                  <Text style={styles.dateTimeText}>
                    {formatDate(eventDate)}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.dateTimeSelector}
                  onPress={() => {
                    setDatePickerMode('time');
                    setShowDatePicker(true);
                  }}
                >
                  <Icon name="clock-outline" size={24} color="#666" style={styles.dateTimeIcon} />
                  <Text style={styles.dateTimeText}>
                    {formatTime(eventDate)}
                  </Text>
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={eventDate}
                    mode={datePickerMode}
                    display="default"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setEventDate(selectedDate);
                      }
                    }}
                  />
                )}
              </View>
              
              <View style={styles.virtualEventSwitch}>
                <Text style={styles.inputLabel}>Virtual Event</Text>
                <Button
                  mode={isVirtualEvent ? "contained" : "outlined"}
                  onPress={() => setIsVirtualEvent(true)}
                  style={[styles.eventTypeButton, isVirtualEvent && styles.activeEventTypeButton]}
                >
                  Virtual
                </Button>
                <Button
                  mode={!isVirtualEvent ? "contained" : "outlined"}
                  onPress={() => setIsVirtualEvent(false)}
                  style={[styles.eventTypeButton, !isVirtualEvent && styles.activeEventTypeButton]}
                >
                  In-Person
                </Button>
              </View>
              
              {isVirtualEvent ? (
                <TextInput
                  label="Meeting Link"
                  value={meetingLink}
                  onChangeText={setMeetingLink}
                  style={styles.textInput}
                />
              ) : (
                <TextInput
                  label="Location"
                  value={eventLocation}
                  onChangeText={setEventLocation}
                  style={styles.textInput}
                />
              )}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowEventDialog(false)}>Cancel</Button>
          <Button onPress={handleCreateEvent}>Create</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderGoalDialog = () => (
    <Portal>
      <Dialog visible={showGoalDialog} onDismiss={() => setShowGoalDialog(false)}>
        <Dialog.Title>Update Savings Goal</Dialog.Title>
        <Dialog.Content>
          {selectedGoal && (
            <>
              <Text style={styles.goalDialogTitle}>{selectedGoal.title}</Text>
              <Text style={styles.goalDialogCurrentAmount}>
                Current target: {formatCurrency(selectedGoal.targetAmount)}
              </Text>
              
              <TextInput
                label="New Target Amount"
                value={goalAmount}
                onChangeText={setGoalAmount}
                keyboardType="numeric"
                style={styles.textInput}
              />
            </>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowGoalDialog(false)}>Cancel</Button>
          <Button onPress={handleUpdateGoal}>Update</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderTopicDetailsDialog = () => (
    <Portal>
      <Dialog 
        visible={showTopicDetailsDialog} 
        onDismiss={() => setShowTopicDetailsDialog(false)}
        style={styles.topicDetailsDialog}
      >
        {selectedTopic && (
          <>
            <Dialog.Title>{selectedTopic.title}</Dialog.Title>
            <Dialog.ScrollArea style={styles.topicScrollArea}>
              <ScrollView>
                <View style={styles.topicAuthorInfo}>
                  <Avatar.Image 
                    source={{ uri: selectedTopic.author.avatar }} 
                    size={40} 
                    style={styles.topicAuthorAvatar}
                  />
                  <View>
                    <Text style={styles.topicAuthorName}>{selectedTopic.author.name}</Text>
                    <Text style={styles.topicTimestamp}>
                      Posted on {formatDate(selectedTopic.createdAt)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.topicCategoryChip}>
                  <Text style={styles.topicCategoryText}>{selectedTopic.category}</Text>
                </View>
                
                <Text style={styles.topicContent}>{selectedTopic.content}</Text>
                
                <Divider style={styles.topicDivider} />
                
                <Text style={styles.commentsTitle}>
                  Comments ({topicComments.length})
                </Text>
                
                {topicComments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Avatar.Image 
                        source={{ uri: comment.author.avatar }} 
                        size={30} 
                        style={styles.commentAuthorAvatar}
                      />
                      <View style={styles.commentHeaderInfo}>
                        <Text style={styles.commentAuthorName}>{comment.author.name}</Text>
                        <Text style={styles.commentTimestamp}>
                          {formatDate(comment.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                ))}
                
                <View style={styles.addCommentSection}>
                  <Text style={styles.addCommentTitle}>Add a Comment</Text>
                  <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Write your comment..."
                    multiline
                    style={styles.commentInput}
                  />
                  <Button 
                    mode="contained" 
                    onPress={handleAddComment}
                    style={styles.addCommentButton}
                  >
                    Post Comment
                  </Button>
                </View>
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setShowTopicDetailsDialog(false)}>Close</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );

  const renderForumTab = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={discussionTopics}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.topicCard} onPress={() => handleViewTopicDetails(item)}>
            <Card.Content>
              <View style={styles.topicCardHeader}>
                <View>
                  <Title style={styles.topicCardTitle}>{item.title}</Title>
                  <View style={styles.topicCardCategoryChip}>
                    <Text style={styles.topicCardCategoryText}>{item.category}</Text>
                  </View>
                </View>
                <View style={styles.topicCardStats}>
                  <View style={styles.topicCardStat}>
                    <Icon name="comment-outline" size={16} color="#666" />
                    <Text style={styles.topicCardStatText}>{item.commentsCount}</Text>
                  </View>
                  <View style={styles.topicCardStat}>
                    <Icon name="eye-outline" size={16} color="#666" />
                    <Text style={styles.topicCardStatText}>{item.viewsCount}</Text>
                  </View>
                </View>
              </View>
              
              <Paragraph style={styles.topicCardExcerpt} numberOfLines={2}>
                {item.content}
              </Paragraph>
              
              <View style={styles.topicCardFooter}>
                <View style={styles.topicCardAuthor}>
                  <Avatar.Image 
                    source={{ uri: item.author.avatar }} 
                    size={24} 
                    style={styles.topicCardAuthorAvatar}
                  />
                  <Text style={styles.topicCardAuthorName}>{item.author.name}</Text>
                </View>
                <Text style={styles.topicCardTimestamp}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="forum-outline" size={60} color="#9E9E9E" />
            <Text style={styles.emptyStateTitle}>No Discussions Yet</Text>
            <Text style={styles.emptyStateDescription}>
              Start the conversation by creating a new discussion topic
            </Text>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => setShowTopicDialog(true)}
              style={styles.emptyStateButton}
            >
              Create Topic
            </Button>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowTopicDialog(true)}
      />
    </View>
  );

  const renderGoalsTab = () => (
    <View style={styles.tabContainer}>
      <FlatList
        data={savingsGoals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.goalCard}>
            <Card.Content>
              <View style={styles.goalCardHeader}>
                <Title style={styles.goalCardTitle}>{item.title}</Title>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => {
                    setSelectedGoal(item);
                    setGoalAmount(item.targetAmount.toString());
                    setShowGoalDialog(true);
                  }}
                />
              </View>
              
              <View style={styles.goalAmounts}>
                <Text style={styles.goalProgress}>
                  {formatCurrency(item.currentAmount)} of {formatCurrency(item.targetAmount)}
                </Text>
                <Text style={styles.goalPercentage}>
                  {Math.round((item.currentAmount / item.targetAmount) * 100)}%
                </Text>
              </View>
              
              <ProgressBar
                progress={item.currentAmount / item.targetAmount}
                color={theme.colors.primary}
                style={styles.goalProgressBar}
              />
              
              <View style={styles.goalDetails}>
                {item.targetDate && (
                  <View style={styles.goalDetail}>
                    <Icon name="calendar" size={16} color="#666" />
                    <Text style={styles.goalDetailText}>
                      Target date: {formatDate(item.targetDate)}
                    </Text>
                  </View>
                )}
                
                <View style={styles.goalDetail}>
                  <Icon name="account-group" size={16} color="#666" />
                  <Text style={styles.goalDetailText}>
                    {item.contributorsCount} contributors
                  </Text>
                </View>
              </View>
              
              {item.description && (
                <Paragraph style={styles.goalDescription}>
                  {item.description}
                </Paragraph>
              )}
              
              {item.milestones && item.milestones.length > 0 && (
                <View style={styles.goalMilestones}>
                  <Text style={styles.milestonesTitle}>Milestones</Text>
                  {item.milestones.map((milestone, index) => (
                    <View key={index} style={styles.milestoneItem}>
                      <View 
                        style={[
                          styles.milestoneDot,
                          milestone.completed && styles.completedMilestoneDot
                        ]}
                      />
                      <View style={styles.milestoneContent}>
                        <Text 
                          style={[
                            styles.milestoneText,
                            milestone.completed && styles.completedMilestoneText
                          ]}
                        >
                          {milestone.description}
                        </Text>
                        {milestone.completed && (
                          <Text style={styles.milestoneCompletedDate}>
                            Completed on {formatDate(milestone.completedDate)}
                          </Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="outlined" 
                icon="cash-plus"
                onPress={() => navigation.navigate('ContributeToGoal', { goalId: item.id })}
              >
                Contribute
              </Button>
              <Button 
                mode="text" 
                icon="chart-line"
                onPress={() => navigation.navigate('GoalDetails', { goalId: item.id })}
              >
                View Details
              </Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="target" size={60} color="#9E9E9E" />
            <Text style={styles.emptyStateTitle}>No Savings Goals</Text>
            <Text style={styles.emptyStateDescription}>
              Create a shared savings goal for your group
            </Text>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => navigation.navigate('CreateGoal')}
              style={styles.emptyStateButton}
            >
              Create Goal
            </Button>
          </View>
        }
      />
    </View>
  );

  const renderEventsTab = () => (
    <View style={styles.tabContainer}>
      <View style={styles.upcomingEventsSection}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        
        {groupEvents.filter(event => new Date(event.date) >= new Date()).length > 0 ? (
          <FlatList
            data={groupEvents.filter(event => new Date(event.date) >= new Date())}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.eventCard}>
                <Card.Content>
                  <View style={styles.eventCardHeader}>
                    <View 
                      style={[
                        styles.eventTypeIndicator, 
                        { 
                          backgroundColor: 
                            item.type === 'Meeting' ? '#2196F3' :
                            item.type === 'Workshop' ? '#4CAF50' :
                            item.type === 'Social Gathering' ? '#FFC107' :
                            item.type === 'Financial Planning' ? '#9C27B0' :
                            '#FF9800'
                        }
                      ]}
                    />
                    <Title style={styles.eventCardTitle}>{item.title}</Title>
                  </View>
                  
                  <Paragraph style={styles.eventCardDescription} numberOfLines={2}>
                    {item.description}
                  </Paragraph>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <Icon name="calendar" size={16} color="#666" />
                      <Text style={styles.eventDetailText}>
                        {formatDate(item.date)}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetail}>
                      <Icon name="clock-outline" size={16} color="#666" />
                      <Text style={styles.eventDetailText}>
                        {formatTime(item.date)}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetail}>
                      <Icon 
                        name={item.isVirtual ? "video" : "map-marker"} 
                        size={16} 
                        color="#666" 
                      />
                      <Text style={styles.eventDetailText}>
                        {item.isVirtual ? "Virtual Event" : item.location}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.eventAttendees}>
                    <Text style={styles.attendeesCount}>
                      {item.attendees ? item.attendees.length : 0} attending
                    </Text>
                    <View style={styles.attendeeAvatars}>
                      {item.attendees && item.attendees.slice(0, 5).map((attendee, index) => (
                        <Avatar.Image
                          key={index}
                          source={{ uri: attendee.avatar }}
                          size={24}
                          style={styles.attendeeAvatar}
                        />
                      ))}
                      {item.attendees && item.attendees.length > 5 && (
                        <View style={styles.moreAttendees}>
                          <Text style={styles.moreAttendeesText}>
                            +{item.attendees.length - 5}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    mode={item.userResponse === 'going' ? "contained" : "outlined"} 
                    icon="check-circle"
                    onPress={() => handleRSVP(item.id, 'going')}
                    style={item.userResponse === 'going' ? styles.activeRsvpButton : null}
                  >
                    Going
                  </Button>
                  <Button 
                    mode={item.userResponse === 'not_going' ? "contained" : "outlined"} 
                    icon="close-circle"
                    onPress={() => handleRSVP(item.id, 'not_going')}
                    style={item.userResponse === 'not_going' ? styles.declineRsvpButton : null}
                  >
                    Not Going
                  </Button>
                  <Button 
                    mode="text" 
                    icon="information"
                    onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
                  >
                    Details
                  </Button>
                </Card.Actions>
              </Card>
            )}
          />
        ) : (
          <View style={styles.emptyUpcomingEvents}>
            <Icon name="calendar-blank" size={40} color="#9E9E9E" />
            <Text style={styles.emptyUpcomingEventsText}>No upcoming events</Text>
          </View>
        )}
      </View>
      
      <View style={styles.pastEventsSection}>
        <Text style={styles.sectionTitle}>Past Events</Text>
        
        {groupEvents.filter(event => new Date(event.date) < new Date()).length > 0 ? (
          <FlatList
            data={groupEvents.filter(event => new Date(event.date) < new Date())}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={[styles.eventCard, styles.pastEventCard]}>
                <Card.Content>
                  <View style={styles.eventCardHeader}>
                    <View 
                      style={[
                        styles.eventTypeIndicator, 
                        styles.pastEventTypeIndicator,
                        { 
                          backgroundColor: 
                            item.type === 'Meeting' ? '#2196F3' :
                            item.type === 'Workshop' ? '#4CAF50' :
                            item.type === 'Social Gathering' ? '#FFC107' :
                            item.type === 'Financial Planning' ? '#9C27B0' :
                            '#FF9800'
                        }
                      ]}
                    />
                    <Title style={[styles.eventCardTitle, styles.pastEventTitle]}>
                      {item.title}
                    </Title>
                  </View>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <Icon name="calendar" size={16} color="#9E9E9E" />
                      <Text style={[styles.eventDetailText, styles.pastEventDetailText]}>
                        {formatDate(item.date)}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetail}>
                      <Icon 
                        name={item.isVirtual ? "video" : "map-marker"} 
                        size={16} 
                        color="#9E9E9E" 
                      />
                      <Text style={[styles.eventDetailText, styles.pastEventDetailText]}>
                        {item.isVirtual ? "Virtual Event" : item.location}
                      </Text>
                    </View>
                    
                    <View style={styles.eventDetail}>
                      <Icon name="account-group" size={16} color="#9E9E9E" />
                      <Text style={[styles.eventDetailText, styles.pastEventDetailText]}>
                        {item.attendeesCount} attended
                      </Text>
                    </View>
                  </View>
                </Card.Content>
                <Card.Actions>
                  <Button 
                    mode="text" 
                    icon="file-document"
                    onPress={() => navigation.navigate('EventSummary', { eventId: item.id })}
                  >
                    View Summary
                  </Button>
                </Card.Actions>
              </Card>
            )}
          />
        ) : (
          <View style={styles.emptyPastEvents}>
            <Text style={styles.emptyPastEventsText}>No past events</Text>
          </View>
        )}
      </View>
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setShowEventDialog(true)}
      />
    </View>
  ); a new discussion topic
      await createDiscussionTopic({
        title: topicTitle,
        content: topicContent,
        category: topicCategory,
        authorId: user.id
      });
      
      // Reset form and close dialog
      setTopicTitle('');
      setTopicContent('');
      setTopicCategory('');
      setShowTopicDialog(false);
      
      // Refresh topics list
      const topics = await getDiscussionTopics();
      setDiscussionTopics(topics);
      
      Alert.alert('Success', 'Discussion topic created successfully.');
    } catch (error) {
      console.error('Error creating topic:', error);
      Alert.alert('Error', 'Failed to create topic. Please try again.');
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!eventTitle.trim()) {
        Alert.alert('Error', 'Please enter an event title.');
        return;
      }
      
      if (!eventType) {
        Alert.alert('Error', 'Please select an event type.');
        return;
      }
      
      if (!eventLocation.trim() && !isVirtualEvent) {
        Alert.alert('Error', 'Please enter an event location.');
        return;
      }
      
      if (isVirtualEvent && !meetingLink.trim()) {
        Alert.alert('Error', 'Please enter a meeting link.');
        return;
      }
      
      // In a real app, this would create