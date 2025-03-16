                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.legendText}>On Time</Text>
                  <Text style={styles.legendValue}>{groupStats.paymentsOnTime}</Text>
                </View>
                
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
                  <Text style={styles.legendText}>Late</Text>
                  <Text style={styles.legendValue}>{groupStats.paymentsLate}</Text>
                </View>
                
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
                  <Text style={styles.legendText}>Missing</Text>
                  <Text style={styles.legendValue}>{groupStats.paymentsMissing}</Text>
                </View>
              </View>
            </View>
            
            {groupData.recentUpdate && (
              <View style={styles.recentUpdate}>
                <View style={styles.recentUpdateHeader}>
                  <Icon name="bullhorn" size={18} color={theme.colors.primary} />
                  <Text style={styles.recentUpdateTitle}>Recent Update</Text>
                </View>
                <Text style={styles.recentUpdateText}>
                  {groupData.recentUpdate.message}
                </Text>
                <Text style={styles.recentUpdateDate}>
                  {formatDate(groupData.recentUpdate.date)}
                </Text>
              </View>
            )}
          </Card.Content>
          
          {groupData.settings.enablePublicStats && (
            <Card.Actions style={styles.cardActions}>
              <Button 
                mode="outlined" 
                icon="share-variant"
                onPress={() => setShowShareDialog(true)}
              >
                Share Progress
              </Button>
            </Card.Actions>
          )}
        </Card>
        
        {/* Anonymous Member Status */}
        {groupData.settings.enablePublicStats && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Member Payment Status</Title>
              
              <View style={styles.memberStatusContainer}>
                {groupStats.memberStatus.map((statusGroup, index) => (
                  <View key={index} style={styles.statusGroup}>
                    <View style={styles.statusHeader}>
                      <View 
                        style={[
                          styles.statusDot, 
                          { 
                            backgroundColor: statusGroup.status === 'paid' ? '#4CAF50' : 
                                           statusGroup.status === 'overdue' ? '#F44336' : 
                                           '#FF9800' 
                          }
                        ]} 
                      />
                      <Text style={styles.statusLabel}>
                        {statusGroup.status === 'paid' ? 'Paid' : 
                         statusGroup.status === 'overdue' ? 'Overdue' :
                         'Pending'}
                      </Text>
                      <Text style={styles.statusCount}>{statusGroup.count} members</Text>
                    </View>
                    
                    {groupData.settings.showMemberNames && statusGroup.members && (
                      <View style={styles.membersList}>
                        {statusGroup.members.slice(0, 3).map((member, memberIndex) => (
                          <View key={memberIndex} style={styles.memberItem}>
                            <View style={styles.memberAvatar}>
                              {member.avatar ? (
                                <Avatar.Image source={{ uri: member.avatar }} size={24} />
                              ) : (
                                <Avatar.Text label={member.name.substring(0, 2)} size={24} />
                              )}
                            </View>
                            <Text style={styles.memberName}>{member.name}</Text>
                            {statusGroup.status === 'paid' && member.daysEarly > 0 && (
                              <Chip size="small" style={styles.earlyChip}>
                                {member.daysEarly}d early
                              </Chip>
                            )}
                            {statusGroup.status === 'overdue' && (
                              <Chip size="small" style={styles.lateChip}>
                                {member.daysLate}d late
                              </Chip>
                            )}
                          </View>
                        ))}
                        
                        {statusGroup.members.length > 3 && (
                          <TouchableOpacity style={styles.viewMoreButton}>
                            <Text style={styles.viewMoreText}>
                              +{statusGroup.members.length - 3} more
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}
        
        {/* My Commitments */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.commitmentHeader}>
              <Title style={styles.cardTitle}>My Payment Commitments</Title>
              
              <IconButton
                icon="plus-circle"
                size={24}
                color={theme.colors.primary}
                onPress={() => setShowCommitmentDialog(true)}
              />
            </View>
            
            {commitments.filter(c => c.memberId === user.id).length > 0 ? (
              <View style={styles.commitmentsList}>
                {commitments
                  .filter(c => c.memberId === user.id)
                  .map((commitment, index) => (
                    <View key={index} style={styles.commitmentItem}>
                      <View style={styles.commitmentLeft}>
                        <Text style={styles.commitmentAmount}>
                          {formatCurrency(commitment.amount)}
                        </Text>
                        <Text style={styles.commitmentDate}>
                          Due by {formatDate(commitment.dueDate)}
                        </Text>
                        {commitment.reason && (
                          <Text style={styles.commitmentReason}>
                            "{commitment.reason}"
                          </Text>
                        )}
                      </View>
                      
                      <View style={styles.commitmentRight}>
                        {commitment.status === 'pending' && (
                          <Button 
                            mode="outlined" 
                            compact 
                            onPress={() => handleAcknowledgePayment(commitment.id)}
                          >
                            Complete
                          </Button>
                        )}
                        
                        {commitment.status === 'completed' && (
                          <Chip icon="check-circle" style={styles.completedChip}>
                            Completed
                          </Chip>
                        )}
                        
                        {commitment.status === 'overdue' && (
                          <Chip icon="alert-circle" style={styles.overdueCommitmentChip}>
                            Overdue
                          </Chip>
                        )}
                        
                        {!commitment.isPublic && (
                          <Icon name="eye-off" size={16} color="#9E9E9E" style={styles.privateIcon} />
                        )}
                      </View>
                    </View>
                  ))}
              </View>
            ) : (
              <View style={styles.emptyCommitments}>
                <Icon name="calendar-blank" size={48} color="#9E9E9E" />
                <Text style={styles.emptyCommitmentsText}>No commitments yet</Text>
                <Text style={styles.emptyCommitmentsSubtext}>
                  Make a public commitment to pay on time
                </Text>
                <Button 
                  mode="contained" 
                  icon="plus"
                  onPress={() => setShowCommitmentDialog(true)}
                  style={styles.emptyButton}
                >
                  Create Commitment
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Group Milestones */}
        {groupData.settings.enableCommunityGoals && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Group Milestones</Title>
              
              <View style={styles.milestonesList}>
                {milestones.map((milestone, index) => (
                  <View key={index} style={styles.milestoneItem}>
                    <View 
                      style={[
                        styles.milestoneIconContainer,
                        { backgroundColor: milestone.completed ? '#E8F5E9' : '#EEEEEE' }
                      ]}
                    >
                      <Icon 
                        name={milestone.icon} 
                        size={28} 
                        color={milestone.completed ? '#4CAF50' : '#9E9E9E'} 
                      />
                    </View>
                    
                    <View style={styles.milestoneContent}>
                      <View style={styles.milestoneHeader}>
                        <Text style={styles.milestoneName}>{milestone.name}</Text>
                        {milestone.completed && (
                          <Chip 
                            icon="trophy" 
                            style={styles.achievedChip}
                            textStyle={styles.achievedChipText}
                          >
                            Achieved
                          </Chip>
                        )}
                      </View>
                      
                      <Text style={styles.milestoneDescription}>
                        {milestone.description}
                      </Text>
                      
                      <ProgressBar
                        progress={milestone.progress}
                        color={milestone.completed ? '#4CAF50' : theme.colors.primary}
                        style={styles.milestoneProgress}
                      />
                      
                      <View style={styles.milestoneStats}>
                        <Text style={styles.milestoneTarget}>
                          {milestone.currentValue}/{milestone.targetValue} {milestone.unit}
                        </Text>
                        <Text style={styles.milestonePercentage}>
                          {Math.round(milestone.progress * 100)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    );
  
  const renderLeaderboardTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Commitment Leaderboard */}
      {groupData.settings.enableLeaderboard && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Commitment Leaderboard</Title>
            
            <View style={styles.leaderboardContainer}>
              {/* Top 3 Users */}
              <View style={styles.topThreeContainer}>
                {/* Second Place */}
                {leaderboard.length > 1 && (
                  <View style={styles.topUserContainer}>
                    <View style={styles.secondPlacePosition}>
                      <Text style={styles.secondPlaceText}>2</Text>
                    </View>
                    
                    <View style={styles.topUserAvatar}>
                      {leaderboard[1].avatar ? (
                        <Avatar.Image source={{ uri: leaderboard[1].avatar }} size={50} />
                      ) : (
                        <Avatar.Text label={leaderboard[1].name.substring(0, 2)} size={50} />
                      )}
                    </View>
                    
                    <Text style={styles.topUserName}>{leaderboard[1].name}</Text>
                    <Text style={styles.topUserScore}>{leaderboard[1].score} pts</Text>
                  </View>
                )}
                
                {/* First Place */}
                {leaderboard.length > 0 && (
                  <View style={styles.topUserContainer}>
                    <View style={styles.firstPlacePosition}>
                      <Text style={styles.firstPlaceText}>1</Text>
                    </View>
                    
                    <View style={styles.topUserAvatar}>
                      {leaderboard[0].avatar ? (
                        <Avatar.Image source={{ uri: leaderboard[0].avatar }} size={60} />
                      ) : (
                        <Avatar.Text label={leaderboard[0].name.substring(0, 2)} size={60} />
                      )}
                    </View>
                    
                    <Text style={styles.topUserName}>{leaderboard[0].name}</Text>
                    <Text style={styles.topUserScore}>{leaderboard[0].score} pts</Text>
                  </View>
                )}
                
                {/* Third Place */}
                {leaderboard.length > 2 && (
                  <View style={styles.topUserContainer}>
                    <View style={styles.thirdPlacePosition}>
                      <Text style={styles.thirdPlaceText}>3</Text>
                    </View>
                    
                    <View style={styles.topUserAvatar}>
                      {leaderboard[2].avatar ? (
                        <Avatar.Image source={{ uri: leaderboard[2].avatar }} size={50} />
                      ) : (
                        <Avatar.Text label={leaderboard[2].name.substring(0, 2)} size={50} />
                      )}
                    </View>
                    
                    <Text style={styles.topUserName}>{leaderboard[2].name}</Text>
                    <Text style={styles.topUserScore}>{leaderboard[2].score} pts</Text>
                  </View>
                )}
              </View>
              
              {/* Rest of Leaderboard */}
              <View style={styles.leaderboardList}>
                {leaderboard.slice(3).map((user, index) => (
                  <View key={index} style={styles.leaderboardItem}>
                    <Text style={styles.leaderboardPosition}>{index + 4}</Text>
                    
                    <View style={styles.leaderboardUserInfo}>
                      {user.avatar ? (
                        <Avatar.Image source={{ uri: user.avatar }} size={36} style={styles.leaderboardAvatar} />
                      ) : (
                        <Avatar.Text label={user.name.substring(0, 2)} size={36} style={styles.leaderboardAvatar} />
                      )}
                      
                      <Text style={styles.leaderboardName}>{user.name}</Text>
                    </View>
                    
                    <Text style={styles.leaderboardScore}>{user.score} pts</Text>
                  </View>
                ))}
              </View>
              
              <Divider style={styles.leaderboardDivider} />
              
              {/* Your Position */}
              {memberStats && (
                <View style={styles.yourPosition}>
                  <Text style={styles.yourPositionLabel}>Your Position</Text>
                  
                  <View style={styles.yourPositionItem}>
                    <Text style={styles.yourPositionNumber}>
                      {memberStats.leaderboardPosition}
                    </Text>
                    
                    <View style={styles.yourPositionInfo}>
                      <Text style={styles.yourPositionName}>You</Text>
                      <Text style={styles.yourPositionScore}>{memberStats.score} pts</Text>
                    </View>
                    
                    <View style={styles.yourPositionBadges}>
                      {memberStats.badges.map((badge, index) => (
                        <Chip 
                          key={index}
                          style={styles.badgeChip}
                          icon={() => <Icon name={badge.icon} size={16} color={badge.color} />}
                        >
                          {badge.name}
                        </Chip>
                      ))}
                    </View>
                  </View>
                </View>
              )}
              
              <View style={styles.leaderboardInfo}>
                <Text style={styles.leaderboardInfoTitle}>How Points Are Earned</Text>
                
                <View style={styles.pointsRow}>
                  <Icon name="check-circle" size={20} color="#4CAF50" style={styles.pointsIcon} />
                  <Text style={styles.pointsText}>On-time payment: +10 points</Text>
                </View>
                
                <View style={styles.pointsRow}>
                  <Icon name="cash-fast" size={20} color="#2196F3" style={styles.pointsIcon} />
                  <Text style={styles.pointsText}>Early payment: +2 points per day</Text>
                </View>
                
                <View style={styles.pointsRow}>
                  <Icon name="calendar-check" size={20} color="#9C27B0" style={styles.pointsIcon} />
                  <Text style={styles.pointsText}>Public commitment kept: +5 points</Text>
                </View>
                
                <View style={styles.pointsRow}>
                  <Icon name="clock-alert" size={20} color="#F44336" style={styles.pointsIcon} />
                  <Text style={styles.pointsText}>Late payment: -5 points</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}
      
      {/* Commitment Wall */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Community Commitment Wall</Title>
          
          <View style={styles.publicCommitments}>
            {commitments
              .filter(c => c.isPublic)
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map((commitment, index) => (
                <View key={index} style={styles.publicCommitmentItem}>
                  <View style={styles.commitmentUserInfo}>
                    {commitment.memberAvatar ? (
                      <Avatar.Image source={{ uri: commitment.memberAvatar }} size={36} style={styles.commitmentAvatar} />
                    ) : (
                      <Avatar.Text label={commitment.memberName.substring(0, 2)} size={36} style={styles.commitmentAvatar} />
                    )}
                    
                    <View style={styles.commitmentUserDetails}>
                      <Text style={styles.commitmentUserName}>{commitment.memberName}</Text>
                      <Text style={styles.commitmentTimestamp}>
                        {formatDate(commitment.createdAt)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.publicCommitmentContent}>
                    <Text style={styles.publicCommitmentText}>
                      I commit to paying <Text style={styles.highlightText}>{formatCurrency(commitment.amount)}</Text> by <Text style={styles.highlightText}>{formatDate(commitment.dueDate)}</Text>
                      {commitment.reason ? ` because "${commitment.reason}"` : ''}
                    </Text>
                    
                    <View style={styles.commitmentStatus}>
                      {commitment.status === 'completed' && (
                        <Chip icon="check-circle" style={styles.completedChip}>
                          Completed on {formatDate(commitment.completedDate)}
                        </Chip>
                      )}
                      
                      {commitment.status === 'pending' && (
                        <Chip icon="clock-outline" style={styles.pendingChip}>
                          Due in {Math.max(0, Math.ceil((new Date(commitment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))} days
                        </Chip>
                      )}
                      
                      {commitment.status === 'overdue' && (
                        <Chip icon="alert-circle" style={styles.overdueCommitmentChip}>
                          Overdue by {Math.ceil((new Date() - new Date(commitment.dueDate)) / (1000 * 60 * 60 * 24))} days
                        </Chip>
                      )}
                    </View>
                    
                    <View style={styles.commitmentActions}>
                      <Button 
                        mode="text" 
                        compact
                        icon="thumb-up"
                        onPress={() => {/* Handle like */}}
                      >
                        {commitment.likes || 0}
                      </Button>
                      
                      <Button 
                        mode="text" 
                        compact
                        icon="message-outline"
                        onPress={() => {/* Handle comment */}}
                      >
                        {commitment.comments?.length || 0}
                      </Button>
                    </View>
                  </View>
                </View>
              ))}
              
            {commitments.filter(c => c.isPublic).length === 0 && (
              <View style={styles.emptyCommitments}>
                <Icon name="text-box-outline" size={48} color="#9E9E9E" />
                <Text style={styles.emptyCommitmentsText}>No public commitments</Text>
                <Text style={styles.emptyCommitmentsSubtext}>
                  Be the first to make a public commitment
                </Text>
                <Button 
                  mode="contained" 
                  icon="plus"
                  onPress={() => setShowCommitmentDialog(true)}
                  style={styles.emptyButton}
                >
                  Create Commitment
                </Button>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
  
  const renderCommitmentDialog = () => (
    <Portal>
      <Dialog
        visible={showCommitmentDialog}
        onDismiss={() => setShowCommitmentDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Create Payment Commitment</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogSubtitle}>
            Making a commitment helps you stay accountable
          </Text>
          
          <TextInput
            label="Payment Amount"
            value={newCommitment.amount}
            onChangeText={(text) => setNewCommitment({ ...newCommitment, amount: text })}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.dialogInput}
            left={<TextInput.Affix text="$" />}
          />
          
          {/* Due date picker would go here - use DateTimePicker component */}
          {/* For simplicity, we're just using a fixed date in this example */}
          
          <TextInput
            label="Reason (Optional)"
            value={newCommitment.reason}
            onChangeText={(text) => setNewCommitment({ ...newCommitment, reason: text })}
            mode="outlined"
            style={styles.dialogInput}
            placeholder="e.g., To help our group reach its goal"
          />
          
          <View style={styles.publicOption}>
            <Text style={styles.publicOptionLabel}>Make this commitment public</Text>
            <Switch
              value={newCommitment.isPublic}
              onValueChange={(value) => setNewCommitment({ ...newCommitment, isPublic: value })}
            />
          </View>
          
          <Text style={styles.publicOptionDescription}>
            Public commitments are visible to all group members and help encourage community accountability
          </Text>
        </Dialog.Content>
        
        <Dialog.Actions>
          <Button onPress={() => setShowCommitmentDialog(false)}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleCreateCommitment}
          >
            Create
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderShareDialog = () => (
    <Portal>
      <Dialog
        visible={showShareDialog}
        onDismiss={() => setShowShareDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Share Group Progress</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.sharePreviewTitle}>Preview</Text>
          
          <View style={styles.sharePreview}>
            <View style={styles.sharePreviewHeader}>
              <Text style={styles.sharePreviewGroup}>{groupName}</Text>
              <Text style={styles.sharePreviewDate}>{new Date().toDateString()}</Text>
            </View>
            
            <View style={styles.sharePreviewStats}>
              <View style={styles.sharePreviewStat}>
                <Text style={styles.sharePreviewStatValue}>{formatPercentage(groupStats.onTimePaymentRate)}</Text>
                <Text style={styles.sharePreviewStatLabel}>On-Time Rate</Text>
              </View>
              
              <View style={styles.sharePreviewStat}>
                <Text style={styles.sharePreviewStatValue}>{groupStats.totalAmountCollected}</Text>
                <Text style={styles.sharePreviewStatLabel}>Collected</Text>
              </View>
              
              <View style={styles.sharePreviewStat}>
                <Text 
                  style={[
                    styles.sharePreviewStatValue,
                    { 
                      color: groupStats.groupHealth > 80 ? '#4CAF50' : 
                             groupStats.groupHealth > 50 ? '#FF9800' : 
                             '#F44336' 
                    }
                  ]}
                >
                  {groupStats.groupHealth}/100
                </Text>
                <Text style={styles.sharePreviewStatLabel}>Group Health</Text>
              </View>
            </View>
            
            <Text style={styles.sharePreviewMessage}>
              Our group is making great progress with {groupStats.completedCommitments} commitments fulfilled this month!
            </Text>
          </View>
          
          <Text style={styles.shareDescription}>
            Share this progress update with your social networks to celebrate your group's achievements.
          </Text>
        </Dialog.Content>
        
        <Dialog.Actions>
          <Button onPress={() => setShowShareDialog(false)}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            icon="share-variant"
            onPress={handleShareProgress}
          >
            Share
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
        style={styles.dialog}
      >
        <Dialog.Title>Accountability Settings</Dialog.Title>
        <Dialog.ScrollArea style={styles.dialogScrollArea}>
          <ScrollView>
            <View style={styles.settingsContent}>
              <List.Item
                title="Enable Public Stats"
                description="Allow members to see anonymous payment statistics"
                left={props => <List.Icon {...props} icon="chart-bar" />}
                right={props => (
                  <Switch
                    value={accountabilitySettings.enablePublicStats}
                    onValueChange={(value) => 
                      setAccountabilitySettings({ ...accountabilitySettings, enablePublicStats: value })
                    }
                  />
                )}
              />
              
              <Divider />
              
              <List.Item
                title="Show Member Names"
                description="Display names with payment statuses"
                left={props => <List.Icon {...props} icon="account-details" />}
                right={props => (
                  <Switch
                    value={accountabilitySettings.showMemberNames}
                    onValueChange={(value) => 
                      setAccountabilitySettings({ ...accountabilitySettings, showMemberNames: value })
                    }
                    disabled={!accountabilitySettings.enablePublicStats}
                  />
                )}
              />
              
              <Divider />
              
              <List.Item
                title="Enable Leaderboard"
                description="Show payment performance rankings"
                left={props => <List.Icon {...props} icon="podium" />}
                right={props => (
                  <Switch
                    value={accountabilitySettings.enableLeaderboard}
                    onValueChange={(value) => 
                      setAccountabilitySettings({ ...accountabilitySettings, enableLeaderboard: value })
                    }
                    disabled={!accountabilitySettings.enablePublicStats}
                  />
                )}
              />
              
              <Divider />
              
              <List.Item
                title="Enable Community Goals"
                description="Set and track group payment milestones"
                left={props => <List.Icon {...props} icon="flag-checkered" />}
                right={props => (
                  <Switch
                    value={accountabilitySettings.enableCommunityGoals}
                    onValueChange={(value) => 
                      setAccountabilitySettings({ ...accountabilitySettings, enableCommunityGoals: value })
                    }
                  />
                )}
              />
              
              <Divider />
              
              <List.Item
                title="Group Updates"
                description="Send regular progress notifications"
                left={props => <List.Icon {...props} icon="bell-ring" />}
                right={props => (
                  <Switch
                    value={accountabilitySettings.sendGroupUpdates}
                    onValueChange={(value) => 
                      setAccountabilitySettings({ ...accountabilitySettings, sendGroupUpdates: value })
                    }
                  />
                )}
              />
              
              <Divider />
              
              <List.Subheader>Update Frequency</List.Subheader>
              <RadioButton.Group
                onValueChange={(value) => 
                  setAccountabilitySettings({ ...accountabilitySettings, reminderFrequency: value })
                }
                value={accountabilitySettings.reminderFrequency}
              >
                <RadioButton.Item
                  label="Weekly"
                  value="weekly"
                  disabled={!accountabilitySettings.sendGroupUpdates}
                />
                <RadioButton.Item
                  label="Bi-weekly"
                  value="biweekly"
                  disabled={!accountabilitySettings.sendGroupUpdates}
                />
                <RadioButton.Item
                  label="Monthly"
                  value="monthly"
                  disabled={!accountabilitySettings.sendGroupUpdates}
                />
              </RadioButton.Group>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        
        <Dialog.Actions>
          <Button onPress={() => setShowSettingsDialog(false)}>
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleUpdateSettings}
          >
            Save
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading accountability data...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>{groupName}</Text>
        <Text style={styles.screenSubtitle}>Community Accountability</Text>
        
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Icon 
              name="chart-donut" 
              size={20} 
              color={activeTab === 'overview' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'overview' ? styles.activeTabText : styles.inactiveTabText
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
            onPress={() => setActiveTab('leaderboard')}
          >
            <Icon 
              name="account-group" 
              size={20} 
              color={activeTab === 'leaderboard' ? '#fff' : 'rgba(255, 255, 255, 0.7)'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'leaderboard' ? styles.activeTabText : styles.inactiveTabText
              ]}
            >
              Community
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content section */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'leaderboard' && renderLeaderboardTab()}
      
      {/* Settings FAB */}
      <FAB
        style={styles.fab}
        small
        icon="cog"
        onPress={() => setShowSettingsDialog(true)}
      />
      
      {/* Dialogs */}
      {renderCommitmentDialog()}
      {renderShareDialog()}
      {renderSettingsDialog()}
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
  card: {
    marginBottom: 16,
    borderRadius: 8
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16
  },
  progressContainer: {
    marginBottom: 16
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  progressStat: {
    alignItems: 'center'
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  chartContainer: {
    alignItems: 'center'
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    marginRight: 4
  },
  legendValue: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  recentUpdate: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginTop: 16
  },
  recentUpdateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  recentUpdateTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8
  },
  recentUpdateText: {
    fontSize: 14,
    marginBottom: 8
  },
  recentUpdateDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right'
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  memberStatusContainer: {
    marginTop: 8
  },
  statusGroup: {
    marginBottom: 16
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8
  },
  statusCount: {
    fontSize: 14,
    color: '#666'
  },
  membersList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  memberAvatar: {
    marginRight: 8
  },
  memberName: {
    flex: 1,
    fontSize: 14
  },
  earlyChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    height: 24
  },
  lateChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    height: 24
  },
  viewMoreButton: {
    alignItems: 'center',
    padding: 8
  },
  viewMoreText: {
    color: theme.colors.primary,
    fontSize: 12
  },
  commitmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  commitmentsList: {
    marginTop: 8
  },
  commitmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8
  },
  commitmentLeft: {
    flex: 1
  },
  commitmentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  commitmentDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  commitmentReason: {
    fontSize: 12,
    fontStyle: 'italic'
  },
  commitmentRight: {
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  completedChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    marginBottom: 4
  },
  overdueCommitmentChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    marginBottom: 4
  },
  privateIcon: {
    marginTop: 4
  },
  emptyCommitments: {
    alignItems: 'center',
    padding: 20
  },
  emptyCommitmentsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4
  },
  emptyCommitmentsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16
  },
  emptyButton: {
    marginTop: 8
  },
  milestonesList: {
    marginTop: 8
  },
  milestoneItem: {
    flexDirection: 'row',
    marginBottom: 16
  },
  milestoneIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  milestoneContent: {
    flex: 1
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  milestoneName: {
    fontSize: 16,
    fontWeight: '500'
  },
  achievedChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    height: 24
  },
  achievedChipText: {
    fontSize: 10
  },
  milestoneDescription: {
    fontSize: 14,
    marginBottom: 8
  },
  milestoneProgress: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4
  },
  milestoneStats: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  milestoneTarget: {
    fontSize: 12
  },
  milestonePercentage: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  leaderboardContainer: {
    marginTop: 8
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 24,
    paddingHorizontal: 16
  },
  topUserContainer: {
    alignItems: 'center',
    marginHorizontal: 12
  },
  firstPlacePosition: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  firstPlaceText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  secondPlacePosition: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  secondPlaceText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  thirdPlacePosition: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CD7F32',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  thirdPlaceText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  topUserAvatar: {
    marginBottom: 8
  },
  topUserName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  topUserScore: {
    fontSize: 12,
    color: '#666'
  },
  leaderboardList: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  leaderboardPosition: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 24,
    textAlign: 'center',
    marginRight: 12
  },
  leaderboardUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  leaderboardAvatar: {
    marginRight: 12
  },
  leaderboardName: {
    fontSize: 14
  },
  leaderboardScore: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  leaderboardDivider: {
    marginVertical: 16
  },
  yourPosition: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12
  },
  yourPositionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  yourPositionItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  yourPositionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 24,
    textAlign: 'center',
    marginRight: 12
  },
  yourPositionInfo: {
    flex: 1
  },
  yourPositionName: {
    fontSize: 14,
    fontWeight: '500'
  },
  yourPositionScore: {
    fontSize: 12,
    color: '#666'
  },
  yourPositionBadges: {
    flexDirection: 'row'
  },
  badgeChip: {
    marginLeft: 8,
    height: 24
  },
  leaderboardInfo: {
    marginTop: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12
  },
  leaderboardInfoTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  pointsIcon: {
    marginRight: 8
  },
  pointsText: {
    fontSize: 14
  },
  publicCommitments: {
    marginTop: 8
  },
  publicCommitmentItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  commitmentUserInfo: {
    flexDirection: 'row',
    marginBottom: 8
  },
  commitmentAvatar: {
    marginRight: 12
  },
  commitmentUserDetails: {
    flex: 1
  },
  commitmentUserName: {
    fontSize: 14,
    fontWeight: '500'
  },
  commitmentTimestamp: {
    fontSize: 12,
    color: '#666'
  },
  publicCommitmentContent: {
    marginLeft: 48
  },
  publicCommitmentText: {
    fontSize: 14,
    marginBottom: 8
  },
  highlightText: {
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  commitmentStatus: {
    marginBottom: 8
  },
  pendingChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)'
  },
  commitmentActions: {
    flexDirection: 'row'
  },
  dialog: {
    borderRadius: 8
  },
  dialogSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  dialogInput: {
    marginBottom: 16
  },
  publicOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  publicOptionLabel: {
    fontSize: 16
  },
  publicOptionDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  sharePreviewTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8
  },
  sharePreview: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16
  },
  sharePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sharePreviewGroup: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  sharePreviewDate: {
    fontSize: 12,
    color: '#666'
  },
  sharePreviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  sharePreviewStat: {
    alignItems: 'center'
  },
  sharePreviewStatValue: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  sharePreviewStatLabel: {
    fontSize: 12,
    color: '#666'
  },
  sharePreviewMessage: {
    fontSize: 14,
    fontStyle: 'italic'
  },
  shareDescription: {
    fontSize: 14,
    color: '#666'
  },
  dialogScrollArea: {
    paddingHorizontal: 0
  },
  settingsContent: {
    paddingVertical: 8
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  }
});

