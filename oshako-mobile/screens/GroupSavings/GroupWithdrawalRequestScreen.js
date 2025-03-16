// File: screens/GroupSavings/GroupWithdrawalRequestScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Card,
  Text,
  Checkbox,
  Divider,
  RadioButton,
  Title,
  Paragraph
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchGroupDetails, requestGroupWithdrawal } from '../../services/api/groupSavings';
import { fetchBankAccounts } from '../../services/api/banking';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WithdrawalTypes = {
  GROUP_ACCOUNT: 'GROUP_ACCOUNT',
  DISTRIBUTE_TO_MEMBERS: 'DISTRIBUTE_TO_MEMBERS'
};

const GroupWithdrawalSchema = Yup.object().shape({
  reason: Yup.string()
    .required('Reason is required')
    .min(10, 'Please provide a more detailed reason'),
  withdrawalType: Yup.string()
    .required('Please select a withdrawal type')
    .oneOf([WithdrawalTypes.GROUP_ACCOUNT, WithdrawalTypes.DISTRIBUTE_TO_MEMBERS]),
  bankAccountId: Yup.string()
    .when('withdrawalType', {
      is: WithdrawalTypes.GROUP_ACCOUNT,
      then: Yup.string().required('Please select a bank account')
    }),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms')
});

const GroupWithdrawalRequestScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { groupId } = route.params;
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    loadData();
  }, [groupId]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const [groupData, bankAccountsData] = await Promise.all([
        fetchGroupDetails(groupId),
        fetchBankAccounts()
      ]);
      
      setGroup(groupData);
      setBankAccounts(bankAccountsData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load group or banking details');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if group withdrawals are allowed based on goal status
  const groupWithdrawalsLocked = () => {
    if (!group) return false;
    
    // If group has no goal, withdrawals are always allowed
    if (!group.goalAmount || group.goalAmount <= 0) return false;
    
    // If group has lockWithdrawalsUntilGoal setting and goal not reached, lock withdrawals
    if (group.settings?.lockWithdrawalsUntilGoal && group.totalSavings < group.goalAmount) {
      return true;
    }
    
    return false;
  };
  
  const handleSubmitWithdrawal = async (values) => {
    try {
      setSubmitting(true);
      
      const withdrawalData = {
        reason: values.reason,
        withdrawalType: values.withdrawalType,
        bankAccountId: values.withdrawalType === WithdrawalTypes.GROUP_ACCOUNT ? values.bankAccountId : null
      };
      
      const result = await requestGroupWithdrawal(groupId, withdrawalData);
      
      Alert.alert(
        'Request Submitted',
        'Your group withdrawal request has been submitted and is pending approval from all members.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('GroupWithdrawalStatus', { 
              withdrawalId: result.id,
              groupId
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error requesting group withdrawal:', error);
      Alert.alert('Error', error.message || 'Failed to submit group withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };
  
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
          onPress={loadData}
          style={{ marginTop: 16 }}
        >
          Retry
        </Button>
      </View>
    );
  }
  
  // Check if withdrawals are locked due to goal not being reached
  if (groupWithdrawalsLocked()) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Group Withdrawal Request</Text>
          
          <Card style={styles.groupInfoCard}>
            <Card.Content>
              <Text style={styles.groupName}>{group.name}</Text>
              <Divider style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Savings:</Text>
                <Text style={styles.infoValue}>{formatCurrency(group.totalSavings)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Group Goal:</Text>
                <Text style={styles.infoValue}>{formatCurrency(group.goalAmount)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current Progress:</Text>
                <Text style={styles.infoValue}>
                  {Math.round((group.totalSavings / group.goalAmount) * 100)}%
                </Text>
              </View>
            </Card.Content>
          </Card>
          
          <Card style={styles.lockedCard}>
            <Card.Content>
              <View style={styles.lockedIconContainer}>
                <Icon name="lock" size={60} color="#F44336" />
              </View>
              <Text style={styles.lockedTitle}>Group Withdrawals Locked</Text>
              <Text style={styles.lockedDescription}>
                This group has locked withdrawals until the savings goal is reached.
                Group withdrawals will be available once the goal of {formatCurrency(group.goalAmount)} is reached.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.goBack()}
                style={styles.lockedButton}
              >
                Go Back
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    );
  }
  
  // Check if user is admin or has permission to request withdrawal
  const isAdmin = group.members.find(m => m.user._id === user.id)?.isAdmin;
  
  if (!isAdmin) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          You must be a group admin to request a group withdrawal
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16 }}
        >
          Go Back
        </Button>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Group Withdrawal Request</Text>
        
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>Important Information</Title>
            <Paragraph style={styles.infoParagraph}>
              This will initiate a withdrawal of the group's total savings ({formatCurrency(group.totalSavings)}). 
              All group members must approve this withdrawal before funds are released.
            </Paragraph>
          </Card.Content>
        </Card>
        
        <Card style={styles.groupInfoCard}>
          <Card.Content>
            <Text style={styles.groupName}>{group.name}</Text>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Savings:</Text>
              <Text style={styles.infoValue}>{formatCurrency(group.totalSavings)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Members:</Text>
              <Text style={styles.infoValue}>{group.members.length}</Text>
            </View>
            {group.goalAmount > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Goal Progress:</Text>
                <Text style={styles.infoValue}>
                  {Math.min(Math.round((group.totalSavings / group.goalAmount) * 100), 100)}%
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
        
        <Formik
          initialValues={{
            reason: '',
            withdrawalType: WithdrawalTypes.GROUP_ACCOUNT,
            bankAccountId: bankAccounts.find(acc => acc.isDefault)?.id || '',
            acceptTerms: false
          }}
          validationSchema={GroupWithdrawalSchema}
          onSubmit={handleSubmitWithdrawal}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.form}>
              <TextInput
                label="Reason for Group Withdrawal"
                value={values.reason}
                onChangeText={handleChange('reason')}
                onBlur={handleBlur('reason')}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={4}
                error={touched.reason && errors.reason}
              />
              {touched.reason && errors.reason && (
                <HelperText type="error">{errors.reason}</HelperText>
              )}
              
              <Text style={styles.sectionTitle}>Withdrawal Method</Text>
              <RadioButton.Group
                onValueChange={(value) => setFieldValue('withdrawalType', value)}
                value={values.withdrawalType}
              >
                <View style={styles.radioOption}>
                  <RadioButton value={WithdrawalTypes.GROUP_ACCOUNT} />
                  <View style={styles.radioTextContainer}>
                    <Text style={styles.radioLabel}>Send to a single bank account</Text>
                    <Text style={styles.radioDescription}>
                      Total funds will be sent to the selected bank account
                    </Text>
                  </View>
                </View>
                
                <View style={styles.radioOption}>
                  <RadioButton value={WithdrawalTypes.DISTRIBUTE_TO_MEMBERS} />
                  <View style={styles.radioTextContainer}>
                    <Text style={styles.radioLabel}>Distribute to all members</Text>
                    <Text style={styles.radioDescription}>
                      Funds will be distributed proportionally based on member contributions
                    </Text>
                  </View>
                </View>
              </RadioButton.Group>
              
              {values.withdrawalType === WithdrawalTypes.GROUP_ACCOUNT && (
                <Card style={styles.bankAccountCard}>
                  <Card.Content>
                    <Text style={styles.bankAccountTitle}>Select Bank Account</Text>
                    
                    {bankAccounts.length > 0 ? (
                      <RadioButton.Group
                        onValueChange={(value) => setFieldValue('bankAccountId', value)}
                        value={values.bankAccountId}
                      >
                        {bankAccounts.map(account => (
                          <View key={account.id} style={styles.bankAccountOption}>
                            <RadioButton value={account.id} />
                            <View style={styles.bankAccountDetails}>
                              <Text style={styles.bankAccountName}>
                                {account.nickname || account.bankName}
                                {account.isDefault && ' (Default)'}
                              </Text>
                              <Text style={styles.bankAccountNumber}>
                                {account.accountType === 'CHECKING' ? 'Checking' : 'Savings'} •••• {account.last4}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </RadioButton.Group>
                    ) : (
                      <View style={styles.noBankAccountsContainer}>
                        <Text style={styles.noBankAccountsText}>
                          You don't have any bank accounts set up
                        </Text>
                        <Button 
                          mode="contained" 
                          onPress={() => navigation.navigate('BankingDetails')}
                          style={styles.addBankButton}
                        >
                          Add Bank Account
                        </Button>
                      </View>
                    )}
                    
                    {touched.bankAccountId && errors.bankAccountId && (
                      <HelperText type="error">{errors.bankAccountId}</HelperText>
                    )}
                  </Card.Content>
                </Card>
              )}
              
              {values.withdrawalType === WithdrawalTypes.DISTRIBUTE_TO_MEMBERS && (
                <Card style={styles.distributionCard}>
                  <Card.Content>
                    <Text style={styles.distributionTitle}>Distribution Information</Text>
                    <Text style={styles.distributionDescription}>
                      Funds will be distributed to each member's default bank account based on their contribution percentage.
                    </Text>
                    <Text style={styles.distributionNote}>
                      Note: Members without a bank account will be prompted to add one before funds can be distributed.
                    </Text>
                  </Card.Content>
                </Card>
              )}
              
              <Card style={styles.termsCard}>
                <Card.Content>
                  <Text style={styles.termsTitle}>Group Withdrawal Terms</Text>
                  <Text style={styles.termsText}>
                    • All group members must approve this withdrawal request.
                  </Text>
                  <Text style={styles.termsText}>
                    • If any member declines, a dispute process will be initiated.
                  </Text>
                  <Text style={styles.termsText}>
                    • Processing may take 3-5 business days after approval.
                  </Text>
                  <Text style={styles.termsText}>
                    • You can cancel this request any time before all members approve.
                  </Text>
                  
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={values.acceptTerms ? 'checked' : 'unchecked'}
                      onPress={() => setFieldValue('acceptTerms', !values.acceptTerms)}
                    />
                    <Text style={styles.checkboxLabel}>
                      I understand and accept the group withdrawal terms
                    </Text>
                  </View>
                  {touched.acceptTerms && errors.acceptTerms && (
                    <HelperText type="error">{errors.acceptTerms}</HelperText>
                  )}
                </Card.Content>
              </Card>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={submitting || (values.withdrawalType === WithdrawalTypes.GROUP_ACCOUNT && bankAccounts.length === 0)}
                loading={submitting}
              >
                Submit Withdrawal Request
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
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  errorText: {
    textAlign: 'center',
    color: '#f44336',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#e8f5e9'
  },
  infoTitle: {
    color: '#2e7d32'
  },
  infoParagraph: {
    color: '#2e7d32'
  },
  groupInfoCard: {
    marginBottom: 20
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  divider: {
    marginVertical: 12
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555'
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  form: {
    marginTop: 8
  },
  input: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  radioTextContainer: {
    marginLeft: 8,
    flex: 1
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500'
  },
  radioDescription: {
    fontSize: 14,
    color: '#666'
  },
  bankAccountCard: {
    marginTop: 16,
    marginBottom: 16
  },
  bankAccountTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  bankAccountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  bankAccountDetails: {
    marginLeft: 8
  },
  bankAccountName: {
    fontSize: 16,
    fontWeight: '500'
  },
  bankAccountNumber: {
    fontSize: 14,
    color: '#666'
  },
  noBankAccountsContainer: {
    alignItems: 'center',
    padding: 16
  },
  noBankAccountsText: {
    marginBottom: 12,
    textAlign: 'center',
    color: '#f44336'
  },
  addBankButton: {
    marginTop: 8
  },
  distributionCard: {
    marginTop: 16,
    marginBottom: 16
  },
  distributionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  distributionDescription: {
    fontSize: 14,
    marginBottom: 8
  },
  distributionNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#f57c00'
  },
  termsCard: {
    marginVertical: 16
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  termsText: {
    fontSize: 14,
    marginBottom: 6
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 8
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 8
  },
  // Added styles for the locked state
  lockedCard: {
    marginTop: 16,
    backgroundColor: '#ffebee',
  },
  lockedIconContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  lockedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#F44336',
    marginBottom: 12,
  },
  lockedDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  lockedButton: {
    marginBottom: 12,
  },
});

export default GroupWithdrawalRequestScreen;