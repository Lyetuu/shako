// File: screens/GroupSavings/CreateGroupScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { TextInput, Button, HelperText, Checkbox, Divider } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createGroup } from '../../services/api/groupSavings';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const contributionOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' }
];

const CreateGroupSchema = Yup.object().shape({
  name: Yup.string().required('Group name is required'),
  description: Yup.string(),
  targetAmount: Yup.number()
    .required('Target amount is required')
    .positive('Amount must be positive'),
  purpose: Yup.string().required('Purpose is required'),
  minimumContribution: Yup.number()
    .required('Minimum contribution is required')
    .positive('Amount must be positive'),
  contributionSchedule: Yup.string()
    .required('Contribution schedule is required')
    .oneOf(['daily', 'weekly', 'monthly', 'yearly']),
  hasEndDate: Yup.boolean(),
  endDate: Yup.date().when('hasEndDate', {
    is: true,
    then: Yup.date().min(new Date(), 'End date must be in the future')
  }),
  requireAllApprovals: Yup.boolean().default(true),
  autoSplitOnDispute: Yup.boolean().default(false),
  minimumApprovalPercentage: Yup.number()
    .min(50, 'Minimum approval percentage must be at least 50%')
    .max(100, 'Minimum approval percentage cannot exceed 100%')
    .default(100)
});

