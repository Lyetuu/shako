import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Dialog,
  Portal,
  List,
  ProgressBar,
  Chip,
  IconButton,
  Avatar,
  Badge,
  FAB
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import {
  getUserAchievements,
  getGroupAchievements,
  getActiveGroupChallenges,
  getAvailableBadges,
  getUserLeaderboardPosition,
  getLeaderboard,
  claimAchievement,
  joinGroupChallenge,
  getRewardHistory,
  redeemReward
} from '../../services/api/gamification';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';

const screenWidth = Dimensions.get('window').width - 40;

// Badge levels and colors
const BADGE_LEVELS = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF'
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
  headerSection: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    paddingBottom: 0
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  screenSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12
  },
  activeTab: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  tabText: {
    marginLeft: 8
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '500'
  },
  inactiveTabText: {
    color: 'rgba(255, 255, 255, 0.7)'
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
    marginBottom: 16
  },
  achievementStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  achievementStat: {
    alignItems: 'center'
  },
  achievementStatValue: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  achievementStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  pointsProgress: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  pointsProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  pointsProgressTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  pointsProgressValue: {
    fontSize: 14,
    color: '#666'
  },
  pointsProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4
  },
  levelLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  currentLevelText: {
    fontSize: 12,
    color: '#666'
  },
  nextLevelText: {
    fontSize: 12,
    color: '#666'
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  badgeItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 4
  },
  badgeName: {
    fontSize: 12,
    textAlign: 'center'
  },
  emptyBadges: {
    alignItems: 'center',
    padding: 24
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  achievementsList: {
    marginTop: 8
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  achievementLeft: {
    flexDirection: 'row',
    flex: 1
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  achievementInfo: {
    flex: 1
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  achievementProgressContainer: {
    marginTop: 4
  },
  achievementProgress: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4
  },
  achievementProgressText: {
    fontSize: 12,
    color: '#666'
  },
  achievementRight: {
    alignItems: 'flex-end'
  },
  achievedChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  achievementPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 8
  },
  dialog: {
    borderRadius: 8
  },
  achievementDialogHeader: {
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  achievementDialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16
  },
  achievementDialogContent: {
    paddingTop: 16
  },
  achievementDialogDescription: {
    fontSize: 16,
    marginBottom: 16
  },
  achievementReward: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  achievementRewardLabel: {
    fontSize: 14,
    fontWeight: '500'
  },
  achievementRewardValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  achievementBadge: {
    marginBottom: 16
  },
  achievementBadgeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  achievementBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  achievementBadgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  achievementBadgeName: {
    fontSize: 14,
    fontWeight: '500'
  },
  achievementRequirements: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  achievementRequirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  requirementIcon: {
    marginRight: 8,
    marginTop: 2
  },
  requirementText: {
    fontSize: 14,
    flex: 1
  },
  completedRequirementText: {
    color: '#4CAF50'
  },
  challengesList: {
    marginTop: 8
  },
  challengeItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  challengeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  challengeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  challengeName: {
    fontSize: 16,
    fontWeight: '500'
  },
  participantsBadge: {
    backgroundColor: theme.colors.primary
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  challengeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  challengeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4
  },
  challengeDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4
  },
  challengeProgress: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12
  },
  challengeProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  challengeProgressTitle: {
    fontSize: 14,
    fontWeight: '500'
  },
  challengeProgressPercent: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  challengeProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  challengeProgressDetail: {
    fontSize: 12,
    color: '#666'
  },
  joinChallengeButton: {
    marginTop: 8
  },
  emptyChallenges: {
    alignItems: 'center',
    padding: 24
  },
  groupAchievementsList: {
    marginTop: 8
  },
  groupAchievementItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  groupAchievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  groupAchievementIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  groupAchievementName: {
    fontSize: 16,
    fontWeight: '500'
  },
  groupAchievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  groupAchievementProgress: {
    marginTop: 8
  },
  groupProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  groupProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  groupProgressPercent: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  groupProgressDetail: {
    fontSize: 12,
    color: '#666'
  },
  emptyGroupAchievements: {
    alignItems: 'center',
    padding: 24
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 24
  },
  topPlayerContainer: {
    alignItems: 'center',
    marginHorizontal: 8
  },
  firstPlacePosition: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  firstPlaceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  secondPlacePosition: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  secondPlaceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  thirdPlacePosition: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#CD7F32',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  thirdPlaceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  topPlayerAvatar: {
    marginBottom: 8
  },
  topPlayerName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center'
  },
  topPlayerPoints: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  topPlayerBadge: {
    alignItems: 'center'
  },
  leaderboardList: {
    marginTop: 8
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  leaderboardRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  leaderboardRankText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  leaderboardPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  leaderboardAvatar: {
    marginRight: 12
  },
  leaderboardPlayerDetails: {
    flex: 1
  },
  leaderboardPlayerName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2
  },
  leaderboardBadges: {
    flexDirection: 'row'
  },
  leaderboardBadgeIcon: {
    marginRight: 4
  },
  leaderboardPoints: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  yourRankingContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginTop: 8
  },
  yourRankingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  yourRankingPosition: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  yourRankingPositionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  yourRankingInfo: {
    flex: 1
  },
  yourRankingName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2
  },
  yourRankingPoints: {
    fontSize: 14,
    color: '#666'
  },
  rankingDivider: {
    marginBottom: 16
  },
  rankingStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  rankingStat: {
    alignItems: 'center'
  },
  rankingStatValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  rankingStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  rankingChart: {
    marginVertical: 8,
    borderRadius: 8
  },
  challengeDialogHeader: {
    padding: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  challengeDialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16
  },
  challengeDialogContent: {
    paddingTop: 16
  },
  challengeDialogDescription: {
    fontSize: 16,
    marginBottom: 16
  },
  challengeTimeline: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  challengeTimelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  challengeTimelineLabel: {
    fontSize: 14,
    color: '#666'
  },
  challengeTimelineValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  challengeDivider: {
    marginBottom: 16
  },
  challengeReward: {
    marginBottom: 16
  },
  challengeRewardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  challengeRewardDescription: {
    fontSize: 14
  },
  challengeDialogProgress: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  challengeDialogProgressTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  challengeDialogProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8
  },
  challengeDialogProgressDetail: {
    fontSize: 12,
    color: '#666'
  },
  challengeParticipants: {
    marginTop: 8
  },
  challengeParticipantsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  participantAvatars: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  participantAvatarContainer: {
    marginRight: 4,
    marginBottom: 4
  },
  moreParticipants: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    marginBottom: 4
  },
  moreParticipantsText: {
    fontSize: 10,
    fontWeight: '500'
  },
  badgeDialogContent: {
    alignItems: 'center',
    padding: 16
  },
  badgeDialogIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: 16
  },
  badgeDialogName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  badgeLevel: {
    marginBottom: 16
  },
  badgeLevelText: {
    fontSize: 16,
    fontWeight: '500'
  },
  badgeDialogDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16
  },
  badgeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8
  },
  badgeStat: {
    alignItems: 'center'
  },
  badgeStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  badgeStatValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  rewardsDialog: {
    borderRadius: 8,
    maxHeight: '80%'
  },
  rewardsScrollArea: {
    paddingHorizontal: 0
  },
  rewardsContent: {
    padding: 16
  },
  rewardsHeader: {
    marginBottom: 16
  },
  rewardsPoints: {
    fontSize: 16,
    fontWeight: '500'
  },
  pointsValue: {
    color: theme.colors.primary
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  availableRewardsList: {
    marginBottom: 16
  },
  rewardItem: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  rewardInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2
  },
  rewardDescription: {
    fontSize: 14,
    color: '#666'
  },
  rewardCost: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12
  },
  rewardCostValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  rewardsDivider: {
    marginBottom: 16
  },
  rewardHistoryList: {
    marginTop: 8
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  historyItemIcon: {
    marginRight: 8
  },
  historyItemInfo: {
    flex: 1
  },
  historyItemName: {
    fontSize: 14,
    fontWeight: '500'
  },
  historyItemDate: {
    fontSize: 12,
    color: '#666'
  },
  historyItemCost: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  emptyRewardHistory: {
    alignItems: 'center',
    padding: 24
  },
  emptyRewardHistoryText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary
  }
});

