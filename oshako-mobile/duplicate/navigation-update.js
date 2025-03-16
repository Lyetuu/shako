// File: navigation/AppNavigator.js (update only)
// Add these imports at the top
import BankingDetailsScreen from '../screens/Profile/BankingDetailsScreen';
import PaymentMethodsScreen from '../screens/Profile/PaymentMethodsScreen';
import TransactionHistoryScreen from '../screens/Profile/TransactionHistoryScreen';
import TransactionDetailsScreen from '../screens/Profile/TransactionDetailsScreen';
import AddPaymentMethodScreen from '../screens/Profile/AddPaymentMethodScreen';

// Create a Profile Stack Navigator
const ProfileStack = createStackNavigator();

const ProfileNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen 
      name="ProfileMain" 
      component={ProfileScreen} 
      options={{ headerShown: false }}
    />
    <ProfileStack.Screen 
      name="PaymentMethods" 
      component={PaymentMethodsScreen} 
      options={{ title: 'Payment Methods' }}
    />
    <ProfileStack.Screen 
      name="AddPaymentMethod" 
      component={AddPaymentMethodScreen} 
      options={{ title: 'Add Payment Method' }}
    />
    <ProfileStack.Screen 
      name="BankingDetails" 
      component={BankingDetailsScreen} 
      options={{ title: 'Banking Details' }}
    />
    <ProfileStack.Screen 
      name="TransactionHistory" 
      component={TransactionHistoryScreen} 
      options={{ title: 'Transaction History' }}
    />
    <ProfileStack.Screen 
      name="TransactionDetails" 
      component={TransactionDetailsScreen} 
      options={{ title: 'Transaction Details' }}
    />
  </ProfileStack.Navigator>
);

// Then update the Main Tab Navigator to use ProfileNavigator instead of ProfileScreen directly
// Replace the Profile Tab.Screen with this:
<Tab.Screen 
  name="Profile" 
  component={ProfileNavigator} 
  options={{
    tabBarIcon: ({ color, size }) => (
      <Icon name="account" color={color} size={size} />
    ),
  }}
/>
