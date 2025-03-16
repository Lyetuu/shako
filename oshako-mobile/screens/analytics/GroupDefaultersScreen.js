// Continuation of the code from the previous part

                List.Item
                  title="In-App Notifications"
                  description="Send notifications within the app"
                  left={() => <Icon name="cellphone" size={24} color={theme.colors.primary} style={styles.channelIcon} />}
                  right={() => (
                    <Checkbox
                      status={formSettings.defaultChannels.includes('app') ? 'checked' : 'unchecked'}
                      onPress={() => handleChannelToggle('app')}
                      disabled={sending}
                    />
                  )}
                />
                
                <List.Item
                  title="Email Notifications"
                  description="Send email notifications"
                  left={() => <Icon name="email" size={24} color={theme.colors.primary} style={styles.channelIcon} />}
                  right={() => (
                    <Checkbox
                      status={formSettings.defaultChannels.includes('email') ? 'checked' : 'unchecked'}
                      onPress={() => handleChannelToggle('email')}
                      disabled={sending}
                    />
                  )}
                />
                
                <List.Item
                  title="WhatsApp Messages"
                  description="Send WhatsApp messages (if user has linked their WhatsApp)"
                  left={() => <Icon name="whatsapp" size={24} color="#25D366" style={styles.channelIcon} />}
                  right={() => (
                    <Checkbox
                      status={formSettings.defaultChannels.includes('whatsapp') ? 'checked' : 'unchecked'}
                      onPress={() => handleChannelToggle('whatsapp')}
                      disabled={sending}
                    />
                  )}
                />
                
                <HelperText type="info" style={styles.channelsHelper}>
                  At least two notification channels must be selected
                </HelperText>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          
          <Dialog.Actions>
            <Button 
              onPress={() => setShowSettingsDialog(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={() => handleSaveSettings(formSettings)}
              loading={sending}
              disabled={
                sending || 
                formSettings.defaultChannels.length < 2 || 
                (formSettings.enableAutoReminders && (!formSettings.reminderDays || parseInt(formSettings.reminderDays) < 1)) ||
                (formSettings.enableAutoRetry && (!formSettings.maxRetryAttempts || parseInt(formSettings.maxRetryAttempts) < 1 || !formSettings.retryIntervalHours || parseInt(formSettings.retryIntervalHours) < 1))
              }
            >
              Save Settings
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  const renderMemberActionsMenu = () => (
    <Portal>
      <Menu
        visible={showMemberActionsMenu}
        onDismiss={() => setShowMemberActionsMenu(false)}
        anchor={menuAnchor}
      >
        <Menu.Item 
          icon="email-send"
          onPress={() => {
            setShowMemberActionsMenu(false);
            setSelectedMember(menuMember);
            setShowReminderDialog(true);
          }} 
          title="Send Reminder" 
        />
        <Menu.Item 
          icon="refresh"
          onPress={() => {
            setShowMemberActionsMenu(false);
            setSelectedMember(menuMember);
            setShowRetryDialog(true);
          }} 
          title="Setup Payment Retry" 
        />
        <Menu.Item 
          icon="account-details"
          onPress={() => {
            setShowMemberActionsMenu(false);
            // Navigate to member detail screen
            navigation.navigate('MemberDetail', { 
              memberId: menuMember.id,
              groupId: groupId,
              memberName: menuMember.name
            });
          }} 
          title="View Member Details" 
        />
        <Menu.Item 
          icon="history"
          onPress={() => {
            setShowMemberActionsMenu(false);
            // Navigate to payment history screen
            navigation.navigate('PaymentHistory', { 
              memberId: menuMember.id,
              groupId: groupId,
              memberName: menuMember.name
            });
          }} 
          title="View Payment History" 
        />
      </Menu>
    </Portal>
  );

  const [saving, setSaving] = useState(false);

  // Render the main screen
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <Text style={styles.screenTitle}>Group Defaulters</Text>
          <Text style={styles.groupName}>{groupName}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{defaulters.length}</Text>
            <Text style={styles.statLabel}>Defaulters</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {formatCurrency(defaulters.reduce((sum, member) => sum + member.amountDue, 0))}
            </Text>
            <Text style={styles.statLabel}>Total Due</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {Math.round(defaulters.reduce((sum, member) => sum + (new Date() - new Date(member.dueDate)) / (1000 * 60 * 60 * 24), 0) / defaulters.length || 0)}
            </Text>
            <Text style={styles.statLabel}>Avg. Days</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <Button
            mode="contained"
            icon="email-multiple"
            onPress={handleSendAllReminders}
            style={styles.headerButton}
            disabled={loading || defaulters.length === 0}
            loading={sending}
          >
            Remind All
          </Button>
          
          <Button
            mode="contained"
            icon="refresh"
            onPress={handleSetupAllRetries}
            style={styles.headerButton}
            disabled={loading || defaulters.length === 0}
            loading={sending}
          >
            Retry All
          </Button>
          
          <IconButton
            icon="cog"
            size={24}
            onPress={() => setShowSettingsDialog(true)}
            style={styles.settingsButton}
          />
        </View>
      </View>
      
      {/* Content section */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading defaulters...</Text>
        </View>
      ) : defaulters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="check-circle" size={64} color={theme.colors.success} />
          <Text style={styles.emptyText}>No defaulters in this group!</Text>
          <Text style={styles.emptySubtext}>All members are up-to-date with their payments.</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.membersList}
          contentContainerStyle={styles.membersListContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {defaulters.map(member => renderMemberItem(member))}
        </ScrollView>
      )}
      
      {/* Dialogs */}
      {renderReminderDialog()}
      {renderRetryDialog()}
      {renderSettingsDialog()}
      {renderMemberActionsMenu()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  headerSection: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  groupName: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerButton: {
    flex: 1,
    marginRight: 8
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    margin: 0
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: theme.colors.text
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: theme.colors.placeholder
  },
  membersList: {
    flex: 1
  },
  membersListContent: {
    padding: 16
  },
  memberCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  memberAvatar: {
    marginRight: 8
  },
  memberTextInfo: {
    flexDirection: 'column'
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text
  },
  memberUsername: {
    fontSize: 12,
    color: theme.colors.placeholder
  },
  memberDetails: {
    marginTop: 12
  },
  memberDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.placeholder
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500'
  },
  overdueChip: {
    height: 28,
    borderWidth: 1
  },
  lowOverdueChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderColor: '#FF9800'
  },
  mediumOverdueChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: '#F44336'
  },
  highOverdueChip: {
    backgroundColor: 'rgba(183, 28, 28, 0.1)',
    borderColor: '#B71C1C'
  },
  memberStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 12
  },
  statusChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(3, 169, 244, 0.1)'
  },
  retryChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(156, 39, 176, 0.1)'
  },
  statusChipText: {
    fontSize: 12
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  reminderButton: {
    flex: 1,
    marginRight: 8
  },
  retryButton: {
    flex: 1
  },
  dialog: {
    borderRadius: 8,
    padding: 4
  },
  settingsDialog: {
    borderRadius: 8,
    padding: 4,
    maxHeight: '80%'
  },
  settingsScrollArea: {
    paddingHorizontal: 0
  },
  dialogRecipient: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 12
  },
  messageInput: {
    marginBottom: 16
  },
  channelsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: theme.colors.text
  },
  channelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  channelOption: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  channelSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(3, 169, 244, 0.05)'
  },
  channelText: {
    marginTop: 8,
    fontSize: 14,
    color: '#888'
  },
  channelTextSelected: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  dialogInfo: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.placeholder,
    marginTop: 8
  },
  retryInfoCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(3, 169, 244, 0.05)'
  },
  retryInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  retryInfoLabel: {
    fontSize: 14,
    color: theme.colors.placeholder
  },
  retryInfoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500'
  },
  settingsSection: {
    padding: 16
  },
  settingsSectionTitle: {
    fontSize: 18,
    marginBottom: 16
  },
  settingsDescription: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 16
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text
  },
  settingInput: {
    marginBottom: 12
  },
  settingTextarea: {
    marginBottom: 12
  },
  settingsDivider: {
    height: 1,
    marginVertical: 8
  },
  channelIcon: {
    marginRight: 8
  },
  channelsHelper: {
    marginTop: 4
  }
});

export default GroupDefaultersScreen;
