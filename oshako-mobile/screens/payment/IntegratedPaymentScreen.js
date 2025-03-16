                    <Text style={styles.recurringPaymentDescription}>
                      {payment.description || 'Recurring payment'}
                    </Text>
                    
                    <View style={styles.recurringPaymentDetails}>
                      <Text style={styles.recurringPaymentDetail}>
                        <Icon name="calendar-check" size={14} color="#666" /> Next payment: {formatDate(payment.nextPaymentDate)}
                      </Text>
                      
                      <Text style={styles.recurringPaymentDetail}>
                        <Icon name="credit-card" size={14} color="#666" /> {payment.paymentMethodName}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.recurringPaymentActions}>
                    <Button 
                      mode="outlined" 
                      icon="pencil"
                      onPress={() => {
                        // Navigate to edit recurring payment
                        navigation.navigate('EditRecurringPayment', { 
                          groupId, 
                          paymentId: payment.id 
                        });
                      }}
                      style={styles.recurringActionButton}
                    >
                      Edit
                    </Button>
                    
                    <Button 
                      mode="outlined" 
                      icon="cancel"
                      color="#F44336"
                      onPress={() => Alert.alert(
                        'Cancel Recurring Payment',
                        'Are you sure you want to cancel this recurring payment?',
                        [
                          { text: 'No', style: 'cancel' },
                          { 
                            text: 'Yes', 
                            style: 'destructive',
                            onPress: () => handleCancelRecurringPayment(payment.id)
                          }
                        ]
                      )}
                      style={styles.recurringActionButton}
                    >
                      Cancel
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
  
  const renderPaymentHistoryTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Payment History Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Payment History</Title>
          
          {paymentHistory.length > 0 ? (
            <View style={styles.paymentHistoryList}>
              {paymentHistory.map((payment) => (
                <View key={payment.id} style={styles.paymentHistoryItem}>
                  <View style={styles.paymentHistoryLeft}>
                    <View 
                      style={[
                        styles.paymentHistoryIcon, 
                        { backgroundColor: payment.status === 'completed' ? '#4CAF50' : '#FF9800' }
                      ]}
                    >
                      <Icon 
                        name={
                          payment.type === 'recurring' ? 'calendar-sync' :
                          payment.type === 'qr' ? 'qrcode' :
                          payment.type === 'link' ? 'link-variant' :
                          'cash'
                        } 
                        size={20} 
                        color="#fff" 
                      />
                    </View>
                    
                    <View style={styles.paymentHistoryInfo}>
                      <Text style={styles.paymentHistoryType}>
                        {payment.type === 'recurring' ? 'Recurring Payment' :
                         payment.type === 'qr' ? 'QR Payment' :
                         payment.type === 'link' ? 'Link Payment' :
                         'Standard Payment'}
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
                        styles.paymentHistoryStatus,
                        payment.status === 'completed' ? styles.completedStatusChip :
                        payment.status === 'pending' ? styles.pendingStatusChip :
                        styles.failedStatusChip
                      ]}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </Chip>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="history" size={48} color="#9E9E9E" />
              <Text style={styles.emptyText}>No payment history</Text>
              <Text style={styles.emptySubtext}>
                Your payment history will appear here
              </Text>
            </View>
          )}
        </Card.Content>
        
        {paymentHistory.length > 0 && (
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="text" 
              icon="download"
              onPress={() => {
                // Export payment history
                Alert.alert('Export', 'Payment history export started. You will be notified when it is ready.');
              }}
            >
              Export History
            </Button>
          </Card.Actions>
        )}
      </Card>
    </ScrollView>
  );
  
  const renderAddMethodDialog = () => (
    <Portal>
      <Dialog
        visible={showAddMethodDialog}
        onDismiss={() => setShowAddMethodDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Add Payment Method</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.dialogSubtitle}>
            Select a payment method type to add
          </Paragraph>
          
          <View style={styles.paymentMethodOptions}>
            {PAYMENT_PROVIDERS.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={styles.paymentMethodOption}
                onPress={() => {
                  // In a real app, this would launch the payment provider's SDK
                  handleAddPaymentMethod(provider.id, {
                    name: provider.name,
                    last4: '1234', // This would come from the SDK
                    color: provider.color
                  });
                }}
              >
                <View 
                  style={[
                    styles.paymentMethodOptionIcon, 
                    { backgroundColor: provider.color }
                  ]}
                >
                  <Icon name={provider.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.paymentMethodOptionText}>{provider.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.securityNote}>
            <Icon name="shield-check" size={14} color="#4CAF50" /> Your payment information is securely stored and encrypted.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowAddMethodDialog(false)}>
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderQRDialog = () => (
    <Portal>
      <Dialog
        visible={showQRDialog}
        onDismiss={() => setShowQRDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>QR Payment Code</Dialog.Title>
        <Dialog.Content>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={200}
              color="#000"
              backgroundColor="#fff"
            />
          </View>
          
          <View style={styles.qrAmount}>
            <Text style={styles.qrAmountLabel}>Amount:</Text>
            <Text style={styles.qrAmountValue}>{formatCurrency(parseFloat(qrAmount))}</Text>
          </View>
          
          <Text style={styles.qrInstructions}>
            Have the payer scan this QR code with their mobile payment app to make the payment.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button 
            icon="content-copy"
            onPress={() => {
              // Copy QR value to clipboard - in a real app
              Alert.alert('Copied', 'Payment code copied to clipboard');
            }}
          >
            Copy Code
          </Button>
          <Button 
            icon="share-variant"
            onPress={() => {
              // Share QR code - in a real app
              Alert.alert('Shared', 'QR code shared successfully');
            }}
          >
            Share
          </Button>
          <Button onPress={() => setShowQRDialog(false)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderRecurringDialog = () => (
    <Portal>
      <Dialog
        visible={showRecurringDialog}
        onDismiss={() => setShowRecurringDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Set Up Recurring Payment</Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <ScrollView>
            <View style={styles.dialogContent}>
              <TextInput
                label="Payment Amount"
                value={recurringForm.amount}
                onChangeText={(text) => setRecurringForm({ ...recurringForm, amount: text })}
                keyboardType="decimal-pad"
                mode="outlined"
                style={styles.dialogInput}
                left={<TextInput.Affix text="$" />}
              />
              
              <Text style={styles.inputLabel}>Payment Frequency</Text>
              <SegmentedButtons
                value={recurringForm.frequency}
                onValueChange={(value) => setRecurringForm({ ...recurringForm, frequency: value })}
                buttons={FREQUENCIES.map(freq => ({ value: freq.value, label: freq.label }))}
                style={styles.frequencySelector}
              />
              
              <View style={styles.datePickerRow}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <Button
                  mode="outlined"
                  icon="calendar"
                  onPress={() => setShowDatePicker(true)}
                  style={styles.datePickerButton}
                >
                  {formatDate(recurringForm.startDate)}
                </Button>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={recurringForm.startDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setRecurringForm({ ...recurringForm, startDate: selectedDate });
                      }
                    }}
                  />
                )}
              </View>
              
              <Text style={styles.inputLabel}>Payment Method</Text>
              {paymentMethods.length > 0 ? (
                <RadioButton.Group
                  onValueChange={(value) => setRecurringForm({ ...recurringForm, paymentMethod: value })}
                  value={recurringForm.paymentMethod}
                >
                  {paymentMethods.map((method) => (
                    <View key={method.id} style={styles.paymentMethodRadio}>
                      <RadioButton.Item
                        label={`${method.name} ${method.last4 ? `•••• ${method.last4}` : ''}`}
                        value={method.id}
                        position="leading"
                        style={styles.radioItem}
                      />
                    </View>
                  ))}
                </RadioButton.Group>
              ) : (
                <Button
                  mode="outlined"
                  icon="plus"
                  onPress={() => {
                    setShowRecurringDialog(false);
                    setShowAddMethodDialog(true);
                  }}
                  style={styles.addMethodButton}
                >
                  Add Payment Method
                </Button>
              )}
              
              <TextInput
                label="Description (Optional)"
                value={recurringForm.description}
                onChangeText={(text) => setRecurringForm({ ...recurringForm, description: text })}
                mode="outlined"
                style={styles.dialogInput}
              />
              
              <View style={styles.recurringPreview}>
                <Text style={styles.recurringPreviewTitle}>Summary</Text>
                <View style={styles.recurringPreviewItem}>
                  <Text style={styles.recurringPreviewLabel}>You will pay:</Text>
                  <Text style={styles.recurringPreviewValue}>
                    {recurringForm.amount ? formatCurrency(parseFloat(recurringForm.amount)) : '$0.00'}
                  </Text>
                </View>
                
                <View style={styles.recurringPreviewItem}>
                  <Text style={styles.recurringPreviewLabel}>Frequency:</Text>
                  <Text style={styles.recurringPreviewValue}>
                    {FREQUENCIES.find(f => f.value === recurringForm.frequency)?.label || 'Monthly'}
                  </Text>
                </View>
                
                <View style={styles.recurringPreviewItem}>
                  <Text style={styles.recurringPreviewLabel}>First payment:</Text>
                  <Text style={styles.recurringPreviewValue}>
                    {formatDate(recurringForm.startDate)}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowRecurringDialog(false)}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSetupRecurringPayment}
            disabled={!recurringForm.amount || !recurringForm.paymentMethod}
          >
            Set Up
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderPaymentLinkDialog = () => (
    <Portal>
      <Dialog
        visible={showPaymentLinkDialog}
        onDismiss={() => setShowPaymentLinkDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Create Payment Link</Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <ScrollView>
            <View style={styles.dialogContent}>
              <TextInput
                label="Payment Amount"
                value={paymentLinkForm.amount}
                onChangeText={(text) => setPaymentLinkForm({ ...paymentLinkForm, amount: text })}
                keyboardType="decimal-pad"
                mode="outlined"
                style={styles.dialogInput}
                left={<TextInput.Affix text="$" />}
              />
              
              <TextInput
                label="Description (Optional)"
                value={paymentLinkForm.description}
                onChangeText={(text) => setPaymentLinkForm({ ...paymentLinkForm, description: text })}
                mode="outlined"
                style={styles.dialogInput}
              />
              
              <Text style={styles.inputLabel}>Expiry Period</Text>
              <SegmentedButtons
                value={paymentLinkForm.expiryDays.toString()}
                onValueChange={(value) => setPaymentLinkForm({ ...paymentLinkForm, expiryDays: parseInt(value) })}
                buttons={[
                  { value: '3', label: '3 Days' },
                  { value: '7', label: '7 Days' },
                  { value: '30', label: '30 Days' }
                ]}
                style={styles.expirySelector}
              />
              
              <View style={styles.linkOption}>
                <Text style={styles.linkOptionLabel}>Allow Partial Payments</Text>
                <Switch
                  value={paymentLinkForm.allowPartial}
                  onValueChange={(value) => setPaymentLinkForm({ ...paymentLinkForm, allowPartial: value })}
                />
              </View>
              
              <View style={styles.linkOption}>
                <Text style={styles.linkOptionLabel}>Notify on Payment</Text>
                <Switch
                  value={paymentLinkForm.notifyOnPayment}
                  onValueChange={(value) => setPaymentLinkForm({ ...paymentLinkForm, notifyOnPayment: value })}
                />
              </View>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowPaymentLinkDialog(false)}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleCreatePaymentLink}
            disabled={!paymentLinkForm.amount}
          >
            Create Link
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderPaymentDialog = () => (
    <Portal>
      <Dialog
        visible={showPaymentDialog}
        onDismiss={() => !processingPayment && setShowPaymentDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Make a Payment</Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <ScrollView>
            <View style={styles.dialogContent}>
              <TextInput
                label="Payment Amount"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                keyboardType="decimal-pad"
                mode="outlined"
                style={styles.dialogInput}
                left={<TextInput.Affix text="$" />}
                disabled={processingPayment}
              />
              
              <Text style={styles.inputLabel}>Choose Payment Method</Text>
              <View style={styles.paymentProvidersList}>
                {PAYMENT_PROVIDERS.map((provider) => (
                  <TouchableOpacity
                    key={provider.id}
                    style={[
                      styles.paymentProvider,
                      selectedProvider === provider.id && styles.selectedPaymentProvider
                    ]}
                    onPress={() => setSelectedProvider(provider.id)}
                    disabled={processingPayment}
                  >
                    <View 
                      style={[
                        styles.paymentProviderIconContainer, 
                        { backgroundColor: provider.color + '20' }
                      ]}
                    >
                      <Icon 
                        name={provider.icon} 
                        size={24} 
                        color={provider.color} 
                      />
                    </View>
                    <Text style={styles.paymentProviderName}>{provider.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Display saved payment methods for selected provider */}
              {selectedProvider && paymentMethods.some(method => method.type === selectedProvider) && (
                <View style={styles.savedMethods}>
                  <Text style={styles.inputLabel}>Saved Payment Methods</Text>
                  <RadioButton.Group
                    onValueChange={() => {/* Select saved method */}}
                    value=""
                  >
                    {paymentMethods
                      .filter(method => method.type === selectedProvider)
                      .map((method) => (
                        <View key={method.id} style={styles.savedMethodItem}>
                          <RadioButton.Item
                            label={`${method.name} ${method.last4 ? `•••• ${method.last4}` : ''}`}
                            value={method.id}
                            position="leading"
                            style={styles.radioItem}
                          />
                        </View>
                      ))}
                  </RadioButton.Group>
                </View>
              )}
              
              {selectedProvider && (
                <View style={styles.paymentSummary}>
                  <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>
                  <View style={styles.paymentSummaryItem}>
                    <Text style={styles.paymentSummaryLabel}>Amount:</Text>
                    <Text style={styles.paymentSummaryValue}>
                      {paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : '$0.00'}
                    </Text>
                  </View>
                  
                  <View style={styles.paymentSummaryItem}>
                    <Text style={styles.paymentSummaryLabel}>Payment Method:</Text>
                    <Text style={styles.paymentSummaryValue}>
                      {PAYMENT_PROVIDERS.find(p => p.id === selectedProvider)?.name || ''}
                    </Text>
                  </View>
                  
                  <View style={styles.paymentSummaryItem}>
                    <Text style={styles.paymentSummaryLabel}>Processing Fee:</Text>
                    <Text style={styles.paymentSummaryValue}>$0.00</Text>
                  </View>
                  
                  <Divider style={styles.paymentSummaryDivider} />
                  
                  <View style={styles.paymentSummaryTotal}>
                    <Text style={styles.paymentSummaryTotalLabel}>Total:</Text>
                    <Text style={styles.paymentSummaryTotalValue}>
                      {paymentAmount ? formatCurrency(parseFloat(paymentAmount)) : '$0.00'}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button 
            onPress={() => setShowPaymentDialog(false)}
            disabled={processingPayment}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleMakePayment}
            loading={processingPayment}
            disabled={processingPayment || !paymentAmount || !selectedProvider}
          >
            Pay Now
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading payment options...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Payments</Text>
        <Text style={styles.screenSubtitle}>{groupName || 'Payment Methods'}</Text>
        
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'payment' && styles.activeTab]}
            onPress={() => setActiveTab('payment')}
          >
            <Icon 
              name="credit-card" 
              size={20} 
              color={activeTab === 'payment' ? theme.colors.primary : '#888'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'payment' && styles.activeTabText
              ]}
            >
              Payment Methods
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => setActiveTab('history')}
          >
            <Icon 
              name="history" 
              size={20} 
              color={activeTab === 'history' ? theme.colors.primary : '#888'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'history' && styles.activeTabText
              ]}
            >
              Payment History
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content section */}
      {activeTab === 'payment' && renderPaymentMethodsTab()}
      {activeTab === 'history' && renderPaymentHistoryTab()}
      
      {/* Dialogs */}
      {renderAddMethodDialog()}
      {renderQRDialog()}
      {renderRecurringDialog()}
      {renderPaymentLinkDialog()}
      {renderPaymentDialog()}
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
  headerSection: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    paddingBottom: 0
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  screenSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '500'
  },
  tabContent: {
    padding: 16
  },
  card: {
    marginBottom: 16,
    borderRadius: 8
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 18
  },
  addButton: {
    marginTop: -8
  },
  paymentMethodsList: {
    marginTop: 8
  },
  paymentMethodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  paymentMethodDetails: {
    flex: 1
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500'
  },
  paymentMethodSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  paymentMethodExpiry: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  defaultChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    marginRight: 8
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  quickOptionsContainer: {
    marginTop: 8
  },
  quickOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  quickOption: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center'
  },
  quickOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  quickOptionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center'
  },
  paymentLinksList: {
    marginTop: 8
  },
  paymentLinkItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  paymentLinkInfo: {
    marginBottom: 12
  },
  paymentLinkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  paymentLinkAmount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  statusChip: {
    height: 24
  },
  activeStatusChip: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)'
  },
  paidStatusChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  expiredStatusChip: {
    backgroundColor: 'rgba(158, 158, 158, 0.1)'
  },
  paymentLinkDescription: {
    fontSize: 14,
    marginBottom: 8
  },
  paymentLinkDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  paymentLinkDetail: {
    fontSize: 12,
    color: '#666'
  },
  paymentLinkActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  linkActionButton: {
    marginLeft: 8
  },
  recurringPaymentsList: {
    marginTop: 8
  },
  recurringPaymentItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  recurringPaymentInfo: {
    marginBottom: 12
  },
  recurringPaymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  recurringPaymentAmount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  frequencyChip: {
    height: 24
  },
  recurringPaymentDescription: {
    fontSize: 14,
    marginBottom: 8
  },
  recurringPaymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  recurringPaymentDetail: {
    fontSize: 12,
    color: '#666'
  },
  recurringPaymentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  recurringActionButton: {
    marginLeft: 8
  },
  paymentHistoryList: {
    marginTop: 8
  },
  paymentHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12
  },
  paymentHistoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  paymentHistoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  paymentHistoryInfo: {
    flex: 1
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  paymentHistoryStatus: {
    height: 24
  },
  completedStatusChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  pendingStatusChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)'
  },
  failedStatusChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)'
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  dialog: {
    maxHeight: '80%'
  },
  dialogSubtitle: {
    marginBottom: 16
  },
  paymentMethodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  paymentMethodOption: {
    alignItems: 'center',
    width: '33%',
    marginBottom: 16
  },
  paymentMethodOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  paymentMethodOptionText: {
    fontSize: 12,
    textAlign: 'center'
  },
  securityNote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center'
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 16
  },
  qrAmount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  qrAmountLabel: {
    fontSize: 16,
    marginRight: 8
  },
  qrAmountValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  qrInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  dialogScrollArea: {
    paddingHorizontal: 0
  },
  dialogContent: {
    padding: 16
  },
  dialogInput: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  frequencySelector: {
    marginBottom: 16
  },
  datePickerRow: {
    marginBottom: 16
  },
  datePickerButton: {
    marginTop: 8
  },
  paymentMethodRadio: {
    marginBottom: 8
  },
  radioItem: {
    paddingLeft: 0
  },
  addMethodButton: {
    marginBottom: 16
  },
  recurringPreview: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8
  },
  recurringPreviewTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  recurringPreviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  recurringPreviewLabel: {
    fontSize: 14,
    color: '#666'
  },
  recurringPreviewValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  expirySelector: {
    marginBottom: 16
  },
  linkOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  linkOptionLabel: {
    fontSize: 16
  },
  paymentProvidersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  paymentProvider: {
    width: '30%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedPaymentProvider: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  },
  paymentProviderIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  paymentProviderName: {
    fontSize: 12,
    textAlign: 'center'
  },
  savedMethods: {
    marginBottom: 16
  },
  savedMethodItem: {
    marginBottom: 4
  },
  paymentSummary: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  paymentSummaryTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  paymentSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  paymentSummaryLabel: {
    fontSize: 14,
    color: '#666'
  },
  paymentSummaryValue: {
    fontSize: 14
  },
  paymentSummaryDivider: {
    marginVertical: 8
  },
  paymentSummaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  paymentSummaryTotalLabel: {
    fontSize: 16,
    fontWeight: '500'
  },
  paymentSummaryTotalValue: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default IntegratedPaymentScreen;
  import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
  Share
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  TextInput,
  Dialog,
  Portal,
  Switch,
  List,
  IconButton,
  Chip,
  SegmentedButtons,
  RadioButton,
  Badge
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { 
  getPaymentMethods, 
  addPaymentMethod,
  removePaymentMethod,
  generateQRPayment,
  getPaymentHistory,
  setupRecurringPayment,
  getRecurringPayments,
  cancelRecurringPayment,
  getGroupPaymentLinks,
  createPaymentLink,
  initiatePayment
} from '../../services/api/payments';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';

// Payment method icons
const PAYMENT_METHOD_ICONS = {
  'bank_account': 'bank',
  'credit_card': 'credit-card',
  'debit_card': 'credit-card-outline',
  'mobile_money': 'phone',
  'paypal': 'paypal',
  'cash': 'cash'
};

// Payment providers
const PAYMENT_PROVIDERS = [
  { id: 'mpesa', name: 'M-Pesa', icon: 'cellphone', color: '#4CD964' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: 'bank', color: '#2196F3' },
  { id: 'credit_card', name: 'Credit Card', icon: 'credit-card', color: '#9C27B0' },
  { id: 'paypal', name: 'PayPal', icon: 'paypal', color: '#003087' },
  { id: 'venmo', name: 'Venmo', icon: 'cash-fast', color: '#3D95CE' },
  { id: 'cash_app', name: 'Cash App', icon: 'cash', color: '#00C244' }
];

// Frequencies for recurring payments
const FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' }
];

