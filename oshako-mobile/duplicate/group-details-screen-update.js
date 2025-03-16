// File: screens/GroupSavings/GroupDetailsScreen.js (update - add group withdrawal button to the screen)
// Add this import at the top
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Add this inside the Card.Content of the first card (after the statsRow)
{group.totalSavings > 0 && (
  <View style={styles.groupWithdrawalContainer}>
    <Button 
      mode="contained" 
      icon="cash-multiple" 
      onPress={() => navigation.navigate('GroupWithdrawalRequest', { groupId: group._id })}
      style={styles.groupWithdrawalButton}
      color="#4CAF50"
    >
      Request Group Withdrawal
    </Button>
    <Text style={styles.groupWithdrawalNote}>
      Request a withdrawal of the entire group savings (requires approval from all members)
    </Text>
  </View>
)}

// Add these styles
groupWithdrawalContainer: {
  marginTop: 16,
  padding: 12,
  backgroundColor: '#e8f5e9',
  borderRadius: 8,
},
groupWithdrawalButton: {
  marginBottom: 8,
},
groupWithdrawalNote: {
  fontSize: 12,
  color: '#2E7D32',
  textAlign: 'center',
},
