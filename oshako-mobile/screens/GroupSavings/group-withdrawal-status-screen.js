// File: screens/GroupSavings/GroupWithdrawalStatusScreen.js (continued)
              <Text style={styles.progressLabel}>
                {approvedCount} of {totalMembers} approvals required
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${(approvedCount / totalMembers) * 100}%` }
                  ]} 
                />
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <Title style={styles.membersTitle}>Member Responses</Title>
            {withdrawal.approvals.map((approval) => (
              <List.Item
                key={approval.userId}
                title={approval.name + (approval.userId === user.id ? ' (You)' : '')}
                description={approval.declineReason ? `Reason: ${approval.declineReason}` : null}
                left={props => (
                  <Avatar.Text 
                    {...props} 
                    size={40} 
                    label={approval.name.charAt(0).toUpperCase()} 
                    backgroundColor={
                      approval.approved 
                        ? '#4caf50' 
                        : approval.declined 
                          ? '#f44336' 
                          : '#9e9e9e'
                    }
                  />
                )}
                right={props => (
                  <Chip 
                    {...props}
                    style={[
                      styles.memberStatusChip,
                      {
                        backgroundColor: approval.approved 
                          ? '#e8f5e9' 
                          : approval.declined 
                            ? '#ffebee' 
                            : '#f5f5f5'
                      }
                    ]}
                  >
                    {approval.approved 
                      ? 'Approved' 
                      : approval.declined 
                        ? 'Declined' 
                        : 'Pending'}
                  </Chip>
                )}
              />
            ))}
          </Card.Content>
        </Card>
        
        {/* Actions Card */}
        {(canApprove || canCancel || canDispute) && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.actionsTitle}>Actions</Title>
              <Divider style={styles.divider} />
              
              {canApprove && (
                <View style={styles.actionButtons}>
                  <Button
                    mode="contained"
                    icon="check"
                    onPress={() => setApproveDialogVisible(true)}
                    style={[styles.actionButton, styles.approveButton]}
                  >
                    Approve
                  </Button>
                  <Button
                    mode="contained"
                    icon="close"
                    onPress={() => setDeclineDialogVisible(true)}
                    style={[styles.actionButton, styles.declineButton]}
                  >
                    Decline
                  </Button>
                </View>
              )}
              
              {canCancel && (
                <Button
                  mode="outlined"
                  icon="cancel"
                  onPress={() => setCancelDialogVisible(true)}
                  style={styles.cancelButton}
                >
                  Cancel Withdrawal Request
                </Button>
              )}
              
              {canDispute && (
                <Button
                  mode="outlined"
                  icon="flag"
                  onPress={() => setDisputeDialogVisible(true)}
                  style={styles.disputeButton}
                >
                  Create Dispute
                </Button>
              )}
            </Card.Content>
          </Card>
        )}
        
        {/* Dispute Section */}
        {withdrawal.hasDispute && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.disputeTitle}>Dispute Information</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.disputeInfo}>
                <View style={styles.disputeHeader}>
                  <Text style={styles.disputeStatusLabel}>Status:</Text>
                  <Chip 
                    style={styles.disputeStatusChip}
                    textStyle={{ color: '#9c27b0' }}
                  >
                    {withdrawal.dispute.status}
                  </Chip>
                </View>
                
                <Text style={styles.disputeReasonLabel}>Reason for dispute:</Text>
                <Text style={styles.disputeReasonText}>{withdrawal.dispute.reason}</Text>
                
                {withdrawal.dispute.supportComment && (
                  <>
                    <Text style={styles.supportCommentLabel}>Support comment:</Text>
                    <Text style={styles.supportCommentText}>{withdrawal.dispute.supportComment}</Text>
                  </>
                )}
                
                <Text style={styles.disputeNote}>
                  Our support team is reviewing this dispute. You'll be notified when there's an update.
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}
        
        {/* Support Ticket Section */}
        {withdrawal.supportTicketId && (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.supportTitle}>Support Ticket</Title>
              <Divider style={styles.divider} />
              
              <View style={styles.supportInfo}>
                <Text style={styles.supportText}>
                  A support ticket has been created for this withdrawal request.
                  Our team will help resolve any issues.
                </Text>
                <Button
                  mode="contained"
                  icon="ticket-confirmation"
                  onPress={() => navigation.navigate('SupportTicketDetails', { 
                    ticketId: withdrawal.supportTicketId 
                  })}
                  style={styles.supportButton}
                >
                  View Support Ticket
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
      
      {/* Approve Dialog */}
      <Portal>
        <Dialog
          visible={approveDialogVisible}
          onDismiss={() => setApproveDialogVisible(false)}
        >
          <Dialog.Title>Approve Group Withdrawal</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to approve this group withdrawal request for {formatCurrency(withdrawal.amount)}?
            </Paragraph>
            <Paragraph style={styles.dialogNote}>
              Once all members approve, the funds will be released automatically.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setApproveDialogVisible(false)} 
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              mode="contained"
              onPress={handleApprove}
              loading={actionLoading}
              disabled={actionLoading}
              style={styles.approveButton}
            >
              Approve
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Decline Dialog */}
      <Portal>
        <Dialog
          visible={declineDialogVisible}
          onDismiss={() => setDeclineDialogVisible(false)}
        >
          <Dialog.Title>Decline Group Withdrawal</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Please provide a reason for declining this withdrawal request:
            </Paragraph>
            <TextInput
              label="Reason for declining"
              value={declineReason}
              onChangeText={setDeclineReason}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.dialogInput}
            />
            <Paragraph style={styles.dialogWarning}>
              Note: If you decline, the requester may open a dispute which will be reviewed by our support team.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setDeclineDialogVisible(false)} 
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              mode="contained"
              onPress={handleDecline}
              loading={actionLoading}
              disabled={actionLoading || !declineReason.trim()}
              style={styles.declineButton}
            >
              Decline
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Cancel Dialog */}
      <Portal>
        <Dialog
          visible={cancelDialogVisible}
          onDismiss={() => setCancelDialogVisible(false)}
        >
          <Dialog.Title>Cancel Withdrawal Request</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to cancel this group withdrawal request?
            </Paragraph>
            <Paragraph style={styles.dialogNote}>
              This action cannot be undone. You can create a new withdrawal request later if needed.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setCancelDialogVisible(false)} 
              disabled={actionLoading}
            >
              No, Keep It
            </Button>
            <Button 
              mode="contained"
              onPress={handleCancel}
              loading={actionLoading}
              disabled={actionLoading}
              color="#f44336"
            >
              Yes, Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      {/* Dispute Dialog */}
      <Portal>
        <Dialog
          visible={disputeDialogVisible}
          onDismiss={() => setDisputeDialogVisible(false)}
        >
          <Dialog.Title>Create Dispute</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Please provide details about why you're disputing the declined withdrawal:
            </Paragraph>
            <TextInput
              label="Reason for dispute"
              value={disputeReason}
              onChangeText={setDisputeReason}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.dialogInput}
            />
            <Paragraph style={styles.dialogNote}>
              Our support team will review your dispute and help resolve the issue.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setDisputeDialogVisible(false)} 
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              mode="contained"
              onPress={handleCreateDispute}
              loading={actionLoading}
              disabled={actionLoading || !disputeReason.trim()}
              color="#9c27b0"
            >
              Submit Dispute
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    padding: 16
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  timestamp: {
    fontSize: 12,
    color: '#666'
  },
  statusChip: {
    height: 30,
    justifyContent: 'center'
  },
  divider: {
    marginVertical: 16
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 16
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  requesterContainer: {
    flexDirection: 'row',
    marginBottom: 12
  },
  requesterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8
  },
  requesterName: {
    fontSize: 14
  },
  reasonContainer: {
    marginBottom: 16
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  reasonText: {
    fontSize: 14
  },
  bankAccountContainer: {
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 4
  },
  bankAccountLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#2E7D32'
  },
  bankAccountInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bankIcon: {
    marginRight: 8
  },
  bankAccountText: {
    fontSize: 14
  },
  distributionContainer: {
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 4
  },
  distributionLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#0d47a1'
  },
  distributionText: {
    fontSize: 14
  },
  approvalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  approvalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16
  },
  approvalStat: {
    alignItems: 'center'
  },
  approvalStatValue: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  approvalStatLabel: {
    fontSize: 14,
    color: '#666'
  },
  progressContainer: {
    marginBottom: 16
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center'
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50'
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  memberStatusChip: {
    height: 24
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4
  },
  approveButton: {
    backgroundColor: '#4caf50'
  },
  declineButton: {
    backgroundColor: '#f44336'
  },
  cancelButton: {
    borderColor: '#f44336',
    borderWidth: 1
  },
  disputeButton: {
    borderColor: '#9c27b0',
    borderWidth: 1
  },
  disputeTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  disputeInfo: {
    padding: 12,
    backgroundColor: '#f3e5f5',
    borderRadius: 4
  },
  disputeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  disputeStatusLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8
  },
  disputeStatusChip: {
    backgroundColor: '#f3e5f5',
    borderWidth: 1,
    borderColor: '#9c27b0'
  },
  disputeReasonLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  disputeReasonText: {
    fontSize: 14,
    marginBottom: 12
  },
  supportCommentLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4
  },
  supportCommentText: {
    fontSize: 14,
    marginBottom: 12,
    fontStyle: 'italic'
  },
  disputeNote: {
    fontSize: 14,
    color: '#9c27b0',
    fontStyle: 'italic'
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  supportInfo: {
    alignItems: 'center'
  },
  supportText: {
    textAlign: 'center',
    marginBottom: 16
  },
  supportButton: {
    backgroundColor: '#2196f3'
  },
  dialogInput: {
    marginTop: 8,
    marginBottom: 16
  },
  dialogNote: {
    fontStyle: 'italic',
    marginTop: 8
  },
  dialogWarning: {
    color: '#f44336',
    fontStyle: 'italic'
  }
});

export default GroupWithdrawalStatusScreen;
