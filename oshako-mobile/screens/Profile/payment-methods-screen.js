// File: screens/Profile/PaymentMethodsScreen.js (continued)
            <Text style={styles.emptyText}>No payment methods added yet</Text>
            <Text style={styles.emptySubtext}>
              Add a payment method to make contributions and receive withdrawals
            </Text>
            <Button
              mode="contained"
              onPress={handleAddPaymentMethod}
              style={styles.addButton}
              icon="plus"
            >
              Add Payment Method
            </Button>
          </View>
        )}
        
        {paymentMethods.length > 0 && (
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={openSetDefaultDialog}
              style={styles.actionButton}
              icon="star"
            >
              Set Default Method
            </Button>
          </View>
        )}
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Method"
        onPress={handleAddPaymentMethod}
      />
      
      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Payment Method</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setDeleteDialogVisible(false)} 
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onPress={confirmDeleteMethod}
              color="#F44336"
              loading={submitting}
              disabled={submitting}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Set Default Method Dialog */}
      <Portal>
        <Dialog
          visible={defaultDialogVisible}
          onDismiss={() => setDefaultDialogVisible(false)}
        >
          <Dialog.Title>Set Default Payment Method</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={setSelectedMethodId}
              value={selectedMethodId}
            >
              {paymentMethods.map((method) => (
                <View key={method.id} style={styles.radioOption}>
                  <RadioButton value={method.id} />
                  <View style={styles.radioMethodInfo}>
                    {renderCardIcon(method.type)}
                    <View style={styles.radioMethodDetails}>
                      <Text style={styles.radioMethodName}>
                        {method.brand || method.bankName} {method.type !== 'BANK' ? 'Card' : 'Account'}
                      </Text>
                      <Text style={styles.radioMethodNumber}>
                        {method.type !== 'BANK' 
                          ? `•••• ${method.last4}` 
                          : `•••••${method.last4}`}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setDefaultDialogVisible(false)} 
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              onPress={handleSetDefault}
              mode="contained"
              loading={submitting}
              disabled={submitting}
            >
              Set as Default
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
  methodCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodDetails: {
    marginLeft: 12,
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  methodNumber: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  methodExpiry: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  methodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  defaultText: {
    fontSize: 12,
    color: '#0097a7',
    fontWeight: 'bold',
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
  actionsContainer: {
    margin: 16,
  },
  actionButton: {
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  radioMethodDetails: {
    marginLeft: 12,
  },
  radioMethodName: {
    fontSize: 16,
  },
  radioMethodNumber: {
    fontSize: 14,
    color: '#666',
  },
});

export default PaymentMethodsScreen;