export default CommunityAccountabilityScreen;'import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Share
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
  TextInput,
  List,
  ProgressBar,
  Switch,
  IconButton,
  Badge,
  FAB
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getGroupAccountability,
  getGroupStats,
  getPaymentCommitments,
  createPaymentCommitment,
  getMemberStats,
  getGroupMilestones,
  getCommitmentLeaderboard,
  shareGroupProgress,
  updateAccountabilitySettings,
  publishAnonymousUpdate,
  acknowledgePayment
} from '../../services/api/groupAccountability';
import { formatCurrency, formatDate, formatPercentage } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import theme from '../../config/theme';

const CommunityAccountabilityScreen = () => {
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [groupStats, setGroupStats] = useState(null);
  const [memberStats, setMemberStats] = useState(null);
  const [commitments, setCommitments] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCommitmentDialog, setShowCommitmentDialog] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [newCommitment, setNewCommitment] = useState({
    amount: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // One week from now
    reason: '',
    isPublic: true
  });
  const [accountabilitySettings, setAccountabilitySettings] = useState({
    enablePublicStats: true,
    showMemberNames: true,
    enableLeaderboard: true,
    enableCommunityGoals: true,
    sendGroupUpdates: true,
    reminderFrequency: 'weekly'
  });
  
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
      // Fetch group accountability data
      const data = await getGroupAccountability(groupId);
      setGroupData(data);
      
      // Fetch group stats
      const stats = await getGroupStats(groupId);
      setGroupStats(stats);
      
      // Fetch member's personal stats
      const memberData = await getMemberStats(groupId, user.id);
      setMemberStats(memberData);
      
      // Fetch payment commitments
      const commitmentsData = await getPaymentCommitments(groupId);
      setCommitments(commitmentsData);
      
      // Fetch group milestones
      const milestonesData = await getGroupMilestones(groupId);
      setMilestones(milestonesData);
      
      // Fetch commitment leaderboard
      const leaderboardData = await getCommitmentLeaderboard(groupId);
      setLeaderboard(leaderboardData);
      
      // Set initial settings based on group data
      setAccountabilitySettings({
        enablePublicStats: data.settings.enablePublicStats,
        showMemberNames: data.settings.showMemberNames,
        enableLeaderboard: data.settings.enableLeaderboard,
        enableCommunityGoals: data.settings.enableCommunityGoals,
        sendGroupUpdates: data.settings.sendGroupUpdates,
        reminderFrequency: data.settings.reminderFrequency
      });
    } catch (error) {
      console.error('Error fetching accountability data:', error);
      Alert.alert('Error', 'Failed to load community accountability data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateCommitment = async () => {
    if (!newCommitment.amount || isNaN(parseFloat(newCommitment.amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount');
      return;
    }
    
    try {
      // Create payment commitment
      await createPaymentCommitment(groupId, {
        amount: parseFloat(newCommitment.amount),
        dueDate: newCommitment.dueDate,
        reason: newCommitment.reason,
        isPublic: newCommitment.isPublic
      });
      
      // Refresh commitments
      const commitmentsData = await getPaymentCommitments(groupId);
      setCommitments(commitmentsData);
      
      // Reset form
      setNewCommitment({
        amount: '',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        reason: '',
        isPublic: true
      });
      
      setShowCommitmentDialog(false);
      Alert.alert('Success', 'Your payment commitment has been created');
    } catch (error) {
      console.error('Error creating commitment:', error);
      Alert.alert('Error', 'Failed to create payment commitment. Please try again.');
    }
  };
  
  const handleShareProgress = async () => {
    try {
      const shareData = await shareGroupProgress(groupId);
      
      // Use React Native Share API
      const result = await Share.share({
        message: shareData.message,
        title: shareData.title,
        url: shareData.url
      });
      
      setShowShareDialog(false);
    } catch (error) {
      console.error('Error sharing progress:', error);
      Alert.alert('Error', 'Failed to share group progress. Please try again.');
    }
  };
  
  const handleUpdateSettings = async () => {
    try {
      await updateAccountabilitySettings(groupId, accountabilitySettings);
      
      // Update group data with new settings
      const data = await getGroupAccountability(groupId);
      setGroupData(data);
      
      setShowSettingsDialog(false);
      Alert.alert('Success', 'Accountability settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    }
  };
  
  const handleAcknowledgePayment = async (commitmentId) => {
    try {
      await acknowledgePayment(groupId, commitmentId);
      
      // Refresh commitments
      const commitmentsData = await getPaymentCommitments(groupId);
      setCommitments(commitmentsData);
      
      Alert.alert('Success', 'Payment marked as completed');
    } catch (error) {
      console.error('Error acknowledging payment:', error);
      Alert.alert('Error', 'Failed to update payment status. Please try again.');
    }
  };
  
  const renderOverviewTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Group Progress Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Group Payment Progress</Title>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatLabel}>On-Time Payments</Text>
                <Text style={styles.progressStatValue}>{formatPercentage(groupStats.onTimePaymentRate)}</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressStatLabel}>Active Members</Text>
                <Text style={styles.progressStatValue}>{groupStats.activeMembers}/{groupStats.totalMembers}</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressStatLabel}>Group Health</Text>
                <Text 
                  style={[
                    styles.progressStatValue,
                    { 
                      color: groupStats.groupHealth > 80 ? '#4CAF50' : 
                             groupStats.groupHealth > 50 ? '#FF9800' : 
                             '#F44336' 
                    }
                  ]}
                >
                  {groupStats.groupHealth}/100
                </Text>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              <PieChart
                data={[
                  {
                    name: 'On Time',
                    population: groupStats.paymentsOnTime,
                    color: '#4CAF50',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  },
                  {
                    name: 'Late',
                    population: groupStats.paymentsLate,
                    color: '#FF9800',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  },
                  {
                    name: 'Missing',
                    population: groupStats.paymentsMissing,
                    color: '#F44336',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12
                  }
                ]}
                width={300}
                height={180}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                hasLegend={false}
              />
              
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.legendText}>On Time</Text>
                  <Text style={styles.legendValue}>{groupStats.paymentsOnTime}</Text>
                </View>
                
                