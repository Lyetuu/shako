          <Button 
            icon="eye" 
            mode="text"
            onPress={() => handleViewTemplate(template)}
          >
            View
          </Button>
          <Button 
            icon="pencil" 
            mode="text"
            onPress={() => handleEditTemplate(template)}
          >
            Edit
          </Button>
          <Button 
            icon="content-copy" 
            mode="text"
            onPress={() => {
              // Clone template
              const cloneForm = { ...templateForm };
              cloneForm.name = `Copy of ${template.name}`;
              
              setSelectedTemplate(null); // New template
              setTemplateForm(cloneForm);
              setEditMode(true);
              setShowTemplateDialog(true);
            }}
          >
            Clone
          </Button>
        </Card.Actions>
      </Card>
    );
  };
  
  const renderTemplateDialog = () => (
    <Portal>
      <Dialog
        visible={showTemplateDialog}
        onDismiss={() => setShowTemplateDialog(false)}
        style={styles.templateDialog}
      >
        <Dialog.Title>{editMode ? (selectedTemplate ? "Edit Template" : "Create Template") : "View Template"}</Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <ScrollView>
            <View style={styles.dialogTabs}>
              <TouchableOpacity
                style={[styles.dialogTab, activeTab === 'content' && styles.activeDialogTab]}
                onPress={() => setActiveTab('content')}
              >
                <Text
                  style={[
                    styles.dialogTabText,
                    activeTab === 'content' && styles.activeDialogTabText
                  ]}
                >
                  Content
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.dialogTab, activeTab === 'settings' && styles.activeDialogTab]}
                onPress={() => setActiveTab('settings')}
              >
                <Text
                  style={[
                    styles.dialogTabText,
                    activeTab === 'settings' && styles.activeDialogTabText
                  ]}
                >
                  Settings
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.dialogTab, activeTab === 'preview' && styles.activeDialogTab]}
                onPress={() => setActiveTab('preview')}
              >
                <Text
                  style={[
                    styles.dialogTabText,
                    activeTab === 'preview' && styles.activeDialogTabText
                  ]}
                >
                  Preview
                </Text>
              </TouchableOpacity>
            </View>
            
            {activeTab === 'content' && (
              <View style={styles.dialogContent}>
                <TextInput
                  label="Template Name"
                  value={templateForm.name}
                  onChangeText={(text) => setTemplateForm({ ...templateForm, name: text })}
                  mode="outlined"
                  style={styles.input}
                  disabled={!editMode}
                />
                
                <TextInput
                  label="Description"
                  value={templateForm.description}
                  onChangeText={(text) => setTemplateForm({ ...templateForm, description: text })}
                  mode="outlined"
                  style={styles.input}
                  disabled={!editMode}
                />
                
                <TextInput
                  label="Subject Line (for email)"
                  value={templateForm.subject}
                  onChangeText={(text) => setTemplateForm({ ...templateForm, subject: text })}
                  mode="outlined"
                  style={styles.input}
                  disabled={!editMode}
                />
                
                <View style={styles.editorToolbar}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Button
                      mode="outlined"
                      icon="plus"
                      onPress={() => setShowVariablesDialog(true)}
                      style={styles.toolbarButton}
                      disabled={!editMode}
                    >
                      Add Variable
                    </Button>
                    
                    <Button
                      mode="outlined"
                      icon="format-bold"
                      onPress={() => {
                        if (editMode) {
                          const text = "**Bold Text**";
                          setTemplateForm({
                            ...templateForm,
                            content: templateForm.content + text
                          });
                        }
                      }}
                      style={styles.toolbarButton}
                      disabled={!editMode}
                    >
                      Bold
                    </Button>
                    
                    <Button
                      mode="outlined"
                      icon="link"
                      onPress={() => {
                        if (editMode) {
                          const text = "[Link Text](https://example.com)";
                          setTemplateForm({
                            ...templateForm,
                            content: templateForm.content + text
                          });
                        }
                      }}
                      style={styles.toolbarButton}
                      disabled={!editMode}
                    >
                      Link
                    </Button>
                  </ScrollView>
                </View>
                
                <TextInput
                  label="Template Content"
                  value={templateForm.content}
                  onChangeText={(text) => setTemplateForm({ ...templateForm, content: text })}
                  mode="outlined"
                  multiline
                  numberOfLines={10}
                  style={styles.contentInput}
                  disabled={!editMode}
                />
              </View>
            )}
            
            {activeTab === 'settings' && (
              <View style={styles.dialogContent}>
                <Text style={styles.settingsSectionTitle}>Template Category</Text>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesScroll}
                  contentContainerStyle={styles.categoriesScrollContent}
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        templateForm.category === category.id && styles.selectedCategoryButton
                      ]}
                      onPress={() => {
                        if (editMode) {
                          setTemplateForm({ ...templateForm, category: category.id });
                        }
                      }}
                      disabled={!editMode}
                    >
                      <Icon 
                        name={category.icon} 
                        size={20} 
                        color={templateForm.category === category.id ? '#fff' : category.color} 
                      />
                      <Text 
                        style={[
                          styles.categoryButtonText,
                          templateForm.category === category.id && styles.selectedCategoryButtonText
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <Text style={styles.settingsSectionTitle}>Notification Channels</Text>
                <View style={styles.settingsChannels}>
                  <TouchableOpacity
                    style={[
                      styles.channelOption,
                      templateForm.channels.includes('app') && styles.selectedChannelOption
                    ]}
                    onPress={() => {
                      if (editMode) {
                        const channels = templateForm.channels.includes('app')
                          ? templateForm.channels.filter(c => c !== 'app')
                          : [...templateForm.channels, 'app'];
                        setTemplateForm({ ...templateForm, channels });
                      }
                    }}
                    disabled={!editMode}
                  >
                    <Icon
                      name="cellphone"
                      size={24}
                      color={templateForm.channels.includes('app') ? theme.colors.primary : '#888'}
                    />
                    <Text
                      style={[
                        styles.channelOptionText,
                        templateForm.channels.includes('app') && styles.selectedChannelOptionText
                      ]}
                    >
                      App
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.channelOption,
                      templateForm.channels.includes('email') && styles.selectedChannelOption
                    ]}
                    onPress={() => {
                      if (editMode) {
                        const channels = templateForm.channels.includes('email')
                          ? templateForm.channels.filter(c => c !== 'email')
                          : [...templateForm.channels, 'email'];
                        setTemplateForm({ ...templateForm, channels });
                      }
                    }}
                    disabled={!editMode}
                  >
                    <Icon
                      name="email"
                      size={24}
                      color={templateForm.channels.includes('email') ? '#D81B60' : '#888'}
                    />
                    <Text
                      style={[
                        styles.channelOptionText,
                        templateForm.channels.includes('email') && { color: '#D81B60' }
                      ]}
                    >
                      Email
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.channelOption,
                      templateForm.channels.includes('whatsapp') && styles.selectedChannelOption
                    ]}
                    onPress={() => {
                      if (editMode) {
                        const channels = templateForm.channels.includes('whatsapp')
                          ? templateForm.channels.filter(c => c !== 'whatsapp')
                          : [...templateForm.channels, 'whatsapp'];
                        setTemplateForm({ ...templateForm, channels });
                      }
                    }}
                    disabled={!editMode}
                  >
                    <Icon
                      name="whatsapp"
                      size={24}
                      color={templateForm.channels.includes('whatsapp') ? '#25D366' : '#888'}
                    />
                    <Text
                      style={[
                        styles.channelOptionText,
                        templateForm.channels.includes('whatsapp') && { color: '#25D366' }
                      ]}
                    >
                      WhatsApp
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.defaultTemplateOption}>
                  <Text style={styles.defaultTemplateLabel}>Set as Default Template</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      templateForm.isDefault && styles.toggleButtonActive
                    ]}
                    onPress={() => {
                      if (editMode) {
                        setTemplateForm({ ...templateForm, isDefault: !templateForm.isDefault });
                      }
                    }}
                    disabled={!editMode}
                  >
                    <View
                      style={[
                        styles.toggleKnob,
                        templateForm.isDefault && styles.toggleKnobActive
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            {activeTab === 'preview' && (
              <View style={styles.dialogContent}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewTitle}>Message Preview</Text>
                  <View style={styles.previewTargets}>
                    {templateForm.channels.map((channel) => (
                      <Chip
                        key={channel}
                        style={styles.previewChannelChip}
                        icon={() => (
                          <Icon
                            name={
                              channel === 'app' ? 'cellphone' :
                              channel === 'email' ? 'email' :
                              channel === 'whatsapp' ? 'whatsapp' :
                              'message'
                            }
                            size={16}
                            color={
                              channel === 'app' ? theme.colors.primary :
                              channel === 'email' ? '#D81B60' :
                              channel === 'whatsapp' ? '#25D366' :
                              '#FF9800'
                            }
                          />
                        )}
                      >
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </Chip>
                    ))}
                  </View>
                </View>
                
                {templateForm.channels.includes('email') && (
                  <View style={styles.emailPreview}>
                    <View style={styles.emailPreviewHeader}>
                      <Text style={styles.emailSubjectLabel}>Subject:</Text>
                      <Text style={styles.emailSubject}>{templateForm.subject || "(No subject)"}</Text>
                    </View>
                    <View style={styles.emailPreviewBody}>
                      <Text style={styles.emailContent}>
                        {renderPreviewContent(templateForm.content)}
                      </Text>
                    </View>
                  </View>
                )}
                
                {templateForm.channels.includes('app') && (
                  <View style={styles.appPreview}>
                    <View style={styles.appNotificationHeader}>
                      <Icon name="bell" size={18} color={theme.colors.primary} />
                      <Text style={styles.appNotificationTitle}>App Notification</Text>
                    </View>
                    <View style={styles.appNotificationContent}>
                      <Text style={styles.appNotificationText}>
                        {renderPreviewContent(templateForm.content, true)}
                      </Text>
                    </View>
                  </View>
                )}
                
                {templateForm.channels.includes('whatsapp') && (
                  <View style={styles.whatsappPreview}>
                    <View style={styles.whatsappHeader}>
                      <Icon name="whatsapp" size={18} color="#25D366" />
                      <Text style={styles.whatsappTitle}>WhatsApp Message</Text>
                    </View>
                    <View style={styles.whatsappContent}>
                      <Text style={styles.whatsappText}>
                        {renderPreviewContent(templateForm.content, true)}
                      </Text>
                    </View>
                  </View>
                )}
                
                {editMode && (
                  <Button
                    mode="contained"
                    icon="test-tube"
                    onPress={handleTestTemplate}
                    style={styles.testButton}
                  >
                    Test Template
                  </Button>
                )}
              </View>
            )}
          </ScrollView>
        </Dialog.ScrollArea>
        
        <Dialog.Actions>
          <Button onPress={() => setShowTemplateDialog(false)}>
            Cancel
          </Button>
          
          {editMode && (
            <Button mode="contained" onPress={handleSaveTemplate}>
              Save
            </Button>
          )}
          
          {!editMode && selectedTemplate && (
            <Button
              mode="outlined"
              icon="pencil"
              onPress={() => setEditMode(true)}
            >
              Edit
            </Button>
          )}
          
          {selectedTemplate && !editMode && (
            <Button
              mode="outlined"
              icon="delete"
              onPress={() => setShowDeleteDialog(true)}
              color="#F44336"
            >
              Delete
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderDeleteDialog = () => (
    <Portal>
      <Dialog
        visible={showDeleteDialog}
        onDismiss={() => setShowDeleteDialog(false)}
      >
        <Dialog.Title>Delete Template</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            Are you sure you want to delete the template "{selectedTemplate?.name}"?
            This action cannot be undone.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button mode="contained" color="#F44336" onPress={handleDeleteTemplate}>
            Delete
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderVariablesDialog = () => (
    <Portal>
      <Dialog
        visible={showVariablesDialog}
        onDismiss={() => setShowVariablesDialog(false)}
        style={styles.variablesDialog}
      >
        <Dialog.Title>Available Variables</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView>
            <List.Section>
              {variables.map((category) => (
                <List.Accordion
                  key={category.id}
                  title={category.name}
                  left={props => <List.Icon {...props} icon={category.icon} />}
                >
                  {category.variables.map((variable) => (
                    <List.Item
                      key={variable.name}
                      title={variable.label}
                      description={variable.description}
                      left={props => <List.Icon {...props} icon="code-tags" />}
                      right={props => (
                        <Button 
                          mode="text" 
                          onPress={() => handleInsertVariable(variable)}
                        >
                          Insert
                        </Button>
                      )}
                      onPress={() => handleInsertVariable(variable)}
                    />
                  ))}
                </List.Accordion>
              ))}
            </List.Section>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowVariablesDialog(false)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderAnalyticsDialog = () => (
    <Portal>
      <Dialog
        visible={showAnalyticsDialog}
        onDismiss={() => setShowAnalyticsDialog(false)}
        style={styles.analyticsDialog}
      >
        <Dialog.Title>Template Analytics</Dialog.Title>
        <Dialog.ScrollArea style={styles.analyticsScrollArea}>
          <ScrollView>
            {selectedTemplate && (
              <View style={styles.analyticsContent}>
                <Text style={styles.analyticsTemplateName}>{selectedTemplate.name}</Text>
                
                <View style={styles.analyticsStats}>
                  <View style={styles.analyticsStat}>
                    <Text style={styles.analyticsStatValue}>
                      {analytics.templates.find(t => t.id === selectedTemplate.id)?.sentCount || 0}
                    </Text>
                    <Text style={styles.analyticsStatLabel}>Total Sent</Text>
                  </View>
                  
                  <View style={styles.analyticsStat}>
                    <Text 
                      style={[
                        styles.analyticsStatValue,
                        { 
                          color: getResponseRateColor(
                            analytics.templates.find(t => t.id === selectedTemplate.id)?.responseRate || 0
                          ) 
                        }
                      ]}
                    >
                      {analytics.templates.find(t => t.id === selectedTemplate.id)?.responseRate || 0}%
                    </Text>
                    <Text style={styles.analyticsStatLabel}>Response Rate</Text>
                  </View>
                  
                  <View style={styles.analyticsStat}>
                    <Text style={styles.analyticsStatValue}>
                      {analytics.templates.find(t => t.id === selectedTemplate.id)?.avgResponseTime || 0}h
                    </Text>
                    <Text style={styles.analyticsStatLabel}>Avg. Response Time</Text>
                  </View>
                </View>
                
                <Divider style={styles.analyticsDivider} />
                
                <Text style={styles.analyticsSubtitle}>Performance by Channel</Text>
                
                <View style={styles.channelPerformance}>
                  {analytics.templates.find(t => t.id === selectedTemplate.id)?.channelPerformance.map((channel) => (
                    <View key={channel.channel} style={styles.channelPerformanceItem}>
                      <View style={styles.channelPerformanceHeader}>
                        <Icon 
                          name={
                            channel.channel === 'app' ? 'cellphone' :
                            channel.channel === 'email' ? 'email' :
                            channel.channel === 'whatsapp' ? 'whatsapp' :
                            'message'
                          }
                          size={20}
                          color={
                            channel.channel === 'app' ? theme.colors.primary :
                            channel.channel === 'email' ? '#D81B60' :
                            channel.channel === 'whatsapp' ? '#25D366' :
                            '#FF9800'
                          }
                        />
                        <Text style={styles.channelPerformanceName}>
                          {channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1)}
                        </Text>
                      </View>
                      
                      <View style={styles.channelPerformanceStats}>
                        <View style={styles.channelPerformanceStat}>
                          <Text style={styles.channelPerformanceLabel}>Sent:</Text>
                          <Text style={styles.channelPerformanceValue}>{channel.sentCount}</Text>
                        </View>
                        
                        <View style={styles.channelPerformanceStat}>
                          <Text style={styles.channelPerformanceLabel}>Response:</Text>
                          <Text 
                            style={[
                              styles.channelPerformanceValue,
                              { color: getResponseRateColor(channel.responseRate) }
                            ]}
                          >
                            {channel.responseRate}%
                          </Text>
                        </View>
                        
                        <View style={styles.channelPerformanceStat}>
                          <Text style={styles.channelPerformanceLabel}>Avg. Time:</Text>
                          <Text style={styles.channelPerformanceValue}>
                            {channel.avgResponseTime}h
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
                
                <Divider style={styles.analyticsDivider} />
                
                <Text style={styles.analyticsSubtitle}>Performance Over Time</Text>
                
                <View style={styles.timePerformance}>
                  {analytics.templates.find(t => t.id === selectedTemplate.id)?.performanceByMonth.map((month, index) => (
                    <View key={index} style={styles.timePerformanceItem}>
                      <Text style={styles.timePerformanceMonth}>{month.month}</Text>
                      
                      <View style={styles.timePerformanceBar}>
                        <View 
                          style={[
                            styles.timePerformanceFill,
                            { width: `${month.responseRate}%`, backgroundColor: getResponseRateColor(month.responseRate) }
                          ]}
                        />
                      </View>
                      
                      <Text style={styles.timePerformanceRate}>{month.responseRate}%</Text>
                      
                      <Text style={styles.timePerformanceSent}>{month.sentCount} sent</Text>
                    </View>
                  ))}
                </View>
                
                <Divider style={styles.analyticsDivider} />
                
                <Text style={styles.analyticsSubtitle}>Recommendations</Text>
                
                <View style={styles.recommendationsContainer}>
                  {analytics.templates.find(t => t.id === selectedTemplate.id)?.recommendations.map((recommendation, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Icon 
                        name={recommendation.icon} 
                        size={24} 
                        color={recommendation.type === 'positive' ? '#4CAF50' : '#FF9800'} 
                        style={styles.recommendationIcon}
                      />
                      <View style={styles.recommendationContent}>
                        <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                        <Text style={styles.recommendationText}>{recommendation.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={() => setShowAnalyticsDialog(false)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderTestResultDialog = () => (
    <Portal>
      <Dialog
        visible={showTestResultDialog}
        onDismiss={() => setShowTestResultDialog(false)}
      >
        <Dialog.Title>
          <Icon 
            name="test-tube" 
            size={24} 
            color={theme.colors.primary} 
            style={{ marginRight: 8 }} 
          />
          Template Test Results
        </Dialog.Title>
        <Dialog.Content>
          {testResult && (
            <View style={styles.testResults}>
              <View style={styles.testResultItem}>
                <Text style={styles.testResultLabel}>Predicted Response Rate:</Text>
                <Text 
                  style={[
                    styles.testResultValue,
                    { color: getResponseRateColor(testResult.predictedResponseRate) }
                  ]}
                >
                  {testResult.predictedResponseRate}%
                </Text>
              </View>
              
              <View style={styles.testResultItem}>
                <Text style={styles.testResultLabel}>Sentiment Score:</Text>
                <Text 
                  style={[
                    styles.testResultValue,
                    { 
                      color: testResult.sentimentScore > 7 ? '#4CAF50' : 
                             testResult.sentimentScore > 4 ? '#FF9800' : 
                             '#F44336' 
                    }
                  ]}
                >
                  {testResult.sentimentScore}/10
                </Text>
              </View>
              
              <View style={styles.testResultItem}>
                <Text style={styles.testResultLabel}>Readability:</Text>
                <Text style={styles.testResultValue}>{testResult.readabilityLevel}</Text>
              </View>
              
              <Divider style={styles.testResultDivider} />
              
              <Text style={styles.testFeedbackTitle}>Feedback</Text>
              <Text style={styles.testFeedback}>{testResult.feedback}</Text>
              
              {testResult.suggestions && testResult.suggestions.length > 0 && (
                <View style={styles.testSuggestions}>
                  <Text style={styles.testSuggestionsTitle}>Improvement Suggestions</Text>
                  {testResult.suggestions.map((suggestion, index) => (
                    <View key={index} style={styles.testSuggestion}>
                      <Icon name="lightbulb-on" size={16} color="#FF9800" style={styles.testSuggestionIcon} />
                      <Text style={styles.testSuggestionText}>{suggestion}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="contained" onPress={() => setShowTestResultDialog(false)}>
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  // Helper functions
  const getCategoryLabel = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  const getCategoryChipStyle = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      backgroundColor: category ? `${category.color}20` : '#eee'
    };
  };
  
  const getResponseRateColor = (rate) => {
    if (rate >= 70) return '#4CAF50';
    if (rate >= 40) return '#FF9800';
    return '#F44336';
  };
  
  const renderPreviewContent = (content, truncate = false) => {
    // Replace variables with sample values
    let previewContent = content;
    
    // Replace member variables
    previewContent = previewContent
      .replace(/{{member_name}}/g, 'John Doe')
      .replace(/{{amount_due}}/g, '$150.00')
      .replace(/{{due_date}}/g, '15 March 2025')
      .replace(/{{days_overdue}}/g, '7')
      .replace(/{{payment_link}}/g, 'https://payment.link/example');
    
    // Truncate if needed
    if (truncate && previewContent.length > 100) {
      previewContent = previewContent.substring(0, 97) + '...';
    }
    
    return previewContent;
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading notification templates...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>Notification Templates</Text>
        
        <View style={styles.categoryFilters}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFiltersContent}
          >
            <TouchableOpacity
              style={[
                styles.categoryFilterChip,
                selectedCategory === 'all' && styles.selectedCategoryFilterChip
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text 
                style={[
                  styles.categoryFilterText,
                  selectedCategory === 'all' && styles.selectedCategoryFilterText
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryFilterChip,
                  selectedCategory === category.id && {
                    backgroundColor: `${category.color}20`,
                    borderColor: category.color
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Icon 
                  name={category.icon} 
                  size={16} 
                  color={category.color} 
                  style={styles.categoryFilterIcon}
                />
                <Text 
                  style={[
                    styles.categoryFilterText,
                    selectedCategory === category.id && { color: category.color }
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      {/* Templates list */}
      <FlatList
        data={templates.filter(t => selectedCategory === 'all' || t.category === selectedCategory)}
        renderItem={renderTemplateItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.templatesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="text-box-outline" size={64} color="#9E9E9E" />
            <Text style={styles.emptyText}>No templates found</Text>
            <Text style={styles.emptySubtext}>Create a new template to get started</Text>
          </View>
        }
      />
      
      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        label="New Template"
        onPress={handleCreateTemplate}
      />
      
      {/* Template menu */}
      <Menu
        visible={showTemplateMenu}
        onDismiss={() => setShowTemplateMenu(false)}
        anchor={menuPosition}
      >
        <Menu.Item
          icon="eye"
          onPress={() => {
            setShowTemplateMenu(false);
            handleViewTemplate(templates.find(t => t.id === menuTemplateId));
          }}
          title="View"
        />
        <Menu.Item
          icon="pencil"
          onPress={() => {
            setShowTemplateMenu(false);
            handleEditTemplate(templates.find(t => t.id === menuTemplateId));
          }}
          title="Edit"
        />
        <Menu.Item
          icon="chart-line"
          onPress={() => {
            setShowTemplateMenu(false);
            handleShowAnalytics(menuTemplateId);
          }}
          title="Analytics"
        />
        <Menu.Item
          icon="content-copy"
          onPress={() => {
            setShowTemplateMenu(false);
            const template = templates.find(t => t.id === menuTemplateId);
            
            // Clone template
            const cloneForm = {
              name: `Copy of ${template.name}`,
              description: template.description,
              category: template.category,
              subject: template.subject,
              content: template.content,
              channels: template.channels,
              isDefault: false
            };
            
            setSelectedTemplate(null); // New template
            setTemplateForm(cloneForm);
            setEditMode(true);
            setShowTemplateDialog(true);
          }}
          title="Clone"
        />
        <Divider />
        <Menu.Item
          icon="delete"
          onPress={() => {
            setShowTemplateMenu(false);
            setSelectedTemplate(templates.find(t => t.id === menuTemplateId));
            setShowDeleteDialog(true);
          }}
          title="Delete"
          titleStyle={{ color: '#F44336' }}
        />
      </Menu>
      
      {/* Dialogs */}
      {renderTemplateDialog()}
      {renderDeleteDialog()}
      {renderVariablesDialog()}
      {renderAnalyticsDialog()}
      {renderTestResultDialog()}
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
    paddingBottom: 24
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16
  },
  categoryFilters: {
    marginTop: 8
  },
  categoryFiltersContent: {
    paddingRight: 16
  },
  categoryFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  selectedCategoryFilterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: theme.colors.primary
  },
  categoryFilterIcon: {
    marginRight: 4
  },
  categoryFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#444'
  },
  selectedCategoryFilterText: {
    color: theme.colors.primary
  },
  templatesList: {
    padding: 16
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#666'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary
  },
  templateCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  templateTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8
  },
  defaultChip: {
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    height: 24
  },
  defaultChipText: {
    fontSize: 10
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  templateDetails: {
    marginBottom: 16
  },
  templateDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  detailLabel: {
    fontSize: 14,
    color: '#666'
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  categoryChip: {
    height: 24
  },
  categoryChipText: {
    fontSize: 10
  },
  channelsContainer: {
    flexDirection: 'row'
  },
  channelIcon: {
    marginLeft: 8
  },
  templateMetrics: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  metricItem: {
    flex: 1,
    alignItems: 'center'
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  templateActions: {
    justifyContent: 'flex-end'
  },
  templateDialog: {
    maxHeight: '90%'
  },
  dialogScrollArea: {
    paddingHorizontal: 0
  },
  dialogTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  dialogTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12
  },
  activeDialogTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary
  },
  dialogTabText: {
    fontSize: 14,
    color: '#888'
  },
  activeDialogTabText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  dialogContent: {
    padding: 16
  },
  input: {
    marginBottom: 16
  },
  editorToolbar: {
    marginBottom: 16
  },
  toolbarButton: {
    marginRight: 8
  },
  contentInput: {
    minHeight: 150
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 8
  },
  categoriesScroll: {
    marginBottom: 16
  },
  categoriesScrollContent: {
    paddingRight: 16
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  selectedCategoryButton: {
    backgroundColor: theme.colors.primary
  },
  categoryButtonText: {
    fontSize: 14,
    marginLeft: 8
  },
  selectedCategoryButtonText: {
    color: '#fff',
    fontWeight: '500'
  },
  settingsChannels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  channelOption: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee'
  },
  selectedChannelOption: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(3, 169, 244, 0.05)'
  },
  channelOptionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#888'
  },
  selectedChannelOptionText: {
    color: theme.colors.primary,
    fontWeight: '500'
  },
  defaultTemplateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  defaultTemplateLabel: {
    fontSize: 16
  },
  toggleButton: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    padding: 2
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  toggleKnobActive: {
    alignSelf: 'flex-end'
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '500'
  },
  previewTargets: {
    flexDirection: 'row'
  },
  previewChannelChip: {
    marginLeft: 8,
    height: 24
  },
  emailPreview: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
    overflow: 'hidden'
  },
  emailPreviewHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  emailSubjectLabel: {
    fontWeight: '500',
    marginRight: 8
  },
  emailSubject: {
    flex: 1
  },
  emailPreviewBody: {
    padding: 16
  },
  emailContent: {
    lineHeight: 22
  },
  appPreview: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
    overflow: 'hidden'
  },
  appNotificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  appNotificationTitle: {
    fontWeight: '500',
    marginLeft: 8
  },
  appNotificationContent: {
    padding: 16
  },
  appNotificationText: {
    lineHeight: 22
  },
  whatsappPreview: {
    backgroundColor: '#DCF8C6',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden'
  },
  whatsappHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#128C7E',
    padding: 12
  },
  whatsappTitle: {
    fontWeight: '500',
    marginLeft: 8,
    color: '#fff'
  },
  whatsappContent: {
    padding: 16
  },
  whatsappText: {
    lineHeight: 22
  },
  testButton: {
    marginTop: 16
  },
  variablesDialog: {
    maxHeight: '80%'
  },
  analyticsDialog: {
    maxHeight: '90%'
  },
  analyticsScrollArea: {
    paddingHorizontal: 0
  },
  analyticsContent: {
    padding: 16
  },
  analyticsTemplateName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  analyticsStats: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  analyticsStat: {
    flex: 1,
    alignItems: 'center'
  },
  analyticsStatValue: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  analyticsStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  analyticsDivider: {
    marginVertical: 16
  },
  analyticsSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12
  },
  channelPerformance: {
    marginBottom: 16
  },
  channelPerformanceItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden'
  },
  channelPerformanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12
  },
  channelPerformanceName: {
    fontWeight: '500',
    marginLeft: 8
  },
  channelPerformanceStats: {
    padding: 12
  },
  channelPerformanceStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  channelPerformanceLabel: {
    color: '#666'
  },
  channelPerformanceValue: {
    fontWeight: '500'
  },
  timePerformance: {
    marginBottom: 16
  },
  timePerformanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  timePerformanceMonth: {
    width: 60,
    fontSize: 12
  },
  timePerformanceBar: {
    flex: 1,
    height: 16,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8
  },
  timePerformanceFill: {
    height: 16,
    borderRadius: 8
  },
  timePerformanceRate: {
    width: 40,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right'
  },
  timePerformanceSent: {
    width: 60,
    fontSize: 10,
    color: '#666',
    textAlign: 'right'
  },
  recommendationsContainer: {
    marginBottom: 16
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12
  },
  recommendationIcon: {
    marginRight: 12,
    marginTop: 2
  },
  recommendationContent: {
    flex: 1
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4
  },
  recommendationText: {
    fontSize: 14,
    color: '#666'
  },
  testResults: {
    marginTop: 8
  },
  testResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  testResultLabel: {
    fontSize: 14,
    color: '#666'
  },
  testResultValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  testResultDivider: {
    marginVertical: 12
  },
  testFeedbackTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  testFeedback: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16
  },
  testSuggestions: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12
  },
  testSuggestionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  testSuggestion: {
    flexDirection: 'row',
    marginBottom: 8
  },
  testSuggestionIcon: {
    marginRight: 8,
    marginTop: 2
  },
  testSuggestionText: {
    flex: 1,
    fontSize: 14
  }
});

export default NotificationTemplatesScreen;
      
      {/*import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  TextInput,
  Portal,
  Dialog,
  IconButton,
  Chip,
  SegmentedButtons,
  List,
  Menu
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { 
  getNotificationTemplates, 
  createNotificationTemplate,
  updateNotificationTemplate,
  deleteNotificationTemplate,
  testNotificationTemplate,
  getTemplateVariables,
  getTemplateCategories,
  getTemplateAnalytics
} from '../../services/api/notificationTemplates';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';

const NotificationTemplatesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [variables, setVariables] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showVariablesDialog, setShowVariablesDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [menuTemplateId, setMenuTemplateId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    category: 'payment_reminder',
    subject: '',
    content: '',
    channels: ['app', 'email', 'whatsapp'],
    isDefault: false
  });
  const [testResult, setTestResult] = useState(null);
  const [showTestResultDialog, setShowTestResultDialog] = useState(false);
  
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  
  // Get group ID from route params
  const { groupId } = route.params || {};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch templates
      const templatesData = await getNotificationTemplates(groupId);
      setTemplates(templatesData);
      
      // Fetch template categories
      const categoriesData = await getTemplateCategories();
      setCategories(categoriesData);
      
      // Fetch available variables
      const variablesData = await getTemplateVariables();
      setVariables(variablesData);
      
      // Fetch template analytics
      const analyticsData = await getTemplateAnalytics(groupId);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      Alert.alert('Error', 'Failed to load notification templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateForm({
      name: '',
      description: '',
      category: 'payment_reminder',
      subject: '',
      content: '',
      channels: ['app', 'email', 'whatsapp'],
      isDefault: false
    });
    setEditMode(true);
    setActiveTab('content');
    setShowTemplateDialog(true);
  };
  
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      category: template.category,
      subject: template.subject,
      content: template.content,
      channels: template.channels,
      isDefault: template.isDefault
    });
    setEditMode(true);
    setActiveTab('content');
    setShowTemplateDialog(true);
  };
  
  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      category: template.category,
      subject: template.subject,
      content: template.content,
      channels: template.channels,
      isDefault: template.isDefault
    });
    setEditMode(false);
    setActiveTab('content');
    setShowTemplateDialog(true);
  };
  
  const handleDeleteTemplate = async () => {
    try {
      await deleteNotificationTemplate(groupId, selectedTemplate.id);
      
      // Update local state
      setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
      
      setShowDeleteDialog(false);
      setShowTemplateDialog(false);
      Alert.alert('Success', 'Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      Alert.alert('Error', 'Failed to delete template. Please try again.');
    }
  };
  
  const handleSaveTemplate = async () => {
    // Validate form
    if (!templateForm.name.trim()) {
      Alert.alert('Error', 'Template name is required');
      return;
    }
    
    if (!templateForm.subject.trim() && templateForm.channels.includes('email')) {
      Alert.alert('Error', 'Subject is required for email templates');
      return;
    }
    
    if (!templateForm.content.trim()) {
      Alert.alert('Error', 'Template content is required');
      return;
    }
    
    try {
      if (selectedTemplate) {
        // Update existing template
        await updateNotificationTemplate(
          groupId,
          selectedTemplate.id,
          templateForm
        );
        
        // Update local state
        setTemplates(templates.map(t => 
          t.id === selectedTemplate.id 
            ? { ...t, ...templateForm }
            : t
        ));
        
        Alert.alert('Success', 'Template updated successfully');
      } else {
        // Create new template
        const newTemplate = await createNotificationTemplate(
          groupId,
          templateForm
        );
        
        // Update local state
        setTemplates([...templates, newTemplate]);
        
        Alert.alert('Success', 'Template created successfully');
      }
      
      setShowTemplateDialog(false);
    } catch (error) {
      console.error('Error saving template:', error);
      Alert.alert('Error', 'Failed to save template. Please try again.');
    }
  };
  
  const handleTestTemplate = async () => {
    try {
      const result = await testNotificationTemplate(
        groupId,
        selectedTemplate ? selectedTemplate.id : null,
        templateForm
      );
      
      setTestResult(result);
      setShowTestResultDialog(true);
    } catch (error) {
      console.error('Error testing template:', error);
      Alert.alert('Error', 'Failed to test template. Please try again.');
    }
  };
  
  const handleInsertVariable = (variable) => {
    const insertText = `{{${variable.name}}}`;
    
    // Insert at cursor position if available
    const updatedContent = templateForm.content + insertText;
    
    setTemplateForm({
      ...templateForm,
      content: updatedContent
    });
    
    setShowVariablesDialog(false);
  };
  
  const handleShowAnalytics = async (templateId) => {
    try {
      const templateAnalytics = analytics.templates.find(t => t.id === templateId);
      
      if (templateAnalytics) {
        setSelectedTemplate(templates.find(t => t.id === templateId));
        setShowAnalyticsDialog(true);
      } else {
        Alert.alert('No Data', 'No analytics data available for this template');
      }
    } catch (error) {
      console.error('Error showing analytics:', error);
      Alert.alert('Error', 'Failed to load analytics data. Please try again.');
    }
  };
  
  const handleTemplateMenuPress = (templateId, event) => {
    setMenuTemplateId(templateId);
    setMenuPosition({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY
    });
    setShowTemplateMenu(true);
  };
  
  const renderTemplateItem = ({ item }) => {
    const lastUsed = item.lastUsed ? new Date(item.lastUsed) : null;
    const template = item;
    
    return (
      <Card style={styles.templateCard} onPress={() => handleViewTemplate(template)}>
        <Card.Content>
          <View style={styles.templateHeader}>
            <View style={styles.templateTitleContainer}>
              <Text style={styles.templateName}>{template.name}</Text>
              {template.isDefault && (
                <Chip style={styles.defaultChip} textStyle={styles.defaultChipText}>Default</Chip>
              )}
            </View>
            
            <IconButton
              icon="dots-vertical"
              size={20}
              onPress={(e) => handleTemplateMenuPress(template.id, e)}
            />
          </View>
          
          <Text style={styles.templateDescription}>{template.description}</Text>
          
          <View style={styles.templateDetails}>
            <View style={styles.templateDetail}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Chip 
                style={[
                  styles.categoryChip,
                  getCategoryChipStyle(template.category)
                ]}
                textStyle={styles.categoryChipText}
              >
                {getCategoryLabel(template.category)}
              </Chip>
            </View>
            
            {lastUsed && (
              <View style={styles.templateDetail}>
                <Text style={styles.detailLabel}>Last Used:</Text>
                <Text style={styles.detailValue}>
                  {lastUsed.toLocaleDateString()}
                </Text>
              </View>
            )}
            
            <View style={styles.templateDetail}>
              <Text style={styles.detailLabel}>Channels:</Text>
              <View style={styles.channelsContainer}>
                {template.channels.map((channel) => (
                  <Icon 
                    key={channel}
                    name={
                      channel === 'app' ? 'cellphone' :
                      channel === 'email' ? 'email' :
                      channel === 'whatsapp' ? 'whatsapp' :
                      'message'
                    }
                    size={18}
                    color={
                      channel === 'app' ? theme.colors.primary :
                      channel === 'email' ? '#D81B60' :
                      channel === 'whatsapp' ? '#25D366' :
                      '#FF9800'
                    }
                    style={styles.channelIcon}
                  />
                ))}
              </View>
            </View>
          </View>
          
          {template.usageCount > 0 && (
            <View style={styles.templateMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{template.usageCount}</Text>
                <Text style={styles.metricLabel}>Uses</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text 
                  style={[
                    styles.metricValue,
                    { color: getResponseRateColor(template.responseRate) }
                  ]}
                >
                  {template.responseRate}%
                </Text>
                <Text style={styles.metricLabel}>Response</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.metricItem}
                onPress={() => handleShowAnalytics(template.id)}
              >
                <Icon name="chart-line" size={18} color={theme.colors.primary} />
                <Text style={[styles.metricLabel, { color: theme.colors.primary }]}>Analytics</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card.Content>
        
        <Card.Actions style={styles.templateActions}>
          <Button 
            icon="eye" 
            mode="text"
            