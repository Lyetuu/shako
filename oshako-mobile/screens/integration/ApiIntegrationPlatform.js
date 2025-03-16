  const togglePermission = (permissionId) => {
    if (keyPermissions.includes(permissionId)) {
      setKeyPermissions(keyPermissions.filter(id => id !== permissionId));
    } else {
      setKeyPermissions([...keyPermissions, permissionId]);
    }
  };

  const renderApiKeyDialog = () => (
    <Portal>
      <Dialog 
        visible={showApiKeyDialog} 
        onDismiss={() => {
          setShowApiKeyDialog(false);
          setNewApiKey(null);
        }}
      >
        {newApiKey ? (
          <>
            <Dialog.Title>API Key Created</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.apiKeyCopyWarning}>
                Copy this key now. You will not be able to see it again!
              </Text>
              
              <View style={styles.apiKeyContainer}>
                <Text style={styles.apiKeyText}>{newApiKey.key}</Text>
                <Button 
                  icon="content-copy" 
                  onPress={() => handleCopyApiKey(newApiKey.key)}
                >
                  Copy
                </Button>
              </View>
              
              <Text style={styles.apiKeyInfoText}>
                Secret: {newApiKey.secret}
              </Text>
              <Text style={styles.apiKeyInfoText}>
                Created: {formatDate(newApiKey.createdAt)}
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button 
                onPress={() => {
                  setShowApiKeyDialog(false);
                  setNewApiKey(null);
                }}
              >
                Done
              </Button>
            </Dialog.Actions>
          </>
        ) : (
          <>
            <Dialog.Title>Create New API Key</Dialog.Title>
            <Dialog.ScrollArea style={styles.apiKeyScrollArea}>
              <ScrollView>
                <View style={styles.apiKeyFormContent}>
                  <TextInput
                    label="Key Name"
                    value={keyName}
                    onChangeText={setKeyName}
                    style={styles.textInput}
                    placeholder="E.g., Mobile App, Integration"
                  />
                  
                  <Text style={styles.permissionsTitle}>Permissions</Text>
                  <Text style={styles.permissionsSubtitle}>
                    Select what this API key will be allowed to do
                  </Text>
                  
                  <View style={styles.permissionsList}>
                    {apiPermissions.map((permission) => (
                      <List.Item
                        key={permission.id}
                        title={permission.name}
                        description={permission.description}
                        left={props => (
                          <List.Icon 
                            {...props} 
                            icon={
                              permission.id.startsWith('read') ? 'eye' : 
                              permission.id.startsWith('write') ? 'pencil' : 
                              'key'
                            } 
                          />
                        )}
                        right={props => (
                          <Switch
                            value={keyPermissions.includes(permission.id)}
                            onValueChange={() => togglePermission(permission.id)}
                            color={theme.colors.primary}
                          />
                        )}
                        style={styles.permissionItem}
                      />
                    ))}
                  </View>
                </View>
              </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={() => setShowApiKeyDialog(false)}>Cancel</Button>
              <Button onPress={handleCreateApiKey}>Create</Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );

  const renderBankDialog = () => (
    <Portal>
      <Dialog visible={showBankDialog} onDismiss={() => setShowBankDialog(false)}>
        <Dialog.Title>Connect Bank Account</Dialog.Title>
        <Dialog.ScrollArea style={styles.bankScrollArea}>
          <ScrollView>
            <View style={styles.bankDialogContent}>
              <Text style={styles.bankSelectionTitle}>Select Your Bank</Text>
              <View style={styles.bankOptions}>
                {bankOptions.map((bank) => (
                  <TouchableOpacity
                    key={bank.id}
                    style={[
                      styles.bankOption,
                      selectedBank?.id === bank.id && styles.selectedBankOption
                    ]}
                    onPress={() => setSelectedBank(bank)}
                  >
                    <Icon name="bank" size={28} color="#666" style={styles.bankIcon} />
                    <Text style={styles.bankName}>{bank.name}</Text>
                    {selectedBank?.id === bank.id && (
                      <Icon name="check-circle" size={24} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              {selectedBank && (
                <View style={styles.bankCredentialsSection}>
                  <Text style={styles.bankCredentialsTitle}>
                    Enter your {selectedBank.name} credentials
                  </Text>
                  
                  <TextInput
                    label="Username"
                    value={bankCredentials.username}
                    onChangeText={(text) => setBankCredentials({...bankCredentials, username: text})}
                    style={styles.textInput}
                  />
                  
                  <TextInput
                    label="Password"
                    value={bankCredentials.password}
                    onChangeText={(text) => setBankCredentials({...bankCredentials, password: text})}
                    secureTextEntry
                    style={styles.textInput}
                  />
                  
                  <View style={styles.bankSecurityNote}>
                    <Icon name="shield-check" size={20} color="#4CAF50" style={styles.securityIcon} />
                    <Text style={styles.securityText}>
                      Your credentials are encrypted and securely stored. We use read-only access for your protection.
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowBankDialog(false)}>Cancel</Button>
          <Button 
            onPress={handleConnectBank}
            disabled={!selectedBank || !bankCredentials.username || !bankCredentials.password}
          >
            Connect
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderAccountingDialog = () => (
    <Portal>
      <Dialog visible={showAccountingDialog} onDismiss={() => setShowAccountingDialog(false)}>
        <Dialog.Title>Connect Accounting Software</Dialog.Title>
        <Dialog.ScrollArea style={styles.accountingScrollArea}>
          <ScrollView>
            <View style={styles.accountingDialogContent}>
              <Text style={styles.accountingSelectionTitle}>Select Your Accounting Software</Text>
              <View style={styles.accountingOptions}>
                {accountingOptions.map((software) => (
                  <TouchableOpacity
                    key={software.id}
                    style={[
                      styles.accountingOption,
                      selectedAccounting?.id === software.id && styles.selectedAccountingOption
                    ]}
                    onPress={() => setSelectedAccounting(software)}
                  >
                    <Icon name="calculator-variant" size={28} color="#666" style={styles.accountingIcon} />
                    <Text style={styles.accountingName}>{software.name}</Text>
                    {selectedAccounting?.id === software.id && (
                      <Icon name="check-circle" size={24} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              {selectedAccounting && (
                <View style={styles.accountingCredentialsSection}>
                  <Text style={styles.accountingCredentialsTitle}>
                    Enter your {selectedAccounting.name} API credentials
                  </Text>
                  
                  <TextInput
                    label="API Key"
                    value={accountingCredentials.apiKey}
                    onChangeText={(text) => setAccountingCredentials({...accountingCredentials, apiKey: text})}
                    style={styles.textInput}
                  />
                  
                  <TextInput
                    label="Organization ID"
                    value={accountingCredentials.organization}
                    onChangeText={(text) => setAccountingCredentials({...accountingCredentials, organization: text})}
                    style={styles.textInput}
                  />
                  
                  <TouchableOpacity
                    style={styles.findCredentialsLink}
                    onPress={() => Linking.openURL(`https://example.com/${selectedAccounting.name.toLowerCase()}-api-docs`)}
                  >
                    <Text style={styles.findCredentialsText}>
                      How to find your {selectedAccounting.name} API credentials
                    </Text>
                    <Icon name="open-in-new" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowAccountingDialog(false)}>Cancel</Button>
          <Button 
            onPress={handleConnectAccounting}
            disabled={!selectedAccounting || !accountingCredentials.apiKey || !accountingCredentials.organization}
          >
            Connect
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderOpenApiTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* API Documentation Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Open API Documentation</Title>
          <Paragraph style={styles.apiDescription}>
            Build custom integrations with our Open API. Access your group savings data programmatically.
          </Paragraph>
          
          <View style={styles.apiDocLinks}>
            <Button 
              mode="contained" 
              icon="code-tags"
              onPress={() => Linking.openURL('https://example.com/api-docs')}
              style={styles.apiDocButton}
            >
              API Reference
            </Button>
            
            <Button 
              mode="outlined" 
              icon="code-not-equal-variant"
              onPress={() => Linking.openURL('https://example.com/api-examples')}
              style={styles.apiDocButton}
            >
              Code Examples
            </Button>
            
            <Button 
              mode="outlined" 
              icon="school"
              onPress={() => Linking.openURL('https://example.com/api-tutorials')}
              style={styles.apiDocButton}
            >
              Tutorials
            </Button>
          </View>
        </Card.Content>
      </Card>
      
      {/* API Keys Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.apiKeysHeader}>
            <Title style={styles.cardTitle}>API Keys</Title>
            <Button 
              mode="contained" 
              icon="key-plus"
              onPress={() => setShowApiKeyDialog(true)}
            >
              Create Key
            </Button>
          </View>
          
          {apiKeys.length > 0 ? (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Permissions</DataTable.Title>
                <DataTable.Title>Created</DataTable.Title>
                <DataTable.Title>Status</DataTable.Title>
                <DataTable.Title numeric>Actions</DataTable.Title>
              </DataTable.Header>
              
              {apiKeys.map((key) => (
                <DataTable.Row key={key.id}>
                  <DataTable.Cell>{key.name}</DataTable.Cell>
                  <DataTable.Cell>
                    <View style={styles.keyPermissionsContainer}>
                      {key.permissions.length > 2 ? (
                        <Text>{key.permissions.length} permissions</Text>
                      ) : (
                        key.permissions.map((permission, index) => (
                          <Text key={index} style={styles.keyPermission}>
                            {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            {index < key.permissions.length - 1 ? ', ' : ''}
                          </Text>
                        ))
                      )}
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell>{formatDate(key.createdAt)}</DataTable.Cell>
                  <DataTable.Cell>
                    <Chip 
                      style={[
                        styles.statusChip,
                        { backgroundColor: key.active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)' }
                      ]}
                    >
                      {key.active ? 'Active' : 'Revoked'}
                    </Chip>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <View style={styles.keyActions}>
                      <Button 
                        icon="information"
                        compact
                        onPress={() => navigation.navigate('ApiKeyDetails', { keyId: key.id })}
                      />
                      {key.active && (
                        <Button 
                          icon="delete"
                          compact
                          onPress={() => Alert.alert(
                            'Revoke API Key',
                            'Are you sure you want to revoke this API key? This action cannot be undone.',
                            [
                              { text: 'Cancel' },
                              { 
                                text: 'Revoke', 
                                onPress: () => handleRevokeApiKey(key.id),
                                style: 'destructive'
                              }
                            ]
                          )}
                        />
                      )}
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          ) : (
            <View style={styles.emptyApiKeys}>
              <Icon name="key-variant" size={48} color="#9E9E9E" />
              <Text style={styles.emptyApiKeysTitle}>No API Keys</Text>
              <Text style={styles.emptyApiKeysText}>
                Create an API key to start building integrations with your group's data
              </Text>
              <Button 
                mode="contained" 
                icon="key-plus"
                onPress={() => setShowApiKeyDialog(true)}
                style={styles.emptyApiKeysButton}
              >
                Create API Key
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Webhook Configuration Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Webhook Configuration</Title>
          <Paragraph style={styles.webhookDescription}>
            Set up webhooks to receive real-time notifications when certain events occur in your group.
          </Paragraph>
          
          <Button 
            mode="contained" 
            icon="webhook"
            onPress={() => navigation.navigate('WebhookConfiguration')}
            style={styles.webhookButton}
          >
            Configure Webhooks
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderBankingTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Bank Connections Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.bankConnectionsHeader}>
            <Title style={styles.cardTitle}>Connected Banks</Title>
            <Button 
              mode="contained" 
              icon="bank-plus"
              onPress={() => setShowBankDialog(true)}
            >
              Connect Bank
            </Button>
          </View>
          
          {bankConnections.length > 0 ? (
            <View style={styles.bankConnectionsList}>
              {bankConnections.map((connection) => (
                <Card key={connection.id} style={styles.bankConnectionCard}>
                  <Card.Content>
                    <View style={styles.bankConnectionHeader}>
                      <View style={styles.bankConnectionInfo}>
                        <Icon name="bank" size={30} color="#666" style={styles.bankConnectionIcon} />
                        <View>
                          <Text style={styles.bankConnectionName}>{connection.bankName}</Text>
                          <Text style={styles.bankConnectionAccount}>{connection.accountNumber}</Text>
                        </View>
                      </View>
                      <Chip 
                        style={[
                          styles.connectionStatusChip,
                          { 
                            backgroundColor: 
                              connection.status === 'active' ? 'rgba(76, 175, 80, 0.1)' :
                              connection.status === 'pending' ? 'rgba(255, 193, 7, 0.1)' :
                              'rgba(244, 67, 54, 0.1)'
                          }
                        ]}
                      >
                        {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                      </Chip>
                    </View>
                    
                    <View style={styles.bankConnectionDetails}>
                      <View style={styles.bankConnectionDetail}>
                        <Text style={styles.detailLabel}>Last Synced:</Text>
                        <Text style={styles.detailValue}>{formatDate(connection.lastSynced)}</Text>
                      </View>
                      
                      <View style={styles.bankConnectionDetail}>
                        <Text style={styles.detailLabel}>Access Level:</Text>
                        <Text style={styles.detailValue}>{connection.accessLevel}</Text>
                      </View>
                    </View>
                    
                    {connection.status === 'error' && (
                      <View style={styles.connectionError}>
                        <Icon name="alert-circle" size={20} color="#F44336" style={styles.errorIcon} />
                        <Text style={styles.errorText}>{connection.errorMessage}</Text>
                      </View>
                    )}
                  </Card.Content>
                  <Card.Actions>
                    <Button 
                      icon="sync" 
                      onPress={() => Alert.alert('Sync', 'Syncing bank data...')}
                    >
                      Sync Now
                    </Button>
                    <Button 
                      icon="cog" 
                      onPress={() => navigation.navigate('BankConnectionSettings', { connectionId: connection.id })}
                    >
                      Settings
                    </Button>
                    <Button 
                      icon="link-off" 
                      onPress={() => Alert.alert(
                        'Disconnect Bank',
                        'Are you sure you want to disconnect this bank? You will need to reconnect to sync data again.',
                        [
                          { text: 'Cancel' },
                          { 
                            text: 'Disconnect', 
                            onPress: () => handleDisconnectBank(connection.id),
                            style: 'destructive'
                          }
                        ]
                      )}
                    >
                      Disconnect
                    </Button>
                  </Card.Actions>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.emptyBankConnections}>
              <Icon name="bank-outline" size={48} color="#9E9E9E" />
              <Text style={styles.emptyBankTitle}>No Connected Banks</Text>
              <Text style={styles.emptyBankText}>
                Connect your bank account to automatically track deposits and withdrawals
              </Text>
              <Button 
                mode="contained" 
                icon="bank-plus"
                onPress={() => setShowBankDialog(true)}
                style={styles.emptyBankButton}
              >
                Connect Bank
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Bank Integration Benefits Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Banking Integration Benefits</Title>
          
          <List.Item
            title="Automatic Transaction Tracking"
            description="Automatically record deposits and withdrawals in your group"
            left={props => <List.Icon {...props} icon="bank-transfer" color="#2196F3" />}
            style={styles.benefitItem}
          />
          
          <Divider />
          
          <List.Item
            title="Real-time Balance Updates"
            description="Always know your group's current balance"
            left={props => <List.Icon {...props} icon="clock-fast" color="#4CAF50" />}
            style={styles.benefitItem}
          />
          
          <Divider />
          
          <List.Item
            title="Simplified Reconciliation"
            description="Easily match transactions with your records"
            left={props => <List.Icon {...props} icon="check-all" color="#FF9800" />}
            style={styles.benefitItem}
          />
          
          <Divider />
          
          <List.Item
            title="Enhanced Security"
            description="Read-only access keeps your funds secure"
            left={props => <List.Icon {...props} icon="shield-check" color="#9C27B0" />}
            style={styles.benefitItem}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );

  const renderAccountingTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Accounting Software Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.accountingHeader}>
            <Title style={styles.cardTitle}>Accounting Software</Title>
            <Button 
              mode="contained" 
              icon="plus"
              onPress={() => setShowAccountingDialog(true)}
            >
              Connect Software
            </Button>
          </View>
          
          {accountingSoftware.length > 0 ? (
            <View style={styles.accountingSoftwareList}>
              {accountingSoftware.map((software) => (
                <Card key={software.id} style={styles.accountingSoftwareCard}>
                  <Card.Content>
                    <View style={styles.accountingSoftwareHeader}>
                      <View style={styles.accountingSoftwareInfo}>
                        <Icon name="calculator-variant" size={30} color="#666" style={styles.accountingSoftwareIcon} />
                        <View>
                          <Text style={styles.accountingSoftwareName}>{software.name}</Text>
                          <Text style={styles.accountingSoftwareOrg}>{software.organization}</Text>
                        </View>
                      </View>
                      <Chip 
                        style={[
                          styles.accountingStatusChip,
                          { 
                            backgroundColor: 
                              software.status === 'active' ? 'rgba(76, 175, 80, 0.1)' :
                              software.status === 'pending' ? 'rgba(255, 193, 7, 0.1)' :
                              'rgba(244, 67, 54, 0.1)'
                          }
                        ]}
                      >
                        {software.status.charAt(0).toUpperCase() + software.status.slice(1)}
                      </Chip>
                    </View>
                    
                    <View style={styles.accountingSyncInfo}>
                      <View style={styles.syncInfoItem}>
                        <Text style={styles.syncInfoLabel}>Last Sync:</Text>
                        <Text style={styles.syncInfoValue}>{formatDate(software.lastSynced)}</Text>
                      </View>
                      
                      <View style={styles.syncInfoItem}>
                        <Text style={styles.syncInfoLabel}>Sync Frequency:</Text>
                        <Text style={styles.syncInfoValue}>{software.syncFrequency}</Text>
                      </View>
                      
                      <View style={styles.syncInfoItem}>
                        <Text style={styles.syncInfoLabel}>Synced Items:</Text>
                        <Text style={styles.syncInfoValue}>{software.syncedItems.join(', ')}</Text>
                      </View>
                    </View>
                    
                    {software.status === 'error' && (
                      <View style={styles.softwareError}>
                        <Icon name="alert-circle" size={20} color="#F44336" style={styles.errorIcon} />
                        <Text style={styles.errorText}>{software.errorMessage}</Text>
                      </View>
                    )}
                  </Card.Content>
                  <Card.Actions>
                    <Button 
                      icon="sync" 
                      onPress={() => Alert.alert('Sync', 'Syncing accounting data...')}
                    >
                      Sync Now
                    </Button>
                    <Button 
                      icon="cog" 
                      onPress={() => navigation.navigate('AccountingSoftwareSettings', { softwareId: software.id })}
                    >
                      Settings
                    </Button>
                    <Button 
                      icon="link-off" 
                      onPress={() => Alert.alert(
                        'Disconnect Software',
                        'Are you sure you want to disconnect this accounting software?',
                        [
                          { text: 'Cancel' },
                          { 
                            text: 'Disconnect', 
                            onPress: () => console.log('Disconnect software', software.id),
                            style: 'destructive'
                          }
                        ]
                      )}
                    >
                      Disconnect
                    </Button>
                  </Card.Actions>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.emptyAccountingSoftware}>
              <Icon name="calculator-variant-outline" size={48} color="#9E9E9E" />
              <Text style={styles.emptyAccountingTitle}>No Connected Software</Text>
              <Text style={styles.emptyAccountingText}>
                Connect your accounting software to sync financial data and simplify bookkeeping
              </Text>
              <Button 
                mode="contained" 
                icon="plus"
                onPress={() => setShowAccountingDialog(true)}
                style={styles.emptyAccountingButton}
              >
                Connect Software
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
      
      {/* Accounting Integration Benefits Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Accounting Integration Benefits</Title>
          
          <List.Item
            title="Automatic Data Sync"
            description="Eliminate manual data entry and reduce errors"
            left={props => <List.Icon {...props} icon="sync" color="#2196F3" />}
            style={styles.benefitItem}
          />
          
          <Divider />
          
          <List.Item
            title="Streamlined Bookkeeping"
            description="Keep your books up-to-date with minimal effort"
            left={props => <List.Icon {...props} icon="book-open-page-variant" color="#4CAF50" />}
            style={styles.benefitItem}
          />
          
          <Divider />
          
          <List.Item
            title="Simplified Tax Preparation"
            description="Make tax time easier with organized financial data"
            left={props => <List.Icon {...props} icon="file-document" color="#FF9800" />}
            style={styles.benefitItem}
          />
          
          <Divider />
          
          <List.Item
            title="Better Financial Insights"
            description="Access detailed reports and analytics"
            left={props => <List.Icon {...props} icon="chart-bar" color="#9C27B0" />}
            style={styles.benefitItem}
          />
        </Card.Content>
      </Card>
      
      {/* Chart of Accounts Mapping Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Chart of Accounts Mapping</Title>
          <Paragraph style={styles.chartAccountsDescription}>
            Configure how transactions are categorized in your accounting software
          </Paragraph>
          
          <Button 
            mode="contained" 
            icon="clipboard-list"
            onPress={() => navigation.navigate('ChartOfAccountsMapping')}
            style={styles.chartAccountsButton}
          >
            Configure Mapping
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading integration data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>API & Integrations</Text>
        <Text style={styles.headerSubtitle}>Connect with external services</Text>
      </View>
      
      {/* Tab Menu */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'openapi' && styles.activeTab]}
          onPress={() => setActiveTab('openapi')}
        >
          <Icon 
            name="api" 
            size={24} 
            color={activeTab === 'openapi' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'openapi' && styles.activeTabText
            ]}
          >
            Open API
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'banking' && styles.activeTab]}
          onPress={() => setActiveTab('banking')}
        >
          <Icon 
            name="bank" 
            size={24} 
            color={activeTab === 'banking' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'banking' && styles.activeTabText
            ]}
          >
            Banking
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'accounting' && styles.activeTab]}
          onPress={() => setActiveTab('accounting')}
        >
          <Icon 
            name="calculator-variant" 
            size={24} 
            color={activeTab === 'accounting' ? theme.colors.primary : '#666'} 
          />
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'accounting' && styles.activeTabText
            ]}
          >
            Accounting
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      {activeTab === 'openapi' && renderOpenApiTab()}
      {activeTab === 'banking' && renderBankingTab()}
      {activeTab === 'accounting' && renderAccountingTab()}
      
      {/* Dialogs */}
      {renderApiKeyDialog()}
      {renderBankDialog()}
      {renderAccountingDialog()}
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
  header: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    paddingTop: 48,
    paddingBottom: 16
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666'
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  tabContent: {
    padding: 16
  },
  card: {
    marginBottom: 16,
    borderRadius: 8
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8
  },
  apiDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  apiDocLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  apiDocButton: {
    marginRight: 8,
    marginBottom: 8
  },
  apiKeysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  keyPermissionsContainer: {
    maxWidth: 150
  },
  keyPermission: {
    fontSize: 12
  },
  statusChip: {
    height: 24,
    justifyContent: 'center'
  },
  keyActions: {
    flexDirection: 'row'
  },
  emptyApiKeys: {
    alignItems: 'center',
    padding: 24
  },
  emptyApiKeysTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8
  },
  emptyApiKeysText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  emptyApiKeysButton: {
    marginTop: 8
  },
  webhookDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  webhookButton: {
    alignSelf: 'flex-start'
  },
  bankConnectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  bankConnectionsList: {
    marginTop: 8
  },
  bankConnectionCard: {
    marginBottom: 12
  },
  bankConnectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  bankConnectionInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bankConnectionIcon: {
    marginRight: 12
  },
  bankConnectionName: {
    fontSize: 16,
    fontWeight: '500'
  },
  bankConnectionAccount: {
    fontSize: 14,
    color: '#666'
  },
  connectionStatusChip: {
    height: 24,
    justifyContent: 'center'
  },
  bankConnectionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  bankConnectionDetail: {
    flexDirection: 'row',
    width: '50%',
    marginBottom: 4
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  connectionError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 8,
    borderRadius: 4,
    marginTop: 8
  },
  errorIcon: {
    marginRight: 8
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
    flex: 1
  },
  emptyBankConnections: {
    alignItems: 'center',
    padding: 24
  },
  emptyBankTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8
  },
  emptyBankText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  emptyBankButton: {
    marginTop: 8
  },
  benefitItem: {
    paddingVertical: 8
  },
  accountingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  accountingSoftwareList: {
    marginTop: 8
  },
  accountingSoftwareCard: {
    marginBottom: 12
  },
  accountingSoftwareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  accountingSoftwareInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  accountingSoftwareIcon: {
    marginRight: 12
  },
  accountingSoftwareName: {
    fontSize: 16,
    fontWeight: '500'
  },
  accountingSoftwareOrg: {
    fontSize: 14,
    color: '#666'
  },
  accountingStatusChip: {
    height: 24,
    justifyContent: 'center'
  },
  accountingSyncInfo: {
    marginBottom: 12
  },
  syncInfoItem: {
    flexDirection: 'row',
    marginBottom: 4
  },
  syncInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
    width: 120
  },
  syncInfoValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  softwareError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 8,
    borderRadius: 4,
    marginTop: 8
  },
  emptyAccountingSoftware: {
    alignItems: 'center',
    padding: 24
  },
  emptyAccountingTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8
  },
  emptyAccountingText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  emptyAccountingButton: {
    marginTop: 8
  },
  chartAccountsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  chartAccountsButton: {
    alignSelf: 'flex-start'
  },
  apiKeyScrollArea: {
    maxHeight: 400
  },
  apiKeyFormContent: {
    paddingVertical: 8
  },
  textInput: {
    marginBottom: 16
  },
  permissionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4
  },
  permissionsSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12
  },
  permissionsList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8
  },
  permissionItem: {
    paddingVertical: 4
  },
  apiKeyCopyWarning: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
    marginBottom: 16
  },
  apiKeyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  apiKeyText: {
    fontSize: 14,
    fontFamily: 'monospace',
    flex: 1,
    marginRight: 8
  },
  apiKeyInfoText: {
    fontSize: 14,
    marginBottom: 4
  },
  bankScrollArea: {
    maxHeight: 400
  },
  bankDialogContent: {
    paddingVertical: 8
  },
  bankSelectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  bankOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  bankOption: {
    width: '48%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    marginRight: '4%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedBankOption: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  },
  bankIcon: {
    marginRight: 8
  },
  bankName: {
    fontSize: 14,
    flex: 1
  },
  bankCredentialsSection: {
    marginTop: 8
  },
  bankCredentialsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  bankSecurityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16
  },
  securityIcon: {
    marginRight: 8
  },
  securityText: {
    fontSize: 14,
    color: '#4CAF50',
    flex: 1
  },
  accountingScrollArea: {
    maxHeight: 400
  },
  accountingDialogContent: {
    paddingVertical: 8
  },
  accountingSelectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  accountingOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  accountingOption: {
    width: '48%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    marginRight: '4%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedAccountingOption: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(33, 150, 243, 0.05)'
  },
  accountingIcon: {
    marginRight: 8
  },
  accountingName: {
    fontSize: 14,
    flex: 1
  },
  accountingCredentialsSection: {
    marginTop: 8
  },
  accountingCredentialsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  findCredentialsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  findCredentialsText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 4
  }
});

