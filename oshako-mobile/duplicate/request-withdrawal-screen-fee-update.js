// File: screens/GroupSavings/RequestWithdrawalScreen.js (fee update)
// Add these imports at the top
import { calculateWithdrawalFeeLocally } from '../../services/api/feeService';

// Add these to the state section
const [processingTime, setProcessingTime] = useState('DAYS_30');
const [feeCalculation, setFeeCalculation] = useState(null);
const [showFeeDetails, setShowFeeDetails] = useState(false);

// Add this function after handleWithdrawalRequest
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

// Add this effect to recalculate fees when amount or processing time changes
useEffect(() => {
  if (values?.amount) {
    calculateFees(values.amount, processingTime);
  }
}, [values?.amount, processingTime]);

// Add this section to the Formik form, just before the termsCard
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

// Update handleWithdrawalRequest to include processingTime
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

// Add these styles
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
