import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Chip,
  DataTable,
  Divider,
  List,
  Searchbar,
  Portal,
  Dialog,
  TextInput,
  ProgressBar
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import {
  getUserReputation,
  getFederatedGroups,
  getGroupBenchmarks,
  endorseMember,
  requestFederation,
  generateBenchmarkReport
} from '../../services/api/cross-group';
import { formatCurrency, formatDate } from '../../utils/formatters';

const screenWidth = Dimensions.get('window').width - 40;

const CrossGroupFunctionality = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reputation');
  const [searchQuery, setSearchQuery] = useState('');
  const [userReputation, setUserReputation] = useState(null);
  const [federatedGroups, setFederatedGroups] = useState([]);
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [showEndorseDialog, setShowEndorseDialog] = useState(false);
  const [showFederationDialog, setShowFederationDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [endorsementNote, setEndorsementNote] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [federationReason, setFederationReason] = useState('');
  const [federationPermissions, setFederationPermissions] = useState([]);
  const [benchmarkCategories, setBenchmarkCategories] = useState(['All', 'Savings', 'Governance', 'Member Engagement', 'Financial Health']);
  const [selectedBenchmarkCategory, setSelectedBenchmarkCategory] = useState('All');
  
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user reputation
      const reputation = await getUserReputation(user.id);
      setUserReputation(reputation);
      
      // Fetch federated groups
      const groups = await getFederatedGroups(user.id);
      setFederatedGroups(groups);
      
      // Fetch benchmark data
      const benchmarks = await getGroupBenchmarks(user.groupId);
      setBenchmarkData(benchmarks);
    } catch (error) {
      console.error('Error fetching cross-group data:', error);
      Alert.alert('Error', 'Failed to load cross-group data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (query) => {
    setSearchQuery(query);
    // In a real app, you would filter content based on the search query
  };

  const handleEndorseMember = async () => {
    try {
      if (!selectedMember) {
        return;
      }
      
      if (!endorsementNote.trim()) {
        Alert.alert('Error', 'Please enter an endorsement note.');
        return;
      }
      
      // In a real app, this would endorse the member
      await endorseMember(selectedMember.id, {
        endorserId: user.id,
        note: endorsementNote
      });
      
      // Reset form and close dialog
      setSelectedMember(null);
      setEndorsementNote('');
      setShowEndorseDialog(false);
      
      // Refresh user reputation
      const reputation = await getUserReputation(user.id);
      setUserReputation(reputation);
      
      Alert.alert('Success', 'Member endorsed successfully.');
    } catch (error) {
      console.error('Error endorsing member:', error);
      Alert.alert('Error', 'Failed to endorse member. Please try again.');
    }
  };

  const handleRequestFederation = async () => {
    try {
      if (!selectedGroup) {
        return;
      }
      
      if (!federationReason.trim()) {
        Alert.alert('Error', 'Please enter a reason for federation.');
        return;
      }
      
      if (federationPermissions.length === 0) {
        Alert.alert('Error', 'Please select at least one permission for federation.');
        return;
      }
      
      // In a real app, this would request federation with another group
      await requestFederation(selectedGroup.id, {
        requestingGroupId: user.groupId,
        reason: federationReason,
        permissions: federationPermissions
      });
      
      // Reset form and close dialog
      setSelectedGroup(null);
      setFederationReason('');
      setFederationPermissions([]);
      setShowFederationDialog(false);
      
      // Refresh federated groups
      const groups = await getFederatedGroups(user.id);
      setFederatedGroups(groups);
      
      Alert.alert('Success', 'Federation request sent successfully.');
    } catch (error) {
      console.error('Error requesting federation:', error);
      Alert.alert('Error', 'Failed to request federation. Please try again.');
    }
  };

  const handleGenerateBenchmarkReport = async () => {
    try {
      // In a real app, this would generate a detailed benchmark report
      const reportUrl = await generateBenchmarkReport(user.groupId, selectedBenchmarkCategory);
      
      Alert.alert('Success', 'Benchmark report generated successfully.', [
        { text: 'View Report', onPress: () => navigation.navigate('PDFViewer', { url: reportUrl }) },
        { text: 'Close' }
      ]);
    } catch (error) {
      console.error('Error generating benchmark report:', error);
      Alert.alert('Error', 'Failed to generate benchmark report. Please try again.');
    }
  };

  const toggleFederationPermission = (permission) => {
    if (federationPermissions.includes(permission)) {
      setFederationPermissions(federationPermissions.filter(p => p !== permission));
    } else {
      setFederationPermissions([...federationPermissions, permission]);
    }
  };

  const renderEndorseDialog = () => (
    <Portal>
      <Dialog visible={showEndorseDialog} onDismiss={() => setShowEndorseDialog(false)}>
        <Dialog.Title>Endorse Member</Dialog.Title>
        <Dialog.Content>
          {selectedMember && (
            <View style={styles.endorseMemberContent}>
              <View style={styles.endorseMemberHeader}>
                <Avatar.Image 
                  source={{ uri: selectedMember.avatar }} 
                  size={60} 
                  style={styles.endorseMemberAvatar}
                />
                <View>
                  <Text style={styles.endorseMemberName}>{selectedMember.name}</Text>
                  <Text style={styles.endorseMemberRole}>{selectedMember.role}</Text>
                </View>
              </View>
              
              <TextInput
                label="Endorsement Note"
                value={endorsementNote}
                onChangeText={setEndorsementNote}
                style={styles.textInput}
                multiline
                numberOfLines={3}
                placeholder="What skills or qualities would you like to endorse?"
              />
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowEndorseDialog(false)}>Cancel</Button>
          <Button onPress={handleEndorseMember}>Endorse</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderFederationDialog = () => (
    <Portal>
      <Dialog visible={showFederationDialog} onDismiss={() => setShowFederationDialog(false)}>
        <Dialog.Title>Request Group Federation</Dialog.Title>
        <Dialog.ScrollArea style={styles.federationScrollArea}>
          <ScrollView>
            <View style={styles.federationContent}>
              {selectedGroup && (
                <View style={styles.selectedGroupHeader}>
                  <Text style={styles.selectedGroupName}>{selectedGroup.name}</Text>
                  <Text style={styles.selectedGroupMembers}>
                    {selectedGroup.membersCount} members | Created {formatDate(selectedGroup.createdAt)}
                  </Text>
                </View>
              )}
              
              <TextInput
                label="Reason for Federation"
                value={federationReason}
                onChangeText={setFederationReason}
                style={styles.textInput}
                multiline
                numberOfLines={3}
                placeholder="Explain why you want to federate with this group"
              />
              
              <Text style={styles.permissionsTitle}>Federation Permissions</Text>
              <Text style={styles.permissionsSubtitle}>
                Select which resources and data you want to share with this group
              </Text>
              
              <View style={styles.permissionItems}>
                <List.Item
                  title="Financial Reports"
                  description="Share aggregated financial performance"
                  left={props => <List.Icon {...props} icon="chart-bar" />}
                  right={props => (
                    <Checkbox
                      status={federationPermissions.includes('financial_reports') ? 'checked' : 'unchecked'}
                      onPress={() => toggleFederationPermission('financial_reports')}
                    />
                  )}
                />
                
                <Divider />
                
                <List.Item
                  title="Member Directory"
                  description="Share basic member information"
                  left={props => <List.Icon {...props} icon="account-group" />}
                  right={props => (
                    <Checkbox
                      status={federationPermissions.includes('member_directory') ? 'checked' : 'unchecked'}
                      onPress={() => toggleFederationPermission('member_directory')}
                    />
                  )}
                />
                
                <Divider />
                
                <List.Item
                  title="Educational Resources"
                  description="Share learning materials and content"
                  left={props => <List.Icon {...props} icon="book-open-variant" />}
                  right={props => (
                    <Checkbox
                      status={federationPermissions.includes('educational_resources') ? 'checked' : 'unchecked'}
                      onPress={() => toggleFederationPermission('educational_resources')}
                    />
                  )}
                />
                
                <Divider />
                
                <List.Item
                  title="Events & Meetings"
                  description="Allow cross-group event participation"
                  left={props => <List.Icon {...props} icon="calendar" />}
                  right={props => (
                    <Checkbox
                      status={federationPermissions.includes('events') ? 'checked' : 'unchecked'}
                      onPress={() => toggleFederationPermission('events')}
                    />
                  )}
                />
                
                <Divider />
                
                <List.Item
                  title="Investment Opportunities"
                  description="Share and participate in investments"
                  left={props => <List.Icon {...props} icon="trending-up" />}
                  right={props => (
                    <Checkbox
                      status={federationPermissions.includes('investments') ? 'checked' : 'unchecked'}
                      onPress={() => toggleFederationPermission('investments')}
                    />
                  )}
                />
              </View>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowFederationDialog(false)}>Cancel</Button>
          <Button onPress={handleRequestFederation}>Request</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderReputationTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* User Reputation Card */}
      {userReputation && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.reputationHeader}>
              <View style={styles.userReputationInfo}>
                <Title style={styles.reputationScore}>{userReputation.overallScore}</Title>
                <Text style={styles.reputationLabel}>Reputation Score</Text>
              </View>
              
              <View style={styles.reputationLevelContainer}>
                <Text style={styles.reputationLevelLabel}>Level</Text>
                <View style={styles.reputationLevel}>
                  <Text style={styles.reputationLevelText}>{userReputation.level}</Text>
                </View>
                <Text style={styles.reputationNextLevel}>
                  {userReputation.pointsToNextLevel} points to next level
                </Text>
              </View>
            </View>
            
            <View style={styles.reputationStats}>
              <View style={styles.reputationStat}>
                <Text style={styles.reputationStatValue}>{userReputation.groupsCount}</Text>
                <Text style={styles.reputationStatLabel}>Groups</Text>
              </View>
              
              <View style={styles.reputationStat}>
                <Text style={styles.reputationStatValue}>{userReputation.endorsementsCount}</Text>
                <Text style={styles.reputationStatLabel}>Endorsements</Text>
              </View>
              
              <View style={styles.reputationStat}>
                <Text style={styles.reputationStatValue}>{userReputation.badgesCount}</Text>
                <Text style={styles.reputationStatLabel}>Badges</Text>
              </View>
              
              <View style={styles.reputationStat}>
                <Text style={styles.reputationStatValue}>{userReputation.contributionsCount}</Text>
                <Text style={styles.reputationStatLabel}>Contributions</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.reputationCategories}>
              <Text style={styles.categoriesTitle}>Reputation Categories</Text>
              
              {userReputation.categories.map((category) => (
                <View key={category.name} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryScore}>{category.score}/100</Text>
                  </View>
                  <ProgressBar
                    progress={category.score / 100}
                    color={
                      category.score >= 80 ? '#4CAF50' :
                      category.score >= 60 ? '#2196F3' :
                      category.score >= 40 ? '#FFC107' :
                      '#F44336'
                    }
                    style={styles.categoryProgress}
                  />
                </View>
              ))}
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.reputationHistory}>
              <Text style={styles.historyTitle}>Reputation History</Text>
              
              <LineChart
                data={{
                  labels: userReputation.history.map(h => h.month),
                  datasets: [
                    {
                      data: userReputation.history.map(h => h.score)
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
                style={styles.historyChart}
              />
            </View>
          </Card.Content>
        </Card>
      )}
      
      {/* Endorsements Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.endorsementsHeader}>
            <Title style={styles.cardTitle}>Your Endorsements</Title>
            <Button 
              mode="contained" 
              icon="account-check"
              onPress={() => navigation.navigate('FindMembersToEndorse')}
            >
              Endorse
            </Button>
          </View>
          
          {userReputation && userReputation.endorsements.length > 0 ? (
            <View style={styles.endorsementsList}>
              {userReputation.endorsements.map((endorsement) => (
                <View key={endorsement.id} style={styles.endorsementItem}>
                  <View style={styles.endorsementHeader}>
                    <Avatar.Image 
                      source={{ uri: endorsement.endorser.avatar }} 
                      size={40} 
                      style={styles.endorserAvatar}
                    />
                    <View style={styles.endorserInfo}>
                      <Text style={styles.endorserName}>{endorsement.endorser.name}</Text>
                      <Text style={styles.endorsementDate}>
                        Endorsed on {formatDate(endorsement.date)}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.endorsementNote}>"{endorsement.note}"</Text>
                  
                  <View style={styles.endorsementSkills}>
                    {endorsement.skills.map((skill, index) => (
                      <Chip key={index} style={styles.skillChip}>
                        {skill}
                      </Chip>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyEndorsements}>
              <Icon name="account-question" size={48} color="#9E9E9E" />
              <Text style={styles.emptyEndorsementsText}>
                No endorsements yet. Build your reputation by being active in your groups.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Cross-Group Badges Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Cross-Group Badges</Title>
          
          {userReputation && userReputation.badges.length > 0 ? (
            <View style={styles.badgesContainer}>
              {userReputation.badges.map((badge) => (
                <TouchableOpacity
                  key={badge.id}
                  style={styles.badgeItem}
                  onPress={() => navigation.navigate('BadgeDetails', { badgeId: badge.id })}
                >
                  <View 
                    style={[
                      styles.badgeIcon, 
                      { backgroundColor: badge.color || '#2196F3' }
                    ]}
                  >
                    <Icon name={badge.icon} size={28} color="#fff" />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <Text style={styles.badgeGroups}>{badge.groupsCount} groups</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyBadges}>
              <Icon name="shield-off" size={48} color="#9E9E9E" />
              <Text style={styles.emptyBadgesText}>
                No cross-group badges yet. Earn badges that will be recognized across all your groups.
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderFederationTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Active Federations Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.federationHeader}>
            <Title style={styles.cardTitle}>Active Group Federations</Title>
            <Button 
              mode="contained" 
              icon="account-group"
              onPress={() => navigation.navigate('FindGroupsToFederate')}
            >
              Federate
            </Button>
          </View>
          
          {federatedGroups.length > 0 ? (
            <View style={styles.federatedGroupsList}>
              {federatedGroups.map((group) => (
                <Card key={group.id} style={styles.federatedGroupCard}>
                  <Card.Content>
                    <View style={styles.federatedGroupHeader}>
                      <View>
                        <Title style={styles.federatedGroupName}>{group.name}</Title>
                        <Text style={styles.federatedGroupMembers}>
                          {group.membersCount} members
                        </Text>
                      </View>
                      <Chip 
                        style={[
                          styles.federationStatusChip,
                          { 
                            backgroundColor: 
                              group.status === 'active' ? 'rgba(76, 175, 80, 0.1)' :
                              group.status === 'pending' ? 'rgba(255, 193, 7, 0.1)' :
                              'rgba(244, 67, 54, 0.1)'
                          }
                        ]}
                      >
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                      </Chip>
                    </View>
                    
                    <Divider style={styles.federatedGroupDivider} />
                    
                    <View style={styles.federationPermissions}>
                      <Text style={styles.federationPermissionsTitle}>Shared Resources:</Text>
                      <View style={styles.permissionChips}>
                        {group.permissions.map((permission, index) => (
                          <Chip 
                            key={index} 
                            style={styles.permissionChip}
                            icon={
                              permission === 'financial_reports' ? 'chart-bar' :
                              permission === 'member_directory' ? 'account-group' :
                              permission === 'educational_resources' ? 'book-open-variant' :
                              permission === 'events' ? 'calendar' :
                              permission === 'investments' ? 'trending-up' :
                              'check'
                            }
                          >
                            {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Chip>
                        ))}
                      </View>
                    </View>
                    
                    <Text style={styles.federationDate}>
                      Federated since {formatDate(group.federatedSince)}
                    </Text>
                  </Card.Content>
                  <Card.Actions>
                    <Button 
                      icon="eye" 
                      onPress={() => navigation.navigate('FederatedGroupDetails', { groupId: group.id })}
                    >
                      View
                    </Button>
                    <Button 
                      icon="sync" 
                      onPress={() => navigation.navigate('FederationActivity', { groupId: group.id })}
                    >
                      Activity
                    </Button>
                    {group.status === 'active' && (
                      <Button 
                        icon="link-variant-off"
                        onPress={() => Alert.alert(
                          'Disconnect Federation',
                          `Are you sure you want to disconnect federation with ${group.name}?`,
                          [
                            { text: 'Cancel' },
                            { 
                              text: 'Disconnect', 
                              onPress: () => console.log('Disconnect federation with', group.id) 
                            }
                          ]
                        )}
                      >
                        Disconnect
                      </Button>
                    )}
                  </Card.Actions>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.emptyFederations}>
              <Icon name="account-group" size={48} color="#9E9E9E" />
              <Text style={styles.emptyFederationsTitle}>No Active Federations</Text>
              <Text style={styles.emptyFederationsText}>
                Connect with other savings groups to share resources and knowledge
              </Text>
              <Button 
                mode="contained" 
                icon="account-group"
                onPress={() => navigation.navigate('FindGroupsToFederate')}
                style={styles.emptyFederationsButton}
              >
                Find Groups to Federate
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Federation Benefits Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Federation Benefits</Title>
          
          <List.Item
            title="Shared Knowledge"
            description="Access educational resources and best practices from other groups"
            left={props => <List.Icon {...props} icon="lightbulb-on" color="#FFC107" />}
          />
          
          <Divider />
          
          <List.Item
            title="Expanded Network"
            description="Connect with members from other groups for mentorship and guidance"
            left={props => <List.Icon {...props} icon="account-network" color="#2196F3" />}
          />
          
          <Divider />
          
          <List.Item
            title="Resource Pooling"
            description="Combine resources for larger projects or investments"
            left={props => <List.Icon {...props} icon="hand-coin" color="#4CAF50" />}
          />
          
          <Divider />
          
          <List.Item
            title="Governance Support"
            description="Share governance structures and systems for better management"
            left={props => <List.Icon {...props} icon="gavel" color="#9C27B0" />}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderBenchmarkTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Benchmark Overview Card */}
      {benchmarkData && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Benchmark Overview</Title>
            <Text style={styles.benchmarkDescription}>
              Compare your group's performance against similar groups anonymously
            </Text>
            
            <View style={styles.benchmarkCategories}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {benchmarkCategories.map((category) => (
                  <Chip
                    key={category}
                    selected={selectedBenchmarkCategory === category}
                    onPress={() => setSelectedBenchmarkCategory(category)}
                    style={styles.benchmarkCategoryChip}
                  >
                    {category}
                  </Chip>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.overallPerformance}>
              <Text style={styles.overallPerformanceTitle}>Overall Performance</Text>
              <View style={styles.performanceIndicator}>
                <View 
                  style={[
                    styles.performanceBar, 
                    { width: `${benchmarkData.overallPerformance}%` },
                    {
                      backgroundColor: 
                        benchmarkData.overallPerformance >= 80 ? '#4CAF50' :
                        benchmarkData.overallPerformance >= 60 ? '#2196F3' :
                        benchmarkData.overallPerformance >= 40 ? '#FFC107' :
                        '#F44336'
                    }
                  ]}
                />
                <Text style={styles.performancePercentage}>
                  {benchmarkData.overallPerformance}%
                </Text>
              </View>
              <Text style={styles.performanceDescription}>
                Your group performs better than {benchmarkData.overallPerformance}% of similar groups
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.benchmarkMetrics}>
              <Text style={styles.benchmarkMetricsTitle}>Key Metrics Comparison</Text>
              
              <BarChart
                data={{
                  labels: benchmarkData.metrics.map(m => m.name),
                  datasets: [
                    {
                      data: benchmarkData.metrics.map(m => m.groupValue)
                    },
                    {
                      data: benchmarkData.metrics.map(m => m.averageValue)
                    }
                  ],
                  barColors: ['#2196F3', '#9E9E9E']
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1, index) => index === 0 ? `rgba(33, 150, 243, ${opacity})` : `rgba(158, 158, 158, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  barPercentage: 0.6
                }}
                fromZero
                showValuesOnTopOfBars
                withInnerLines={false}
                style={styles.benchmarkChart}
              />
              
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
                  <Text style={styles.legendText}>Your Group</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#9E9E9E' }]} />
                  <Text style={styles.legendText}>Similar Groups Average</Text>
                </View>
              </View>
            </View>
          </Card.Content>
          <Card.Actions style={styles.benchmarkActions}>
            <Button 
              mode="contained" 
              icon="file-chart"
              onPress={handleGenerateBenchmarkReport}
            >
              Generate Report
            </Button>
          </Card.Actions>
        </Card>
      )}
      
      {/* Improvement Opportunities Card */}
      {benchmarkData && benchmarkData.improvementOpportunities && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Improvement Opportunities</Title>
            
            {benchmarkData.improvementOpportunities.map((opportunity, index) => (
              <View key={index} style={styles.opportunityItem}>
                <View style={styles.opportunityHeader}>
                  <Icon 
                    name={
                      opportunity.category === 'Savings' ? 'piggy-bank' :
                      opportunity.category === 'Governance' ? 'gavel' :
                      opportunity.category === 'Engagement' ? 'account-group' :
                      opportunity.category === 'Financial Health' ? 'chart-line' :
                      'lightbulb-on'
                    } 
                    size={24} 
                    color={
                      opportunity.priority === 'high' ? '#F44336' :
                      opportunity.priority === 'medium' ? '#FFC107' :
                      '#2196F3'
                    }
                    style={styles.opportunityIcon}
                  />
                  <View style={styles.opportunityInfo}>
                    <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
                    <Text style={styles.opportunityCategory}>{opportunity.category}</Text>
                  </View>
                  <Chip 
                    style={[
                      styles.opportunityPriorityChip,
                      {
                        backgroundColor: 
                          opportunity.priority === 'high' ? 'rgba(244, 67, 54, 0.1)' :
                          opportunity.priority === 'medium' ? 'rgba(255, 193, 7, 0.1)' :
                          'rgba(33, 150, 243, 0.1)'
                      }
                    ]}
                  >
                    {opportunity.priority.charAt(0).toUpperCase() + opportunity.priority.slice(1)}
                  </Chip>
                </View>
                
                <Text style={styles.opportunityDescription}>{opportunity.description}</Text>
                
                <View style={styles.opportunitySuggestions}>
                  <Text style={styles.suggestionsTitle}>Suggested Actions:</Text>
                  {opportunity.suggestions.map((suggestion, i) => (
                    <View key={i} style={styles.suggestionItem}>
                      <Icon name="arrow-right" size={16} color="#666" style={styles.suggestionIcon} />
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
      
      {/* Benchmark Insights Card */}
      {benchmarkData && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Benchmark Insights</Title>
            
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Metric</DataTable.Title>
                <DataTable.Title numeric>Your Group</DataTable.Title>
                <DataTable.Title numeric>Top 10%</DataTable.Title>
                <DataTable.Title numeric>Average</DataTable.Title>
              </DataTable.Header>
              
              {benchmarkData.detailedMetrics.map((metric) => (
                <DataTable.Row key={metric.name}>
                  <DataTable.Cell>{metric.name}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text 
                      style={[
                        metric.groupValue > metric.top10Value ? styles.aboveAverageValue :
                        metric.groupValue > metric.averageValue ? styles.averageValue :
                        styles.belowAverageValue
                      ]}
                    >
                      {metric.formatValue ? formatCurrency(metric.groupValue) : metric.groupValue}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {metric.formatValue ? formatCurrency(metric.top10Value) : metric.top10Value}
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    {metric.formatValue ? formatCurrency(metric.averageValue) : metric.averageValue}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading cross-group data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cross-Group Features</Text>
        <Text style={styles.headerSubtitle}>Connect across multiple savings groups</Text>
      </View>
      
      {/* Search Bar */}
      <Searchbar
        placeholder="Search groups, members and benchmarks..."
        onChangeText={onSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {/* Tab Menu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reputation' && styles.activeTab]}
          onPress={() => setActiveTab('reputation')}
        >
          <Icon 
            name="star" 
            size={24} 
            color={activeTab === 'reputation' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'reputation' && styles.activeTabText
            ]}
          >
            Reputation
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'federation' && styles.activeTab]}
          onPress={() => setActiveTab('federation')}
        >
          <Icon 
            name="link-variant" 
            size={24} 
            color={activeTab === 'federation' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'federation' && styles.activeTabText
            ]}
          >
            Group Federation
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'benchmark' && styles.activeTab]}
          onPress={() => setActiveTab('benchmark')}
        >
          <Icon 
            name="poll" 
            size={24} 
            color={activeTab === 'benchmark' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'benchmark' && styles.activeTabText
            ]}
          >
            Benchmarks
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {activeTab === 'reputation' && renderReputationTab()}
      {activeTab === 'federation' && renderFederationTab()}
      {activeTab === 'benchmark' && renderBenchmarkTab()}
      
      {/* Dialogs */}
      {renderEndorseDialog()}
      {renderFederationDialog()}
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
  reputationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  userReputationInfo: {
    alignItems: 'center'
  },
  reputationScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  reputationLabel: {
    fontSize: 14,
    color: '#666'
  },
  reputationLevelContainer: {
    alignItems: 'center'
  },
  reputationLevelLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  reputationLevel: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4
  },
  reputationLevelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  reputationNextLevel: {
    fontSize: 12,
    color: '#666'
  },
  reputationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  reputationStat: {
    alignItems: 'center'
  },
  reputationStatValue: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  reputationStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  divider: {
    marginVertical: 16
  },
  reputationCategories: {
    marginBottom: 16
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  categoryItem: {
    marginBottom: 12
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500'
  },
  categoryScore: {
    fontSize: 14,
    fontWeight: '500'
  },
  categoryProgress: {
    height: 8,
    borderRadius: 4
  },
  reputationHistory: {
    marginBottom: 8
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  historyChart: {
    marginVertical: 8,
    borderRadius: 8
  },
  endorsementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  endorsementsList: {
    marginTop: 8
  },
  endorsementItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  },
  endorsementHeader: {
    flexDirection: 'row',
    marginBottom: 8
  },
  endorserAvatar: {
    marginRight: 12
  },
  endorserInfo: {
    flex: 1
  },
  endorserName: {
    fontSize: 16,
    fontWeight: '500'
  },
  endorsementDate: {
    fontSize: 12,
    color: '#666'
  },
  endorsementNote: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8
  },
  endorsementSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  skillChip: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: 'rgba(33, 150, 243, 0.1)'
  },
  emptyEndorsements: {
    alignItems: 'center',
    padding: 24
  },
  emptyEndorsementsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 16
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  badgeItem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 16
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  badgeName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4
  },
  badgeGroups: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  emptyBadges: {
    alignItems: 'center',
    padding: 24
  },
  emptyBadgesText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginTop: 16
  },
  federationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  federatedGroupsList: {
    marginTop: 8
  },
  federatedGroupCard: {
    marginBottom: 12
  },
  federatedGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  federatedGroupName: {
    fontSize: 18
  },
  federatedGroupMembers: {
    fontSize: 14,
    color: '#666'
  },
  federationStatusChip: {
    height: 28
  },
  federatedGroupDivider: {
    marginVertical: 12
  },
  federationPermissions: {
    marginBottom: 12
  },
  federationPermissionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  permissionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  permissionChip: {
    marginRight: 4,
    marginBottom: 4
  },
  federationDate: {
    fontSize: 12,
    color: '#666'
  },
  emptyFederations: {
    alignItems: 'center',
    padding: 24
  },
  emptyFederationsTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8
  },
  emptyFederationsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  emptyFederationsButton: {
    marginTop: 8
  },
  benchmarkDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  benchmarkCategories: {
    marginBottom: 16
  },
  benchmarkCategoryChip: {
    marginRight: 8
  },
  overallPerformance: {
    marginBottom: 16
  },
  overallPerformanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  performanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8
  },
  performanceBar: {
    height: '100%'
  },
  performancePercentage: {
    position: 'absolute',
    right: 12,
    fontWeight: '500'
  },
  performanceDescription: {
    fontSize: 14,
    color: '#666'
  },
  benchmarkMetrics: {
    marginBottom: 16
  },
  benchmarkMetricsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  benchmarkChart: {
    marginVertical: 8,
    borderRadius: 8
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4
  },
  legendText: {
    fontSize: 12,
    color: '#666'
  },
  benchmarkActions: {
    justifyContent: 'flex-end'
  },
  opportunityItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  },
  opportunityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  opportunityIcon: {
    marginRight: 12
  },
  opportunityInfo: {
    flex: 1
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  opportunityCategory: {
    fontSize: 12,
    color: '#666'
  },
  opportunityPriorityChip: {
    height: 28
  },
  opportunityDescription: {
    fontSize: 14,
    marginBottom: 12
  },
  opportunitySuggestions: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  suggestionItem: {
    flexDirection: 'row',
    marginBottom: 4
  },
  suggestionIcon: {
    marginRight: 8
  },
  suggestionText: {
    fontSize: 14,
    flex: 1
  },
  aboveAverageValue: {
    color: '#4CAF50',
    fontWeight: '500'
  },
  averageValue: {
    color: '#2196F3',
    fontWeight: '500'
  },
  belowAverageValue: {
    color: '#F44336',
    fontWeight: '500'
  },
  textInput: {
    marginBottom: 16
  },
  endorseMemberContent: {
    paddingVertical: 8
  },
  endorseMemberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  endorseMemberAvatar: {
    marginRight: 16
  },
  endorseMemberName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4
  },
  endorseMemberRole: {
    fontSize: 14,
    color: '#666'
  },
  federationScrollArea: {
    maxHeight: 400
  },
  federationContent: {
    paddingVertical: 8
  },
  selectedGroupHeader: {
    marginBottom: 16
  },
  selectedGroupName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4
  },
  selectedGroupMembers: {
    fontSize: 14,
    color: '#666'
  },
  permissionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4
  },
  permissionsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  permissionItems: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8
  }
});

export default CrossGroupFunctionality;