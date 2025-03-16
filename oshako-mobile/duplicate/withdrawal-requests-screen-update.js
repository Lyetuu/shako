// File: screens/GroupSavings/WithdrawalRequestsScreen.js (update)
// Add this to the Card.Content in the withdrawal card rendering, after the reason container
{withdrawal.bankAccount && (
  <View style={styles.bankAccountContainer}>
    <Text style={styles.bankAccountLabel}>Withdrawal Account:</Text>
    <View style={styles.bankAccountInfo}>
      <Icon 
        name="bank" 
        size={16} 
        color="#2E7D32"
        style={styles.bankIcon}
      />
      <Text style={styles.bankAccountText}>
        {withdrawal.bankAccount.nickname || withdrawal.bankAccount.bankName} (
        {withdrawal.bankAccount.accountType === 'CHECKING' ? 'Checking' : 'Savings'} 
        •••• {withdrawal.bankAccount.last4})
      </Text>
    </View>
  </View>
)}

// Add these styles
bankAccountContainer: {
  marginTop: 12,
  padding: 8,
  backgroundColor: '#f0f8ff',
  borderRadius: 4,
  borderLeftWidth: 3,
  borderLeftColor: '#2196F3',
},
bankAccountLabel: {
  fontSize: 12,
  fontWeight: 'bold',
  marginBottom: 4,
  color: '#2196F3',
},
bankAccountInfo: {
  flexDirection: 'row',
  alignItems: 'center',
},
bankIcon: {
  marginRight: 8,
},
bankAccountText: {
  fontSize: 14,
},
