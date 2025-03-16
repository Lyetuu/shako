// File: screens/GroupSavings/GroupDetailsScreen.js (update to show lock status)
// Add this to the Card.Content in the Group Overview Card, after the statsRow
{group.goalAmount > 0 && group.settings?.lockWithdrawalsUntilGoal && (
  <View style={styles.lockBannerContainer}>
    <Icon name="lock" size={20} color="#F44336" style={styles.lockIcon} />
    <Text style={styles.lockBannerText}>
      Withdrawals locked until goal of {formatCurrency(group.goalAmount)} is reached
    </Text>
  </View>
)}

// Add these styles
lockBannerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#ffebee',
  padding: 8,
  borderRadius: 4,
  marginTop: 12,
},
lockIcon: {
  marginRight: 8,
},
lockBannerText: {
  color: '#F44336',
  fontSize: 14,
  flex: 1,
},
