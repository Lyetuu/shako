import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import TwoFactorScreen from '../screens/Auth/TwoFactorScreen'; // Added from second file

// Main App Screens
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SaveGoalScreen from '../screens/Home/SaveGoalScreen'; // Added from second file
import SecurityScreen from '../screens/Profile/SecurityScreen'; // Added from second file
import KycScreen from '../screens/Profile/KycScreen'; // Added from second file
import SavingsScreen from '../screens/Savings/SavingsScreen'; // Added from second file

// Group Savings Screens
import GroupsListScreen from '../screens/GroupSavings/GroupsListScreen';
import GroupDetailsScreen from '../screens/GroupSavings/GroupDetailsScreen';
import CreateGroupScreen from '../screens/GroupSavings/CreateGroupScreen';
import ContributeScreen from '../screens/GroupSavings/ContributeScreen';
import RequestWithdrawalScreen from '../screens/GroupSavings/RequestWithdrawalScreen';
import GroupWithdrawalRequestScreen from '../screens/GroupSavings/GroupWithdrawalRequestScreen';
import GroupWithdrawalStatusScreen from '../screens/GroupSavings/GroupWithdrawalStatusScreen';
import GroupMembersScreen from '../screens/GroupSavings/GroupMembersScreen';
import WithdrawalRequestsScreen from '../screens/GroupSavings/WithdrawalRequestsScreen';

// Profile Screens
import BankingDetailsScreen from '../screens/Profile/BankingDetailsScreen';
import PaymentMethodsScreen from '../screens/Profile/PaymentMethodsScreen';
import AddPaymentMethodScreen from '../screens/Profile/AddPaymentMethodScreen';
import TransactionHistoryScreen from '../screens/Profile/TransactionHistoryScreen';
import TransactionDetailsScreen from '../screens/Profile/TransactionDetailsScreen';

// Settings Screens
import FeesAndCommissionScreen from '../screens/Settings/FeesAndCommissionScreen';

// Support Screens
import SupportTicketScreen from '../screens/Support/SupportTicketScreen';

// Insights Screens
import SavingsInsightsScreen from '../screens/Insights/SavingsInsightsScreen';

// Tools Screens
import SavingsCalculatorScreen from '../screens/Tools/SavingsCalculatorScreen';

// Education Screens
import FinancialEducationScreen from '../screens/Education/FinancialEducationScreen';

// Challenges Screens
import SavingsChallengeScreen from '../screens/Challenges/SavingsChallengeScreen';

// Social Screens
import SocialSharingScreen from '../screens/Social/SocialSharingScreen';

// Utils & Context
import { useAuth } from '../contexts/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="TwoFactor" component={TwoFactorScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Home Navigator
const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="SaveGoal" 
      component={SaveGoalScreen} 
      options={{ title: 'Create Savings Goal' }}
    />
  </Stack.Navigator>
);

// Group Savings Navigator
const GroupSavingsNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen 
      name="GroupsList" 
      component={GroupsListScreen} 
      options={{ title: 'Savings Groups' }}
    />
    <Stack.Screen 
      name="GroupDetails" 
      component={GroupDetailsScreen} 
      options={({ route }) => ({ title: route.params?.groupName || 'Group Details' })}
    />
    <Stack.Screen 
      name="CreateGroup" 
      component={CreateGroupScreen} 
      options={{ title: 'Create New Group' }}
    />
    <Stack.Screen 
      name="Contribute" 
      component={ContributeScreen} 
      options={{ title: 'Make Contribution' }}
    />
    <Stack.Screen 
      name="RequestWithdrawal" 
      component={RequestWithdrawalScreen} 
      options={{ title: 'Request Withdrawal' }}
    />
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
      name="GroupMembers" 
      component={GroupMembersScreen} 
      options={{ title: 'Group Members' }}
    />
    <Stack.Screen 
      name="WithdrawalRequests" 
      component={WithdrawalRequestsScreen} 
      options={{ title: 'Withdrawal Requests' }}
    />
    <Stack.Screen 
      name="SupportTicketDetails" 
      component={SupportTicketScreen} 
      options={{ title: 'Support Ticket' }}
    />
  </Stack.Navigator>
);

// Profile Navigator
const ProfileNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="ProfileMain" 
      component={ProfileScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="PaymentMethods" 
      component={PaymentMethodsScreen} 
      options={{ title: 'Payment Methods' }}
    />
    <Stack.Screen 
      name="AddPaymentMethod" 
      component={AddPaymentMethodScreen} 
      options={{ title: 'Add Payment Method' }}
    />
    <Stack.Screen 
      name="BankingDetails" 
      component={BankingDetailsScreen} 
      options={{ title: 'Banking Details' }}
    />
    <Stack.Screen 
      name="TransactionHistory" 
      component={TransactionHistoryScreen} 
      options={{ title: 'Transaction History' }}
    />
    <Stack.Screen 
      name="TransactionDetails" 
      component={TransactionDetailsScreen} 
      options={{ title: 'Transaction Details' }}
    />
    <Stack.Screen 
      name="FeesAndCommission" 
      component={FeesAndCommissionScreen} 
      options={{ title: 'Fees & Commission' }}
    />
    <Stack.Screen 
      name="SavingsCalculator" 
      component={SavingsCalculatorScreen} 
      options={{ title: 'Savings Calculator' }}
    />
    <Stack.Screen 
      name="Security" 
      component={SecurityScreen} 
      options={{ title: 'Security Settings' }}
    />
    <Stack.Screen 
      name="KYC" 
      component={KycScreen} 
      options={{ title: 'Verify Identity' }}
    />
  </Stack.Navigator>
);

// Insights Navigator
const InsightsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SavingsInsights" 
      component={SavingsInsightsScreen} 
      options={{ title: 'Savings Insights' }}
    />
  </Stack.Navigator>
);

// Savings Navigator
const SavingsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SavingsMain" 
      component={SavingsScreen} 
      options={{ title: 'My Savings' }}
    />
  </Stack.Navigator>
);

// Education Navigator
const EducationNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="FinancialEducation" 
      component={FinancialEducationScreen} 
      options={{ title: 'Financial Education' }}
    />
  </Stack.Navigator>
);

// Challenges Navigator
const ChallengesNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SavingsChallenges" 
      component={SavingsChallengeScreen} 
      options={{ title: 'Savings Challenges' }}
    />
  </Stack.Navigator>
);

// Social Navigator
const SocialNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="SocialSharing" 
      component={SocialSharingScreen} 
      options={{ title: 'Social & Sharing' }}
    />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainNavigator = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Groups" 
        component={GroupSavingsNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Savings" 
        component={SavingsNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    // You could return a splash screen here
    return null;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;