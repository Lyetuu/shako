// File: screens/GroupSavings/ContributeScreen.js
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
  Card,
  Text,
  HelperText,
  Divider,
  RadioButton,
  Switch
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchGroupDetails, makeContribution } from '../../services/api/groupSavings';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { MIN_CONTRIBUTION_AMOUNT } from '../../config/constants';

const ContributionSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .min(MIN_CONTRIBUTION_AMOUNT, `Minimum contribution is ${formatCurrency(MIN_CONTRIBUTION_AMOUNT)}`),
  paymentMethod: Yup.string()
    .required('Payment method is required'),
  savePaymentMethod: Yup.boolean(),
  note: Yup.string()
    .max(200, 'Note should be less than 200 characters'),
});

const ContributeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { groupId, groupName } = route.params;
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  
  useEffect(() => {
    loadGroupDetails();
    loadSavedPaymentMethods();
  }, [groupId]);
  
  useEffect(() => {
    navigation.setOptions({
      title: `Contribute to ${groupName || 'Group'}`
    });
  }, [groupName, navigation]);
  
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
  
  const loadSavedPaymentMethods = async () => {
    // This would fetch from your API
    // Mocking for now
    setSavedPaymentMethods([
      { id: 'card1', type: 'CARD', last4: '4242', name: 'Visa ending in 4242' },
      { id: 'bank1', type: 'BANK', last4: '9876', name: 'Bank account ending in 9876' }
    ]);
  };
  
  const handleContribution = async (values) => {
    try {
      setSubmitting(true);
      
      const contributionData = {
        amount: parseFloat(values.amount),
        paymentMethod: values.paymentMethod,
        savePaymentMethod: values.savePaymentMethod,
        note: values.note,
      };
      
      await makeContribution(groupId, contributionData);
      
      Alert.alert(
        'Contribution Successful',
        `You have successfully contributed ${formatCurrency(values.amount)} to ${groupName}.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('GroupDetails', { groupId })
          }
        ]
      );
    } catch (error) {
      console.error('Error making contribution:', error);
      Alert.alert('Error', error.message || 'Failed to make contribution');
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
  
  const suggestedAmounts = [10, 25, 50, 100];
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Make a Contribution</Text>
        
        {group && (
          <Card style={styles.groupInfoCard}>
            <Card.Content>
              <Text style={styles.groupName}>{group.name}</Text>
              <Divider style={styles.divider} />
              <Text style={styles.description}>{group.description}</Text>
            </Card.Content>
          </Card>
        )}
        
        <Formik
          initialValues={{
            amount: '',
            paymentMethod: savedPaymentMethods.length > 0 ? savedPaymentMethods[0].id : 'NEW_CARD',
            savePaymentMethod: false,
            note: '',
          }}
          validationSchema={ContributionSchema}
          onSubmit={handleContribution}
        >
          {({ handleChange, handleBlur, setFieldValue, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <Text style={styles.sectionTitle}>Contribution Amount</Text>
              <TextInput
                label="Amount"
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
              
              <View style={styles.suggestedAmounts}>
                {suggestedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    mode={values.amount === amount.toString() ? 'contained' : 'outlined'}
                    onPress={() => setFieldValue('amount', amount.toString())}
                    style={styles.amountButton}
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </View>
              
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Payment Method</Text>
              
              <RadioButton.Group
                onValueChange={value => setFieldValue('paymentMethod', value)}
                value={values.paymentMethod}
              >
                {savedPaymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    style={[
                      styles.paymentMethodCard,
                      values.paymentMethod === method.id && styles.selectedPaymentMethod
                    ]}
                    onPress={() => setFieldValue('paymentMethod', method.id)}
                  >
                    <Card.Content style={styles.paymentMethodContent}>
                      <RadioButton value={method.id} />
                      <View style={styles.paymentMethodInfo}>
                        <Text style={styles.paymentMethodName}>{method.name}</Text>
                        <Text style={styles.paymentMethodDetail}>
                          {method.type === 'CARD' ? 'Credit Card' : 'Bank Account'}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
                
                <Card
                  style={[
                    styles.paymentMethodCard,
                    values.paymentMethod === 'NEW_CARD' && styles.selectedPaymentMethod
                  ]}
                  onPress={() => setFieldValue('paymentMethod', 'NEW_CARD')}
                >
                  <Card.Content style={styles.paymentMethodContent}>
                    <RadioButton value="NEW_CARD" />
                    <View style={styles.paymentMethodInfo}>
                      <Text style={styles.paymentMethodName}>New Credit Card</Text>
                      <Text style={styles.paymentMethodDetail}>
                        Add a new card for this payment
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
                
                <Card
                  style={[
                    styles.paymentMethodCard,
                    values.paymentMethod === 'NEW_BANK' && styles.selectedPaymentMethod
                  ]}
                  onPress={() => setFieldValue('paymentMethod', 'NEW_BANK')}
                >
                  <Card.Content style={styles.paymentMethodContent}>
                    <RadioButton value="NEW_BANK" />
                    <View style={styles.paymentMethodInfo}>
                      <Text style={styles.paymentMethodName}>New Bank Account</Text>
                      <Text style={styles.paymentMethodDetail}>
                        Add a new bank account for this payment
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </RadioButton.Group>
              
              {(values.paymentMethod === 'NEW_CARD' || values.paymentMethod === 'NEW_BANK') && (
                <View style={styles.saveMethodContainer}>
                  <Text>Save payment method for future contributions</Text>
                  <Switch
                    value={values.savePaymentMethod}
                    onValueChange={(value) => setFieldValue('savePaymentMethod', value)}
                  />
                </View>
              )}
              
              <Divider style={styles.divider} />
              
              <TextInput
                label="Note (Optional)"
                value={values.note}
                onChangeText={handleChange('note')}
                onBlur={handleBlur('note')}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
                maxLength={200}
                error={touched.note && errors.note}
              />
              {touched.note && errors.note && (
                <HelperText type="error">{errors.note}</HelperText>
              )}
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={submitting}
                loading={submitting}
              >
                Contribute {values.amount ? formatCurrency(parseFloat(values.amount)) : ''}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  groupInfoCard: {
    marginBottom: 20,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    marginVertical: 12,
  },
  form: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    marginBottom: 8,
  },
  suggestedAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
  },
  amountButton: {
    marginVertical: 4,
    width: '48%',
  },
  paymentMethodCard: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedPaymentMethod: {
    borderColor: '#6200ee',
    borderWidth: 2,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    marginLeft: 8,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentMethodDetail: {
    fontSize: 14,
    color: '#666',
  },
  saveMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
});

export default ContributeScreen;
