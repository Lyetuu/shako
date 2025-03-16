// File: screens/Profile/ProfileScreen.js (update only)
// Add this to the Account Card in the existing ProfileScreen.js

/* Add after the Payment Methods List.Item */
<List.Item
  title="Banking Details"
  description="Manage your withdrawal bank accounts"
  left={props => <List.Icon {...props} icon="bank" />}
  right={props => <List.Icon {...props} icon="chevron-right" />}
  onPress={() => navigation.navigate('BankingDetails')}
/>
<Divider />