export default GamificationScreen;

const GamificationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('achievements');
  const [userAchievements, setUserAchievements] = useState([]);
  const [groupAchievements, setGroupAchievements] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [availableBadges, setAvailableBadges] = useState([]);
  const [userLeaderboard, setUserLeaderboard] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);
  const [showBadgeDialog, setShowBadgeDialog] = useState(false);
  const [showRewardsDialog, setShowRewardsDialog] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [availableRewards, setAvailableRewards] = useState([]);
  
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
      // Fetch user achievements
      const userAchievementsData = await getUserAchievements(user.id, groupId);
      setUserAchievements(userAchievementsData);
      
      // Fetch group achievements
      const groupAchievementsData = await getGroupAchievements(groupId);
      setGroupAchievements(groupAchievementsData);
      
      // Fetch active group challenges
      const challengesData = await getActiveGroupChallenges(groupId);
      setActiveChallenges(challengesData);
      
      // Fetch available badges
      const badgesData = await getAvailableBadges(groupId);
      setAvailableBadges(badgesData);
      
      // Fetch user leaderboard position
      const userLeaderboardData = await getUserLeaderboardPosition(user.id, groupId);
      setUserLeaderboard(userLeaderboardData);
      
      // Fetch leaderboard
      const leaderboardData = await getLeaderboard(groupId);
      setLeaderboard(leaderboardData);
      
      // Fetch reward history
      const rewardHistoryData = await getRewardHistory(user.id, groupId);
      setRewardHistory(rewardHistoryData);
      
      // Set sample available rewards (in a real app, this would come from the API)
      setAvailableRewards([
        {
          id: '1',
          name: 'Fee Waiver',
          description: 'Get your next monthly fee waived',
          pointsCost: 200,
          icon: 'cash-remove',
          color: '#4CAF50'
        },
        {
          id: '2',
          name: 'Priority Access',
          description: 'Get priority access for your next loan request',
          pointsCost: 300,
          icon: 'star',
          color: '#FF9800'
        },
        {
          id: '3',
          name: 'Interest Discount',
          description: '0.5% interest rate discount on your next loan',
          pointsCost: 500,
          icon: 'percent',
          color: '#2196F3'
        }
      ]);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
      Alert.alert('Error', 'Failed to load gamification data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClaimAchievement = async (achievementId) => {
    try {
      await claimAchievement(user.id, groupId, achievementId);
      
      // Update user achievements
      const updatedAchievements = await getUserAchievements(user.id, groupId);
      setUserAchievements(updatedAchievements);
      
      // Update user leaderboard position
      const updatedLeaderboardPosition = await getUserLeaderboardPosition(user.id, groupId);
      setUserLeaderboard(updatedLeaderboardPosition);
      
      setShowAchievementDialog(false);
      Alert.alert('Success', 'Achievement claimed successfully!');
    } catch (error) {
      console.error('Error claiming achievement:', error);
      Alert.alert('Error', 'Failed to claim achievement. Please try again.');
    }
  };
  
  const handleJoinChallenge = async (challengeId) => {
    try {
      await joinGroupChallenge(user.id, groupId, challengeId);
      
      // Update active challenges
      const updatedChallenges = await getActiveGroupChallenges(groupId);
      setActiveChallenges(updatedChallenges);
      
      setShowChallengeDialog(false);
      Alert.alert('Success', 'You have joined the challenge!');
    } catch (error) {
      console.error('Error joining challenge:', error);
      Alert.alert('Error', 'Failed to join challenge. Please try again.');
    }
  };
  
  const handleRedeemReward = async (rewardId) => {
    try {
      await redeemReward(user.id, groupId, rewardId);
      
      // Update reward history
      const updatedRewardHistory = await getRewardHistory(user.id, groupId);
      setRewardHistory(updatedRewardHistory);
      
      // Update user leaderboard position (to refresh points)
      const updatedLeaderboardPosition = await getUserLeaderboardPosition(user.id, groupId);
      setUserLeaderboard(updatedLeaderboardPosition);
      
      Alert.alert('Success', 'Reward redeemed successfully!');
    } catch (error) {
      console.error('Error redeeming reward:', error);
      Alert.alert('Error', 'Failed to redeem reward. Please try again.');
    }
  };
  
  const renderAchievementsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* User Achievements Stats Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.achievementStats}>
            <View style={styles.achievementStat}>
              <Text style={styles.achievementStatValue}>{userAchievements.filter(a => a.achieved).length}</Text>
              <Text style={styles.achievementStatLabel}>Achievements</Text>
            </View>
            
            <View style={styles.achievementStat}>
              <Text style={styles.achievementStatValue}>{userLeaderboard?.totalPoints || 0}</Text>
              <Text style={styles.achievementStatLabel}>Points</Text>
            </View>
            
            <View style={styles.achievementStat}>
              <Text style={styles.achievementStatValue}>{userLeaderboard?.rank || '-'}</Text>
              <Text style={styles.achievementStatLabel}>Rank</Text>
            </View>
          </View>
          
          <View style={styles.pointsProgress}>
            <View style={styles.pointsProgressHeader}>
              <Text style={styles.pointsProgressTitle}>Next Level</Text>
              <Text style={styles.pointsProgressValue}>
                {userLeaderboard?.pointsToNextLevel} points to go
              </Text>
            </View>
            <ProgressBar 
              progress={userLeaderboard?.levelProgress || 0} 
              color={theme.colors.primary}
              style={styles.pointsProgressBar}
            />
            <View style={styles.levelLabels}>
              <Text style={styles.currentLevelText}>
                Level {userLeaderboard?.currentLevel || 1}
              </Text>
              <Text style={styles.nextLevelText}>
                Level {userLeaderboard?.nextLevel || 2}
              </Text>
            </View>
          </View>
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="text" 
            icon="gift"
            onPress={() => setShowRewardsDialog(true)}
          >
            Redeem Rewards
          </Button>
        </Card.Actions>
      </Card>
      
      {/* User Badges Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Your Badges</Title>
          
          <View style={styles.badgesContainer}>
            {userAchievements
              .filter(achievement => achievement.achieved && achievement.badge)
              .map((achievement, index) => (
                <TouchableOpacity
                  key={achievement.id}
                  style={styles.badgeItem}
                  onPress={() => {
                    setSelectedBadge(achievement);
                    setShowBadgeDialog(true);
                  }}
                >
                  <View 
                    style={[
                      styles.badgeIcon, 
                      { 
                        backgroundColor: achievement.badge.color || BADGE_LEVELS[achievement.badge.level] || '#2196F3',
                        borderColor: BADGE_LEVELS[achievement.badge.level] || '#2196F3'
                      }
                    ]}
                  >
                    <Icon name={achievement.badge.icon} size={24} color="#fff" />
                  </View>
                  <Text style={styles.badgeName}>{achievement.badge.name}</Text>
                </TouchableOpacity>
              ))}
              
            {userAchievements.filter(achievement => achievement.achieved && achievement.badge).length === 0 && (
              <View style={styles.emptyBadges}>
                <Icon name="shield-off" size={48} color="#9E9E9E" />
                <Text style={styles.emptyText}>No badges earned yet</Text>
                <Text style={styles.emptySubtext}>
                  Complete achievements to earn badges
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
      
      {/* Available Achievements Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Achievements</Title>
          
          <View style={styles.achievementsList}>
            {userAchievements.map((achievement) => (
              <TouchableOpacity
                key={achievement.id}
                style={styles.achievementItem}
                onPress={() => {
                  setSelectedAchievement(achievement);
                  setShowAchievementDialog(true);
                }}
              >
                <View style={styles.achievementLeft}>
                  <View 
                    style={[
                      styles.achievementIcon, 
                      { 
                        backgroundColor: achievement.achieved ? '#4CAF50' : '#9E9E9E',
                        opacity: achievement.achieved ? 1 : 0.7
                      }
                    ]}
                  >
                    <Icon name={achievement.icon} size={24} color="#fff" />
                  </View>
                  
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementName}>{achievement.name}</Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    
                    {achievement.progress < 100 && !achievement.achieved && (
                      <View style={styles.achievementProgressContainer}>
                        <ProgressBar 
                          progress={achievement.progress / 100} 
                          color="#2196F3"
                          style={styles.achievementProgress} 
                        />
                        <Text style={styles.achievementProgressText}>
                          {achievement.progress}% complete
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.achievementRight}>
                  {achievement.achieved ? (
                    <Chip 
                      style={styles.achievedChip}
                      icon="check-circle"
                    >
                      Achieved
                    </Chip>
                  ) : achievement.progress === 100 ? (
                    <Button 
                      mode="contained" 
                      onPress={() => handleClaimAchievement(achievement.id)}
                      compact
                    >
                      Claim
                    </Button>
                  ) : (
                    <Text style={styles.achievementPoints}>+{achievement.points}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
  
  const renderChallengesTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Current Challenges Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Active Challenges</Title>
          
          {activeChallenges.length > 0 ? (
            <View style={styles.challengesList}>
              {activeChallenges.map((challenge) => (
                <TouchableOpacity
                  key={challenge.id}
                  style={styles.challengeItem}
                  onPress={() => {
                    setSelectedChallenge(challenge);
                    setShowChallengeDialog(true);
                  }}
                >
                  <View style={styles.challengeHeader}>
                    <View style={styles.challengeHeaderLeft}>
                      <View 
                        style={[
                          styles.challengeIconContainer, 
                          { backgroundColor: challenge.color || '#2196F3' }
                        ]}
                      >
                        <Icon name={challenge.icon} size={24} color="#fff" />
                      </View>
                      <Text style={styles.challengeName}>{challenge.name}</Text>
                    </View>
                    
                    <Badge style={styles.participantsBadge}>
                      {challenge.participantsCount}
                    </Badge>
                  </View>
                  
                  <Text style={styles.challengeDescription}>
                    {challenge.description}
                  </Text>
                  
                  <View style={styles.challengeDetails}>
                    <View style={styles.challengeDetail}>
                      <Icon name="calendar-range" size={16} color="#666" />
                      <Text style={styles.challengeDetailText}>
                        Ends in {challenge.daysRemaining} days
                      </Text>
                    </View>
                    
                    <View style={styles.challengeDetail}>
                      <Icon name="trophy" size={16} color="#666" />
                      <Text style={styles.challengeDetailText}>
                        {challenge.reward}
                      </Text>
                    </View>
                  </View>
                  
                  {challenge.joined ? (
                    <View style={styles.challengeProgress}>
                      <View style={styles.challengeProgressHeader}>
                        <Text style={styles.challengeProgressTitle}>Your Progress</Text>
                        <Text style={styles.challengeProgressPercent}>
                          {challenge.progress}%
                        </Text>
                      </View>
                      
                      <ProgressBar 
                        progress={challenge.progress / 100} 
                        color={challenge.color || '#2196F3'}
                        style={styles.challengeProgressBar} 
                      />
                      
                      <Text style={styles.challengeProgressDetail}>
                        {challenge.progressDetail}
                      </Text>
                    </View>
                  ) : (
                    <Button 
                      mode="contained" 
                      icon="flag"
                      onPress={() => handleJoinChallenge(challenge.id)}
                      style={styles.joinChallengeButton}
                    >
                      Join Challenge
                    </Button>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyChallenges}>
              <Icon name="flag-off" size={48} color="#9E9E9E" />
              <Text style={styles.emptyText}>No active challenges</Text>
              <Text style={styles.emptySubtext}>
                Check back soon for new challenges
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Group Achievements Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Group Achievements</Title>
          
          {groupAchievements.length > 0 ? (
            <View style={styles.groupAchievementsList}>
              {groupAchievements.map((achievement) => (
                <View key={achievement.id} style={styles.groupAchievementItem}>
                  <View style={styles.groupAchievementHeader}>
                    <View 
                      style={[
                        styles.groupAchievementIcon, 
                        { backgroundColor: achievement.color || '#2196F3' }
                      ]}
                    >
                      <Icon name={achievement.icon} size={24} color="#fff" />
                    </View>
                    <Text style={styles.groupAchievementName}>{achievement.name}</Text>
                  </View>
                  
                  <Text style={styles.groupAchievementDescription}>
                    {achievement.description}
                  </Text>
                  
                  <View style={styles.groupAchievementProgress}>
                    <ProgressBar 
                      progress={achievement.progress / 100} 
                      color={achievement.color || '#2196F3'}
                      style={styles.groupProgressBar} 
                    />
                    
                    <View style={styles.groupProgressLabels}>
                      <Text style={styles.groupProgressPercent}>{achievement.progress}%</Text>
                      <Text style={styles.groupProgressDetail}>
                        {achievement.progressDetail}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyGroupAchievements}>
              <Icon name="trophy-off" size={48} color="#9E9E9E" />
              <Text style={styles.emptyText}>No group achievements yet</Text>
              <Text style={styles.emptySubtext}>
                Work together to achieve group goals
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
  
  const renderLeaderboardTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Top Players Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Top Members</Title>
          
          <View style={styles.topThreeContainer}>
            {/* Second Place */}
            {leaderboard.length > 1 && (
              <View style={styles.topPlayerContainer}>
                <View style={styles.secondPlacePosition}>
                  <Text style={styles.secondPlaceText}>2</Text>
                </View>
                
                <View style={styles.topPlayerAvatar}>
                  {leaderboard[1].avatar ? (
                    <Avatar.Image source={{ uri: leaderboard[1].avatar }} size={50} />
                  ) : (
                    <Avatar.Text label={leaderboard[1].name.substring(0, 2)} size={50} />
                  )}
                </View>
                
                <Text style={styles.topPlayerName}>{leaderboard[1].name}</Text>
                <Text style={styles.topPlayerPoints}>{leaderboard[1].points} pts</Text>
                
                {leaderboard[1].badges && leaderboard[1].badges.length > 0 && (
                  <View style={styles.topPlayerBadge}>
                    <Icon 
                      name={leaderboard[1].badges[0].icon} 
                      size={16} 
                      color={BADGE_LEVELS[leaderboard[1].badges[0].level]} 
                    />
                  </View>
                )}
              </View>
            )}
            
            {/* First Place */}
            {leaderboard.length > 0 && (
              <View style={styles.topPlayerContainer}>
                <View style={styles.firstPlacePosition}>
                  <Text style={styles.firstPlaceText}>1</Text>
                </View>
                
                <View style={styles.topPlayerAvatar}>
                  {leaderboard[0].avatar ? (
                    <Avatar.Image source={{ uri: leaderboard[0].avatar }} size={60} />
                  ) : (
                    <Avatar.Text label={leaderboard[0].name.substring(0, 2)} size={60} />
                  )}
                </View>
                
                <Text style={styles.topPlayerName}>{leaderboard[0].name}</Text>
                <Text style={styles.topPlayerPoints}>{leaderboard[0].points} pts</Text>
                
                {leaderboard[0].badges && leaderboard[0].badges.length > 0 && (
                  <View style={styles.topPlayerBadge}>
                    <Icon 
                      name={leaderboard[0].badges[0].icon} 
                      size={16} 
                      color={BADGE_LEVELS[leaderboard[0].badges[0].level]} 
                    />
                  </View>
                )}
              </View>
            )}
            
            {/* Third Place */}
            {leaderboard.length > 2 && (
              <View style={styles.topPlayerContainer}>
                <View style={styles.thirdPlacePosition}>
                  <Text style={styles.thirdPlaceText}>3</Text>
                </View>
                
                <View style={styles.topPlayerAvatar}>
                  {leaderboard[2].avatar ? (
                    <Avatar.Image source={{ uri: leaderboard[2].avatar }} size={50} />
                  ) : (
                    <Avatar.Text label={leaderboard[2].name.substring(0, 2)} size={50} />
                  )}
                </View>
                
                <Text style={styles.topPlayerName}>{leaderboard[2].name}</Text>
                <Text style={styles.topPlayerPoints}>{leaderboard[2].points} pts</Text>
                
                {leaderboard[2].badges && leaderboard[2].badges.length > 0 && (
                  <View style={styles.topPlayerBadge}>
                    <Icon 
                      name={leaderboard[2].badges[0].icon} 
                      size={16} 
                      color={BADGE_LEVELS[leaderboard[2].badges[0].level]} 
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
      
      {/* Full Leaderboard Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Leaderboard</Title>
          
          <View style={styles.leaderboardList}>
            {leaderboard.slice(3).map((player, index) => (
              <View key={player.id} style={styles.leaderboardItem}>
                <View style={styles.leaderboardRank}>
                  <Text style={styles.leaderboardRankText}>{index + 4}</Text>
                </View>
                
                <View style={styles.leaderboardPlayerInfo}>
                  {player.avatar ? (
                    <Avatar.Image source={{ uri: player.avatar }} size={36} style={styles.leaderboardAvatar} />
                  ) : (
                    <Avatar.Text label={player.name.substring(0, 2)} size={36} style={styles.leaderboardAvatar} />
                  )}
                  
                  <View style={styles.leaderboardPlayerDetails}>
                    <Text style={styles.leaderboardPlayerName}>{player.name}</Text>
                    <View style={styles.leaderboardBadges}>
                      {player.badges && player.badges.slice(0, 3).map((badge, badgeIndex) => (
                        <Icon 
                          key={badgeIndex}
                          name={badge.icon} 
                          size={14} 
                          color={BADGE_LEVELS[badge.level]} 
                          style={styles.leaderboardBadgeIcon}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                
                <Text style={styles.leaderboardPoints}>{player.points} pts</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
      
      {/* Your Ranking Card */}
      {userLeaderboard && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Your Ranking</Title>
            
            <View style={styles.yourRankingContainer}>
              <View style={styles.yourRankingHeader}>
                <View style={styles.yourRankingPosition}>
                  <Text style={styles.yourRankingPositionText}>
                    {userLeaderboard.rank}
                  </Text>
                </View>
                
                <View style={styles.yourRankingInfo}>
                  <Text style={styles.yourRankingName}>
                    {user.name}
                  </Text>
                  <Text style={styles.yourRankingPoints}>
                    {userLeaderboard.totalPoints} points
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.rankingDivider} />
              
              <View style={styles.rankingStats}>
                <View style={styles.rankingStat}>
                  <Text style={styles.rankingStatValue}>{userLeaderboard.pointsThisMonth}</Text>
                  <Text style={styles.rankingStatLabel}>This Month</Text>
                </View>
                
                <View style={styles.rankingStat}>
                  <Text style={styles.rankingStatValue}>{userLeaderboard.totalAchievements}</Text>
                  <Text style={styles.rankingStatLabel}>Achievements</Text>
                </View>
                
                <View style={styles.rankingStat}>
                  <Text 
                    style={[
                      styles.rankingStatValue,
                      { 
                        color: userLeaderboard.trendsUp ? '#4CAF50' : '#F44336' 
                      }
                    ]}
                  >
                    {userLeaderboard.trendsUp ? '+' : '-'}{userLeaderboard.trendsValue}
                  </Text>
                  <Text style={styles.rankingStatLabel}>Trend</Text>
                </View>
              </View>
              
              <LineChart
                data={{
                  labels: userLeaderboard.history.map(h => h.month),
                  datasets: [
                    {
                      data: userLeaderboard.history.map(h => h.points)
                    }
                  ]
                }}
                width={screenWidth}
                height={180}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={styles.rankingChart}
              />
            </View>
          </Card.Content>
          
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="text" 
              icon="share-variant"
              onPress={() => {
                // Share ranking
                Alert.alert('Share', 'Sharing your ranking...');
              }}
            >
              Share My Ranking
            </Button>
          </Card.Actions>
        </Card>
      )}
    </ScrollView>
  );
  
  const renderAchievementDialog = () => (
    <Portal>
      <Dialog
        visible={showAchievementDialog}
        onDismiss={() => setShowAchievementDialog(false)}
        style={styles.dialog}
      >
        {selectedAchievement && (
          <>
            <View 
              style={[
                styles.achievementDialogHeader, 
                { backgroundColor: selectedAchievement.color || '#2196F3' }
              ]}
            >
              <Icon name={selectedAchievement.icon} size={40} color="#fff" />
              <Text style={styles.achievementDialogTitle}>
                {selectedAchievement.name}
              </Text>
            </View>
            
            <Dialog.Content style={styles.achievementDialogContent}>
              <Text style={styles.achievementDialogDescription}>
                {selectedAchievement.description}
              </Text>
              
              <View style={styles.achievementReward}>
                <Text style={styles.achievementRewardLabel}>Reward:</Text>
                <Text style={styles.achievementRewardValue}>
                  {selectedAchievement.points} points
                </Text>
              </View>
              
              {selectedAchievement.badge && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementBadgeLabel}>Badge:</Text>
                  <View style={styles.achievementBadgeContainer}>
                    <View 
                      style={[
                        styles.achievementBadgeIcon, 
                        { 
                          backgroundColor: selectedAchievement.badge.color || BADGE_LEVELS[selectedAchievement.badge.level] || '#2196F3',
                          borderColor: BADGE_LEVELS[selectedAchievement.badge.level] || '#2196F3'
                        }
                      ]}
                    >
                      <Icon name={selectedAchievement.badge.icon} size={20} color="#fff" />
                    </View>
                    <Text style={styles.achievementBadgeName}>
                      {selectedAchievement.badge.name}
                    </Text>
                  </View>
                </View>
              )}
              
              {!selectedAchievement.achieved && (
                <View style={styles.achievementRequirements}>
                  <Text style={styles.achievementRequirementsTitle}>
                    Requirements:
                  </Text>
                  {selectedAchievement.requirements.map((req, index) => (
                    <View key={index} style={styles.requirementItem}>
                      <Icon 
                        name={req.completed ? "check-circle" : "circle-outline"} 
                        size={20} 
                        color={req.completed ? "#4CAF50" : "#9E9E9E"} 
                        style={styles.requirementIcon}
                      />
                      <Text 
                        style={[
                          styles.requirementText,
                          req.completed && styles.completedRequirementText
                        ]}
                      >
                        {req.description}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={() => setShowAchievementDialog(false)}>
                Close
              </Button>
              
              {!selectedAchievement.achieved && selectedAchievement.progress === 100 && (
                <Button 
                  mode="contained" 
                  onPress={() => handleClaimAchievement(selectedAchievement.id)}
                >
                  Claim
                </Button>
              )}
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );
  
  const renderChallengeDialog = () => (
    <Portal>
      <Dialog
        visible={showChallengeDialog}
        onDismiss={() => setShowChallengeDialog(false)}
        style={styles.dialog}
      >
        {selectedChallenge && (
          <>
            <View 
              style={[
                styles.challengeDialogHeader, 
                { backgroundColor: selectedChallenge.color || '#2196F3' }
              ]}
            >
              <Icon name={selectedChallenge.icon} size={40} color="#fff" />
              <Text style={styles.challengeDialogTitle}>
                {selectedChallenge.name}
              </Text>
            </View>
            
            <Dialog.Content style={styles.challengeDialogContent}>
              <Text style={styles.challengeDialogDescription}>
                {selectedChallenge.description}
              </Text>
              
              <View style={styles.challengeTimeline}>
                <View style={styles.challengeTimelineItem}>
                  <Text style={styles.challengeTimelineLabel}>Started:</Text>
                  <Text style={styles.challengeTimelineValue}>
                    {formatDate(selectedChallenge.startDate)}
                  </Text>
                </View>
                
                <View style={styles.challengeTimelineItem}>
                  <Text style={styles.challengeTimelineLabel}>Ends:</Text>
                  <Text style={styles.challengeTimelineValue}>
                    {formatDate(selectedChallenge.endDate)}
                  </Text>
                </View>
                
                <View style={styles.challengeTimelineItem}>
                  <Text style={styles.challengeTimelineLabel}>Days Left:</Text>
                  <Text style={styles.challengeTimelineValue}>
                    {selectedChallenge.daysRemaining} days
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.challengeDivider} />
              
              <View style={styles.challengeReward}>
                <Text style={styles.challengeRewardTitle}>Reward:</Text>
                <Text style={styles.challengeRewardDescription}>
                  {selectedChallenge.reward}
                </Text>
              </View>
              
              {selectedChallenge.joined && (
                <View style={styles.challengeDialogProgress}>
                  <Text style={styles.challengeDialogProgressTitle}>
                    Your Progress: {selectedChallenge.progress}%
                  </Text>
                  <ProgressBar 
                    progress={selectedChallenge.progress / 100} 
                    color={selectedChallenge.color || '#2196F3'}
                    style={styles.challengeDialogProgressBar} 
                  />
                  <Text style={styles.challengeDialogProgressDetail}>
                    {selectedChallenge.progressDetail}
                  </Text>
                </View>
              )}
              
              <View style={styles.challengeParticipants}>
                <Text style={styles.challengeParticipantsTitle}>
                  Participants: {selectedChallenge.participantsCount}
                </Text>
                
                <View style={styles.participantAvatars}>
                  {selectedChallenge.participants.map((participant, index) => (
                    <View key={index} style={styles.participantAvatarContainer}>
                      {participant.avatar ? (
                        <Avatar.Image source={{ uri: participant.avatar }} size={30} />
                      ) : (
                        <Avatar.Text label={participant.name.substring(0, 2)} size={30} />
                      )}
                    </View>
                  ))}
                  
                  {selectedChallenge.participantsCount > selectedChallenge.participants.length && (
                    <View style={styles.moreParticipants}>
                      <Text style={styles.moreParticipantsText}>
                        +{selectedChallenge.participantsCount - selectedChallenge.participants.length}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={() => setShowChallengeDialog(false)}>
                Close
              </Button>
              
              {!selectedChallenge.joined && (
                <Button 
                  mode="contained" 
                  onPress={() => handleJoinChallenge(selectedChallenge.id)}
                >
                  Join Challenge
                </Button>
              )}
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );
  
  const renderBadgeDialog = () => (
    <Portal>
      <Dialog
        visible={showBadgeDialog}
        onDismiss={() => setShowBadgeDialog(false)}
        style={styles.dialog}
      >
        {selectedBadge && selectedBadge.badge && (
          <>
            <Dialog.Content style={styles.badgeDialogContent}>
              <View 
                style={[
                  styles.badgeDialogIcon, 
                  { 
                    backgroundColor: selectedBadge.badge.color || BADGE_LEVELS[selectedBadge.badge.level] || '#2196F3',
                    borderColor: BADGE_LEVELS[selectedBadge.badge.level] || '#2196F3'
                  }
                ]}
              >
                <Icon name={selectedBadge.badge.icon} size={60} color="#fff" />
              </View>
              
              <Text style={styles.badgeDialogName}>{selectedBadge.badge.name}</Text>
              
              <View style={styles.badgeLevel}>
                <Text 
                  style={[
                    styles.badgeLevelText, 
                    { color: BADGE_LEVELS[selectedBadge.badge.level] || '#2196F3' }
                  ]}
                >
                  {selectedBadge.badge.level.charAt(0).toUpperCase() + selectedBadge.badge.level.slice(1)} Level
                </Text>
              </View>
              
              <Text style={styles.badgeDialogDescription}>
                {selectedBadge.badge.description || selectedBadge.description}
              </Text>
              
              <View style={styles.badgeStats}>
                <View style={styles.badgeStat}>
                  <Text style={styles.badgeStatLabel}>Earned On</Text>
                  <Text style={styles.badgeStatValue}>
                    {formatDate(selectedBadge.achievedDate)}
                  </Text>
                </View>
                
                <View style={styles.badgeStat}>
                  <Text style={styles.badgeStatLabel}>Rarity</Text>
                  <Text style={styles.badgeStatValue}>
                    {selectedBadge.badge.rarity || 'Common'}
                  </Text>
                </View>
              </View>
            </Dialog.Content>
            
            <Dialog.Actions>
              <Button onPress={() => setShowBadgeDialog(false)}>
                Close
              </Button>
              
              <Button 
                mode="contained" 
                icon="share-variant"
                onPress={() => {
                  // Share badge
                  Alert.alert('Share', 'Sharing your badge...');
                  setShowBadgeDialog(false);
                }}
              >
                Share
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );
  
  const renderRewardsDialog = () => (
    <Portal>
      <Dialog
        visible={showRewardsDialog}
        onDismiss={() => setShowRewardsDialog(false)}
        style={styles.rewardsDialog}
      >
        <Dialog.Title>Rewards</Dialog.Title>
        <Dialog.ScrollArea style={styles.rewardsScrollArea}>
          <ScrollView>
            <View style={styles.rewardsContent}>
              <View style={styles.rewardsHeader}>
                <Text style={styles.rewardsPoints}>
                  Available Points: <Text style={styles.pointsValue}>{userLeaderboard?.totalPoints || 0}</Text>
                </Text>
              </View>
              
              <Text style={styles.rewardsTitle}>Available Rewards</Text>
              
              <View style={styles.availableRewardsList}>
                {availableRewards.map((reward) => (
                  <View key={reward.id} style={styles.rewardItem}>
                    <View 
                      style={[
                        styles.rewardIcon, 
                        { backgroundColor: reward.color || '#2196F3' }
                      ]}
                    >
                      <Icon name={reward.icon} size={24} color="#fff" />
                    </View>
                    
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardName}>{reward.name}</Text>
                      <Text style={styles.rewardDescription}>
                        {reward.description}
                      </Text>
                    </View>
                    
                    <View style={styles.rewardCost}>
                      <Text style={styles.rewardCostValue}>{reward.pointsCost}</Text>
                      <Button 
                        mode="contained" 
                        onPress={() => handleRedeemReward(reward.id)}
                        disabled={(userLeaderboard?.totalPoints || 0) < reward.pointsCost}
                        compact
                      >
                        Redeem
                      </Button>
                    </View>
                  </View>
                ))}
              </View>
              
              <Divider style={styles.rewardsDivider} />
              
              <Text style={styles.rewardsTitle}>Recent Redemptions</Text>
              
              {rewardHistory.length > 0 ? (
                <View style={styles.rewardHistoryList}>
                  {rewardHistory.map((history, index) => (
                    <View key={index} style={styles.historyItem}>
                      <View style={styles.historyItemLeft}>
                        <Icon 
                          name={history.reward.icon} 
                          size={20} 
                          color={history.reward.color || '#2196F3'} 
                          style={styles.historyItemIcon}
                        />
                        <View style={styles.historyItemInfo}>
                          <Text style={styles.historyItemName}>
                            {history.reward.name}
                          </Text>
                          <Text style={styles.historyItemDate}>
                            {formatDate(history.redeemedDate)}
                          </Text>
                        </View>
                      </View>
                      
                      <Text style={styles.historyItemCost}>
                        -{history.pointsSpent} pts
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyRewardHistory}>
                  <Icon name="gift-off" size={40} color="#9E9E9E" />
                  <Text style={styles.emptyRewardHistoryText}>
                    No rewards redeemed yet
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowRewardsDialog(false)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading gamification data...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Gamification</Text>
        <Text style={styles.screenSubtitle}>{groupName || 'All Groups'}</Text>
        
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Icon 
              name="trophy" 
              size={20} 
              color={activeTab === 'achievements' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'achievements' ? styles.activeTabText : styles.inactiveTabText
              ]}
            >
              Achievements
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
            onPress={() => setActiveTab('challenges')}
          >
            <Icon 
              name="flag" 
              size={20} 
              color={activeTab === 'challenges' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'challenges' ? styles.activeTabText : styles.inactiveTabText
              ]}
            >
              Challenges
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
            onPress={() => setActiveTab('leaderboard')}
          >
            <Icon 
              name="podium" 
              size={20} 
              color={activeTab === 'leaderboard' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'leaderboard' ? styles.activeTabText : styles.inactiveTabText
              ]}
            >
              Leaderboard
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content section */}
      {activeTab === 'achievements' && renderAchievementsTab()}
      {activeTab === 'challenges' && renderChallengesTab()}
      {activeTab === 'leaderboard' && renderLeaderboardTab()}
      
      {/* Floating action button */}
      <FAB
        style={styles.fab}
        icon="gift"
        label="Rewards"
        onPress={() => setShowRewardsDialog(true)}
      />
      
      {/* Dialogs */}
      {renderAchievementDialog()}
      {renderChallengeDialog()}
      {renderBadgeDialog()}
      {renderRewardsDialog()}
    </View>
  );
};