const IntegratedPaymentScreen = () => {
  const [loading, setLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [paymentLinks, setPaymentLinks] = useState([]);
  const [showAddMethodDialog, setShowAddMethodDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [showPaymentLinkDialog, setShowPaymentLinkDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('payment');
  const [qrValue, setQrValue] = useState('');
  const [qrAmount, setQrAmount] = useState('');
  const [recurringForm, setRecurringForm] = useState({
    amount: '',
    frequency: 'monthly',
    startDate: new Date(),
    paymentMethod: '',
    description: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [paymentLinkForm, setPaymentLinkForm] = useState({
    amount: '',
    description: '',
    expiryDays: 7,
    allowPartial: false,
    notifyOnPayment: true
  });
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  // Get group ID and payment amount from route params
  const { groupId, groupName, amount, paymentId } = route.params || {};

  useEffect(() => {
    fetchData();
    
    // If amount is provided, show payment dialog
    if (amount && !isNaN(parseFloat(amount))) {
      setPaymentAmount(amount.toString());
      setShowPaymentDialog(true);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch payment methods
      const methods = await getPaymentMethods(user.id);
      setPaymentMethods(methods);
      
      // Fetch payment history
      const history = await getPaymentHistory(user.id, groupId);
      setPaymentHistory(history);
      
      // Fetch recurring payments
      const recurring = await getRecurringPayments(user.id, groupId);
      setRecurringPayments(recurring);
      
      // Fetch payment links
      const links = await getGroupPaymentLinks(groupId);
      setPaymentLinks(links);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      Alert.alert('Error', 'Failed to load payment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddPaymentMethod = async (type, details) => {
    try {
      // This would normally integrate with a payment processor's SDK
      // For this example, we'll just simulate adding a method
      const newMethod = await addPaymentMethod(user.id, type, details);
      
      // Update local state
      setPaymentMethods([...paymentMethods, newMethod]);
      
      setShowAddMethodDialog(false);
      Alert.alert('Success', 'Payment method added successfully.');
    } catch (error) {
      console.error('Error adding payment method:', error);
      Alert.alert('Error', 'Failed to add payment method. Please try again.');
    }
  };
  
  const handleRemovePaymentMethod = async (methodId) => {
    try {
      await removePaymentMethod(user.id, methodId);
      
      // Update local state
      setPaymentMethods(paymentMethods.filter(method => method.id !== methodId));
      
      Alert.alert('Success', 'Payment method removed successfully.');
    } catch (error) {
      console.error('Error removing payment method:', error);
      Alert.alert('Error', 'Failed to remove payment method. Please try again.');
    }
  };
  
  const handleGenerateQR = async () => {
    if (!qrAmount || isNaN(parseFloat(qrAmount)) || parseFloat(qrAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }
    
    try {
      const response = await generateQRPayment(groupId, parseFloat(qrAmount));
      setQrValue(response.qrCode);
      setShowQRDialog(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      Alert.alert('Error', 'Failed to generate QR code. Please try again.');
    }
  };
  
  const handleSetupRecurringPayment = async () => {
    if (!recurringForm.amount || isNaN(parseFloat(recurringForm.amount)) || parseFloat(recurringForm.amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }
    
    if (!recurringForm.paymentMethod) {
      Alert.alert('Missing Information', 'Please select a payment method.');
      return;
    }
    
    try {
      const response = await setupRecurringPayment(
        user.id,
        groupId,
        {
          amount: parseFloat(recurringForm.amount),
          frequency: recurringForm.frequency,
          startDate: recurringForm.startDate,
          paymentMethodId: recurringForm.paymentMethod,
          description: recurringForm.description
        }
      );
      
      // Update local state
      setRecurringPayments([...recurringPayments, response]);
      
      setShowRecurringDialog(false);
      Alert.alert('Success', 'Recurring payment scheduled successfully.');
    } catch (error) {
      console.error('Error setting up recurring payment:', error);
      Alert.alert('Error', 'Failed to set up recurring payment. Please try again.');
    }
  };
  
  const handleCancelRecurringPayment = async (paymentId) => {
    try {
      await cancelRecurringPayment(user.id, paymentId);
      
      // Update local state
      setRecurringPayments(recurringPayments.filter(payment => payment.id !== paymentId));
      
      Alert.alert('Success', 'Recurring payment canceled successfully.');
    } catch (error) {
      console.error('Error canceling recurring payment:', error);
      Alert.alert('Error', 'Failed to cancel recurring payment. Please try again.');
    }
  };
  
  const handleCreatePaymentLink = async () => {
    if (!paymentLinkForm.amount || isNaN(parseFloat(paymentLinkForm.amount)) || parseFloat(paymentLinkForm.amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }
    
    try {
      const response = await createPaymentLink(
        groupId,
        {
          amount: parseFloat(paymentLinkForm.amount),
          description: paymentLinkForm.description,
          expiryDays: paymentLinkForm.expiryDays,
          allowPartial: paymentLinkForm.allowPartial,
          notifyOnPayment: paymentLinkForm.notifyOnPayment
        }
      );
      
      // Update local state
      setPaymentLinks([...paymentLinks, response]);
      
      setShowPaymentLinkDialog(false);
      Alert.alert('Success', 'Payment link created successfully.');
    } catch (error) {
      console.error('Error creating payment link:', error);
      Alert.alert('Error', 'Failed to create payment link. Please try again.');
    }
  };
  
  const handleSharePaymentLink = async (link) => {
    try {
      await Share.share({
        message: `Please use this link to make your payment: ${link.url}`,
        title: 'Payment Link'
      });
    } catch (error) {
      console.error('Error sharing payment link:', error);
      Alert.alert('Error', 'Failed to share payment link. Please try again.');
    }
  };
  
  const handleMakePayment = async () => {
    if (!selectedProvider) {
      Alert.alert('Missing Selection', 'Please select a payment method.');
      return;
    }
    
    if (!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }
    
    setProcessingPayment(true);
    
    try {
      // In a real app, this would integrate with the payment provider's SDK
      const response = await initiatePayment(
        groupId,
        {
          amount: parseFloat(paymentAmount),
          provider: selectedProvider,
          paymentId: paymentId, // If paying a specific obligation
          userId: user.id
        }
      );
      
      if (response.redirectUrl) {
        // If we need to redirect to a payment gateway
        Linking.openURL(response.redirectUrl);
      } else if (response.status === 'completed') {
        // If payment was processed immediately
        Alert.alert(
          'Payment Successful', 
          `Your payment of ${formatCurrency(parseFloat(paymentAmount))} has been processed successfully.`
        );
        
        // Refresh payment history
        const history = await getPaymentHistory(user.id, groupId);
        setPaymentHistory(history);
      }
      
      setShowPaymentDialog(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Payment Failed', 'Unable to process your payment. Please try again or use a different payment method.');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  const renderPaymentMethodsTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Payment Methods Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.cardTitle}>Your Payment Methods</Title>
            <Button 
              mode="contained" 
              icon="plus"
              onPress={() => setShowAddMethodDialog(true)}
              style={styles.addButton}
            >
              Add
            </Button>
          </View>
          
          {paymentMethods.length > 0 ? (
            <View style={styles.paymentMethodsList}>
              {paymentMethods.map((method) => (
                <View key={method.id} style={styles.paymentMethodItem}>
                  <View style={styles.paymentMethodInfo}>
                    <View 
                      style={[
                        styles.paymentMethodIcon, 
                        { backgroundColor: method.color || '#2196F3' }
                      ]}
                    >
                      <Icon 
                        name={PAYMENT_METHOD_ICONS[method.type] || 'credit-card'} 
                        size={20} 
                        color="#fff" 
                      />
                    </View>
                    
                    <View style={styles.paymentMethodDetails}>
                      <Text style={styles.paymentMethodName}>{method.name}</Text>
                      <Text style={styles.paymentMethodSubtitle}>
                        {method.last4 ? `•••• ${method.last4}` : method.description}
                      </Text>
                      {method.expiryDate && (
                        <Text style={styles.paymentMethodExpiry}>
                          Expires: {method.expiryDate}
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.paymentMethodActions}>
                    {method.isDefault && (
                      <Chip style={styles.defaultChip}>Default</Chip>
                    )}
                    
                    <IconButton
                      icon="trash-can-outline"
                      size={20}
                      color="#F44336"
                      onPress={() => Alert.alert(
                        'Remove Payment Method',
                        'Are you sure you want to remove this payment method?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { 
                            text: 'Remove', 
                            style: 'destructive',
                            onPress: () => handleRemovePaymentMethod(method.id)
                          }
                        ]
                      )}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="credit-card-off" size={48} color="#9E9E9E" />
              <Text style={styles.emptyText}>No payment methods added</Text>
              <Text style={styles.emptySubtext}>
                Add a payment method to make quick and easy payments
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Quick Payment Options Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Quick Payment Options</Title>
          
          <View style={styles.quickOptionsContainer}>
            <View style={styles.quickOptionRow}>
              <TouchableOpacity
                style={styles.quickOption}
                onPress={() => setShowPaymentDialog(true)}
              >
                <View 
                  style={[
                    styles.quickOptionIcon, 
                    { backgroundColor: '#4CAF50' }
                  ]}
                >
                  <Icon name="cash-fast" size={24} color="#fff" />
                </View>
                <Text style={styles.quickOptionText}>One-time Payment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickOption}
                onPress={() => {
                  setRecurringForm({
                    amount: '',
                    frequency: 'monthly',
                    startDate: new Date(),
                    paymentMethod: paymentMethods.length > 0 ? paymentMethods[0].id : '',
                    description: ''
                  });
                  setShowRecurringDialog(true);
                }}
              >
                <View 
                  style={[
                    styles.quickOptionIcon, 
                    { backgroundColor: '#2196F3' }
                  ]}
                >
                  <Icon name="calendar-sync" size={24} color="#fff" />
                </View>
                <Text style={styles.quickOptionText}>Recurring Payment</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.quickOptionRow}>
              <TouchableOpacity
                style={styles.quickOption}
                onPress={() => {
                  setQrAmount('');
                  setQrValue('');
                  navigation.navigate('ReceivePaymentScreen', { 
                    groupId, 
                    paymentMethods 
                  });
                }}
              >
                <View 
                  style={[
                    styles.quickOptionIcon, 
                    { backgroundColor: '#9C27B0' }
                  ]}
                >
                  <Icon name="qrcode" size={24} color="#fff" />
                </View>
                <Text style={styles.quickOptionText}>Receive Payment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickOption}
                onPress={() => {
                  setPaymentLinkForm({
                    amount: '',
                    description: '',
                    expiryDays: 7,
                    allowPartial: false,
                    notifyOnPayment: true
                  });
                  setShowPaymentLinkDialog(true);
                }}
              >
                <View 
                  style={[
                    styles.quickOptionIcon, 
                    { backgroundColor: '#FF9800' }
                  ]}
                >
                  <Icon name="link-variant" size={24} color="#fff" />
                </View>
                <Text style={styles.quickOptionText}>Create Payment Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Payment Links Card */}
      {paymentLinks.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Payment Links</Title>
            
            <View style={styles.paymentLinksList}>
              {paymentLinks.map((link) => (
                <View key={link.id} style={styles.paymentLinkItem}>
                  <View style={styles.paymentLinkInfo}>
                    <View style={styles.paymentLinkHeader}>
                      <Text style={styles.paymentLinkAmount}>
                        {formatCurrency(link.amount)}
                      </Text>
                      <Chip 
                        style={[
                          styles.statusChip,
                          link.status === 'active' ? styles.activeStatusChip :
                          link.status === 'paid' ? styles.paidStatusChip :
                          styles.expiredStatusChip
                        ]}
                      >
                        {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                      </Chip>
                    </View>
                    
                    <Text style={styles.paymentLinkDescription}>
                      {link.description || 'Payment link'}
                    </Text>
                    
                    <View style={styles.paymentLinkDetails}>
                      <Text style={styles.paymentLinkDetail}>
                        <Icon name="calendar" size={14} color="#666" /> Expires: {formatDate(link.expiryDate)}
                      </Text>
                      
                      {link.timesUsed > 0 && (
                        <Text style={styles.paymentLinkDetail}>
                          <Icon name="refresh" size={14} color="#666" /> Used {link.timesUsed} {link.timesUsed === 1 ? 'time' : 'times'}
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.paymentLinkActions}>
                    <Button 
                      mode="outlined" 
                      icon="content-copy"
                      onPress={() => {
                        // Copy link to clipboard - in a real app
                        Alert.alert('Link Copied', 'Payment link copied to clipboard');
                      }}
                      style={styles.linkActionButton}
                    >
                      Copy
                    </Button>
                    
                    <Button 
                      mode="outlined" 
                      icon="share-variant"
                      onPress={() => handleSharePaymentLink(link)}
                      style={styles.linkActionButton}
                    >
                      Share
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}
      
      {/* Recurring Payments Card */}
      {recurringPayments.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recurring Payments</Title>
            
            <View style={styles.recurringPaymentsList}>
              {recurringPayments.map((payment) => (
                <View key={payment.id} style={styles.recurringPaymentItem}>
                  <View style={styles.recurringPaymentInfo}>
                    <View style={styles.recurringPaymentHeader}>
                      <Text style={styles.recurringPaymentAmount}>
                        {formatCurrency(payment.amount)}
                      </Text>
                      <Chip 
                        style={[
                          styles.frequencyChip,
                          { backgroundColor: 'rgba(33, 150, 243, 0.1)' }
                        ]}
                      >
                        {payment.frequency.charAt(0).toUpperCase() + payment.frequency.slice(1)}
                      </Chip>
                    </View>
                    
                    <Text style={styles.recurringPaymentDescription}>
                      {payment