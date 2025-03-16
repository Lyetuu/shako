// File: screens/GroupSavings/RequestWithdrawalScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
  Checkbox,
  Divider,
  RadioButton
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchGroupDetails, requestWithdrawal } from '../../services/api/groupSavings';
import { fetchBankAccounts } from '../../services/api/banking';
import { calculateWithdrawalFeeLocally } from '../../services/api/feeService';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';

const WithdrawalSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  reason: Yup.string()
    .required('Reason is required')
    .min(10, 'Please provide a more detailed reason'),
  bankAccountId: Yup.string()
    .required('Please select a bank account'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms')
});

const RequestWithdrawalScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { groupId } = route.params;
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userContribution, setUserContribution] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [processingTime, setProcessingTime] = useState('DAYS_30');
  const [feeCalculation, setFeeCalculation] = useState(null);
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  
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
      
      // Find the user's contribution
      const member = groupData.members.find(m => m.user._id === user.id);
      if (member) {
        setUserContribution(member.totalContributed);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load group or banking details');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if withdrawals are allowed based on goal status
  const withdrawalsLocked = () => {
    if (!group) return false;
    
    // If group has no goal, withdrawals are always allowed
    if (!group.goalAmount || group.goalAmount <= 0) return false;
    
    // If group has lockWithdrawalsUntilGoal setting and goal not reached, lock withdrawals
    if (group.settings?.lockWithdrawalsUntilGoal && group.totalSavings < group.goalAmount) {
      return true;
    }
    
    return false;
  };
  
  const handleWithdrawalRequest = async (values) => {
    try {
      setSubmitting(true);
      
      if (parseFloat(values.amount) > userContribution) {
        Alert.alert(
          'Invalid Amount',
          'You cannot withdraw more than your contribution'
        );
        return;
      }
      
      const withdrawalData = {
        amount: parseFloat(values.amount),
        reason: values.reason,
        bankAccountId: values.bankAccountId,
        processingTime: processingTime
      };
      
      await requestWithdrawal(groupId, withdrawalData);
      
      Alert.alert(
        'Request Submitted',
        'Your withdrawal request has been submitted and is pending approval.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('GroupDetails', { groupId })
          }
        ]
      );
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      Alert.alert('Error', error.message || 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };
  
  const calculateFees = (amount, processingTime) => {
    if (!amount || isNaN(amount)) return;
    
    const isEarlyWithdrawal = group?.goalAmount > 0 && group.totalSavings < group.goalAmount;
    
    const calculation = calculateWithdrawalFeeLocally(
      parseFloat(amount),
      isEarlyWithdrawal, 
      processingTime
    );
    
    setFeeCalculation(calculation);
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
  if (withdrawalsLocked()) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Request a Withdrawal</Text>
          
          <Card style={styles.groupInfoCard}>
            <Card.Content>
              <Text style={styles.groupName}>{group.name}</Text>
              <Divider style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Your Contribution:</Text>
                <Text style={styles.infoValue}>{formatCurrency(userContribution)}</Text>
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
              <Text style={styles.lockedTitle}>Withdrawals Locked</Text>
              <Text style={styles.lockedDescription}>
                This group has locked withdrawals until the savings goal is reached.
                You will be able to withdraw once the group reaches {formatCurrency(group.goalAmount)}.
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
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Request a Withdrawal</Text>
        
        <Card style={styles.groupInfoCard}>
          <Card.Content>
            <Text style={styles.groupName}>{group.name}</Text>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Your Contribution:</Text>
              <Text style={styles.infoValue}>{formatCurrency(userContribution)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Available to Withdraw:</Text>
              <Text style={styles.infoValue}>{formatCurrency(userContribution)}</Text>
            </View>
          </Card.Content>
        </Card>
        
        <Formik
          initialValues={{
            amount: '',
            reason: '',
            bankAccountId: bankAccounts.find(acc => acc.isDefault)?.id || '',
            acceptTerms: false
          }}
          validationSchema={WithdrawalSchema}
          onSubmit={handleWithdrawalRequest}
          validateOnChange={false}
        >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => {
            // Recalculate fees when amount or processing time changes
            useEffect(() => {
              if (values.amount) {
                calculateFees(values.amount, processingTime);
              }
            }, [values.amount, processingTime]);
            
            return (
              <View style={styles.form}>
                <Card style={styles.formCard}>
                  <Card.Content>
                    <TextInput
                      label="Withdrawal Amount"
                      value={values.amount}
                      onChangeText={handleChange('amount')}
                      onBlur={handleBlur('amount')}
                      keyboardType="numeric"
                      mode="outlined"
                      left={<TextInput.Affix text="$" />}
                      style={styles.input}
                      error={touched.amount && errors.amount}
                    />
                    {touched.amount && errors.amount && (
                      <HelperText type="error">{errors.amount}</HelperText>
                    )}
                    
                    <TextInput
                      label="Reason for Withdrawal"
                      value={values.reason}
                      onChangeText={handleChange('reason')}
                      onBlur={handleBlur('reason')}
                      mode="outlined"
                      multiline
                      numberOfLines={3}
                      style={styles.input}
                      error={touched.reason && errors.reason}
                    />
                    {touched.reason && errors.reason && (
                      <HelperText type="error">{errors.reason}</HelperText>
                    )}
                  </Card.Content>
                </Card>
                
                {bankAccounts.length > 0 ? (
                  <>
                    <Card style={styles.bankCard}>
                      <Card.Content>
                        <Text style={styles.sectionTitle}>Select Bank Account</Text>
                        <Text style={styles.sectionDescription}>
                          Choose where you want to receive your funds
                        </Text>
                        
                        <RadioButton.Group
                          onValueChange={(value) => setFieldValue('bankAccountId', value)}
                          value={values.bankAccountId}
                        >
                          {bankAccounts.map(account => (
                            <View key={account.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                              <RadioButton value={account.id} />
                              <View style={{ marginLeft: 8 }}>
                                <Text style={{ fontWeight: 'bold' }}>
                                  {account.nickname || account.bankName} 
                                  {account.isDefault && ' (Default)'}
                                </Text>
                                <Text style={{ color: '#666', fontSize: 14 }}>
                                  {account.accountType === 'CHECKING' ? 'Checking' : 'Savings'} •••• {account.last4}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </RadioButton.Group>
                        
                        <Button
                          mode="outlined"
                          onPress={() => navigation.navigate('BankingDetails')}
                          style={{ marginTop: 8 }}
                          icon="plus"
                        >
                          Add Bank Account
                        </Button>
                        
                        {touched.bankAccountId && errors.bankAccountId && (
                          <HelperText type="error">{errors.bankAccountId}</HelperText>
                        )}
                      </Card.Content>
                    </Card>
                  </>
                ) : (
                  <Card style={{ marginTop: 16, marginBottom: 16 }}>
                    <Card.Content>
                      <Text style={{ textAlign: 'center', marginBottom: 8 }}>
                        You need to add a bank account to receive withdrawals
                      </Text>
                      <Button
                        mode="contained"
                        onPress={() => navigation.navigate('BankingDetails')}
                        icon="bank"
                      >
                        Add Bank Account
                      </Button>
                    </Card.Content>
                  </Card>
                )}
                
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Processing Time</Text>
                  <Text style={styles.sectionDescription}>
                    Choose how quickly you need to receive your funds.
                    Faster processing times have higher fees.
                  </Text>
                  
                  <RadioButton.Group 
                    onValueChange={value => {
                      setProcessingTime(value);
                      calculateFees(values.amount, value);
                    }} 
                    value={processingTime}
                  >
                    <View style={styles.radioOption}>
                      <RadioButton value="INSTANT" />
                      <View style={styles.radioTextContainer}>
                        <Text style={styles.radioLabel}>Instant Processing</Text>
                        <Text style={styles.radioDescription}>
                          Receive funds immediately (20% fee)
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.radioOption}>
                      <RadioButton value="DAYS_7" />
                      <View style={styles.radioTextContainer}>
                        <Text style={styles.radioLabel}>7-Day Processing</Text>
                        <Text style={styles.radioDescription}>
                          Receive funds in 7 days (15% fee)
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.radioOption}>
                      <RadioButton value="DAYS_14" />
                      <View style={styles.radioTextContainer}>
                        <Text style={styles.radioLabel}>14-Day Processing</Text>
                        <Text style={styles.radioDescription}>
                          Receive funds in 14 days (10% fee)
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.radioOption}>
                      <RadioButton value="DAYS_30" />
                      <View style={styles.radioTextContainer}>
                        <Text style={styles.radioLabel}>30-Day Processing</Text>
                        <Text style={styles.radioDescription}>
                          Receive funds in 30 days (5% fee)
                        </Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
                
                {/* Fee Calculation Card */}
                {feeCalculation && values.amount && (
                  <Card style={styles.feeCard}>
                    <Card.Content>
                      <View style={styles.feeHeader}>
                        <Text style={styles.feeTitle}>Fee Calculation</Text>
                        <Button 
                          mode="text" 
                          compact 
                          onPress={() => setShowFeeDetails(!showFeeDetails)}
                        >
                          {showFeeDetails ? 'Hide Details' : 'Show Details'}
                        </Button>
                      </View>
                      
                      <Divider style={styles.divider} />
                      
                      <View style={styles.feeRow}>
                        <Text style={styles.feeLabel}>Withdrawal Amount:</Text>
                        <Text style={styles.feeValue}>{formatCurrency(feeCalculation.originalAmount)}</Text>
                      </View>
                      
                      {group?.goalAmount > 0 && group.totalSavings < group.goalAmount && (
                        <View style={styles.earlyWithdrawalWarning}>
                          <Icon name="alert-circle" size={20} color="#F44336" style={styles.warningIcon} />
                          <Text style={styles.warningText}>
                            Early withdrawal fee applies because you haven't reached your goal yet.
                          </Text>
                        </View>
                      )}
                      
                      {showFeeDetails && (
                        <>
                          {feeCalculation.feeBreakdown.earlyWithdrawalFee > 0 && (
                            <View style={styles.feeRow}>
                              <Text style={styles.feeDetailLabel}>Early Withdrawal Fee (20%):</Text>
                              <Text style={styles.feeDetailValue}>
                                {formatCurrency(feeCalculation.feeBreakdown.earlyWithdrawalFee)}
                              </Text>
                            </View>
                          )}
                          
                          <View style={styles.feeRow}>
                            <Text style={styles.feeDetailLabel}>
                              Processing Fee ({
                                processingTime === 'INSTANT' ? '20%' :
                                processingTime === 'DAYS_7' ? '15%' :
                                processingTime === 'DAYS_14' ? '10%' : '5%'
                              }):
                            </Text>
                            <Text style={styles.feeDetailValue}>
                              {formatCurrency(feeCalculation.feeBreakdown.processingTimeFee)}
                            </Text>
                          </View>
                        </>
                      )}
                      
                      <View style={styles.feeRow}>
                        <Text style={styles.feeTotalLabel}>Total Fee ({feeCalculation.feePercentage}%):</Text>
                        <Text style={styles.feeTotalValue}>{formatCurrency(feeCalculation.feeAmount)}</Text>
                      </View>
                      
                      <Divider style={styles.divider} />
                      
                      <View style={styles.feeRow}>
                        <Text style={styles.netAmountLabel}>Amount You'll Receive:</Text>
                        <Text style={styles.netAmountValue}>{formatCurrency(feeCalculation.netAmount)}</Text>
                      </View>
                    </Card.Content>
                  </Card>
                )}
                
                <Card style={styles.termsCard}>
                  <Card.Content>
                    <Text style={styles.termsTitle}>Withdrawal Terms</Text>
                    <Text style={styles.termsText}>
                      • Your withdrawal request requires approval from the group admin(s).
                    </Text>
                    <Text style={styles.termsText}>
                      • Fees will be deducted based on your selected processing time.
                    </Text>
                    <Text style={styles.termsText}>
                      • Processing will begin once your request is approved.
                    </Text>
                    <Text style={styles.termsText}>
                      • Withdrawal policies are subject to group rules.
                    </Text>
                    
                    <View style={styles.checkboxContainer}>
                      <Checkbox
                        status={values.acceptTerms ? 'checked' : 'unchecked'}
                        onPress={() => setFieldValue('acceptTerms', !values.acceptTerms)}
                      />
                      <Text style={styles.checkboxLabel}>
                        I understand and accept the withdrawal terms and fees
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
                  disabled={submitting || bankAccounts.length === 0}
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
            );
          }}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  },
  groupInfoCard: {
    marginBottom: 16,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 8,
  },
  formCard: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  bankCard: {
    marginBottom: 16,
  },
  termsCard: {
    marginBottom: 16,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    marginBottom: 6,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 24,
  },
  // Locked screen styles
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
  // Fee calculation styles
  sectionContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioDescription: {
    fontSize: 14,
    color: '#666',
  },
  feeCard: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  feeLabel: {
    fontSize: 14,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  feeDetailLabel: {
    fontSize: 13,
    color: '#666',
  },
  feeDetailValue: {
    fontSize: 13,
    color: '#666',
  },
  feeTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
  },
  feeTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
  },
  netAmountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  netAmountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  earlyWithdrawalWarning: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 4,
    marginVertical: 8,
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#F44336',
    flex: 1,
  },
});

export default RequestWithdrawalScreen;