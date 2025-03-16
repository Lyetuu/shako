// File: screens/Profile/ProfileScreen.js (update for fees link)
// Add this to the Help Card in the list of items
<List.Item
  title="Fees & Commission"
  description="Learn about our fee structure"
  left={props => <List.Icon {...props} icon="cash" />}
  right={props => <List.Icon {...props} icon="chevron-right" />}
  onPress={() => navigation.navigate('FeesAndCommission')}
/>
<Divider />
