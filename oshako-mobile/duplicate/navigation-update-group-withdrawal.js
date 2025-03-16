// File: navigation/AppNavigator.js (update - add new screens to the navigation)
// Add these imports at the top
import GroupWithdrawalRequestScreen from '../screens/GroupSavings/GroupWithdrawalRequestScreen';
import GroupWithdrawalStatusScreen from '../screens/GroupSavings/GroupWithdrawalStatusScreen';
import SupportTicketScreen from '../screens/Support/SupportTicketScreen';

// Add these to the GroupSavingsNavigator Stack.Navigator
<Stack.Screen 
  name="GroupWithdrawalRequest" 
  component={GroupWithdrawalRequestScreen} 
  options={{ title: 'Group Withdrawal Request' }}
/>
<Stack.Screen 
  name="GroupWithdrawalStatus" 
  component={GroupWithdrawalStatusScreen} 
  options={{ title: 'Group Withdrawal Status' }}
/>
<Stack.Screen 
  name="SupportTicketDetails" 
  component={SupportTicketScreen} 
  options={{ title: 'Support Ticket' }}
/>