export default ApiIntegrationPlatform;import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Clipboard,
  Linking
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  List,
  ProgressBar,
  Portal,
  Dialog,
  TextInput,
  Chip,
  DataTable
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import {
  getApiKeys,
  getBankConnections,
  getAccountingSoftware,
  createApiKey,
  revokeApiKey,
  connectBank,
  disconnectBank,
  syncAccountingSoftware
} from '../../services/api/integration';
import { formatDate } from '../../utils/formatters';

const ApiIntegrationPlatform = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('openapi');
  const [apiKeys, setApiKeys] = useState([]);
  const [bankConnections, setBankConnections] = useState([]);
  const [accountingSoftware, setAccountingSoftware] = useState([]);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [showAccountingDialog, setShowAccountingDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState(null);
  const [keyName, setKeyName] = useState('');
  const [keyPermissions, setKeyPermissions] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedAccounting, setSelectedAccounting] = useState(null);
  const [bankCredentials, setBankCredentials] = useState({
    username: '',
    password: ''
  });
  const [accountingCredentials, setAccountingCredentials] = useState({
    apiKey: '',
    organization: ''
  });
  
  const navigation = useNavigation();
  const { user } = useAuth();
  
  const bankOptions = [
    { id: 'bank1', name: 'First National Bank', logo: 'https://example.com/bank1.png' },
    { id: 'bank2', name: 'Community Trust', logo: 'https://example.com/bank2.png' },
    { id: 'bank3', name: 'Digital Credit Union', logo: 'https://example.com/bank3.png' },
    { id: 'bank4', name: 'Village Microfinance', logo: 'https://example.com/bank4.png' }
  ];
  
  const accountingOptions = [
    { id: 'accounting1', name: 'QuickBooks', logo: 'https://example.com/quickbooks.png' },
    { id: 'accounting2', name: 'Xero', logo: 'https://example.com/xero.png' },
    { id: 'accounting3', name: 'Wave', logo: 'https://example.com/wave.png' },
    { id: 'accounting4', name: 'Tally', logo: 'https://example.com/tally.png' }
  ];
  
  const apiPermissions = [
    { id: 'read_group', name: 'Read Group Data', description: 'View group information and activity' },
    { id: 'read_transactions', name: 'Read Transactions', description: 'View transaction history' },
    { id: 'read_members', name: 'Read Members', description: 'View member information' },
    { id: 'write_transactions', name: 'Create Transactions', description: 'Create new transactions' },
    { id: 'write_members', name: 'Manage Members', description: 'Add or update members' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch API keys
      const keys = await getApiKeys(user.id);
      setApiKeys(keys);
      
      // Fetch bank connections
      const banks = await getBankConnections(user.id);
      setBankConnections(banks);
      
      // Fetch accounting software
      const accounting = await getAccountingSoftware(user.id);
      setAccountingSoftware(accounting);
    } catch (error) {
      console.error('Error fetching integration data:', error);
      Alert.alert('Error', 'Failed to load integration data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async () => {
    try {
      if (!keyName.trim()) {
        Alert.alert('Error', 'Please enter a key name.');
        return;
      }
      
      if (keyPermissions.length === 0) {
        Alert.alert('Error', 'Please select at least one permission.');
        return;
      }
      
      // In a real app, this would create a new API key
      const apiKey = await createApiKey(user.id, {
        name: keyName,
        permissions: keyPermissions
      });
      
      // Show the new API key to the user
      setNewApiKey(apiKey);
      
      // Reset form
      setKeyName('');
      setKeyPermissions([]);
      
      // Refresh API keys list
      const keys = await getApiKeys(user.id);
      setApiKeys(keys);
    } catch (error) {
      console.error('Error creating API key:', error);
      Alert.alert('Error', 'Failed to create API key. Please try again.');
    }
  };

  const handleRevokeApiKey = async (keyId) => {
    try {
      // In a real app, this would revoke the API key
      await revokeApiKey(keyId);
      
      // Refresh API keys list
      const keys = await getApiKeys(user.id);
      setApiKeys(keys);
      
      Alert.alert('Success', 'API key revoked successfully.');
    } catch (error) {
      console.error('Error revoking API key:', error);
      Alert.alert('Error', 'Failed to revoke API key. Please try again.');
    }
  };

  const handleCopyApiKey = (key) => {
    Clipboard.setString(key);
    Alert.alert('Success', 'API key copied to clipboard.');
  };

  const handleConnectBank = async () => {
    try {
      if (!selectedBank) {
        Alert.alert('Error', 'Please select a bank.');
        return;
      }
      
      if (!bankCredentials.username.trim() || !bankCredentials.password.trim()) {
        Alert.alert('Error', 'Please enter your bank credentials.');
        return;
      }
      
      // In a real app, this would connect the bank
      await connectBank(user.id, {
        bankId: selectedBank.id,
        credentials: bankCredentials
      });
      
      // Reset form and close dialog
      setSelectedBank(null);
      setBankCredentials({
        username: '',
        password: ''
      });
      setShowBankDialog(false);
      
      // Refresh bank connections list
      const banks = await getBankConnections(user.id);
      setBankConnections(banks);
      
      Alert.alert('Success', 'Bank connected successfully.');
    } catch (error) {
      console.error('Error connecting bank:', error);
      Alert.alert('Error', 'Failed to connect bank. Please try again.');
    }
  };

  const handleDisconnectBank = async (connectionId) => {
    try {
      // In a real app, this would disconnect the bank
      await disconnectBank(connectionId);
      
      // Refresh bank connections list
      const banks = await getBankConnections(user.id);
      setBankConnections(banks);
      
      Alert.alert('Success', 'Bank disconnected successfully.');
    } catch (error) {
      console.error('Error disconnecting bank:', error);
      Alert.alert('Error', 'Failed to disconnect bank. Please try again.');
    }
  };

  const handleConnectAccounting = async () => {
    try {
      if (!selectedAccounting) {
        Alert.alert('Error', 'Please select an accounting software.');
        return;
      }
      
      if (!accountingCredentials.apiKey.trim() || !accountingCredentials.organization.trim()) {
        Alert.alert('Error', 'Please enter your accounting credentials.');
        return;
      }
      
      // In a real app, this would connect the accounting software
      await syncAccountingSoftware(user.id, {
        softwareId: selectedAccounting.id,
        credentials: accountingCredentials
      });
      
      // Reset form and close dialog
      setSelectedAccounting(null);
      setAccountingCredentials({
        apiKey: '',
        organization: ''
      });
      setShowAccountingDialog(false);
      
      // Refresh accounting software list
      const accounting = await getAccountingSoftware(user.id);
      setAccountingSoftware(accounting);
      
      Alert.alert('Success', 'Accounting software connected successfully.');
    } catch (error) {
      console.error('Error connecting accounting software:', error);
      Alert.alert('Error', 'Failed to connect accounting software. Please try again.');
    }
  };

  const togglePermission = (permissionId) => {
    if (keyPermissions.includes(permissionId)) {
      set