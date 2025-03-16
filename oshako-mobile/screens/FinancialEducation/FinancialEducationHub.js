import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Searchbar,
  Chip,
  List,
  ProgressBar,
  Avatar,
  ActivityIndicator
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import {
  getLearningPaths,
  getRecommendedCourses,
  getFinancialTools,
  getSuccessStories,
  getUserLearningProgress
} from '../../services/api/education';

const screenWidth = Dimensions.get('window').width;

const FinancialEducationHub = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('learn');
  const [searchQuery, setSearchQuery] = useState('');
  const [learningPaths, setLearningPaths] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [financialTools, setFinancialTools] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const categories = [
    'Saving', 
    'Budgeting', 
    'Investing', 
    'Debt Management', 
    'Group Savings'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch learning paths
      const paths = await getLearningPaths();
      setLearningPaths(paths);
      
      // Fetch recommended courses
      const courses = await getRecommendedCourses(user.id);
      setRecommendedCourses(courses);
      
      // Fetch financial tools
      const tools = await getFinancialTools();
      setFinancialTools(tools);
      
      // Fetch success stories
      const stories = await getSuccessStories();
      setSuccessStories(stories);
      
      // Fetch user learning progress
      const progress = await getUserLearningProgress(user.id);
      setUserProgress(progress);
    } catch (error) {
      console.error('Error fetching education hub data:', error);
      Alert.alert('Error', 'Failed to load educational content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    // In a real app, you would filter content based on the search query
  };

  const toggleCategoryFilter = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleStartCourse = (courseId) => {
    // Navigate to course details screen
    navigation.navigate('CourseDetails', { courseId });
  };

  const handleOpenTool = (toolId) => {
    // Navigate to tool screen
    navigation.navigate('FinancialTool', { toolId });
  };

  const handleViewStory = (storyId) => {
    // Navigate to success story details
    navigation.navigate('SuccessStoryDetails', { storyId });
  };

  const renderLearningPathItem = ({ item }) => (
    <Card style={styles.learningPathCard}>
      <Card.Cover source={{ uri: item.coverImage }} style={styles.learningPathCover} />
      <Card.Content>
        <Title style={styles.learningPathTitle}>{item.title}</Title>
        <Paragraph style={styles.learningPathDescription}>{item.description}</Paragraph>
        
        <View style={styles.learningPathMetrics}>
          <View style={styles.learningPathMetric}>
            <Icon name="book-open-variant" size={16} color="#666" />
            <Text style={styles.learningPathMetricText}>{item.modulesCount} modules</Text>
          </View>
          
          <View style={styles.learningPathMetric}>
            <Icon name="clock-outline" size={16} color="#666" />
            <Text style={styles.learningPathMetricText}>{item.duration}</Text>
          </View>
          
          <View style={styles.learningPathMetric}>
            <Icon name="account-multiple" size={16} color="#666" />
            <Text style={styles.learningPathMetricText}>{item.enrolledCount} enrolled</Text>
          </View>
        </View>
        
        {item.progress > 0 && (
          <View style={styles.learningPathProgress}>
            <ProgressBar progress={item.progress / 100} color={theme.colors.primary} style={styles.progressBar} />
            <Text style={styles.progressText}>{item.progress}% completed</Text>
          </View>
        )}
      </Card.Content>
      
      <Card.Actions style={styles.learningPathActions}>
        <Button 
          mode={item.progress > 0 ? "contained" : "outlined"} 
          onPress={() => handleStartCourse(item.id)}
        >
          {item.progress > 0 ? "Continue" : "Start"}
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderRecommendedCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recommendedCourseCard}
      onPress={() => handleStartCourse(item.id)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.courseImage} />
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <View style={styles.courseStats}>
          <Text style={styles.courseDuration}>{item.duration}</Text>
          <View style={styles.courseRating}>
            <Icon name="star" size={14} color="#FFC107" />
            <Text style={styles.courseRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFinancialToolItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.toolCard}
      onPress={() => handleOpenTool(item.id)}
    >
      <View style={[styles.toolIconContainer, { backgroundColor: item.color || '#2196F3' }]}>
        <Icon name={item.icon} size={24} color="#FFF" />
      </View>
      <Text style={styles.toolTitle}>{item.title}</Text>
      <Text style={styles.toolDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderSuccessStoryItem = ({ item }) => (
    <Card style={styles.storyCard} onPress={() => handleViewStory(item.id)}>
      <Card.Content>
        <View style={styles.storyHeader}>
          <Avatar.Image source={{ uri: item.memberAvatar }} size={50} />
          <View style={styles.storyHeaderText}>
            <Title style={styles.storyTitle}>{item.title}</Title>
            <Paragraph style={styles.storyMember}>{item.memberName}</Paragraph>
          </View>
        </View>
        
        <Paragraph style={styles.storyExcerpt}>{item.excerpt}</Paragraph>
        
        <View style={styles.storyTags}>
          {item.tags.map((tag, index) => (
            <Chip key={index} style={styles.storyTag}>{tag}</Chip>
          ))}
        </View>
        
        <View style={styles.storyStats}>
          <View style={styles.storyStat}>
            <Icon name="bank-transfer" size={16} color="#666" />
            <Text style={styles.storyStatText}>{item.savingsAmount}</Text>
          </View>
          
          <View style={styles.storyStat}>
            <Icon name="calendar-range" size={16} color="#666" />
            <Text style={styles.storyStatText}>{item.timeframe}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderLearnTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* User Learning Progress */}
      {userProgress && (
        <Card style={styles.progressCard}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <View>
                <Title style={styles.progressTitle}>Your Learning Progress</Title>
                <Paragraph style={styles.progressSubtitle}>
                  {userProgress.completedCourses} courses completed
                </Paragraph>
              </View>
              
              <View style={styles.progressBadge}>
                <Icon name="school" size={24} color={theme.colors.primary} />
                <Text style={styles.progressBadgeText}>Level {userProgress.level}</Text>
              </View>
            </View>
            
            <View style={styles.overallProgress}>
              <ProgressBar 
                progress={userProgress.overallProgress / 100} 
                color={theme.colors.primary}
                style={styles.overallProgressBar}
              />
              <Text style={styles.overallProgressText}>
                {userProgress.overallProgress}% toward next level
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}
      
      {/* Recommended Courses */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllCourses')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={recommendedCourses}
        renderItem={renderRecommendedCourseItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendedCoursesContainer}
      />
      
      {/* Learning Paths */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Learning Paths</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllLearningPaths')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={learningPaths}
        renderItem={renderLearningPathItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </ScrollView>
  );

  const renderToolsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <View style={styles.toolsGrid}>
        {financialTools.map((tool) => renderFinancialToolItem({ item: tool }))}
      </View>
    </ScrollView>
  );

  const renderStoriesTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {successStories.map((story) => renderSuccessStoryItem({ item: story }))}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading educational content...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Education</Text>
        <Text style={styles.headerSubtitle}>Improve your financial knowledge</Text>
      </View>
      
      {/* Search Bar */}
      <Searchbar
        placeholder="Search courses, tools and stories"
        onChangeText={onSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {/* Category Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            selected={selectedCategories.includes(category)}
            onPress={() => toggleCategoryFilter(category)}
            style={styles.categoryChip}
            selectedColor={theme.colors.primary}
          >
            {category}
          </Chip>
        ))}
      </ScrollView>
      
      {/* Tab Menu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'learn' && styles.activeTab]}
          onPress={() => setActiveTab('learn')}
        >
          <Icon 
            name="school" 
            size={24} 
            color={activeTab === 'learn' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'learn' && styles.activeTabText
            ]}
          >
            Learn
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'tools' && styles.activeTab]}
          onPress={() => setActiveTab('tools')}
        >
          <Icon 
            name="calculator-variant" 
            size={24} 
            color={activeTab === 'tools' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'tools' && styles.activeTabText
            ]}
          >
            Tools
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stories' && styles.activeTab]}
          onPress={() => setActiveTab('stories')}
        >
          <Icon 
            name="account-group" 
            size={24} 
            color={activeTab === 'stories' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'stories' && styles.activeTabText
            ]}
          >
            Success Stories
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {activeTab === 'learn' && renderLearnTab()}
      {activeTab === 'tools' && renderToolsTab()}
      {activeTab === 'stories' && renderStoriesTab()}
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
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  categoryChip: {
    marginRight: 8
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
  progressCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  progressTitle: {
    fontSize: 18
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#666'
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  progressBadgeText: {
    marginLeft: 4,
    color: theme.colors.primary,
    fontWeight: '500'
  },
  overallProgress: {
    marginTop: 8
  },
  overallProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  overallProgressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500'
  },
  seeAllText: {
    color: theme.colors.primary
  },
  recommendedCoursesContainer: {
    paddingRight: 16
  },
  recommendedCourseCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  courseImage: {
    width: '100%',
    height: 100
  },
  courseContent: {
    padding: 12
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  courseDuration: {
    fontSize: 12,
    color: '#666'
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  courseRatingText: {
    fontSize: 12,
    marginLeft: 4
  },
  learningPathCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  learningPathCover: {
    height: 140
  },
  learningPathTitle: {
    fontSize: 18,
    marginTop: 4
  },
  learningPathDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  learningPathMetrics: {
    flexDirection: 'row',
    marginTop: 12
  },
  learningPathMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  learningPathMetricText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  learningPathProgress: {
    marginTop: 12
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right'
  },
  learningPathActions: {
    justifyContent: 'flex-end',
    paddingTop: 8
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  toolCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  toolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  toolDescription: {
    fontSize: 14,
    color: '#666'
  },
  storyCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  storyHeader: {
    flexDirection: 'row',
    marginBottom: 12
  },
  storyHeaderText: {
    marginLeft: 12,
    flex: 1
  },
  storyTitle: {
    fontSize: 18
  },
  storyMember: {
    fontSize: 14,
    color: '#666'
  },
  storyExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12
  },
  storyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  storyTag: {
    marginRight: 8,
    marginBottom: 8
  },
  storyStats: {
    flexDirection: 'row'
  },
  storyStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  storyStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  }
});

export default FinancialEducationHub;
    