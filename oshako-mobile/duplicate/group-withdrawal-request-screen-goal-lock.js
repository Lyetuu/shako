// File: screens/GroupSavings/GroupWithdrawalRequestScreen.js (update for goal lock check)
// Add this to the component body, after the loadData function

// Check if group withdrawals are allowed based on goal status
const groupWithdrawalsLocked = () => {
  if (!group) return false;
  
  // If group has no goal, withdrawals are always allowed
  if (!group.goalAmount || group.goalAmount <= 0) return false;
  
  // If group has lockWithdrawalsUntilGoal setting and goal not reached, lock withdrawals
  if (group.settings?.lockWithdrawalsUntilGoal && group.totalSavings < group.goalAmount) {
    return true;
  }
  
  return false;
};

// Update the rendering condition before the main form
// First keep the existing loading and missing group checks
if (loading) {
  // ... existing loading code
}

if (!group) {
  // ... existing missing group code
}

// Add this check before the admin check
if (groupWithdrawalsLocked()) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Group Withdrawal Request</Text>
        
        <Card style={styles.groupInfoCard}>
          <Card.Content>
            <Text style={styles.groupName}>{group.name}</Text>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Savings:</Text>
              <Text style={styles.infoValue}>{formatCurrency(group.totalSavings)}</Text>
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
            <Text style={styles.lockedTitle}>Group Withdrawals Locked</Text>
            <Text style={styles.lockedDescription}>
              This group has locked withdrawals until the savings goal is reached.
              Group withdrawals will be available once the goal of {formatCurrency(group.goalAmount)} is reached.
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

// Add these styles
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
