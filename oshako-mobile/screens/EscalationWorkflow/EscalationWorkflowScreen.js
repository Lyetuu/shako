                      <View 
                        style={[
                          styles.stepTypeIcon, 
                          { backgroundColor: config.color }
                        ]}
                      >
                        <Icon name={config.icon} size={20} color="#fff" />
                      </View>
                      <Text style={styles.stepTypeName}>{config.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <Button
                  mode="text"
                  icon="palette"
                  onPress={handleTemplateMenu}
                >
                  Use Template
                </Button>
                
                <Menu
                  visible={showTemplateMenu}
                  onDismiss={() => setShowTemplateMenu(false)}
                  anchor={menuPosition}
                >
                  {stepTemplates.map((template, index) => (
                    <Menu.Item
                      key={index}
                      title={template.name}
                      onPress={() => handleUseTemplate(template)}
                      leadingIcon={STEP_TYPES[template.type]?.icon || 'alert-circle'}
                    />
                  ))}
                </Menu>
              </View>
              
              <Divider style={styles.formDivider} />
              
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>
                  Days After Previous Step
                </Text>
                <TextInput
                  mode="outlined"
                  value={stepForm.days.toString()}
                  onChangeText={(text) => setStepForm({ ...stepForm, days: text })}
                  keyboardType="numeric"
                  style={styles.daysInput}
                  dense
                />
              </View>
              
              {stepForm.type !== 'pause' && (
                <>
                  <Text style={styles.formLabel}>Communication Channels</Text>
                  <View style={styles.channelsSelector}>
                    {CHANNELS.map((channel) => (
                      <TouchableOpacity
                        key={channel.id}
                        style={[
                          styles.channelOption,
                          stepForm.channels.includes(channel.id) && styles.channelSelected
                        ]}
                        onPress={() => {
                          const channels = stepForm.channels.includes(channel.id)
                            ? stepForm.channels.filter(c => c !== channel.id)
                            : [...stepForm.channels, channel.id];
                          setStepForm({ ...stepForm, channels });
                        }}
                      >
                        <Icon 
                          name={channel.icon} 
                          size={24} 
                          color={stepForm.channels.includes(channel.id) ? theme.colors.primary : '#888'} 
                        />
                        <Text 
                          style={[
                            styles.channelOptionText,
                            stepForm.channels.includes(channel.id) && styles.channelSelectedText
                          ]}
                        >
                          {channel.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <TextInput
                    mode="outlined"
                    label="Message Template (Optional)"
                    value={stepForm.message}
                    onChangeText={(text) => setStepForm({ ...stepForm, message: text })}
                    multiline
                    numberOfLines={4}
                    style={styles.messageInput}
                    placeholder="Leave blank to use default message templates"
                  />
                </>
              )}
              
              <View style={styles.approvalSwitch}>
                <Text style={styles.approvalLabel}>Requires Admin Approval</Text>
                <Switch
                  value={stepForm.requiresApproval}
                  onValueChange={(value) => setStepForm({ ...stepForm, requiresApproval: value })}
                />
              </View>
              
              {stepForm.requiresApproval && (
                <HelperText>
                  This step will require manual approval from an admin before proceeding
                </HelperText>
              )}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowAddStepDialog(false)}>
            Cancel
          </Button>
          <Button mode="contained" onPress={confirmAddStep}>
            Add Step
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderEditStepDialog = () => (
    <Portal>
      <Dialog
        visible={showEditStepDialog}
        onDismiss={() => setShowEditStepDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Edit Escalation Step</Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <ScrollView>
            <View style={styles.dialogContent}>
              <View style={styles.stepTypeSelector}>
                <Text style={styles.selectorLabel}>Step Type</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.stepTypeScroll}
                >
                  {Object.entries(STEP_TYPES).map(([type, config]) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.stepTypeOption,
                        stepForm.type === type && styles.stepTypeSelected,
                        { borderColor: stepForm.type === type ? config.color : '#ddd' }
                      ]}
                      onPress={() => setStepForm({ ...stepForm, type })}
                    >
                      <View 
                        style={[
                          styles.stepTypeIcon, 
                          { backgroundColor: config.color }
                        ]}
                      >
                        <Icon name={config.icon} size={20} color="#fff" />
                      </View>
                      <Text style={styles.stepTypeName}>{config.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <Divider style={styles.formDivider} />
              
              <View style={styles.formRow}>
                <Text style={styles.formLabel}>
                  Days After Previous Step
                </Text>
                <TextInput
                  mode="outlined"
                  value={stepForm.days.toString()}
                  onChangeText={(text) => setStepForm({ ...stepForm, days: text })}
                  keyboardType="numeric"
                  style={styles.daysInput}
                  dense
                />
              </View>
              
              {stepForm.type !== 'pause' && (
                <>
                  <Text style={styles.formLabel}>Communication Channels</Text>
                  <View style={styles.channelsSelector}>
                    {CHANNELS.map((channel) => (
                      <TouchableOpacity
                        key={channel.id}
                        style={[
                          styles.channelOption,
                          stepForm.channels.includes(channel.id) && styles.channelSelected
                        ]}
                        onPress={() => {
                          const channels = stepForm.channels.includes(channel.id)
                            ? stepForm.channels.filter(c => c !== channel.id)
                            : [...stepForm.channels, channel.id];
                          setStepForm({ ...stepForm, channels });
                        }}
                      >
                        <Icon 
                          name={channel.icon} 
                          size={24} 
                          color={stepForm.channels.includes(channel.id) ? theme.colors.primary : '#888'} 
                        />
                        <Text 
                          style={[
                            styles.channelOptionText,
                            stepForm.channels.includes(channel.id) && styles.channelSelectedText
                          ]}
                        >
                          {channel.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <TextInput
                    mode="outlined"
                    label="Message Template (Optional)"
                    value={stepForm.message}
                    onChangeText={(text) => setStepForm({ ...stepForm, message: text })}
                    multiline
                    numberOfLines={4}
                    style={styles.messageInput}
                    placeholder="Leave blank to use default message templates"
                  />
                </>
              )}
              
              <View style={styles.approvalSwitch}>
                <Text style={styles.approvalLabel}>Requires Admin Approval</Text>
                <Switch
                  value={stepForm.requiresApproval}
                  onValueChange={(value) => setStepForm({ ...stepForm, requiresApproval: value })}
                />
              </View>
              
              {stepForm.requiresApproval && (
                <HelperText>
                  This step will require manual approval from an admin before proceeding
                </HelperText>
              )}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowEditStepDialog(false)}>
            Cancel
          </Button>
          <Button mode="contained" onPress={confirmEditStep}>
            Save Changes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderDeleteStepDialog = () => (
    <Portal>
      <Dialog
        visible={showDeleteStepDialog}
        onDismiss={() => setShowDeleteStepDialog(false)}
      >
        <Dialog.Title>Delete Escalation Step</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Are you sure you want to delete the "{selectedStep?.name}" step? This action cannot be undone.
          </Paragraph>
          {activeEscalations.some(escalation => escalation.currentStep.type === selectedStep?.type) && (
            <Paragraph style={styles.warningText}>
              Warning: This step is currently active in one or more escalations. Deleting it may affect ongoing processes.
            </Paragraph>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDeleteStepDialog(false)}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={confirmDeleteStep}
            color="#F44336"
          >
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderTestDialog = () => (
    <Portal>
      <Dialog
        visible={showTestDialog}
        onDismiss={() => setShowTestDialog(false)}
        style={styles.testDialog}
      >
        <Dialog.Title>Test Escalation Workflow</Dialog.Title>
        <Dialog.ScrollArea style={styles.testDialogScrollArea}>
          <ScrollView>
            <View style={styles.testDialogContent}>
              <Text style={styles.testSectionTitle}>Member Selection</Text>
              <TextInput
                mode="outlined"
                label="Search Member"
                value={testMemberSearch}
                onChangeText={handleSearchMember}
                style={styles.testInput}
              />
              
              {testMemberResults.length > 0 && (
                <View style={styles.searchResults}>
                  {testMemberResults.map((member) => (
                    <TouchableOpacity
                      key={member.id}
                      style={styles.searchResultItem}
                      onPress={() => handleSelectTestMember(member)}
                    >
                      {member.avatar ? (
                        <Avatar.Image 
                          source={{ uri: member.avatar }} 
                          size={24}
                          style={styles.searchResultAvatar}
                        />
                      ) : (
                        <Avatar.Text 
                          label={member.name.substring(0, 2).toUpperCase()} 
                          size={24}
                          style={styles.searchResultAvatar}
                        />
                      )}
                      <Text style={styles.searchResultName}>{member.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              <TextInput
                mode="outlined"
                label="Payment Amount"
                value={testAmount}
                onChangeText={setTestAmount}
                keyboardType="numeric"
                style={styles.testInput}
              />
              
              <Button
                mode="contained"
                onPress={handleRunTest}
                style={styles.testButton}
                disabled={!selectedTestMember || !testAmount}
              >
                Run Simulation
              </Button>
              
              {testWorkflowDiagram && (
                <View style={styles.testResults}>
                  <Text style={styles.testResultsTitle}>Simulation Results</Text>
                  
                  <Text style={styles.testResultsSubtitle}>Timeline</Text>
                  <View style={styles.testTimeline}>
                    {testWorkflowDiagram.timeline.map((event, index) => (
                      <View key={index} style={styles.timelineEvent}>
                        <View 
                          style={[
                            styles.timelineEventDot, 
                            { backgroundColor: event.color || theme.colors.primary }
                          ]} 
                        />
                        <View style={styles.timelineEventContent}>
                          <Text style={styles.timelineEventDate}>
                            Day {event.day}: {event.date}
                          </Text>
                          <Text style={styles.timelineEventTitle}>
                            {event.title}
                          </Text>
                          <Text style={styles.timelineEventDescription}>
                            {event.description}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                  
                  <Text style={styles.testResultsSubtitle}>Expected Outcome</Text>
                  <Card style={styles.outcomeCard}>
                    <Card.Content>
                      <View style={styles.outcomeRow}>
                        <Text style={styles.outcomeLabel}>
                          Estimated Payment Probability:
                        </Text>
                        <Text 
                          style={[
                            styles.outcomeValue,
                            { 
                              color: testWorkflowDiagram.outcome.paymentProbability > 70 ? '#4CAF50' : 
                                     testWorkflowDiagram.outcome.paymentProbability > 40 ? '#FF9800' : 
                                     '#F44336' 
                            }
                          ]}
                        >
                          {testWorkflowDiagram.outcome.paymentProbability}%
                        </Text>
                      </View>
                      
                      <View style={styles.outcomeRow}>
                        <Text style={styles.outcomeLabel}>
                          Estimated Response After:
                        </Text>
                        <Text style={styles.outcomeValue}>
                          Step {testWorkflowDiagram.outcome.likelyResponseStep}
                        </Text>
                      </View>
                      
                      <View style={styles.outcomeRow}>
                        <Text style={styles.outcomeLabel}>
                          Expected Recovery:
                        </Text>
                        <Text style={styles.outcomeValue}>
                          {testWorkflowDiagram.outcome.expectedRecoveryDays} days
                        </Text>
                      </View>
                      
                      <Text style={styles.outcomeNotes}>
                        {testWorkflowDiagram.outcome.notes}
                      </Text>
                    </Card.Content>
                  </Card>
                </View>
              )}
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowTestDialog(false)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading escalation workflow...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <Text style={styles.screenTitle}>Escalation Workflow</Text>
          <View style={styles.enabledSwitch}>
            <Text style={styles.enabledLabel}>
              {workflowEnabled ? 'Enabled' : 'Disabled'}
            </Text>
            <Switch
              value={workflowEnabled}
              onValueChange={toggleWorkflowEnabled}
              color="#fff"
            />
          </View>
        </View>
        
        <Text style={styles.headerDescription}>
          Customize the escalation process for overdue payments
        </Text>
      </View>
      
      {/* Workflow editor section */}
      <ScrollView style={styles.content}>
        <Card style={styles.workflowCard}>
          <Card.Content>
            <View style={styles.workflowHeader}>
              <Title style={styles.workflowTitle}>Payment Escalation Steps</Title>
              <Text style={styles.dragHint}>Drag to reorder steps</Text>
            </View>
            
            {workflowSteps.length > 0 ? (
              <View style={styles.workflowSteps}>
                {workflowSteps.map((step, index) => renderWorkflowStep(step, index))}
              </View>
            ) : (
              <View style={styles.emptyWorkflow}>
                <Icon name="arrow-up-circle" size={48} color="#9E9E9E" />
                <Text style={styles.emptyWorkflowText}>
                  No escalation steps defined yet
                </Text>
                <Text style={styles.emptyWorkflowSubtext}>
                  Add steps to create your escalation workflow
                </Text>
              </View>
            )}
          </Card.Content>
          
          <Card.Actions style={styles.workflowActions}>
            <Button 
              mode="contained" 
              icon="plus"
              onPress={handleAddStep}
            >
              Add Step
            </Button>
            
            <Button 
              mode="outlined" 
              icon="test-tube"
              onPress={handleTestWorkflow}
            >
              Test Workflow
            </Button>
          </Card.Actions>
        </Card>
        
        {/* Active escalations */}
        <Card style={styles.activeEscalationsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Active Escalations</Title>
            
            {activeEscalations.length > 0 ? (
              <View style={styles.escalationsList}>
                {activeEscalations.map((escalation, index) => 
                  renderActiveEscalation(escalation, index)
                )}
              </View>
            ) : (
              <View style={styles.emptyEscalations}>
                <Icon name="check-circle" size={48} color="#4CAF50" />
                <Text style={styles.emptyEscalationsText}>
                  No active escalations
                </Text>
                <Text style={styles.emptyEscalationsSubtext}>
                  All members are current with their payments
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* Dialogs */}
      {renderAddStepDialog()}
      {renderEditStepDialog()}
      {renderDeleteStepDialog()}
      {renderTestDialog()}
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
    marginBottom: 8
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  enabledSwitch: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  enabledLabel: {
    color: '#fff',
    marginRight: 8
  },
  headerDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)'
  },
  content: {
    flex: 1,
    padding: 16
  },
  workflowCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  workflowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  workflowTitle: {
    fontSize: 18
  },
  dragHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  workflowSteps: {
    marginTop: 8
  },
  stepContainer: {
    marginBottom: 4
  },
  stepContent: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stepTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  stepName: {
    fontSize: 16,
    fontWeight: '500'
  },
  stepActions: {
    flexDirection: 'row'
  },
  stepDivider: {
    marginVertical: 8
  },
  stepDetails: {
    marginTop: 4
  },
  stepDetail: {
    marginBottom: 8
  },
  stepDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  stepDetailValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  stepTiming: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stepDetailNote: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8
  },
  channelsList: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  channelChip: {
    margin: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  },
  channelChipText: {
    fontSize: 10
  },
  approvalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  approvalText: {
    fontSize: 12,
    color: '#9C27B0',
    marginLeft: 4
  },
  stepConnector: {
    alignItems: 'center',
    marginVertical: 4
  },
  emptyWorkflow: {
    alignItems: 'center',
    padding: 32
  },
  emptyWorkflowText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  emptyWorkflowSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  workflowActions: {
    justifyContent: 'space-between',
    padding: 16
  },
  dialog: {
    maxHeight: '80%'
  },
  dialogScrollArea: {
    paddingHorizontal: 0
  },
  dialogContent: {
    padding: 16
  },
  stepTypeSelector: {
    marginBottom: 16
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  stepTypeScroll: {
    marginBottom: 8
  },
  stepTypeOption: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepTypeSelected: {
    backgroundColor: 'rgba(3, 169, 244, 0.05)'
  },
  stepTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  stepTypeName: {
    fontSize: 12,
    textAlign: 'center'
  },
  formDivider: {
    marginVertical: 16
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  formLabel: {
    fontSize: 16,
    marginBottom: 8
  },
  daysInput: {
    width: 80
  },
  channelsSelector: {
    marginBottom: 16
  },
  channelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8
  },
  channelSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(3, 169, 244, 0.05)'
  },
  channelOptionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444'
  },
  channelSelectedText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  messageInput: {
    marginBottom: 16
  },
  approvalSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  approvalLabel: {
    fontSize: 16
  },
  activeEscalationsCard: {
    marginBottom: 16,
    borderRadius: 8
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16
  },
  escalationsList: {
    marginTop: 8
  },
  escalationCard: {
    marginBottom: 12,
    borderRadius: 8
  },
  escalationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  memberAvatar: {
    marginRight: 8
  },
  memberTextInfo: {
    flex: 1
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500'
  },
  memberUsername: {
    fontSize: 12,
    color: '#666'
  },
  statusChip: {
    height: 26
  },
  activeStatusChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)'
  },
  pausedStatusChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)'
  },
  pendingStatusChip: {
    backgroundColor: 'rgba(3, 169, 244, 0.1)'
  },
  escalationDivider: {
    marginVertical: 12
  },
  escalationDetails: {
    marginBottom: 12
  },
  escalationDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  escalationDetailLabel: {
    fontSize: 14,
    color: '#666'
  },
  escalationDetailValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  currentStepInfo: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  currentStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  currentStepLabel: {
    fontSize: 14,
    fontWeight: '500'
  },
  stepProgress: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  stepProgressText: {
    fontSize: 12
  },
  currentStepDetails: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  currentStepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  currentStepContent: {
    flex: 1
  },
  currentStepName: {
    fontSize: 14,
    fontWeight: '500'
  },
  currentStepSchedule: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  escalationActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  emptyEscalations: {
    alignItems: 'center',
    padding: 32
  },
  emptyEscalationsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8
  },
  emptyEscalationsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4
  },
  warningText: {
    color: '#F44336',
    marginTop: 8
  },
  testDialog: {
    maxHeight: '90%'
  },
  testDialogScrollArea: {
    paddingHorizontal: 0
  },
  testDialogContent: {
    padding: 16
  },
  testSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  testInput: {
    marginBottom: 16
  },
  searchResults: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  searchResultAvatar: {
    marginRight: 8
  },
  searchResultName: {
    fontSize: 14
  },
  testButton: {
    marginBottom: 24
  },
  testResults: {
    marginTop: 16
  },
  testResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  testResultsSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  testTimeline: {
    marginBottom: 24
  },
  timelineEvent: {
    flexDirection: 'row',
    marginBottom: 16
  },
  timelineEventDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    marginTop: 2
  },
  timelineEventContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  timelineEventDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  timelineEventTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  timelineEventDescription: {
    fontSize: 14
  },
  outcomeCard: {
    marginBottom: 16
  },
  outcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  outcomeLabel: {
    fontSize: 14,
    color: '#666'
  },
  outcomeValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  outcomeNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8
  }
});

export default EscalationWorkflowScreen;import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Dialog,
  Portal,
  TextInput,
  List,
  IconButton,
  Switch,
  Menu,
  Chip,
  RadioButton,
  HelperText
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  getEscalationWorkflow, 
  updateEscalationWorkflow,
  getEscalationStepTemplates,
  getActiveEscalations,
  cancelEscalation,
  pauseEscalation,
  resumeEscalation,
  testEscalationWorkflow
} from '../../services/api/escalationWorkflow';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;

// Step types definition with icons and colors
const STEP_TYPES = {
  'gentle_reminder': {
    name: 'Gentle Reminder',
    icon: 'message-text-outline',
    color: '#2196F3',
    description: 'A friendly initial reminder about the payment'
  },
  'followup_reminder': {
    name: 'Follow-up Reminder',
    icon: 'message-text',
    color: '#009688',
    description: 'A more direct reminder after the initial one'
  },
  'urgent_reminder': {
    name: 'Urgent Reminder',
    icon: 'message-alert',
    color: '#FF9800',
    description: 'An urgent message emphasizing payment importance'
  },
  'phone_call': {
    name: 'Phone Call',
    icon: 'phone',
    color: '#9C27B0',
    description: 'Direct phone call to discuss the payment'
  },
  'final_notice': {
    name: 'Final Notice',
    icon: 'bell-ring',
    color: '#F44336',
    description: 'Last notice before further action is taken'
  },
  'admin_notification': {
    name: 'Admin Notification',
    icon: 'account-tie',
    color: '#607D8B',
    description: 'Notify group admin about the defaulting payment'
  },
  'pause': {
    name: 'Pause',
    icon: 'pause-circle',
    color: '#795548',
    description: 'Wait for a specified period before next action'
  },
  'payment_plan_offer': {
    name: 'Payment Plan Offer',
    icon: 'handshake',
    color: '#4CAF50',
    description: 'Offer a payment plan option to the member'
  }
};

// Communication channel options
const CHANNELS = [
  { id: 'app', name: 'App Notification', icon: 'cellphone' },
  { id: 'email', name: 'Email', icon: 'email' },
  { id: 'sms', name: 'SMS', icon: 'message-text' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'whatsapp' },
  { id: 'manual', name: 'Manual Action', icon: 'account-supervisor' }
];

const EscalationWorkflowScreen = () => {
  const [loading, setLoading] = useState(true);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [stepTemplates, setStepTemplates] = useState([]);
  const [activeEscalations, setActiveEscalations] = useState([]);
  const [showAddStepDialog, setShowAddStepDialog] = useState(false);
  const [showEditStepDialog, setShowEditStepDialog] = useState(false);
  const [showDeleteStepDialog, setShowDeleteStepDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);
  const [stepForm, setStepForm] = useState({
    type: 'gentle_reminder',
    days: 1,
    channels: ['app', 'email'],
    message: '',
    requiresApproval: false
  });
  const [workflowEnabled, setWorkflowEnabled] = useState(true);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [testMemberSearch, setTestMemberSearch] = useState('');
  const [testMemberResults, setTestMemberResults] = useState([]);
  const [selectedTestMember, setSelectedTestMember] = useState(null);
  const [testAmount, setTestAmount] = useState('');
  const [testWorkflowDiagram, setTestWorkflowDiagram] = useState(null);
  const [draggedStep, setDraggedStep] = useState(null);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  // Get group ID from route params
  const { groupId, groupName } = route.params || {};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch workflow steps
      const workflow = await getEscalationWorkflow(groupId);
      setWorkflowSteps(workflow.steps);
      setWorkflowEnabled(workflow.enabled);
      
      // Fetch step templates
      const templates = await getEscalationStepTemplates();
      setStepTemplates(templates);
      
      // Fetch active escalations
      const escalations = await getActiveEscalations(groupId);
      setActiveEscalations(escalations);
    } catch (error) {
      console.error('Error fetching workflow data:', error);
      Alert.alert('Error', 'Failed to load escalation workflow data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddStep = () => {
    setStepForm({
      type: 'gentle_reminder',
      days: 1,
      channels: ['app', 'email'],
      message: '',
      requiresApproval: false
    });
    setShowAddStepDialog(true);
  };
  
  const handleEditStep = (step, index) => {
    setSelectedStep(step);
    setSelectedStepIndex(index);
    setStepForm({
      type: step.type,
      days: step.days,
      channels: step.channels || ['app', 'email'],
      message: step.message || '',
      requiresApproval: step.requiresApproval || false
    });
    setShowEditStepDialog(true);
  };
  
  const handleDeleteStep = (step, index) => {
    setSelectedStep(step);
    setSelectedStepIndex(index);
    setShowDeleteStepDialog(true);
  };
  
  const confirmAddStep = async () => {
    // Validate form
    if (!stepForm.days || isNaN(parseInt(stepForm.days)) || parseInt(stepForm.days) < 1) {
      Alert.alert('Invalid Value', 'Please enter a valid number of days (minimum 1).');
      return;
    }
    
    if (stepForm.channels.length === 0 && stepForm.type !== 'pause') {
      Alert.alert('Missing Channels', 'Please select at least one communication channel.');
      return;
    }
    
    // Get step name from type
    const stepName = STEP_TYPES[stepForm.type]?.name || stepForm.type;
    
    // Create new step
    const newStep = {
      type: stepForm.type,
      name: stepName,
      days: parseInt(stepForm.days),
      channels: stepForm.channels,
      message: stepForm.message,
      requiresApproval: stepForm.requiresApproval
    };
    
    // Add to workflow
    const updatedSteps = [...workflowSteps, newStep];
    
    try {
      // Update workflow on the server
      await updateEscalationWorkflow(groupId, {
        steps: updatedSteps,
        enabled: workflowEnabled
      });
      
      // Update local state
      setWorkflowSteps(updatedSteps);
      setShowAddStepDialog(false);
      
      // Show success message
      Alert.alert('Success', 'Escalation step added successfully.');
    } catch (error) {
      console.error('Error adding step:', error);
      Alert.alert('Error', 'Failed to add escalation step. Please try again.');
    }
  };
  
  const confirmEditStep = async () => {
    // Validate form
    if (!stepForm.days || isNaN(parseInt(stepForm.days)) || parseInt(stepForm.days) < 1) {
      Alert.alert('Invalid Value', 'Please enter a valid number of days (minimum 1).');
      return;
    }
    
    if (stepForm.channels.length === 0 && stepForm.type !== 'pause') {
      Alert.alert('Missing Channels', 'Please select at least one communication channel.');
      return;
    }
    
    // Get step name from type
    const stepName = STEP_TYPES[stepForm.type]?.name || stepForm.type;
    
    // Create updated step
    const updatedStep = {
      type: stepForm.type,
      name: stepName,
      days: parseInt(stepForm.days),
      channels: stepForm.channels,
      message: stepForm.message,
      requiresApproval: stepForm.requiresApproval
    };
    
    // Update workflow
    const updatedSteps = [...workflowSteps];
    updatedSteps[selectedStepIndex] = updatedStep;
    
    try {
      // Update workflow on the server
      await updateEscalationWorkflow(groupId, {
        steps: updatedSteps,
        enabled: workflowEnabled
      });
      
      // Update local state
      setWorkflowSteps(updatedSteps);
      setShowEditStepDialog(false);
      
      // Show success message
      Alert.alert('Success', 'Escalation step updated successfully.');
    } catch (error) {
      console.error('Error updating step:', error);
      Alert.alert('Error', 'Failed to update escalation step. Please try again.');
    }
  };
  
  const confirmDeleteStep = async () => {
    // Remove step from workflow
    const updatedSteps = workflowSteps.filter((_, index) => index !== selectedStepIndex);
    
    try {
      // Update workflow on the server
      await updateEscalationWorkflow(groupId, {
        steps: updatedSteps,
        enabled: workflowEnabled
      });
      
      // Update local state
      setWorkflowSteps(updatedSteps);
      setShowDeleteStepDialog(false);
      
      // Show success message
      Alert.alert('Success', 'Escalation step deleted successfully.');
    } catch (error) {
      console.error('Error deleting step:', error);
      Alert.alert('Error', 'Failed to delete escalation step. Please try again.');
    }
  };
  
  const toggleWorkflowEnabled = async () => {
    try {
      // Update workflow on the server
      await updateEscalationWorkflow(groupId, {
        steps: workflowSteps,
        enabled: !workflowEnabled
      });
      
      // Update local state
      setWorkflowEnabled(!workflowEnabled);
    } catch (error) {
      console.error('Error toggling workflow:', error);
      Alert.alert('Error', 'Failed to update workflow status. Please try again.');
    }
  };
  
  const handleUseTemplate = (template) => {
    setStepForm({
      type: template.type,
      days: template.days,
      channels: template.channels,
      message: template.message,
      requiresApproval: template.requiresApproval
    });
    setShowTemplateMenu(false);
  };
  
  const handleTemplateMenu = (event) => {
    setMenuPosition({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    });
    setShowTemplateMenu(true);
  };
  
  const handleCancelEscalation = async (escalationId) => {
    try {
      await cancelEscalation(groupId, escalationId);
      
      // Refresh active escalations
      const escalations = await getActiveEscalations(groupId);
      setActiveEscalations(escalations);
      
      Alert.alert('Success', 'Escalation cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling escalation:', error);
      Alert.alert('Error', 'Failed to cancel escalation. Please try again.');
    }
  };
  
  const handlePauseEscalation = async (escalationId) => {
    try {
      await pauseEscalation(groupId, escalationId);
      
      // Refresh active escalations
      const escalations = await getActiveEscalations(groupId);
      setActiveEscalations(escalations);
      
      Alert.alert('Success', 'Escalation paused successfully.');
    } catch (error) {
      console.error('Error pausing escalation:', error);
      Alert.alert('Error', 'Failed to pause escalation. Please try again.');
    }
  };
  
  const handleResumeEscalation = async (escalationId) => {
    try {
      await resumeEscalation(groupId, escalationId);
      
      // Refresh active escalations
      const escalations = await getActiveEscalations(groupId);
      setActiveEscalations(escalations);
      
      Alert.alert('Success', 'Escalation resumed successfully.');
    } catch (error) {
      console.error('Error resuming escalation:', error);
      Alert.alert('Error', 'Failed to resume escalation. Please try again.');
    }
  };
  
  const handleTestWorkflow = () => {
    setTestMemberSearch('');
    setTestMemberResults([]);
    setSelectedTestMember(null);
    setTestAmount('');
    setTestWorkflowDiagram(null);
    setShowTestDialog(true);
  };
  
  const handleSearchMember = async (text) => {
    setTestMemberSearch(text);
    
    if (text.length >= 2) {
      // This would be an API call in a real app
      // For this example, we'll just simulate it
      setTimeout(() => {
        setTestMemberResults([
          { id: '1', name: 'John Doe', avatar: null },
          { id: '2', name: 'Jane Smith', avatar: null },
          { id: '3', name: 'Mike Johnson', avatar: null }
        ].filter(member => 
          member.name.toLowerCase().includes(text.toLowerCase())
        ));
      }, 300);
    } else {
      setTestMemberResults([]);
    }
  };
  
  const handleSelectTestMember = (member) => {
    setSelectedTestMember(member);
    setTestMemberResults([]);
    setTestMemberSearch(member.name);
  };
  
  const handleRunTest = async () => {
    if (!selectedTestMember) {
      Alert.alert('Missing Member', 'Please select a member to test the workflow.');
      return;
    }
    
    if (!testAmount || isNaN(parseFloat(testAmount)) || parseFloat(testAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount.');
      return;
    }
    
    try {
      // Run test workflow
      const result = await testEscalationWorkflow(groupId, {
        memberId: selectedTestMember.id,
        amount: parseFloat(testAmount)
      });
      
      setTestWorkflowDiagram(result);
    } catch (error) {
      console.error('Error testing workflow:', error);
      Alert.alert('Error', 'Failed to test workflow. Please try again.');
    }
  };
  
  const moveStep = async (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    const updatedSteps = [...workflowSteps];
    const [movedStep] = updatedSteps.splice(fromIndex, 1);
    updatedSteps.splice(toIndex, 0, movedStep);
    
    try {
      // Update workflow on the server
      await updateEscalationWorkflow(groupId, {
        steps: updatedSteps,
        enabled: workflowEnabled
      });
      
      // Update local state
      setWorkflowSteps(updatedSteps);
    } catch (error) {
      console.error('Error moving step:', error);
      Alert.alert('Error', 'Failed to update workflow. Please try again.');
    }
  };
  
  // Render a single step in the workflow
  const renderWorkflowStep = (step, index) => {
    const stepConfig = STEP_TYPES[step.type] || {
      name: step.name,
      icon: 'alert-circle',
      color: '#757575',
      description: 'Custom escalation step'
    };
    
    // Calculate the cumulative days until this step (including this step)
    const daysUntilStep = workflowSteps
      .slice(0, index + 1)
      .reduce((sum, currentStep) => sum + currentStep.days, 0);
      
    const position = useSharedValue({ x: 0, y: 0 });
    
    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startX = position.value.x;
        ctx.startY = position.value.y;
        runOnJS(setDraggedStep)(index);
      },
      onActive: (event, ctx) => {
        position.value = {
          x: ctx.startX + event.translationX,
          y: ctx.startY + event.translationY
        };
      },
      onEnd: (event) => {
        // Reset position with spring animation
        position.value = withSpring({ x: 0, y: 0 });
        
        // Determine if we need to move the step
        // This is oversimplified - in a real app, you'd need more sophisticated logic
        const direction = event.translationY > 0 ? 1 : -1;
        const magnitude = Math.abs(event.translationY);
        
        if (magnitude > 50) { // Threshold for movement
          const newIndex = Math.max(0, Math.min(workflowSteps.length - 1, index + direction));
          if (newIndex !== index) {
            runOnJS(moveStep)(index, newIndex);
          }
        }
        
        runOnJS(setDraggedStep)(null);
      }
    });
    
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: position.value.x },
          { translateY: position.value.y },
          { scale: draggedStep === index ? 1.05 : 1 }
        ],
        zIndex: draggedStep === index ? 1000 : 1,
        elevation: draggedStep === index ? 5 : 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: draggedStep === index ? 4 : 0 },
        shadowOpacity: draggedStep === index ? 0.3 : 0,
        shadowRadius: draggedStep === index ? 4 : 0
      };
    });
    
    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.stepContainer, animatedStyle]}>
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepTypeContainer}>
                <View 
                  style={[
                    styles.stepIcon, 
                    { backgroundColor: stepConfig.color }
                  ]}
                >
                  <Icon name={stepConfig.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.stepName}>{stepConfig.name}</Text>
              </View>
              
              <View style={styles.stepActions}>
                <IconButton
                  icon="pencil"
                  size={18}
                  color={theme.colors.primary}
                  onPress={() => handleEditStep(step, index)}
                />
                <IconButton
                  icon="trash-can"
                  size={18}
                  color="#F44336"
                  onPress={() => handleDeleteStep(step, index)}
                />
              </View>
            </View>
            
            <Divider style={styles.stepDivider} />
            
            <View style={styles.stepDetails}>
              <View style={styles.stepDetail}>
                <Text style={styles.stepDetailLabel}>Timing:</Text>
                <View style={styles.stepTiming}>
                  <Text style={styles.stepDetailValue}>Day {daysUntilStep}</Text>
                  <Text style={styles.stepDetailNote}>
                    (+{step.days} {step.days === 1 ? 'day' : 'days'} from previous)
                  </Text>
                </View>
              </View>
              
              {step.channels && step.channels.length > 0 && (
                <View style={styles.stepDetail}>
                  <Text style={styles.stepDetailLabel}>Channels:</Text>
                  <View style={styles.channelsList}>
                    {step.channels.map((channelId) => {
                      const channel = CHANNELS.find(c => c.id === channelId);
                      return (
                        <Chip 
                          key={channelId}
                          style={styles.channelChip}
                          textStyle={styles.channelChipText}
                          icon={() => (
                            <Icon 
                              name={channel?.icon || 'alert-circle'} 
                              size={16} 
                              color="#666" 
                            />
                          )}
                        >
                          {channel?.name || channelId}
                        </Chip>
                      );
                    })}
                  </View>
                </View>
              )}
              
              {step.requiresApproval && (
                <View style={styles.approvalBadge}>
                  <Icon name="account-check" size={16} color="#9C27B0" />
                  <Text style={styles.approvalText}>Requires Approval</Text>
                </View>
              )}
            </View>
          </View>
          
          {index < workflowSteps.length - 1 && (
            <View style={styles.stepConnector}>
              <Icon name="chevron-down" size={24} color="#CCC" />
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    );
  };
  
  const renderActiveEscalation = (escalation, index) => {
    // Find current step in the workflow
    const currentStepIndex = workflowSteps.findIndex(step => step.type === escalation.currentStep.type);
    const stepConfig = STEP_TYPES[escalation.currentStep.type] || {
      name: escalation.currentStep.name,
      icon: 'alert-circle',
      color: '#757575'
    };
    
    return (
      <Card key={escalation.id} style={styles.escalationCard}>
        <Card.Content>
          <View style={styles.escalationHeader}>
            <View style={styles.memberInfo}>
              {escalation.memberAvatar ? (
                <Avatar.Image 
                  source={{ uri: escalation.memberAvatar }} 
                  size={40}
                  style={styles.memberAvatar}
                />
              ) : (
                <Avatar.Text 
                  label={escalation.memberName.substring(0, 2).toUpperCase()} 
                  size={40}
                  style={styles.memberAvatar}
                />
              )}
              
              <View style={styles.memberTextInfo}>
                <Text style={styles.memberName}>{escalation.memberName}</Text>
                <Text style={styles.memberUsername}>@{escalation.memberUsername}</Text>
              </View>
            </View>
            
            <Chip 
              style={[
                styles.statusChip,
                escalation.status === 'active' ? styles.activeStatusChip :
                escalation.status === 'paused' ? styles.pausedStatusChip :
                styles.pendingStatusChip
              ]}
            >
              {escalation.status.charAt(0).toUpperCase() + escalation.status.slice(1)}
            </Chip>
          </View>
          
          <Divider style={styles.escalationDivider} />
          
          <View style={styles.escalationDetails}>
            <View style={styles.escalationDetail}>
              <Text style={styles.escalationDetailLabel}>Amount Due:</Text>
              <Text style={styles.escalationDetailValue}>
                {formatCurrency(escalation.amountDue)}
              </Text>
            </View>
            
            <View style={styles.escalationDetail}>
              <Text style={styles.escalationDetailLabel}>Days Overdue:</Text>
              <Text style={styles.escalationDetailValue}>
                {escalation.daysOverdue} days
              </Text>
            </View>
            
            <View style={styles.escalationDetail}>
              <Text style={styles.escalationDetailLabel}>Started:</Text>
              <Text style={styles.escalationDetailValue}>
                {formatDate(escalation.startDate)}
              </Text>
            </View>
          </View>
          
          <View style={styles.currentStepInfo}>
            <View style={styles.currentStepHeader}>
              <Text style={styles.currentStepLabel}>Current Step:</Text>
              <View style={styles.stepProgress}>
                <Text style={styles.stepProgressText}>
                  Step {currentStepIndex + 1} of {workflowSteps.length}
                </Text>
              </View>
            </View>
            
            <View style={styles.currentStepDetails}>
              <View 
                style={[
                  styles.currentStepIcon, 
                  { backgroundColor: stepConfig.color }
                ]}
              >
                <Icon name={stepConfig.icon} size={20} color="#fff" />
              </View>
              
              <View style={styles.currentStepContent}>
                <Text style={styles.currentStepName}>{stepConfig.name}</Text>
                <Text style={styles.currentStepSchedule}>
                  {escalation.nextActionDate 
                    ? `Next action: ${formatDate(escalation.nextActionDate)}` 
                    : 'Awaiting action'}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
        
        <Card.Actions style={styles.escalationActions}>
          {escalation.status === 'active' && (
            <Button 
              mode="outlined"
              icon="pause"
              onPress={() => handlePauseEscalation(escalation.id)}
            >
              Pause
            </Button>
          )}
          
          {escalation.status === 'paused' && (
            <Button 
              mode="outlined"
              icon="play"
              onPress={() => handleResumeEscalation(escalation.id)}
            >
              Resume
            </Button>
          )}
          
          <Button 
            mode="outlined"
            icon="cancel"
            color="#F44336"
            onPress={() => handleCancelEscalation(escalation.id)}
          >
            Cancel
          </Button>
        </Card.Actions>
      </Card>
    );
  };
  
  const renderAddStepDialog = () => (
    <Portal>
      <Dialog
        visible={showAddStepDialog}
        onDismiss={() => setShowAddStepDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Add Escalation Step</Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <ScrollView>
            <View style={styles.dialogContent}>
              <View style={styles.stepTypeSelector}>
                <Text style={styles.selectorLabel}>Step Type</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.stepTypeScroll}
                >
                  {Object.entries(STEP_TYPES).map(([type, config]) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.stepTypeOption,
                        stepForm.type === type && styles.stepTypeSelected,
                        { borderColor: stepForm.type === type ? config.color : '#ddd' }
                      ]}
                      onPress={() => setStepForm({ ...stepForm, type })}
                    >
                      <View 
                        style={[
                          styles.stepTypeIcon, 