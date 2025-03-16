              {pendingSyncActions.map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <View style={styles.actionHeader}>
                    <View style={styles.actionType}>
                      <Icon 
                        name={
                          action.type === 'payment' ? 'cash' : 
                          action.type === 'commitment' ? 'handshake' : 
                          action.type === 'reminder' ? 'bell' : 
                          'file-document'
                        } 
                        size={20} 
                        color={theme.colors.primary} 
                      />
                      <Text style={styles.actionTypeText}>
                        {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
                      </Text>
                    </View>
                    
                    <Text style={styles.actionTime}>
                      {formatDate(action.timestamp)}
                    </Text>
                  </View>
                  
                  <Text style={styles.actionDescription}>
                    {action.description}
                  </Text>
                  
                  {action.amount && (
                    <Text style={styles.actionAmount}>
                      Amount: {formatCurrency(action.amount)}
                    </Text>
                  )}
                  
                  <View style={styles.actionFooter}>
                    <Chip 
                      style={styles.actionStatusChip} 
                      textStyle={styles.actionStatusText}
                    >
                      Pending Sync
                    </Chip>
                    
                    {action.priority === 'high' && (
                      <Chip 
                        style={styles.priorityChip} 
                        textStyle={styles.priorityText}
                      >
                        High Priority
                      </Chip>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="check-circle" size={48} color="#4CAF50" />
              <Text style={styles.emptyText}>No pending actions</Text>
              <Text style={styles.emptySubtext}>All changes have been synchronized</Text>
            </View>
          )}
        </Card.Content>
        
        {pendingSyncActions.length > 0 && (
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="contained" 
              icon="sync"
              onPress={() => handleSync()}
              disabled={!isOnline || syncingNow}
              loading={syncingNow}
            >
              Sync Now
            </Button>
          </Card.Actions>
        )}
      </Card>
      
      {/* Notification Queue */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Notification Queue</Title>
            <Badge size={24} style={styles.countBadge}>{notificationQueue.length}</Badge>
          </View>
          
          {notificationQueue.length > 0 ? (
            <View style={styles.queueList}>
              {notificationQueue.map((notification, index) => (
                <View key={index} style={styles.queueItem}>
                  <View style={styles.queueHeader}>
                    <View style={styles.queueType}>
                      <Icon 
                        name={
                          notification.channel === 'app' ? 'cellphone' : 
                          notification.channel === 'email' ? 'email' :
                          notification.channel === 'sms' ? 'message-text' :
                          notification.channel === 'whatsapp' ? 'whatsapp' :
                          'bell'
                        } 
                        size={20} 
                        color={
                          notification.channel === 'app' ? theme.colors.primary : 
                          notification.channel === 'email' ? '#2196F3' :
                          notification.channel === 'sms' ? '#FF9800' :
                          notification.channel === 'whatsapp' ? '#25D366' :
                          '#9C27B0'
                        } 
                      />
                      <Text style={styles.queueTypeText}>
                        {notification.channel.charAt(0).toUpperCase() + notification.channel.slice(1)} Notification
                      </Text>
                    </View>
                    
                    <Text style={styles.queueTime}>
                      {formatDate(notification.createdAt)}
                    </Text>
                  </View>
                  
                  <View style={styles.queueRecipient}>
                    <Text style={styles.queueLabel}>To:</Text>
                    <Text style={styles.queueValue}>{notification.recipientName}</Text>
                  </View>
                  
                  <View style={styles.queueContent}>
                    <Text style={styles.queueLabel}>Content:</Text>
                    <Text style={styles.queueMessage} numberOfLines={2}>
                      {notification.message}
                    </Text>
                  </View>
                  
                  <View style={styles.queueFooter}>
                    <Chip 
                      style={styles.queueStatusChip}
                      icon={() => (
                        <Icon 
                          name="clock-outline" 
                          size={16} 
                          color="#FF9800" 
                        />
                      )}
                    >
                      Queued for sending
                    </Chip>
                    
                    {notification.retryCount > 0 && (
                      <Text style={styles.retryCount}>
                        Retries: {notification.retryCount}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="check-circle" size={48} color="#4CAF50" />
              <Text style={styles.emptyText}>No queued notifications</Text>
              <Text style={styles.emptySubtext}>All notifications have been sent</Text>
            </View>
          )}
        </Card.Content>
        
        {notificationQueue.length > 0 && (
          <Card.Actions style={styles.cardActions}>
            <Button 
              mode="contained" 
              icon="send"
              onPress={handleProcessQueue}
              disabled={!isOnline || loading}
              loading={loading}
            >
              Process Queue
            </Button>
          </Card.Actions>
        )}
      </Card>
    </ScrollView>
  );
  
  const renderCacheTab = () => (
    <ScrollView 
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={() => {
            setRefreshing(true);
            loadData();
          }} 
        />
      }
    >
      {/* Cache Status */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Cached Data</Title>
          
          {Object.keys(cacheSummary).length > 0 ? (
            <View style={styles.cacheList}>
              {Object.entries(cacheSummary).map(([dataType, info], index) => (
                <View key={dataType} style={styles.cacheItem}>
                  <View style={styles.cacheHeader}>
                    <View style={styles.cacheType}>
                      <Icon 
                        name={
                          dataType === 'members' ? 'account-group' : 
                          dataType === 'payments' ? 'cash-multiple' : 
                          dataType === 'commitments' ? 'handshake' : 
                          dataType === 'templates' ? 'text-box-multiple' : 
                          'database'
                        } 
                        size={24} 
                        color={theme.colors.primary} 
                      />
                      <Text style={styles.cacheTypeText}>
                        {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
                      </Text>
                    </View>
                    
                    <Badge size={24} style={styles.countBadge}>{info.count}</Badge>
                  </View>
                  
                  <View style={styles.cacheDetails}>
                    <Text style={styles.cacheLabel}>Last Updated:</Text>
                    <Text style={styles.cacheValue}>
                      {info.lastUpdated ? formatDate(new Date(parseInt(info.lastUpdated))) : 'Never'}
                    </Text>
                  </View>
                  
                  <View style={styles.cacheStatus}>
                    {info.lastUpdated && (
                      <Icon 
                        name={
                          new Date().getTime() - parseInt(info.lastUpdated) < DATA_EXPIRY_TIME 
                            ? "check-circle" 
                            : "alert-circle"
                        } 
                        size={20} 
                        color={
                          new Date().getTime() - parseInt(info.lastUpdated) < DATA_EXPIRY_TIME 
                            ? "#4CAF50" 
                            : "#FF9800"
                        } 
                        style={styles.cacheStatusIcon}
                      />
                    )}
                    <Text style={styles.cacheStatusText}>
                      {!info.lastUpdated 
                        ? "No cached data" 
                        : new Date().getTime() - parseInt(info.lastUpdated) < DATA_EXPIRY_TIME 
                          ? "Data is fresh" 
                          : "Data may be outdated"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="database-off" size={48} color="#9E9E9E" />
              <Text style={styles.emptyText}>No cached data</Text>
              <Text style={styles.emptySubtext}>Connect to the internet to download data for offline use</Text>
            </View>
          )}
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="outlined" 
            icon="delete"
            onPress={() => setShowClearDialog(true)}
          >
            Clear Cache
          </Button>
          
          <Button 
            mode="contained" 
            icon="download"
            onPress={() => handleSync()}
            disabled={!isOnline || syncingNow}
            loading={syncingNow}
          >
            Refresh Cache
          </Button>
        </Card.Actions>
      </Card>
      
      {/* Sync Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Sync Settings</Title>
          
          <List.Item
            title="Automatic Sync"
            description={syncSettings.autoSync ? "Enabled" : "Disabled"}
            left={props => <List.Icon {...props} icon="sync" />}
            right={props => (
              <Switch
                value={syncSettings.autoSync}
                disabled={true}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Sync Interval"
            description={
              syncSettings.syncInterval === 'hourly' ? 'Every hour' :
              syncSettings.syncInterval === 'daily' ? 'Once a day' : 
              'Manual only'
            }
            left={props => <List.Icon {...props} icon="clock-outline" />}
          />
          
          <Divider />
          
          <List.Item
            title="Sync on Wi-Fi Only"
            description={syncSettings.syncOnWifiOnly ? "Enabled" : "Disabled"}
            left={props => <List.Icon {...props} icon="wifi" />}
            right={props => (
              <Switch
                value={syncSettings.syncOnWifiOnly}
                disabled={true}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Retain Offline Data"
            description={`For ${syncSettings.retainDataDays} days`}
            left={props => <List.Icon {...props} icon="calendar-range" />}
          />
          
          <Divider />
          
          <List.Item
            title="Priority Items"
            description="Items to sync first when coming back online"
            left={props => <List.Icon {...props} icon="priority-high" />}
          />
          
          <View style={styles.priorityItems}>
            <Chip 
              style={[
                styles.priorityItem, 
                syncSettings.prioritizeSync.payments && styles.priorityItemSelected
              ]} 
              icon="cash"
            >
              Payments
            </Chip>
            
            <Chip 
              style={[
                styles.priorityItem, 
                syncSettings.prioritizeSync.commitments && styles.priorityItemSelected
              ]} 
              icon="handshake"
            >
              Commitments
            </Chip>
            
            <Chip 
              style={[
                styles.priorityItem, 
                syncSettings.prioritizeSync.messages && styles.priorityItemSelected
              ]} 
              icon="message-text"
            >
              Messages
            </Chip>
          </View>
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="contained" 
            icon="cog"
            onPress={() => setShowSettingsDialog(true)}
          >
            Modify Settings
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
  
  const renderSyncDialog = () => (
    <Portal>
      <Dialog
        visible={showSyncProgressDialog}
        dismissable={false}
      >
        <Dialog.Title>Syncing Data</Dialog.Title>
        <Dialog.Content>
          <View style={styles.dialogContent}>
            <Text style={styles.syncProgressText}>
              {Math.round(currentSyncProgress * 100)}% Complete
            </Text>
            
            <ProgressBar
              progress={currentSyncProgress}
              color={theme.colors.primary}
              style={styles.syncProgressBar}
            />
            
            <Text style={styles.syncProgressStatus}>
              {currentSyncProgress < 0.3 ? 'Preparing data...' : 
               currentSyncProgress < 0.6 ? 'Uploading changes...' : 
               currentSyncProgress < 0.9 ? 'Receiving updates...' : 
               'Finalizing sync...'}
            </Text>
            
            <Text style={styles.syncProgressNote}>
              Please keep the app open until the sync is complete
            </Text>
          </View>
        </Dialog.Content>
        
        {currentSyncProgress === 1 && (
          <Dialog.Actions>
            <Button 
              onPress={() => setShowSyncProgressDialog(false)}
            >
              Done
            </Button>
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
  
  const renderClearDialog = () => (
    <Portal>
      <Dialog
        visible={showClearDialog}
        onDismiss={() => setShowClearDialog(false)}
      >
        <Dialog.Title>Clear Cache</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Are you sure you want to clear all cached data? You will need to reconnect to the internet to download fresh data.
          </Paragraph>
          
          <Paragraph style={styles.warningText}>
            Note: This won't delete any pending sync actions or queued notifications.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowClearDialog(false)}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            color="#F44336"
            onPress={handleClearCache}
          >
            Clear Cache
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderSettingsDialog = () => (
    <Portal>
      <Dialog
        visible={showSettingsDialog}
        onDismiss={() => setShowSettingsDialog(false)}
        style={styles.settingsDialog}
      >
        <Dialog.Title>Sync Settings</Dialog.Title>
        <Dialog.ScrollArea style={styles.settingsScrollArea}>
          <ScrollView>
            <View style={styles.settingsContent}>
              <List.Item
                title="Automatic Sync"
                description="Automatically sync data when online"
                left={props => <List.Icon {...props} icon="sync" />}
                right={props => (
                  <Switch
                    value={syncSettings.autoSync}
                    onValueChange={(value) => 
                      setSyncSettingsState({ 
                        ...syncSettings, 
                        autoSync: value 
                      })
                    }
                  />
                )}
              />
              
              <Divider />
              
              <List.Subheader>Sync Interval</List.Subheader>
              <RadioButton.Group
                onValueChange={(value) => 
                  setSyncSettingsState({ 
                    ...syncSettings, 
                    syncInterval: value 
                  })
                }
                value={syncSettings.syncInterval}
              >
                <RadioButton.Item
                  label="Every hour"
                  value="hourly"
                  disabled={!syncSettings.autoSync}
                />
                <RadioButton.Item
                  label="Once a day"
                  value="daily"
                  disabled={!syncSettings.autoSync}
                />
                <RadioButton.Item
                  label="Manual only"
                  value="manual"
                />
              </RadioButton.Group>
              
              <Divider />
              
              <List.Item
                title="Sync on Wi-Fi Only"
                description="Save mobile data by syncing only on Wi-Fi"
                left={props => <List.Icon {...props} icon="wifi" />}
                right={props => (
                  <Switch
                    value={syncSettings.syncOnWifiOnly}
                    onValueChange={(value) => 
                      setSyncSettingsState({ 
                        ...syncSettings, 
                        syncOnWifiOnly: value 
                      })
                    }
                    disabled={!syncSettings.autoSync}
                  />
                )}
              />
              
              <Divider />
              
              <List.Subheader>Retain Offline Data For</List.Subheader>
              <RadioButton.Group
                onValueChange={(value) => 
                  setSyncSettingsState({ 
                    ...syncSettings, 
                    retainDataDays: parseInt(value) 
                  })
                }
                value={syncSettings.retainDataDays.toString()}
              >
                <RadioButton.Item
                  label="3 days"
                  value="3"
                />
                <RadioButton.Item
                  label="7 days"
                  value="7"
                />
                <RadioButton.Item
                  label="30 days"
                  value="30"
                />
              </RadioButton.Group>
              
              <Divider />
              
              <List.Subheader>Priority Items for Sync</List.Subheader>
              <View style={styles.settingsPriorityItems}>
                <View style={styles.prioritySettingItem}>
                  <Checkbox
                    status={syncSettings.prioritizeSync.payments ? 'checked' : 'unchecked'}
                    onPress={() => 
                      setSyncSettingsState({ 
                        ...syncSettings, 
                        prioritizeSync: {
                          ...syncSettings.prioritizeSync,
                          payments: !syncSettings.prioritizeSync.payments
                        }
                      })
                    }
                  />
                  <Text style={styles.prioritySettingLabel}>Payments</Text>
                </View>
                
                <View style={styles.prioritySettingItem}>
                  <Checkbox
                    status={syncSettings.prioritizeSync.commitments ? 'checked' : 'unchecked'}
                    onPress={() => 
                      setSyncSettingsState({ 
                        ...syncSettings, 
                        prioritizeSync: {
                          ...syncSettings.prioritizeSync,
                          commitments: !syncSettings.prioritizeSync.commitments
                        }
                      })
                    }
                  />
                  <Text style={styles.prioritySettingLabel}>Commitments</Text>
                </View>
                
                <View style={styles.prioritySettingItem}>
                  <Checkbox
                    status={syncSettings.prioritizeSync.messages ? 'checked' : 'unchecked'}
                    onPress={() => 
                      setSyncSettingsState({ 
                        ...syncSettings, 
                        prioritizeSync: {
                          ...syncSettings.prioritizeSync,
                          messages: !syncSettings.prioritizeSync.messages
                        }
                      })
                    }
                  />
                  <Text style={styles.prioritySettingLabel}>Messages</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        
        <Dialog.Actions>
          <Button onPress={() => setShowSettingsDialog(false)}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleUpdateSyncSettings}
          >
            Save Settings
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading offline data...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Offline Mode</Text>
        <Text style={styles.screenSubtitle}>Manage offline data and sync</Text>
        
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'queue' && styles.activeTab]}
            onPress={() => setActiveTab('queue')}
          >
            <Icon 
              name="sync" 
              size={20} 
              color={activeTab === 'queue' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'queue' ? styles.activeTabText : styles.inactiveTabText
              ]}
            >
              Sync Queue
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'cache' && styles.activeTab]}
            onPress={() => setActiveTab('cache')}
          >
            <Icon 
              name="database" 
              size={20} 
              color={activeTab === 'cache' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'cache' ? styles.activeTabText : styles.inactiveTabText
              ]}
            >
              Cached Data
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content section */}
      {activeTab === 'queue' && renderQueueTab()}
      {activeTab === 'cache' && renderCacheTab()}
      
      {/* Dialogs */}
      {renderSyncDialog()}
      {renderClearDialog()}
      {renderSettingsDialog()}
      
      {/* Snackbar for messages */}
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setShowSnackbar(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  headerSection: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    paddingBottom: 0
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  screenSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    overflow: 'hidden'
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12
  },
  activeTab: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  tabText: {
    marginLeft: 8
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '500'
  },
  inactiveTabText: {
    color: 'rgba(255, 255, 255, 0.7)'
  },
  tabContent: {
    padding: 16
  },
  bannerText: {
    fontSize: 14
  },
  card: {
    marginTop: 16,
    borderRadius: 8
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 18
  },
  countBadge: {
    backgroundColor: theme.colors.primary
  },
  actionsList: {
    marginTop: 8
  },
  actionItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  actionType: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionTypeText: {
    fontWeight: '500',
    marginLeft: 8
  },
  actionTime: {
    fontSize: 12,
    color: '#666'
  },
  actionDescription: {
    fontSize: 14,
    marginBottom: 8
  },
  actionAmount: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  actionFooter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionStatusChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  actionStatusText: {
    fontSize: 12
  },
  priorityChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    marginLeft: 8
  },
  priorityText: {
    fontSize: 12
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  queueList: {
    marginTop: 8
  },
  queueItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  queueType: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  queueTypeText: {
    fontWeight: '500',
    marginLeft: 8
  },
  queueTime: {
    fontSize: 12,
    color: '#666'
  },
  queueRecipient: {
    flexDirection: 'row',
    marginBottom: 4
  },
  queueLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4
  },
  queueValue: {
    fontSize: 14
  },
  queueContent: {
    marginBottom: 8
  },
  queueMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4
  },
  queueFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  queueStatusChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)'
  },
  retryCount: {
    fontSize: 12,
    color: '#666'
  },
  cacheList: {
    marginTop: 8
  },
  cacheItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  cacheHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cacheType: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cacheTypeText: {
    fontWeight: '500',
    marginLeft: 8
  },
  cacheDetails: {
    flexDirection: 'row',
    marginBottom: 8
  },
  cacheLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4
  },
  cacheValue: {
    fontSize: 14
  },
  cacheStatus: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cacheStatusIcon: {
    marginRight: 4
  },
  cacheStatusText: {
    fontSize: 14
  },
  priorityItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  priorityItem: {
    margin: 4
  },
  priorityItemSelected: {
    backgroundColor: 'rgba(3, 169, 244, 0.1)'
  },
  warningText: {
    color: '#F44336',
    marginTop: 8
  },
  dialogContent: {
    alignItems: 'center'
  },
  syncProgressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12
  },
  syncProgressBar: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 12
  },
  syncProgressStatus: {
    fontSize: 14,
    marginBottom: 8
  },
  syncProgressNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  settingsDialog: {
    maxHeight: '80%'
  },
  settingsScrollArea: {
    paddingHorizontal: 0
  },
  settingsContent: {
    paddingVertical: 8
  },
  settingsPriorityItems: {
    paddingHorizontal: 16
  },
  prioritySettingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  prioritySettingLabel: {
    marginLeft: 8
  }
});

export default OfflineModeSupportScreen;import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  AppState,
  NetInfo
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Avatar,
  Chip,
  Dialog,
  Portal,
  IconButton,
  Snackbar,
  List,
  Badge,
  FAB,
  Banner
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  scheduleNotification,
  queueNotification,
  getLocalNotificationQueue,
  processLocalNotificationQueue,
  setSyncSettings
} from '../../services/notificationQueue';
import {
  markAsPendingSync,
  getOfflineActions,
  syncOfflineActions,
  clearCompletedSyncActions
} from '../../services/offlineSync';
import {
  getMembers,
  saveDataToStorage,
  getDataFromStorage,
  clearStorageData
} from '../../services/storage';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';

// Maximum time data is considered valid without refresh (24 hours)
const DATA_EXPIRY_TIME = 24 * 60 * 60 * 1000;

const OfflineModeSupportScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [pendingSyncActions, setPendingSyncActions] = useState([]);
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [cacheSummary, setCacheSummary] = useState({});
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [syncSettings, setSyncSettingsState] = useState({
    autoSync: true,
    syncOnWifiOnly: false,
    syncInterval: 'hourly', // hourly, daily, manual
    retainDataDays: 7,
    prioritizeSync: {
      payments: true,
      commitments: true,
      messages: false
    }
  });
  const [isDataFresh, setIsDataFresh] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [syncingNow, setSyncingNow] = useState(false);
  const [currentSyncProgress, setCurrentSyncProgress] = useState(0);
  const [showSyncProgressDialog, setShowSyncProgressDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('queue');
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  useEffect(() => {
    checkNetworkStatus();
    loadData();
    
    // Subscribe to app state changes to check network when app comes to foreground
    const appStateSubscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkNetworkStatus();
        loadData();
      }
    });
    
    // Cleanup
    return () => {
      appStateSubscription.remove();
    };
  }, []);
  
  // Check network status
  const checkNetworkStatus = async () => {
    try {
      const connectionInfo = await NetInfo.fetch();
      setIsOnline(connectionInfo.isConnected);
      
      // If we're coming back online and have pending actions, show notification
      if (connectionInfo.isConnected) {
        const actions = await getOfflineActions();
        if (actions.length > 0) {
          setSnackbarMessage('You are back online. Sync your offline actions now.');
          setShowSnackbar(true);
        }
      }
    } catch (error) {
      console.error('Error checking network status:', error);
      setIsOnline(false); // Assume offline if there's an error
    }
  };
  
  const loadData = async () => {
    setLoading(true);
    try {
      // Load last sync time
      const lastSync = await getDataFromStorage('lastSyncTime');
      if (lastSync) {
        setLastSyncTime(new Date(parseInt(lastSync)));
        
        // Check if data is fresh (less than 24 hours old)
        const now = new Date().getTime();
        const syncTime = parseInt(lastSync);
        setIsDataFresh(now - syncTime < DATA_EXPIRY_TIME);
      }
      
      // Load pending sync actions
      const actions = await getOfflineActions();
      setPendingSyncActions(actions);
      
      // Load notification queue
      const queue = await getLocalNotificationQueue();
      setNotificationQueue(queue);
      
      // Load cache summary
      const summary = await getCacheSummary();
      setCacheSummary(summary);
      
      // Load sync settings
      const settings = await getDataFromStorage('syncSettings');
      if (settings) {
        setSyncSettingsState(JSON.parse(settings));
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
      Alert.alert('Error', 'Failed to load offline data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Get summary of cached data
  const getCacheSummary = async () => {
    try {
      // Get size and last updated time for various cached data types
      const members = await getDataFromStorage('cachedMembers');
      const payments = await getDataFromStorage('cachedPayments');
      const commitments = await getDataFromStorage('cachedCommitments');
      const templates = await getDataFromStorage('cachedTemplates');
      
      return {
        members: {
          count: members ? JSON.parse(members).length : 0,
          lastUpdated: await getDataFromStorage('cachedMembersTime')
        },
        payments: {
          count: payments ? JSON.parse(payments).length : 0,
          lastUpdated: await getDataFromStorage('cachedPaymentsTime')
        },
        commitments: {
          count: commitments ? JSON.parse(commitments).length : 0,
          lastUpdated: await getDataFromStorage('cachedCommitmentsTime')
        },
        templates: {
          count: templates ? JSON.parse(templates).length : 0,
          lastUpdated: await getDataFromStorage('cachedTemplatesTime')
        }
      };
    } catch (error) {
      console.error('Error getting cache summary:', error);
      return {};
    }
  };
  
  // Handle sync now
  const handleSync = async () => {
    if (!isOnline) {
      Alert.alert('Offline', 'You are currently offline. Please connect to the internet and try again.');
      return;
    }
    
    setSyncingNow(true);
    setShowSyncProgressDialog(true);
    setCurrentSyncProgress(0);
    
    try {
      // Simulate progress updates (in a real app, you'd get actual progress from the sync service)
      const progressInterval = setInterval(() => {
        setCurrentSyncProgress(prev => {
          const newProgress = prev + 0.1;
          return newProgress > 0.9 ? 0.9 : newProgress;
        });
      }, 500);
      
      // Perform the actual sync
      await syncOfflineActions(actions => {
        // This callback would update UI based on sync progress
        setPendingSyncActions(actions);
      });
      
      // Clear the interval and set progress to 100%
      clearInterval(progressInterval);
      setCurrentSyncProgress(1);
      
      // Update last sync time
      const now = new Date().getTime();
      await saveDataToStorage('lastSyncTime', now.toString());
      setLastSyncTime(new Date(now));
      setIsDataFresh(true);
      
      // Refresh the data
      setTimeout(() => {
        loadData();
        setShowSyncProgressDialog(false);
        setSyncingNow(false);
        
        setSnackbarMessage('Sync completed successfully!');
        setShowSnackbar(true);
      }, 1000); // Give a second to show 100% progress
    } catch (error) {
      console.error('Error syncing data:', error);
      setShowSyncProgressDialog(false);
      setSyncingNow(false);
      Alert.alert('Sync Error', 'Failed to sync data. Please try again.');
    }
  };
  
  // Handle clearing cached data
  const handleClearCache = async () => {
    try {
      await clearStorageData();
      setShowClearDialog(false);
      loadData();
      
      setSnackbarMessage('Cache cleared successfully!');
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error clearing cache:', error);
      Alert.alert('Error', 'Failed to clear cache. Please try again.');
    }
  };
  
  // Handle updating sync settings
  const handleUpdateSyncSettings = async () => {
    try {
      await saveDataToStorage('syncSettings', JSON.stringify(syncSettings));
      await setSyncSettings(syncSettings);
      setShowSettingsDialog(false);
      
      setSnackbarMessage('Sync settings updated!');
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error updating sync settings:', error);
      Alert.alert('Error', 'Failed to update sync settings. Please try again.');
    }
  };
  
  // Handle processing notification queue
  const handleProcessQueue = async () => {
    if (!isOnline) {
      Alert.alert('Offline', 'Notifications can only be processed when online. Please connect to the internet and try again.');
      return;
    }
    
    setLoading(true);
    try {
      await processLocalNotificationQueue();
      
      // Refresh queue
      const queue = await getLocalNotificationQueue();
      setNotificationQueue(queue);
      
      setSnackbarMessage('Notification queue processed!');
      setShowSnackbar(true);
    } catch (error) {
      console.error('Error processing notification queue:', error);
      Alert.alert('Error', 'Failed to process notification queue. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderQueueTab = () => (
    <ScrollView 
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={() => {
            setRefreshing(true);
            loadData();
          }} 
        />
      }
    >
      {/* Status Banner */}
      <Banner
        visible={true}
        icon={({ size }) => 
          <Icon 
            name={isOnline ? "wifi" : "wifi-off"} 
            size={size} 
            color={isOnline ? "#4CAF50" : "#F44336"} 
          />
        }
        actions={[
          {
            label: 'Sync Now',
            onPress: () => handleSync(),
            disabled: !isOnline || pendingSyncActions.length === 0 || syncingNow
          },
        ]}
      >
        <Text style={styles.bannerText}>
          {isOnline ? 'You are online' : 'You are offline'} 
          {isOnline && lastSyncTime && ` • Last sync: ${formatDate(lastSyncTime)}`}
          {!isDataFresh && ' • Data might be outdated'}
        </Text>
      </Banner>
      
      {/* Pending Sync Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Pending Sync Actions</Title>
            <Badge size={24} style={styles.countBadge}>{pendingSyncActions.length}</Badge>
          </View>
          
          {pendingSyncActions.length > 0 ? (
            <View style={styles.actionsList}>
              {pendingSyncActions.map((