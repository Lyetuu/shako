// Continuing from where the code was cut off in GroupDetailsScreen.js
                  <Text style={styles.actionText}>Contribute</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setShowWithdrawDialog(true)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#FF9800' }]}>
                    <Icon name="cash-minus" size={24} color="white" />
                  </View>
                  <Text style={styles.actionText}>Withdraw</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('GroupTransactions', { groupId: group._id })}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
                    <Icon name="history" size={24} color="white" />
                  </View>
                  <Text style={styles.actionText}>History</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('InviteMembers', { groupId: group._id })}
                >
                  <View style={[styles.actionIcon, { backgroundColor: '#9C27B0' }]}>
                    <Icon name="account-plus" size={24} color="white" />
                  </View>
                  <Text style={styles.actionText}>Invite</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
          
          {group.description && (
            <Card style={styles.descriptionCard}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{group.description}</Text>
              </Card.Content>
            </Card>
          )}
          
          <Card style={styles.withdrawalSettingsCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Withdrawal Settings</Text>
              
              <View style={styles.settingItem}>
                <Icon name="shield-check" size={20} color="#6200ee" />
                <Text style={styles.settingText}>
                  {group.settings.requireAllApprovals 
                    ? 'All members must approve withdrawals' 
                    : `At least ${group.settings.minimumApprovalPercentage}% of members must approve withdrawals`}
                </Text>
              </View>
              
              {group.settings.autoSplitOnDispute && (
                <View style={styles.settingItem}>
                  <Icon name="account-switch" size={20} color="#6200ee" />
                  <Text style={styles.settingText}>
                    Funds will be split equally in case of disputes
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
      
      <Portal>
        <Dialog
          visible={showWithdrawDialog}
          onDismiss={() => setShowWithdrawDialog(false)}
        >
          <Dialog.Title>Request Withdrawal</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Withdrawal requests require approval from {group.settings.requireAllApprovals 
                ? 'all members' 
                : `at least ${group.settings.minimumApprovalPercentage}% of members`}.
            </Paragraph>
            <Paragraph style={{ marginTop: 8 }}>
              Do you want to continue?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowWithdrawDialog(false)}>Cancel</Button>
            <Button 
              onPress={() => {
                setShowWithdrawDialog(false);
                navigation.navigate('RequestWithdrawal', { groupId: group._id });
              }}
            >
              Continue
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <FAB.Group
        open={fabOpen}
        icon={fabOpen ? 'close' : 'dots-vertical'}
        actions={[
          {
            icon: 'account-plus',
            label: 'Invite Members',
            onPress: () => navigation.navigate('InviteMembers', { groupId: group._id }),
          },
          {
            icon: 'cash-plus',
            label: 'Contribute',
            onPress: () => navigation.navigate('GroupContribute', { groupId: group._id }),
          },
          isAdmin() && {
            icon: 'cog',
            label: 'Group Settings',
            onPress: () => navigation.navigate('GroupSettings', { groupId: group._id }),
          },
        ].filter(Boolean)}
        onStateChange={({ open }) => setFabOpen(open)}
        onPress={() => {
          if (fabOpen) {
            // do nothing, it will just close the FAB
          }
        }}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  headerContent: {
    padding: 16,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    backgroundColor: '#6200ee20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#6200ee',
    fontWeight: 'bold',
    fontSize: 12,
  },
  purpose: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    marginTop: 4,
  },
  currentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  targetAmount: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  contributionSection: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contributionLabel: {
    fontSize: 14,
    color: '#424242',
  },
  contributionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoTextContainer: {
    marginLeft: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#757575',
  },
  infoValue: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  sectionCount: {
    fontSize: 14,
    color: '#757575',
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  membersCard: {
    marginBottom: 16,
  },
  memberContribution: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500',
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    width: '22%',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#424242',
    textAlign: 'center',
  },
  descriptionCard: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginTop: 8,
  },
  withdrawalSettingsCard: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingText: {
    fontSize: 14,
    color: '#424242',
    marginLeft: 8,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

export default GroupDetailsScreen;
