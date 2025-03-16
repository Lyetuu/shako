// File: navigation/AppNavigator.js
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

// Main App Screens
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// Group Savings Screens
import GroupsListScreen from '../screens/GroupSavings/GroupsListScreen';
import GroupDetailsScreen from '../screens/GroupSavings/GroupDetailsScreen';
import CreateGroupScreen from '../screens/GroupSavings/CreateGroupScreen';
import ContributeScreen from '../screens/GroupSavings/ContributeScreen';
import RequestWithdrawalScreen from '../screens/GroupSavings/RequestWithdrawalScreen';
import GroupMembersScreen from '../screens/GroupSavings/GroupMembersScreen';
import WithdrawalRequestsScreen from '../screens/GroupSavings/WithdrawalRequestsScreen';

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
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
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
      name="GroupMembers" 
      component={GroupMembersScreen} 
      options={{ title: 'Group Members' }}
    />
    <Stack.Screen 
      name="WithdrawalRequests" 
      component={WithdrawalRequestsScreen} 
      options={{ title: 'Withdrawal Requests' }}
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
        component={HomeScreen} 
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
        name="Profile" 
        component={ProfileScreen} 
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
