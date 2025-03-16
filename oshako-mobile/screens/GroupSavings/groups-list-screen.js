// File: screens/GroupSavings/GroupsListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Text,
  Chip,
  Searchbar,
  Avatar,
  Divider
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getUserSavingsGroups } from '../../services/api/groupSavings';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

const GroupsListScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadGroups();
  }, []);
  
  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await getUserSavingsGroups();
      setGroups(data);
      setFilteredGroups(data);
    } catch (error) {
      console.error('Error loading groups:', error);
      Alert.alert('Error', 'Failed to load savings groups');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    loadGroups();
  };
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredGroups(groups);
      return;
    }
    
    const filtered = groups.filter(group => 
      group.name.toLowerCase().includes(query.toLowerCase()) ||
      group.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredGroups(filtered);
  };
  
  const navigateToGroupDetails = (groupId, groupName) => {
    navigation.navigate('GroupDetails', { groupId, groupName });
  };
  
  const navigateToCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };
  
  const renderGroupCard = ({ item }) => {
    const isAdmin = item.isAdmin;
    
    return (
      <Card 
        style={styles.card}
        onPress={() => navigateToGroupDetails(item._id, item.name)}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.groupName}>{item.name}</Title>
            {isAdmin && (
              <Chip 
                mode="outlined" 
                style={styles.adminChip}
                textStyle={{ color: '#6200ee' }}
              >
                Admin
              </Chip>
            )}
          </View>
          
          <Paragraph style={styles.description} numberOfLines={2}>
            {item.description}
          </Paragraph>
          
          <Divider style={styles.divider} />
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Savings</Text>
              <Text style={styles.statValue}>{formatCurrency(item.totalSavings)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Members</Text>
              <Text style={styles.statValue}>{item.memberCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Your Contribution</Text>
              <Text style={styles.statValue}>{formatCurrency(item.userContribution)}</Text>
            </View>
          </View>
          
          <View style={styles.actionsRow}>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('Contribute', { 
                groupId: item._id, 
                groupName: item.name 
              })}
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
            >
              Contribute
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('RequestWithdrawal', { 
                groupId: item._id
              })}
              style={styles.actionButton}
              labelStyle={styles.actionButtonLabel}
            >
              Withdraw
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderEmptyList = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.emptyText}>Loading groups...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Avatar.Icon 
          size={80} 
          icon="account-group" 
          style={styles.emptyIcon} 
          color="#6200ee"
          backgroundColor="#e8ddf8"
        />
        <Text style={styles.emptyTitle}>No Savings Groups</Text>
        <Text style={styles.emptyText}>
          {searchQuery 
            ? `No groups match "${searchQuery}"`
            : "You haven't joined any savings groups yet"}
        </Text>
        <Button 
          mode="contained" 
          onPress={navigateToCreateGroup}
          style={styles.createButton}
        >
          Create a New Group
        </Button>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search groups..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <FlatList
        data={filteredGroups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyList}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={navigateToCreateGroup}
        label="Create Group"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Add space for FAB
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  adminChip: {
    backgroundColor: '#f3edff',
    borderColor: '#6200ee',
    height: 28,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    borderColor: '#6200ee',
  },
  actionButtonLabel: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default GroupsListScreen;
