// File: screens/Profile/BankingDetailsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Title,
  List,
  Divider,
  TextInput,
  HelperText,
  RadioButton,
  IconButton,
  ActivityIndicator,
  Dialog,
  Portal,
  Paragraph,
  Switch,
  FAB
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { fetchBankAccounts, addBankAccount, deleteBankAccount, setDefaultBankAccount } from '../../services/api/banking';

// Bank account validation schema
const BankAccountSchema = Yup.object().shape({
  accountNumber: Yup.string()
    .required('Account number is required')
    .matches(/^\d{8,17}$/, 'Must be a valid account number (8-17 digits)'),
  routingNumber: Yup.string()
    .required('Routing number is required')
    .matches(/^\d{9}$/, 'Must be a valid 9-digit routing number'),
  accountType: Yup.string()
    .required('Account type is required')
    .oneOf(['CHECKING', 'SAVINGS'], 'Must be either checking or savings'),
  accountHolderName: Yup.string()
    .required('Account holder name is required')
    .min(2, 'Name must be at least 2 characters'),
  bankName: Yup.string()
    .required('Bank name is required'),
  nickname: Yup.string(),
  setAsDefault: Yup.boolean()
});

const BankingDetailsScreen = () => {
  const navigation = useNavigation();
  
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    loadBankAccounts();
  }, []);
  
  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await fetchBankAccounts();
      setBankAccounts(accounts);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      Alert.alert('Error', 'Failed to load banking details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddAccount = async (values) => {
    try {
      setSubmitting(true);
      
      const accountData = {
        accountNumber: values.accountNumber,
        routingNumber: values.routingNumber,
        accountType: values.accountType,
        accountHolderName: values.accountHolderName,
        bankName: values.bankName,
        nickname: values.nickname || `${values.bankName} ${values.accountType.toLowerCase()}`,
        setAsDefault: values.setAsDefault
      };
      
      const newAccount = await addBankAccount(accountData);
      
      // Update state with new account
      if (values.setAsDefault) {
        // If this is the new default, update all accounts' default status
        setBankAccounts(prevAccounts => 
          [...prevAccounts.map(acc => ({...acc, isDefault: false})), {...newAccount, isDefault: true}]
        );
      } else {
        setBankAccounts(prevAccounts => [...prevAccounts, newAccount]);
      }
      
      Alert.alert('Success', 'Bank account added successfully');
      setAddDialogVisible(false);
    } catch (error) {
      console.error('Error adding bank account:', error);
      Alert.alert('Error', error.message || 'Failed to add bank account');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteAccount = (account) => {
    setSelectedAccount(account);
    setDeleteDialogVisible(true);
  };
  
  const confirmDeleteAccount = async () => {
    if (!selectedAccount) return;
    
    try {
      setSubmitting(true);
      await deleteBankAccount(selectedAccount.id);
      
      // Remove from state
      setBankAccounts(prevAccounts => 
        prevAccounts.filter(acc => acc.id !== selectedAccount.id)
      );
      
      Alert.alert('Success', 'Bank account removed successfully');
    } catch (error) {
      console.error('Error deleting bank account:', error);
      Alert.alert('Error', 'Failed to remove bank account');
    } finally {
      setSubmitting(false);
      setDeleteDialogVisible(false);
    }
  };
  
  const handleSetDefaultAccount = async (accountId) => {
    try {
      setLoading(true);
      await setDefaultBankAccount(accountId);
      
      // Update state
      setBankAccounts(prevAccounts => 
        prevAccounts.map(acc => ({
          ...acc,
          isDefault: acc.id === accountId
        }))
      );
      
      Alert.alert('Success', 'Default withdrawal account updated');
    } catch (error) {
      console.error('Error setting default account:', error);
      Alert.alert('Error', 'Failed to update default account');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !bankAccounts.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoText}>
              Manage your bank accounts for withdrawals from savings groups
            </Text>
          </Card.Content>
        </Card>
        
        <Title style={styles.sectionTitle}>Your Bank Accounts</Title>
        
        {bankAccounts.length > 0 ? (
          bankAccounts.map((account) => (
            <Card key={account.id} style={styles.accountCard}>
              <Card.Content>
                <View style={styles.accountHeader}>
                  <View style={styles.accountInfo}>
                    <Icon name="bank" size={24} color="#006633" />
                    <View style={styles.accountDetails}>
                      <Text style={styles.accountName}>
                        {account.nickname || account.bankName}
                      </Text>
                      <Text style={styles.accountNumber}>
                        {account.accountType === 'CHECKING' ? 'Checking' : 'Savings'} •••• {account.last4}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.accountActions}>
                    {account.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                    <IconButton
                      icon="trash-can-outline"
                      size={20}
                      color="#F44336"
                      onPress={() => handleDeleteAccount(account)}
                    />
                  </View>
                </View>
                
                {!account.isDefault && (
                  <Button
                    mode="outlined"
                    onPress={() => handleSetDefaultAccount(account.id)}
                    style={styles.setDefaultButton}
                  >
                    Set as Default
                  </Button>
                )}
              </Card.Content>
            </Card>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="bank-remove" size={64} color="#9E9E9E" />
            <Text style={styles.emptyText}>No Bank Accounts Added</Text>
            <Text style={styles.emptySubtext}>
              Add a bank account to receive withdrawals from your savings groups
            </Text>
            <Button
              mode="contained"
              onPress={() => setAddDialogVisible(true)}
              style={styles.addButton}
              icon="plus"
            >
              Add Bank Account
            </Button>
          </View>
        )}
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Account"
        onPress={() => setAddDialogVisible(true)}
      />
      
      {/* Add Bank Account Dialog */}
      <Portal>
        <Dialog
          visible={addDialogVisible}
          onDismiss={() => setAddDialogVisible(false)}
          style={styles.dialog}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView>
              <Dialog.Title>Add Bank Account</Dialog.Title>
              <Dialog.Content>
                <Formik
                  initialValues={{
                    accountNumber: '',
                    routingNumber: '',
                    accountType: 'CHECKING',
                    accountHolderName: '',
                    bankName: '',
                    nickname: '',
                    setAsDefault: bankAccounts.length === 0 // Default to true if first account
                  }}
                  validationSchema={BankAccountSchema}
                  onSubmit={handleAddAccount}
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <View>
                      <TextInput
                        label="Bank Name"
                        value={values.bankName}
                        onChangeText={handleChange('bankName')}
                        onBlur={handleBlur('bankName')}
                        mode="outlined"
                        style={styles.input}
                        error={touched.bankName && errors.bankName}
                      />
                      {touched.bankName && errors.bankName && (
                        <HelperText type="error">{errors.bankName}</HelperText>
                      )}
                      
                      <TextInput
                        label="Account Number"
                        value={values.accountNumber}
                        onChangeText={handleChange('accountNumber')}
                        onBlur={handleBlur('accountNumber')}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        error={touched.accountNumber && errors.accountNumber}
                      />
                      {touched.accountNumber && errors.accountNumber && (
                        <HelperText type="error">{errors.accountNumber}</HelperText>
                      )}
                      
                      <TextInput
                        label="Routing Number"
                        value={values.routingNumber}
                        onChangeText={handleChange('routingNumber')}
                        onBlur={handleBlur('routingNumber')}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        error={touched.routingNumber && errors.routingNumber}
                        maxLength={9}
                      />
                      {touched.routingNumber && errors.routingNumber && (
                        <HelperText type="error">{errors.routingNumber}</HelperText>
                      )}
                      
                      <Text style={styles.label}>Account Type</Text>
                      <RadioButton.Group
                        onValueChange={value => setFieldValue('accountType', value)}
                        value={values.accountType}
                      >
                        <View style={styles.radioContainer}>
                          <View style={styles.radioOption}>
                            <RadioButton value="CHECKING" />
                            <Text style={styles.radioLabel}>Checking</Text>
                          </View>
                          
                          <View style={styles.radioOption}>
                            <RadioButton value="SAVINGS" />
                            <Text style={styles.radioLabel}>Savings</Text>
                          </View>
                        </View>
                      </RadioButton.Group>
                      
                      <TextInput
                        label="Account Holder Name"
                        value={values.accountHolderName}
                        onChangeText={handleChange('accountHolderName')}
                        onBlur={handleBlur('accountHolderName')}
                        mode="outlined"
                        style={styles.input}
                        error={touched.accountHolderName && errors.accountHolderName}
                      />
                      {touched.accountHolderName && errors.accountHolderName && (
                        <HelperText type="error">{errors.accountHolderName}</HelperText>
                      )}
                      
                      <TextInput
                        label="Nickname (Optional)"
                        value={values.nickname}
                        onChangeText={handleChange('nickname')}
                        onBlur={handleBlur('nickname')}
                        mode="outlined"
                        style={styles.input}
                        error={touched.nickname && errors.nickname}
                      />
                      {touched.nickname && errors.nickname && (
                        <HelperText type="error">{errors.nickname}</HelperText>
                      )}
                      
                      <View style={styles.switchContainer}>
                        <Text>Set as default withdrawal account</Text>
                        <Switch
                          value={values.setAsDefault}
                          onValueChange={(value) => setFieldValue('setAsDefault', value)}
                          disabled={bankAccounts.length === 0} // Force true if first account
                        />
                      </View>
                      
                      <View style={styles.dialogButtons}>
                        <Button 
                          onPress={() => setAddDialogVisible(false)} 
                          style={styles.dialogButton}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                        <Button 
                          mode="contained" 
                          onPress={handleSubmit}
                          style={styles.dialogButton}
                          loading={submitting}
                          disabled={submitting}
                        >
                          Add
                        </Button>
                      </View>
                    </View>
                  )}
                </Formik>
              </Dialog.Content>
            </ScrollView>
          </KeyboardAvoidingView>
        </Dialog>
      </Portal>
      
      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Remove Bank Account</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to remove this bank account? This action cannot be undone.
            </Paragraph>
            {selectedAccount?.isDefault && (
              <Paragraph style={styles.warningText}>
                Warning: This is your default withdrawal account. You will need to set a new default account for future withdrawals.
              </Paragraph>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setDeleteDialogVisible(false)} 
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onPress={confirmDeleteAccount}
              color="#F44336"
              loading={submitting}
              disabled={submitting}
            >
              Remove
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  infoCard: {
    margin: 16,
    backgroundColor: '#e8f5e9',
  },
  infoText: {
    color: '#2E7D32',
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  accountCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountDetails: {
    marginLeft: 12,
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  defaultText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  setDefaultButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  dialog: {
    maxHeight: '90%',
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  radioLabel: {
    marginLeft: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  dialogButton: {
    marginLeft: 8,
  },
  warningText: {
    color: '#F44336',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default BankingDetailsScreen;