const CreateGroupScreen = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (values) => {
    try {
      setLoading(true);
      
      const groupData = {
        name: values.name,
        description: values.description,
        targetAmount: parseFloat(values.targetAmount),
        purpose: values.purpose,
        minimumContribution: parseFloat(values.minimumContribution),
        contributionSchedule: values.contributionSchedule,
        settings: {
          requireAllApprovals: values.requireAllApprovals,
          autoSplitOnDispute: values.autoSplitOnDispute,
          minimumApprovalPercentage: parseInt(values.minimumApprovalPercentage)
        }
      };
      
      if (values.hasEndDate && values.endDate) {
        groupData.endDate = values.endDate;
      }
      
      const response = await createGroup(groupData);
      
      Alert.alert(
        'Success!',
        'Your group has been created successfully. You can now invite members.',
        [
          { 
            text: 'Invite Members', 
            onPress: () => navigation.navigate('InviteMembers', { groupId: response._id }) 
          },
          {
            text: 'Later',
            onPress: () => navigation.navigate('GroupDetails', { groupId: response._id })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Create a New Savings Group</Text>
        
        <Formik
          initialValues={{
            name: '',
            description: '',
            targetAmount: '',
            purpose: '',
            minimumContribution: '',
            contributionSchedule: 'monthly',
            hasEndDate: false,
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 12)), // Default to 1 year
            requireAllApprovals: true,
            autoSplitOnDispute: false,
            minimumApprovalPercentage: '100'
          }}
          validationSchema={CreateGroupSchema}
          onSubmit={handleCreateGroup}
        >
          {({ 
            handleChange, 
            handleBlur, 
            handleSubmit, 
            values, 
            errors, 
            touched, 
            setFieldValue 
          }) => (
            <View style={styles.form}>
              <TextInput
                label="Group Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                style={styles.input}
                error={touched.name && errors.name}
                mode="outlined"
                left={<TextInput.Icon name="account-group" />}
              />
              {touched.name && errors.name && (
                <HelperText type="error">{errors.name}</HelperText>
              )}

              <TextInput
                label="Description (Optional)"
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
                left={<TextInput.Icon name="information-outline" />}
              />

              <TextInput
                label="Target Amount"
                value={values.targetAmount}
                onChangeText={handleChange('targetAmount')}
                onBlur={handleBlur('targetAmount')}
                style={styles.input}
                error={touched.targetAmount && errors.targetAmount}
                mode="outlined"
                keyboardType="numeric"
                left={<TextInput.Icon name="cash" />}
              />
              {touched.targetAmount && errors.targetAmount && (
                <HelperText type="error">{errors.targetAmount}</HelperText>
              )}

              <TextInput
                label="Purpose"
                value={values.purpose}
                onChangeText={handleChange('purpose')}
                onBlur={handleBlur('purpose')}
                style={styles.input}
                error={touched.purpose && errors.purpose}
                mode="outlined"
                left={<TextInput.Icon name="flag" />}
              />
              {touched.purpose && errors.purpose && (
                <HelperText type="error">{errors.purpose}</HelperText>
              )}

              <TextInput
                label="Minimum Contribution"
                value={values.minimumContribution}
                onChangeText={handleChange('minimumContribution')}
                onBlur={handleBlur('minimumContribution')}
                style={styles.input}
                error={touched.minimumContribution && errors.minimumContribution}
                mode="outlined"
                keyboardType="numeric"
                left={<TextInput.Icon name="currency-usd" />}
              />
              {touched.minimumContribution && errors.minimumContribution && (
                <HelperText type="error">{errors.minimumContribution}</HelperText>
              )}

              <Text style={styles.sectionLabel}>Contribution Schedule</Text>
              <View style={styles.radioGroup}>
                {contributionOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.radioButton,
                      values.contributionSchedule === option.value && styles.radioButtonSelected
                    ]}
                    onPress={() => setFieldValue('contributionSchedule', option.value)}
                  >
                    <Text
                      style={[
                        styles.radioLabel,
                        values.contributionSchedule === option.value && styles.radioLabelSelected
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={values.hasEndDate ? 'checked' : 'unchecked'}
                  onPress={() => setFieldValue('hasEndDate', !values.hasEndDate)}
                />
                <Text style={styles.checkboxLabel}>Set an end date</Text>
              </View>

              {values.hasEndDate && (
                <View style={styles.datePickerContainer}>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Icon name="calendar" size={24} color="#6200ee" />
                    <Text style={styles.dateButtonText}>
                      {values.endDate.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={values.endDate}
                      mode="date"
                      display="default"
                      minimumDate={new Date()}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setFieldValue('endDate', selectedDate);
                        }
                      }}
                    />
                  )}
                </View>
              )}

              <Divider style={styles.divider} />
              <Text style={styles.sectionLabel}>Withdrawal Settings</Text>

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={values.requireAllApprovals ? 'checked' : 'unchecked'}
                  onPress={() => setFieldValue('requireAllApprovals', !values.requireAllApprovals)}
                />
                <Text style={styles.checkboxLabel}>
                  Require all members to approve withdrawals
                </Text>
              </View>

              {!values.requireAllApprovals && (
                <TextInput
                  label="Minimum Approval Percentage"
                  value={values.minimumApprovalPercentage}
                  onChangeText={handleChange('minimumApprovalPercentage')}
                  onBlur={handleBlur('minimumApprovalPercentage')}
                  style={styles.input}
                  error={touched.minimumApprovalPercentage && errors.minimumApprovalPercentage}
                  mode="outlined"
                  keyboardType="numeric"
                  right={<TextInput.Affix text="%" />}
                />
              )}

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={values.autoSplitOnDispute ? 'checked' : 'unchecked'}
                  onPress={() => setFieldValue('autoSplitOnDispute', !values.autoSplitOnDispute)}
                />
                <Text style={styles.checkboxLabel}>
                  Automatically split funds equally if there's a dispute
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                Create Group
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 4,
    padding: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  radioButtonSelected: {
    backgroundColor: '#6200ee',
  },
  radioLabel: {
    color: '#6200ee',
  },
  radioLabelSelected: {
    color: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    flex: 1,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 4,
    padding: 12,
  },
  dateButtonText: {
    marginLeft: 8,
    color: '#6200ee',
  },
  divider: {
    marginVertical: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default CreateGroupScreen;

// File: screens/GroupSavings/GroupListScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Card, Button, FAB, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchGroups } from '../../services/api/groupSavings';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import EmptyState from '../../components/EmptyState';
import ProgressBar from '../../components/ProgressBar';

const GroupListScreen = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await fetchGroups();
      setGroups(response);
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadGroups();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [])
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      case 'paused':
        return '#FFC107';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const renderItem = ({ item }) => {
    const progress = (item.currentAmount / item.targetAmount) * 100;
    const isAdmin = item.members.find(member => 
      member.user === user.id && member.role === 'admin'
    );

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('GroupDetails', { groupId: item._id })}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.groupName}>{item.name}</Text>
              <Chip
                mode="outlined"
                textStyle={{ color: getStatusColor(item.status) }}
                style={{ borderColor: getStatusColor(item.status) }}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Chip>
            </View>
            
            <Text style={styles.purpose}>{item.purpose}</Text>
            
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress} />
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>{formatCurrency(item.currentAmount)}</Text>
                <Text style={styles.targetText}>of {formatCurrency(item.targetAmount)}</Text>
              </View>
            </View>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Icon name="account-group" size={16} color="#757575" />
                <Text style={styles.metaText}>{item.members.length} members</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="calendar-clock" size={16} color="#757575" />
                <Text style={styles.metaText}>
                  {item.contributionSchedule.charAt(0).toUpperCase() + item.contributionSchedule.slice(1)}
                </Text>
              </View>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Icon name="shield-account" size={16} color="#6200ee" />
                  <Text style={styles.adminText}>Admin</Text>
                </View>
              )}
            </View>
          </Card.Content>
          
          <Card.Actions style={styles.cardActions}>
            <Button
              mode="text"
              onPress={() => navigation.navigate('GroupContribute', { groupId: item._id })}
              icon="cash-plus"
            >
              Contribute
            </Button>
            <Button
              mode="text"
              onPress={() => navigation.navigate('GroupTransactions', { groupId: item._id })}
              icon="history"
            >
              History
            </Button>
          </Card.Actions>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {groups.length === 0 ? (
        <EmptyState
          icon="account-group"
          title="No Savings Groups"
          message="You haven't joined any savings groups yet. Create your first group or join an existing one."
          actionLabel="Create Group"
          onAction={() => navigation.navigate('CreateGroup')}
        />
      ) : (
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#6200ee']}
            />
          }
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="Create Group"
        onPress={() => navigation.navigate('CreateGroup')}
      />
    </View>
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
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  purpose: {
    color: '#757575',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    marginTop: 4,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  targetText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminText: {
    fontSize: 14,
    color: '#6200ee',
    marginLeft: 4,
    fontWeight: '500',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default GroupListScreen;

// File: screens/GroupSavings/GroupDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import {
  Card,
  Button,
  Divider,
  Avatar,
  List,
  FAB,
  Portal,
  Dialog,
  Paragraph
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchGroupDetails } from '../../services/api/groupSavings';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ProgressBar from '../../components/ProgressBar';

const GroupDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { groupId } = route.params;
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  
  useEffect(() => {
    loadGroupDetails();
  }, [groupId]);
  
  const loadGroupDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchGroupDetails(groupId);
      setGroup(data);
    } catch (error) {
      console.error('Error loading group details:', error);
      Alert.alert('Error', 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  };
  
  const isAdmin = () => {
    if (!group || !user) return false;
    const member = group.members.find(m => m.user._id === user.id);
    return member && member.role === 'admin';
  };
  
  const getMembershipStatus = () => {
    if (!group || !user) return null;
    const member = group.members.find(m => m.user._id === user.id);
    return {
      isMember: !!member,
      role: member ? member.role : null,
      totalContributed: member ? member.totalContributed : 0
    };
  };
  
  const membershipStatus = group ? getMembershipStatus() : null;
  
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  if (!group) {
    return (
      <View style={styles.centered}>
        <Text>Unable to load group details</Text>
        <Button
          mode="contained"
          onPress={loadGroupDetails}
          style={{ marginTop: 16 }}
        >
          Retry
        </Button>
      </View>
    );
  }
  
  const progress = (group.currentAmount / group.targetAmount) * 100;
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View style={styles.titleSection}>
                <Text style={styles.groupName}>{group.name}</Text>
                <View style={styles.statusChip}>
                  <Text style={styles.statusText}>{group.status.toUpperCase()}</Text>
                </View>
              </View>
              
              <Text style={styles.purpose}>{group.purpose}</Text>
              
              <View style={styles.progressSection}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressTitle}>Progress</Text>
                  <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                </View>
                <ProgressBar progress={progress} />
                <View style={styles.amountRow}>
                  <Text style={styles.currentAmount}>{formatCurrency(group.currentAmount)}</Text>
                  <Text style={styles.targetAmount}>of {formatCurrency(group.targetAmount)}</Text>
                </View>
              </View>
              
              {membershipStatus && (
                <View style={styles.contributionSection}>
                  <Text style={styles.contributionLabel}>Your Contribution</Text>
                  <Text style={styles.contributionAmount}>
                    {formatCurrency(membershipStatus.totalContributed)}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
          
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Icon name="calendar-range" size={20} color="#6200ee" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Started</Text>
                    <Text style={styles.infoValue}>{formatDate(group.startDate)}</Text>
                  </View>
                </View>
                
                {group.endDate && (
                  <View style={styles.infoItem}>
                    <Icon name="calendar-check" size={20} color="#6200ee" />
                    <View style={styles.infoTextContainer}>
                      <Text style={styles.infoLabel}>Ends</Text>
                      <Text style={styles.infoValue}>{formatDate(group.endDate)}</Text>
                    </View>
                  </View>
                )}
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Icon name="cash-clock" size={20} color="#6200ee" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Contribution Schedule</Text>
                    <Text style={styles.infoValue}>
                      {group.contributionSchedule.charAt(0).toUpperCase() + group.contributionSchedule.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <Icon name="cash-multiple" size={20} color="#6200ee" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Minimum Contribution</Text>
                    <Text style={styles.infoValue}>{formatCurrency(group.minimumContribution)}</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
          
          <Card style={styles.membersCard}>
            <Card.Content>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Members</Text>
                <Text style={styles.sectionCount}>{group.members.length}</Text>
              </View>
              
              {group.members.slice(0, 5).map((member) => (
                <List.Item
                  key={member.user._id}
                  title={member.user.name}
                  description={member.role === 'admin' ? 'Admin' : 'Member'}
                  left={() => (
                    <Avatar.Text
                      size={40}
                      label={member.user.name.substring(0, 2).toUpperCase()}
                      backgroundColor={member.role === 'admin' ? '#6200ee' : '#9e9e9e'}
                    />
                  )}
                  right={() => (
                    <Text style={styles.memberContribution}>
                      {formatCurrency(member.totalContributed)}
                    </Text>
                  )}
                />
              ))}
              
              {group.members.length > 5 && (
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('GroupMembers', { groupId: group._id })}
                >
                  View All Members
                </Button>
              )}
            </Card.Content>
          </Card>
          
          <Card style={styles.actionsCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('GroupContribute', { groupId: group._id })}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
                    <Icon name="cash-plus" size={24} color="white" />
                  </View>
                  <Text style={styles.actionText}>Contribute