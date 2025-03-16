// File: screens/Savings/SavingsGoalDetailsScreen.js (update to show lock status)
// Add this to the goal details card after the progress information
{savingsGoal.lockWithdrawalsUntilGoal && (
  <View style={styles.lockBannerContainer}>
    <Icon name="lock" size={20} color="#F44336" style={styles.lockIcon} />
    <Text style={styles.lockBannerText}>
      Withdrawals locked until goal of {formatCurrency(savingsGoal.targetAmount)} is reached
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
