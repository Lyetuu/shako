  const [loading, setLoading] = useState(true);
  const [memberDetails, setMemberDetails] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [planHistory, setPlanHistory] = useState([]);
  const [customPlan, setCustomPlan] = useState({
    installments: 3,
    firstPaymentDate: new Date(Date.now() + (24 * 60 * 60 * 1000)), // Tomorrow
    includeInterest: false,
    interestRate: 0,
    installmentType: 'equal', // equal, progressive, regressive
    paymentMethod: 'bank', // bank, mobile, card
    sendReminders: true
  });
  const [calculatedPlan, setCalculatedPlan] = useState(null);
  const [selectedPlanTemplate, setSelectedPlanTemplate] = useState(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [proposalResult, setProposalResult] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  // Get member ID and group ID from route params
  const { memberId, groupId, memberName } = route.params || {};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch member payment details
      const details = await getMemberPaymentDetails(groupId, memberId);
      setMemberDetails(details);
      
      // Fetch available payment plan templates
      const plans = await getAvailablePaymentPlans(groupId);
      setAvailablePlans(plans);
      
      // Fetch payment plan history
      const history = await getPaymentPlanHistory(groupId, memberId);
      setPlanHistory(history);
      
      // Calculate default payment plan
      calculatePlan();
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load payment details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const calculatePlan = async (planSettings = customPlan) => {
    try {
      // Use API to calculate payment plan installments
      const calculatedInstallments = await calculatePaymentPlanInstallments(
        groupId,
        memberId,
        planSettings
      );
      
      setCalculatedPlan(calculatedInstallments);
    } catch (error) {
      console.error('Error calculating payment plan:', error);
      Alert.alert('Error', 'Failed to calculate payment plan. Please try again.');
    }
  };
  
  const handlePlanTemplateSelect = (plan) => {
    setSelectedPlanTemplate(plan);
    setCustomPlan({
      ...customPlan,
      installments: plan.installments,
      includeInterest: plan.includeInterest,
      interestRate: plan.interestRate,
      installmentType: plan.installmentType,
    });
    
    calculatePlan({
      ...customPlan,
      installments: plan.installments,
      includeInterest: plan.includeInterest,
      interestRate: plan.interestRate,
      installmentType: plan.installmentType,
    });
  };
  
  const handleCustomPlanChange = (field, value) => {
    const updatedPlan = {
      ...customPlan,
      [field]: value
    };
    
    setCustomPlan(updatedPlan);
    
    // Recalculate when important parameters change
    if (['installments', 'includeInterest', 'interestRate', 'installmentType'].includes(field)) {
      calculatePlan(updatedPlan);
    }
  };
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleCustomPlanChange('firstPaymentDate', selectedDate);
    }
  };
  
  const handleSendProposal = async () => {
    setShowConfirmationDialog(false);
    setSending(true);
    
    try {
      // Use selected template or custom plan
      const planToSend = selectedPlanTemplate
        ? { ...selectedPlanTemplate, firstPaymentDate: customPlan.firstPaymentDate, sendReminders: customPlan.sendReminders, paymentMethod: customPlan.paymentMethod }
        : customPlan;
      
      const result = await sendPaymentPlanProposal(
        groupId,
        memberId,
        planToSend
      );
      
      setProposalResult(result);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error sending payment plan proposal:', error);
      Alert.alert('Error', 'Failed to send payment plan proposal. Please try again.');
    } finally {
      setSending(false);
      setShowPlanDialog(false);
    }
  };
  
  const renderPaymentPlanDialog = () => (
    <Portal>
      <Dialog
        visible={showPlanDialog}
        onDismiss={() => !sending && setShowPlanDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Create Payment Plan</Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <ScrollView>
            <View style={styles.dialogContent}>
              <Text style={styles.summaryTitle}>Payment Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Amount Due:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(memberDetails?.amountDue)}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Days Overdue:</Text>
                <Text style={styles.summaryValue}>{memberDetails?.daysOverdue} days</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Plan Templates</Text>
              <Text style={styles.sectionDescription}>Choose a predefined plan or customize below</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.planTemplatesScroll}
                contentContainerStyle={styles.planTemplatesContent}
              >
                {availablePlans.map((plan) => (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.planTemplate,
                      selectedPlanTemplate?.id === plan.id && styles.selectedPlanTemplate
                    ]}
                    onPress={() => handlePlanTemplateSelect(plan)}
                  >
                    <View style={styles.planTemplateHeader}>
                      <Text style={styles.planTemplateName}>{plan.name}</Text>
                      {plan.recommended && (
                        <Chip style={styles.recommendedChip} size="small">Recommended</Chip>
                      )}
                    </View>
                    
                    <View style={styles.planTemplateDetails}>
                      <View style={styles.planTemplateDetail}>
                        <Icon 
                          name="calendar-range" 
                          size={16} 
                          color={theme.colors.primary} 
                        />
                        <Text style={styles.planTemplateValue}>{plan.installments} installments</Text>
                      </View>
                      
                      <View style={styles.planTemplateDetail}>
                        <Icon 
                          name="cash" 
                          size={16} 
                          color={theme.colors.primary} 
                        />
                        <Text style={styles.planTemplateValue}>
                          {formatCurrency(memberDetails?.amountDue / plan.installments)} per payment
                        </Text>
                      </View>
                      
                      {plan.includeInterest && (
                        <View style={styles.planTemplateDetail}>
                          <Icon 
                            name="percent" 
                            size={16} 
                            color="#FF9800" 
                          />
                          <Text style={styles.planTemplateValue}>
                            {plan.interestRate}% interest
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <Divider style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Customize Payment Plan</Text>
              
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Number of Installments</Text>
                <View style={styles.installmentsInput}>
                  <IconButton
                    icon="minus"
                    size={20}
                    onPress={() => {
                      if (customPlan.installments > 2) {
                        handleCustomPlanChange('installments', customPlan.installments - 1);
                      }
                    }}
                    disabled={customPlan.installments <= 2}
                  />
                  <TextInput
                    value={customPlan.installments.toString()}
                    onChangeText={(text) => {
                      const value = parseInt(text) || 0;
                      if (value >= 2) {
                        handleCustomPlanChange('installments', value);
                      }
                    }}
                    keyboardType="numeric"
                    style={styles.installmentsTextInput}
                    textAlign="center"
                  />
                  <IconButton
                    icon="plus"
                    size={20}
                    onPress={() => {
                      handleCustomPlanChange('installments', customPlan.installments + 1);
                    }}
                  />
                </View>
              </View>
              
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>First Payment Date</Text>
                <Button
                  mode="outlined"
                  icon="calendar"
                  onPress={() => setShowDatePicker(true)}
                  style={styles.datePickerButton}
                >
                  {formatDate(customPlan.firstPaymentDate)}
                </Button>
              </View>
              
              {showDatePicker && (
                <DateTimePicker
                  value={customPlan.firstPaymentDate}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
              
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Include Interest</Text>
                <Switch
                  value={customPlan.includeInterest}
                  onValueChange={(value) => handleCustomPlanChange('includeInterest', value)}
                />
              </View>
              
              {customPlan.includeInterest && (
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>Interest Rate (%)</Text>
                  <TextInput
                    value={customPlan.interestRate.toString()}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 0;
                      handleCustomPlanChange('interestRate', value);
                    }}
                    keyboardType="numeric"
                    style={styles.rateInput}
                  />
                </View>
              )}
              
              <Text style={styles.inputSectionTitle}>Installment Type</Text>
              <RadioButton.Group
                onValueChange={(value) => handleCustomPlanChange('installmentType', value)}
                value={customPlan.installmentType}
              >
                <RadioButton.Item
                  label="Equal Installments"
                  value="equal"
                  style={styles.radioItem}
                />
                <RadioButton.Item
                  label="Progressive (smaller to larger)"
                  value="progressive"
                  style={styles.radioItem}
                />
                <RadioButton.Item
                  label="Regressive (larger to smaller)"
                  value="regressive"
                  style={styles.radioItem}
                />
              </RadioButton.Group>
              
              <Text style={styles.inputSectionTitle}>Payment Method</Text>
              <RadioButton.Group
                onValueChange={(value) => handleCustomPlanChange('paymentMethod', value)}
                value={customPlan.paymentMethod}
              >
                <RadioButton.Item
                  label="Bank Transfer"
                  value="bank"
                  style={styles.radioItem}
                />
                <RadioButton.Item
                  label="Mobile Money"
                  value="mobile"
                  style={styles.radioItem}
                />
                <RadioButton.Item
                  label="Card Payment"
                  value="card"
                  style={styles.radioItem}
                />
              </RadioButton.Group>
              
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Send Payment Reminders</Text>
                <Switch
                  value={customPlan.sendReminders}
                  onValueChange={(value) => handleCustomPlanChange('sendReminders', value)}
                />
              </View>
              
              <Divider style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Payment Schedule</Text>
              
              {calculatedPlan ? (
                <View style={styles.scheduleContainer}>
                  <View style={styles.scheduleSummary}>
                    <View style={styles.scheduleSummaryItem}>
                      <Text style={styles.scheduleSummaryLabel}>Total to Pay:</Text>
                      <Text style={styles.scheduleSummaryValue}>
                        {formatCurrency(calculatedPlan.totalAmount)}
                      </Text>
                    </View>
                    
                    {calculatedPlan.totalInterest > 0 && (
                      <View style={styles.scheduleSummaryItem}>
                        <Text style={styles.scheduleSummaryLabel}>Total Interest:</Text>
                        <Text style={[styles.scheduleSummaryValue, { color: '#FF9800' }]}>
                          {formatCurrency(calculatedPlan.totalInterest)}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.installmentsList}>
                    {calculatedPlan.installments.map((installment, index) => (
                      <View key={index} style={styles.installmentItem}>
                        <View style={styles.installmentHeader}>
                          <Text style={styles.installmentTitle}>Installment {index + 1}</Text>
                          <Text style={styles.installmentDate}>
                            {formatDate(installment.dueDate)}
                          </Text>
                        </View>
                        
                        <View style={styles.installmentDetails}>
                          <View style={styles.installmentDetail}>
                            <Text style={styles.installmentLabel}>Principal:</Text>
                            <Text style={styles.installmentValue}>
                              {formatCurrency(installment.principal)}
                            </Text>
                          </View>
                          
                          {installment.interest > 0 && (
                            <View style={styles.installmentDetail}>
                              <Text style={styles.installmentLabel}>Interest:</Text>
                              <Text style={[styles.installmentValue, { color: '#FF9800' }]}>
                                {formatCurrency(installment.interest)}
                              </Text>
                            </View>
                          )}
                          
                          <View style={styles.installmentDetail}>
                            <Text style={styles.installmentLabel}>Total:</Text>
                            <Text style={[styles.installmentValue, { fontWeight: 'bold' }]}>
                              {formatCurrency(installment.total)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.calculatingContainer}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={styles.calculatingText}>Calculating payment plan...</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        
        <Dialog.Actions>
          <Button onPress={() => setShowPlanDialog(false)} disabled={sending}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={() => setShowConfirmationDialog(true)}
            loading={sending}
            disabled={sending || !calculatedPlan}
          >
            Propose Plan
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderConfirmationDialog = () => (
    <Portal>
      <Dialog
        visible={showConfirmationDialog}
        onDismiss={() => setShowConfirmationDialog(false)}
      >
        <Dialog.Title>Confirm Payment Plan</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Are you sure you want to propose this payment plan to {memberName}?
          </Paragraph>
          <Paragraph>
            They will be notified and can accept or request modifications.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowConfirmationDialog(false)}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSendProposal}>
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderHistoryDialog = () => (
    <Portal>
      <Dialog
        visible={showHistoryDialog}
        onDismiss={() => setShowHistoryDialog(false)}
        style={styles.historyDialog}
      >
        <Dialog.Title>Payment Plan History</Dialog.Title>
        <Dialog.ScrollArea style={styles.historyScrollArea}>
          <ScrollView>
            {planHistory.length > 0 ? (
              planHistory.map((plan, index) => (
                <Card key={index} style={styles.historyCard}>
                  <Card.Content>
                    <View style={styles.historyCardHeader}>
                      <View style={styles.historyHeaderLeft}>
                        <Text style={styles.historyPlanTitle}>{plan.name || 'Custom Plan'}</Text>
                        <Text style={styles.historyPlanDate}>
                          Proposed on {formatDate(plan.proposedDate)}
                        </Text>
                      </View>
                      
                      <Chip 
                        style={[
                          styles.historyStatusChip,
                          plan.status === 'accepted' ? styles.acceptedChip :
                          plan.status === 'rejected' ? styles.rejectedChip :
                          plan.status === 'modified' ? styles.modifiedChip :
                          styles.pendingChip
                        ]}
                      >
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </Chip>
                    </View>
                    
                    <Divider style={styles.historyDivider} />
                    
                    <View style={styles.historyDetails}>
                      <View style={styles.historyDetail}>
                        <Text style={styles.historyDetailLabel}>Installments:</Text>
                        <Text style={styles.historyDetailValue}>{plan.installments}</Text>
                      </View>
                      
                      <View style={styles.historyDetail}>
                        <Text style={styles.historyDetailLabel}>Total Amount:</Text>
                        <Text style={styles.historyDetailValue}>{formatCurrency(plan.totalAmount)}</Text>
                      </View>
                      
                      {plan.status === 'accepted' && (
                        <View style={styles.historyDetail}>
                          <Text style={styles.historyDetailLabel}>Acceptance Date:</Text>
                          <Text style={styles.historyDetailValue}>{formatDate(plan.acceptedDate)}</Text>
                        </View>
                      )}
                      
                      {plan.status === 'rejected' && plan.rejectionReason && (
                        <View style={styles.historyReason}>
                          <Text style={styles.historyReasonLabel}>Rejection Reason:</Text>
                          <Text style={styles.historyReasonValue}>{plan.rejectionReason}</Text>
                        </View>
                      )}
                      
                      {plan.status === 'modified' && plan.modificationNote && (
                        <View style={styles.historyReason}>
                          <Text style={styles.historyReasonLabel}>Modification Note:</Text>
                          <Text style={styles.historyReasonValue}>{plan.modificationNote}</Text>
                        </View>
                      )}
                    </View>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <View style={styles.emptyHistoryContainer}>
                <Icon name="calendar-clock" size={48} color="#9E9E9E" />
                <Text style={styles.emptyHistoryText}>No payment plans have been proposed yet</Text>
              </View>
            )}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowHistoryDialog(false)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderSuccessDialog = () => (
    <Portal>
      <Dialog
        visible={showSuccessDialog}
        onDismiss={() => setShowSuccessDialog(false)}
      >
        <Dialog.Title>
          <Icon 
            name="check-circle" 
            size={24} 
            color="#4CAF50" 
            style={{ marginRight: 8 }} 
          />
          Plan Proposed
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Your payment plan proposal has been sent to {memberName}.
          </Paragraph>
          <Paragraph>
            They will be notified and can review the plan through the app.
          </Paragraph>
          {proposalResult?.estimatedResponse && (
            <Paragraph style={{ fontStyle: 'italic', marginTop: 8 }}>
              Estimated response time: {proposalResult.estimatedResponse}
            </Paragraph>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="contained" onPress={() => setShowSuccessDialog(false)}>
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading payment details...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <View style={styles.headerInfo}>
          <View style={styles.memberInfo}>
            {memberDetails?.avatar ? (
              <Avatar.Image 
                source={{ uri: memberDetails.avatar }} 
                size={60}
                style={styles.memberAvatar}
              />
            ) : (
              <Avatar.Text 
                label={memberName.substring(0, 2).toUpperCase()} 
                size={60}
                style={styles.memberAvatar}
              />
            )}
            <View style={styles.memberTextInfo}>
              <Text style={styles.memberName}>{memberName}</Text>
              <Text style={styles.memberUsername}>@{memberDetails?.username}</Text>
              
              <View style={styles.memberStatuses}>
                {memberDetails?.activePlan && (
                  <Chip 
                    icon="calendar-check" 
                    style={styles.activePlanChip}
                    textStyle={styles.statusChipText}
                  >
                    Active Plan
                  </Chip>
                )}
                
                {memberDetails?.previousPlans > 0 && (
                  <Chip 
                    icon="history" 
                    style={styles.historyChip}
                    textStyle={styles.statusChipText}
                    onPress={() => setShowHistoryDialog(true)}
                  >
                    {memberDetails.previousPlans} Previous Plans
                  </Chip>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* Content section */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Card style={styles.paymentDetailsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Payment Details</Title>
            
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentDetailLabel}>Amount Due:</Text>
              <Text style={styles.paymentDetailValue}>{formatCurrency(memberDetails?.amountDue)}</Text>
            </View>
            
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentDetailLabel}>Original Due Date:</Text>
              <Text style={styles.paymentDetailValue}>{formatDate(memberDetails?.dueDate)}</Text>
            </View>
            
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentDetailLabel}>Days Overdue:</Text>
              <Chip 
                mode="outlined" 
                style={[
                  styles.overdueChip,
                  memberDetails?.daysOverdue > 30 ? styles.highOverdueChip : 
                  memberDetails?.daysOverdue > 7 ? styles.mediumOverdueChip : 
                  styles.lowOverdueChip
                ]}
              >
                {memberDetails?.daysOverdue} days
              </Chip>
            </View>
            
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentDetailLabel}>Failed Payment Attempts:</Text>
              <Text style={styles.paymentDetailValue}>{memberDetails?.failedAttempts || 0}</Text>
            </View>
            
            {memberDetails?.lastPaymentDate && (
              <View style={styles.paymentDetail}>
                <Text style={styles.paymentDetailLabel}>Last Partial Payment:</Text>
                <Text style={styles.paymentDetailValue}>
                  {formatCurrency(memberDetails.lastPaymentAmount)} on {formatDate(memberDetails.lastPaymentDate)}
                </Text>
              </View>
            )}
          </Card.Content>
          
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="contained" 
              icon="handshake"
              onPress={() => setShowPlanDialog(true)}
            >
              Create Payment Plan
            </Button>
          </Card.Actions>
        </Card>
        
        {memberDetails?.activePlan && (
          <Card style={styles.activePlanCard}>
            <Card.Content>
              <View style={styles.activePlanHeader}>
                <Title style={styles.cardTitle}>Active Payment Plan</Title>
                <Chip
                  style={[
                    styles.activePlanStatusChip,
                    memberDetails.activePlan.status === 'on_track' ? styles.onTrackChip : 
                    memberDetails.activePlan.status === 'behind' ? styles.behindChip : 
                    styles.atRiskChip
                  ]}
                >
                  {memberDetails.activePlan.status === 'on_track' ? 'On Track' : 
                   memberDetails.activePlan.status === 'behind' ? 'Behind' : 
                   'At Risk'}
                </Chip>
              </View>
              
              <View style={styles.activePlanProgress}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>
                    Progress: {memberDetails.activePlan.completedInstallments} of {memberDetails.activePlan.totalInstallments} installments
                  </Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round((memberDetails.activePlan.completedInstallments / memberDetails.activePlan.totalInstallments) * 100)}%
                  </Text>
                </View>
                <ProgressBar
                  progress={memberDetails.activePlan.completedInstallments / memberDetails.activePlan.totalInstallments}
                  color={
                    memberDetails.activePlan.status === 'on_track' ? '#4CAF50' : 
                    memberDetails.activePlan.status === 'behind' ? '#FF9800' : 
                    '#F44336'
                  }
                  style={styles.progressBar}
                />
              </View>
              
              <View style={styles.activePlanDetail}>
                <Text style={styles.activePlanDetailLabel}>Total Plan Amount:</Text>
                <Text style={styles.activePlanDetailValue}>
                  {formatCurrency(memberDetails.activePlan.totalAmount)}
                </Text>
              </View>
              
              <View style={styles.activePlanDetail}>
                <Text style={styles.activePlanDetailLabel}>Paid So Far:</Text>
                <Text style={styles.activePlanDetailValue}>
                  {formatCurrency(memberDetails.activePlan.paidAmount)}
                </Text>
              </View>
              
              <View style={styles.activePlanDetail}>
                <Text style={styles.activePlanDetailLabel}>Remaining:</Text>
                <Text style={styles.activePlanDetailValue}>
                  {formatCurrency(memberDetails.activePlan.totalAmount - memberDetails.activePlan.paidAmount)}
                </Text>
              </View>
              
              <View style={styles.activePlanDetail}>
                <Text style={styles.activePlanDetailLabel}>Next Payment:</Text>
                <Text style={styles.activePlanDetailValue}>
                  {formatCurrency(memberDetails.activePlan.nextPaymentAmount)} due on {formatDate(memberDetails.activePlan.nextPaymentDate)}
                </Text>
              </View>
              
              <View style={styles.activePlanDetail}>
                <Text style={styles.activePlanDetailLabel}>Plan Created:</Text>
                <Text style={styles.activePlanDetailValue}>
                  {formatDate(memberDetails.activePlan.startDate)}
                </Text>
              </View>
            </Card.Content>
            
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="outlined" 
                icon="eye"
                onPress={() => {
                  // Navigate to active plan details
                  navigation.navigate('PaymentPlanDetails', { 
                    groupId,
                    memberId,
                    planId: memberDetails.activePlan.id
                  });
                }}
              >
                View Details
              </Button>
              
              <Button 
                mode="outlined" 
                icon="cash-refund"
                onPress={() => {
                  // Navigate to record payment screen
                  navigation.navigate('RecordPayment', { 
                    groupId,
                    memberId,
                    planId: memberDetails.activePlan.id
                  });
                }}
              >
                Record Payment
              </Button>
            </Card.Actions>
          </Card>
        )}
        
        <Card style={styles.paymentHistoryCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Payment History</Title>
            
            {memberDetails?.paymentHistory && memberDetails.paymentHistory.length > 0 ? (
              <View style={styles.paymentHistoryList}>
                {memberDetails.paymentHistory.map((payment, index) => (
                  <View key={index} style={styles.paymentHistoryItem}>
                    <View style={styles.paymentHistoryLeft}>
                      <Icon 
                        name={
                          payment.status === 'successful' ? 'check-circle' : 
                          payment.status === 'failed' ? 'close-circle' : 
                          'progress-clock'
                        } 
                        size={24} 
                        color={
                          payment.status === 'successful' ? '#4CAF50' : 
                          payment.status === 'failed' ? '#F44336' : 
                          '#FF9800'
                        } 
                      />
                      <View style={styles.paymentHistoryInfo}>
                        <Text style={styles.paymentHistoryType}>
                          {payment.type === 'regular' ? 'Regular Payment' : 
                           payment.type === 'installment' ? 'Plan Installment' : 
                           payment.type === 'partial' ? 'Partial Payment' : 
                           'Payment'}
                        </Text>
                        <Text style={styles.paymentHistoryDate}>
                          {formatDate(payment.date)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.paymentHistoryRight}>
                      <Text style={styles.paymentHistoryAmount}>
                        {formatCurrency(payment.amount)}
                      </Text>
                      <Chip 
                        style={[
                          styles.paymentHistoryStatusChip,
                          payment.status === 'successful' ? styles.successfulPaymentChip : 
                          payment.status === 'failed' ? styles.failedPaymentChip : 
                          styles.pendingPaymentChip
                        ]}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Chip>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyHistoryContainer}>
                <Icon name="history" size={48} color="#9E9E9E" />
                <Text style={styles.emptyHistoryText}>No payment history available</Text>
              </View>
            )}
          </Card.Content>
          
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="outlined" 
              icon="history"
              onPress={() => {
                // Navigate to detailed payment history
                navigation.navigate('DetailedPaymentHistory', { 
                  groupId,
                  memberId
                });
              }}
            >
              View Full History
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
      
      {/* Dialogs */}
      {renderPaymentPlanDialog()}
      {renderHistoryDialog()}
      {renderSuccessDialog()}
      {renderConfirmationDialog()}
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
    color: theme.colors.text
  },
  headerSection: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  headerInfo: {
    marginBottom: 16
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  memberAvatar: {
    marginRight: 16
  },
  memberTextInfo: {
    flex: 1
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  memberUsername: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8
  },
  memberStatuses: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  activePlanChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    marginRight: 8,
    marginBottom: 8
  },
  historyChip: {
    backgroundColor: 'rgba(3, 169, 244, 0.2)',
    marginRight: 8,
    marginBottom: 8
  },
  statusChipText: {
    fontSize: 12
  },
  content: {
    flex: 1
  },
  contentContainer: {
    padding: 16
  },
  paymentDetailsCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16
  },
  paymentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  paymentDetailLabel: {
    fontSize: 14,
    color: '#666'
  },
  paymentDetailValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  overdueChip: {
    height: 28,
    borderWidth: 1
  },
  lowOverdueChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderColor: '#FF9800'
  },
  mediumOverdueChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: '#F44336'
  },
  highOverdueChip: {
    backgroundColor: 'rgba(183, 28, 28, 0.1)',
    borderColor: '#B71C1C'
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  activePlanCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  activePlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  activePlanStatusChip: {
    height: 28
  },
  onTrackChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: '#4CAF50'
  },
  behindChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderColor: '#FF9800'
  },
  atRiskChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: '#F44336'
  },
  activePlanProgress: {
    marginBottom: 16
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  progressLabel: {
    fontSize: 12,
    color: '#666'
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  progressBar: {
    height: 8,
    borderRadius: 4
  },
  activePlanDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  activePlanDetailLabel: {
    fontSize: 14,
    color: '#666'
  },
  activePlanDetailValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  paymentHistoryCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  paymentHistoryList: {
    marginTop: 8
  },
  paymentHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  paymentHistoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  paymentHistoryInfo: {
    marginLeft: 12
  },
  paymentHistoryType: {
    fontSize: 14,
    fontWeight: '500'
  },
  paymentHistoryDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  paymentHistoryRight: {
    alignItems: 'flex-end'
  },
  paymentHistoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  paymentHistoryStatusChip: {
    height: 24
  },
  successfulPaymentChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  failedPaymentChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)'
  },
  pendingPaymentChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)'
  },
  emptyHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  emptyHistoryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 12
  },
  dialog: {
    borderRadius: 8,
    padding: 4
  },
  dialogScrollArea: {
    paddingHorizontal: 0
  },
  dialogContent: {
    padding: 16
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666'
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  divider: {
    marginVertical: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  sectionDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12
  },
  planTemplatesScroll: {
    marginTop: 8,
    marginBottom: 8
  },
  planTemplatesContent: {
    paddingRight: 16
  },
  planTemplate: {
    width: 200,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginRight: 12
  },
  selectedPlanTemplate: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(3, 169, 244, 0.05)'
  },
  planTemplateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  planTemplateName: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  recommendedChip: {
    height: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  planTemplateDetails: {
    marginTop: 8
  },
  planTemplateDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  planTemplateValue: {
    fontSize: 12,
    marginLeft: 8
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 14,
    flex: 1
  },
  installmentsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120
  },
  installmentsTextInput: {
    height: 40,
    width: 40,
    paddingVertical: 0
  },
  datePickerButton: {
    width: 160
  },
  rateInput: {
    width: 120,
    height: 40
  },
  inputSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8
  },
  radioItem: {
    paddingVertical: 4
  },
  scheduleContainer: {
    marginTop: 8
  },
  scheduleSummary: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  scheduleSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  scheduleSummaryLabel: {
    fontSize: 14,
    color: '#666'
  },
  scheduleSummaryValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  installmentsList: {
    marginTop: 8
  },
  installmentItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  installmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  installmentTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  installmentDate: {
    fontSize: 12,
    color: '#666'
  },
  installmentDetails: {
    marginTop: 8
  },
  installmentDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  installmentLabel: {
    fontSize: 12,
    color: '#666'
  },
  installmentValue: {
    fontSize: 12
  },
  calculatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  calculatingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8
  },
  historyDialog: {
    borderRadius: 8,
    padding: 4
  },
  historyScrollArea: {
    paddingHorizontal: 0
  },
  historyCard: {
    marginHorizontal: 16,
    marginBottom: 12
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  historyHeaderLeft: {
    flex: 1
  },
  historyPlanTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  historyPlanDate: {
    fontSize: 12,
    color: '#666'
  },
  historyStatusChip: {
    height: 24
  },
  acceptedChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  rejectedChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)'
  },
  modifiedChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)'
  },
  pendingChip: {
    backgroundColor: 'rgba(158, 158, 158, 0.1)'
  },
  historyDivider: {
    marginVertical: 12
  },
  historyDetails: {
    marginTop: 8
  },
  historyDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  historyDetailLabel: {
    fontSize: 12,
    color: '#666'
  },
  historyDetailValue: {
    fontSize: 12,
    fontWeight: '500'
  },
  historyReason: {
    marginTop: 8
  },
  historyReasonLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  historyReasonValue: {
    fontSize: 12,
    fontStyle: 'italic'
  }
});

export default PaymentPlanNegotiation;import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  TextInput,
  Portal,
  Dialog,
  List,
  ProgressBar,
  IconButton,
  Avatar,
  Switch,
  Chip,
  RadioButton,
  Checkbox
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { 
  getMemberPaymentDetails,
  createPaymentPlan,
  getAvailablePaymentPlans,
  sendPaymentPlanProposal,
  getPaymentPlanHistory,
  calculatePaymentPlanInstallments
} from '../../services/api/paymentPlans';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';

const PaymentPlanNegotiation = () => {
  const [loading, setLoading] = useState(true);
  const [memberDetails, setMemberDetails] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [planHistory, setPlanHistory] = useState([]);