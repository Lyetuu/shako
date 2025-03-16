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
import { 
  TextInput, 
  Button, 
  HelperText, 
  Checkbox, 
  Divider, 
  Card, 
  Switch,
  Chip,
  RadioButton,
  TouchableRipple
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createGroup } from '../../services/api/groupSavings';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CONTRIBUTION_FREQUENCIES } from '../../config/constants';

const CreateGroupSchema = Yup.object().shape({
  name: Yup.string().required('Group name is required'),
  description: Yup.string(),
  purpose: Yup.string().required('Purpose is required'),
  hasGoal: Yup.boolean(),
  goalAmount: Yup.string().when('hasGoal', {
    is: true,
    then: Yup.string()
      .required('Goal amount is required')
      .test('is-number', 'Must be a valid number', value => !isNaN(value))
      .test('is-positive', 'Must be a positive number', value => parseFloat(value) > 0)
  }),
  targetDate: Yup.mixed().nullable(),
  contributionFrequency: Yup.string()
    .required('Contribution frequency is required')
    .oneOf(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  hasMinimum: Yup.boolean(),
  minimumContribution: Yup.string().when('hasMinimum', {
    is: true,
    then: Yup.string()
      .required('Minimum contribution is required')
      .test('is-number', 'Must be a valid number', value => !isNaN(value))
      .test('is-positive', 'Must be a positive number', value => parseFloat(value) > 0)
  }),
  isPublic: Yup.boolean(),
  withdrawalPolicy: Yup.string()
    .required('Withdrawal policy is required')
    .oneOf(['ADMIN_APPROVAL', 'ANYTIME', 'GOAL_ONLY']),
  requireAllApprovals: Yup.boolean(),
  autoSplitOnDispute: Yup.boolean(),
  minimumApprovalPercentage: Yup.string().when('requireAllApprovals', {
    is: false,
    then: Yup.string()
      .required('Minimum approval percentage is required')
      .test('is-number', 'Must be a valid number', value => !isNaN(value))
      .test('is-valid-percentage', 'Must be between 50 and 100', 
        value => parseFloat(value) >= 50 && parseFloat(value) <= 100)
  })
});

const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleCreateGroup = async (values) => {
    try {
      setSubmitting(true);
      
      // Prepare group data
      const groupData = {
        name: values.name,
        description: values.description,
        purpose: values.purpose,
        contributionFrequency: values.contributionFrequency,
        isPublic: values.isPublic,
        settings: {
          requireAllApprovals: values.requireAllApprovals,
          autoSplitOnDispute: values.autoSplitOnDispute,
          withdrawalPolicy: values.withdrawalPolicy
        }
      };
      
      // Add specific settings based on form values
      if (!values.requireAllApprovals) {
        groupData.settings.minimumApprovalPercentage = parseInt(values.minimumApprovalPercentage);
      }
      
      if (values.hasGoal) {
        groupData.goalAmount = parseFloat(values.goalAmount);
        
        if (values.withdrawalPolicy === 'GOAL_ONLY') {
          groupData.settings.lockWithdrawalsUntilGoal = true;
        }
        
        if (values.targetDate) {
          groupData.settings.targetDate = values.targetDate instanceof Date 
            ? values.targetDate 
            : new Date(values.targetDate);
        }
      }
      
      if (values.hasMinimum) {
        groupData.minimumContribution = parseFloat(values.minimumContribution);
      }
      
      const response = await createGroup(groupData);
      
      Alert.alert(
        'Group Created',
        `"${values.name}" has been created successfully!`,
        [
          {
            text: 'Invite Members',
            onPress: () => navigation.navigate('GroupMembers', { 
              groupId: response._id,
              groupName: response.name
            })
          },
          {
            text: 'View Group',
            onPress: () => navigation.navigate('GroupDetails', { 
              groupId: response._id,
              groupName: response.name
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', error.message || 'Failed to create savings group');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Create a Savings Group</Text>
        
        <Formik
          initialValues={{
            name: '',
            description: '',
            purpose: '',
            hasGoal: false,
            goalAmount: '',
            targetDate: null,
            contributionFrequency: 'MONTHLY',
            hasMinimum: false,
            minimumContribution: '',
            isPublic: false,
            withdrawalPolicy: 'ADMIN_APPROVAL',
            requireAllApprovals: true,
            autoSplitOnDispute: false,
            minimumApprovalPercentage: '100'
          }}
          validationSchema={CreateGroupSchema}
          onSubmit={handleCreateGroup}
        >
          {({ handleChange, handleBlur, setFieldValue, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <Card style={styles.section}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Basic Information</Text>
                  <Divider style={styles.divider} />
                  
                  <TextInput
                    label="Group Name"
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    mode="outlined"
                    style={styles.input}
                    error={touched.name && errors.name}
                    left={<TextInput.Icon icon="account-group" />}
                  />
                  {touched.name && errors.name && (
                    <HelperText type="error">{errors.name}</HelperText>
                  )}
                  
                  <TextInput
                    label="Purpose"
                    value={values.purpose}
                    onChangeText={handleChange('purpose')}
                    onBlur={handleBlur('purpose')}
                    mode="outlined"
                    style={styles.input}
                    error={touched.purpose && errors.purpose}
                    left={<TextInput.Icon icon="flag" />}
                  />
                  {touched.purpose && errors.purpose && (
                    <HelperText type="error">{errors.purpose}</HelperText>
                  )}
                  
                  <TextInput
                    label="Description"
                    value={values.description}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={styles.input}
                    error={touched.description && errors.description}
                    left={<TextInput.Icon icon="information-outline" />}
                  />
                  {touched.description && errors.description && (
                    <HelperText type="error">{errors.description}</HelperText>
                  )}
                  
                  <View style={styles.switchContainer}>
                    <Text>Public Group</Text>
                    <Switch
                      value={values.isPublic}
                      onValueChange={(value) => setFieldValue('isPublic', value)}
                    />
                  </View>
                  <Text style={styles.helperText}>
                    {values.isPublic 
                      ? 'Anyone can find and request to join this group'
                      : 'Only people with invitation link can join this group'}
                  </Text>
                </Card.Content>
              </Card>
              
              <Card style={styles.section}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Savings Goal</Text>
                  <Divider style={styles.divider} />
                  
                  <View style={styles.switchContainer}>
                    <Text>Set a Savings Goal</Text>
                    <Switch
                      value={values.hasGoal}
                      onValueChange={(value) => setFieldValue('hasGoal', value)}
                    />
                  </View>
                  
                  {values.hasGoal && (
                    <>
                      <TextInput
                        label="Goal Amount"
                        value={values.goalAmount}
                        onChangeText={handleChange('goalAmount')}
                        onBlur={handleBlur('goalAmount')}
                        keyboardType="numeric"
                        mode="outlined"
                        left={<TextInput.Affix text="$" />}
                        style={styles.input}
                        error={touched.goalAmount && errors.goalAmount}
                      />
                      {touched.goalAmount && errors.goalAmount && (
                        <HelperText type="error">{errors.goalAmount}</HelperText>
                      )}
                      
                      <Text style={styles.label}>Target Date (Optional)</Text>
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                      >
                        <Icon name="calendar" size={24} color="#6200ee" />
                        <Text style={styles.dateButtonText}>
                          {values.targetDate 
                            ? values.targetDate instanceof Date 
                              ? values.targetDate.toLocaleDateString()
                              : new Date(values.targetDate).toLocaleDateString()
                            : 'Select a target date'}
                        </Text>
                      </TouchableOpacity>
                      
                      {showDatePicker && (
                        <DateTimePicker
                          value={values.targetDate ? new Date(values.targetDate) : new Date()}
                          mode="date"
                          display="default"
                          minimumDate={new Date()}
                          onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                              setFieldValue('targetDate', selectedDate);
                            }
                          }}
                        />
                      )}
                    </>
                  )}
                </Card.Content>
              </Card>
              
              <Card style={styles.section}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Contribution Settings</Text>
                  <Divider style={styles.divider} />
                  
                  <Text style={styles.label}>Contribution Frequency</Text>
                  <View style={styles.chipsContainer}>
                    {CONTRIBUTION_FREQUENCIES.map((frequency) => (
                      <Chip
                        key={frequency.value}
                        selected={values.contributionFrequency === frequency.value}
                        onPress={() => setFieldValue('contributionFrequency', frequency.value)}
                        style={styles.chip}
                        selectedColor="#6200ee"
                      >
                        {frequency.label}
                      </Chip>
                    ))}
                  </View>
                  
                  <View style={styles.switchContainer}>
                    <Text>Set Minimum Contribution</Text>
                    <Switch
                      value={values.hasMinimum}
                      onValueChange={(value) => setFieldValue('hasMinimum', value)}
                    />
                  </View>
                  
                  {values.hasMinimum && (
                    <>
                      <TextInput
                        label="Minimum Contribution Amount"
                        value={values.minimumContribution}
                        onChangeText={handleChange('minimumContribution')}
                        onBlur={handleBlur('minimumContribution')}
                        keyboardType="numeric"
                        mode="outlined"
                        left={<TextInput.Affix text="$" />}
                        style={styles.input}
                        error={touched.minimumContribution && errors.minimumContribution}
                      />
                      {touched.minimumContribution && errors.minimumContribution && (
                        <HelperText type="error">{errors.minimumContribution}</HelperText>
                      )}
                    </>
                  )}
                </Card.Content>
              </Card>
              
              <Card style={styles.section}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Withdrawal Policy</Text>
                  <Divider style={styles.divider} />
                  
                  <View style={styles.policyContainer}>
                    <TouchableOpacity
                      style={[
                        styles.policyOption,
                        values.withdrawalPolicy === 'ADMIN_APPROVAL' && styles.policySelected
                      ]}
                      onPress={() => setFieldValue('withdrawalPolicy', 'ADMIN_APPROVAL')}
                    >
                      <Icon 
                        name="shield-check" 
                        size={24} 
                        color={values.withdrawalPolicy === 'ADMIN_APPROVAL' ? "#fff" : "#6200ee"} 
                      />
                      <Text 
                        style={[
                          styles.policyTitle,
                          values.withdrawalPolicy === 'ADMIN_APPROVAL' && styles.policyTitleSelected
                        ]}
                      >
                        Admin Approval
                      </Text>
                      <Text 
                        style={[
                          styles.policyDescription,
                          values.withdrawalPolicy === 'ADMIN_APPROVAL' && styles.policyDescriptionSelected
                        ]}
                      >
                        All withdrawal requests must be approved by a group admin
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.policyOption,
                        values.withdrawalPolicy === 'ANYTIME' && styles.policySelected
                      ]}
                      onPress={() => setFieldValue('withdrawalPolicy', 'ANYTIME')}
                    >
                      <Icon 
                        name="timer-sand" 
                        size={24} 
                        color={values.withdrawalPolicy === 'ANYTIME' ? "#fff" : "#6200ee"} 
                      />
                      <Text 
                        style={[
                          styles.policyTitle,
                          values.withdrawalPolicy === 'ANYTIME' && styles.policyTitleSelected
                        ]}
                      >
                        Withdraw Anytime
                      </Text>
                      <Text 
                        style={[
                          styles.policyDescription,
                          values.withdrawalPolicy === 'ANYTIME' && styles.policyDescriptionSelected
                        ]}
                      >
                        Members can withdraw their contributions at any time
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.policyOption,
                        values.withdrawalPolicy === 'GOAL_ONLY' && styles.policySelected
                      ]}
                      onPress={() => setFieldValue('withdrawalPolicy', 'GOAL_ONLY')}
                    >
                      <Icon 
                        name="lock-check" 
                        size={24} 
                        color={values.withdrawalPolicy === 'GOAL_ONLY' ? "#fff" : "#6200ee"} 
                      />
                      <Text 
                        style={[
                          styles.policyTitle,
                          values.withdrawalPolicy === 'GOAL_ONLY' && styles.policyTitleSelected
                        ]}
                      >
                        Goal Achievement
                      </Text>
                      <Text 
                        style={[
                          styles.policyDescription,
                          values.withdrawalPolicy === 'GOAL_ONLY' && styles.policyDescriptionSelected
                        ]}
                      >
                        Withdrawals only allowed when the goal is reached
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Divider style={styles.divider} />
                  <Text style={styles.label}>Approval Settings</Text>
                  
                  <View style={styles.switchContainer}>
                    <Text>Require all members to approve withdrawals</Text>
                    <Switch
                      value={values.requireAllApprovals}
                      onValueChange={(value) => setFieldValue('requireAllApprovals', value)}
                    />
                  </View>
                  
                  {!values.requireAllApprovals && (
                    <>
                      <TextInput
                        label="Minimum Approval Percentage"
                        value={values.minimumApprovalPercentage}
                        onChangeText={handleChange('minimumApprovalPercentage')}
                        onBlur={handleBlur('minimumApprovalPercentage')}
                        keyboardType="numeric"
                        mode="outlined"
                        right={<TextInput.Affix text="%" />}
                        style={styles.input}
                        error={touched.minimumApprovalPercentage && errors.minimumApprovalPercentage}
                      />
                      {touched.minimumApprovalPercentage && errors.minimumApprovalPercentage && (
                        <HelperText type="error">{errors.minimumApprovalPercentage}</HelperText>
                      )}
                    </>
                  )}
                  
                  <View style={styles.switchContainer}>
                    <Text>Automatically split funds equally if there's a dispute</Text>
                    <Switch
                      value={values.autoSplitOnDispute}
                      onValueChange={(value) => setFieldValue('autoSplitOnDispute', value)}
                    />
                  </View>
                </Card.Content>
              </Card>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={submitting}
                loading={submitting}
              >
                Create Savings Group
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
                disabled={submitting}
              >
                Cancel
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
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  form: {
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    margin: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    marginLeft: 8,
    color: '#6200ee',
  },
  policyContainer: {
    marginBottom: 16,
  },
  policyOption: {
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  policySelected: {
    backgroundColor: '#6200ee',
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 8,
    marginBottom: 4,
  },
  policyTitleSelected: {
    color: '#fff',
  },
  policyDescription: {
    fontSize: 14,
    color: '#666',
  },
  policyDescriptionSelected: {
    color: '#f0f0f0',
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 8,
    marginBottom: 24,
  },
});

export default CreateGroupScreen;