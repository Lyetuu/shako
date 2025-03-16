        <Dialog.Actions>
          <Button onPress={handleClearFilters}>Clear All</Button>
          <Button mode="contained" onPress={handleApplyFilters}>Apply Filters</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderReminderDialog = () => (
    <Portal>
      <Dialog
        visible={showReminderDialog}
        onDismiss={() => !sending && setShowReminderDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Send Bulk Reminders</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.dialogRecipient}>
            To: {selectedMembers.length} selected members
          </Text>
          
          <TextInput
            label="Reminder Message"
            value={reminderMessage}
            onChangeText={setReminderMessage}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.messageInput}
            disabled={sending}
          />
          
          <Text style={styles.channelsTitle}>Notification Channels</Text>
          <View style={styles.channelsContainer}>
            <TouchableOpacity 
              style={[
                styles.channelOption,
                selectedChannels.includes('app') && styles.channelSelected
              ]}
              onPress={() => {
                setSelectedChannels(prev => 
                  prev.includes('app') 
                    ? prev.filter(ch => ch !== 'app')
                    : [...prev, 'app']
                );
              }}
              disabled={sending}
            >
              <Icon 
                name="cellphone" 
                size={24} 
                color={selectedChannels.includes('app') ? theme.colors.primary : '#888'} 
              />
              <Text 
                style={[
                  styles.channelText,
                  selectedChannels.includes('app') && styles.channelTextSelected
                ]}
              >
                App
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.channelOption,
                selectedChannels.includes('email') && styles.channelSelected
              ]}
              onPress={() => {
                setSelectedChannels(prev => 
                  prev.includes('email') 
                    ? prev.filter(ch => ch !== 'email')
                    : [...prev, 'email']
                );
              }}
              disabled={sending}
            >
              <Icon 
                name="email" 
                size={24} 
                color={selectedChannels.includes('email') ? theme.colors.primary : '#888'} 
              />
              <Text 
                style={[
                  styles.channelText,
                  selectedChannels.includes('email') && styles.channelTextSelected
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.channelOption,
                selectedChannels.includes('whatsapp') && styles.channelSelected
              ]}
              onPress={() => {
                setSelectedChannels(prev => 
                  prev.includes('whatsapp') 
                    ? prev.filter(ch => ch !== 'whatsapp')
                    : [...prev, 'whatsapp']
                );
              }}
              disabled={sending}
            >
              <Icon 
                name="whatsapp" 
                size={24} 
                color={selectedChannels.includes('whatsapp') ? '#25D366' : '#888'} 
              />
              <Text 
                style={[
                  styles.channelText,
                  selectedChannels.includes('whatsapp') && styles.channelTextSelected
                ]}
              >
                WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
          
          <Paragraph style={styles.dialogInfo}>
            The reminder will be sent to all selected members through the selected channels if they have them enabled.
          </Paragraph>
        </Dialog.Content>
        
        <Dialog.Actions>
          <Button 
            onPress={() => setShowReminderDialog(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSendBulkReminders}
            loading={sending}
            disabled={sending || !reminderMessage.trim() || selectedChannels.length === 0 || selectedMembers.length === 0}
          >
            Send to {selectedMembers.length} Members
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderSegmentDialog = () => (
    <Portal>
      <Dialog
        visible={showSegmentDialog}
        onDismiss={() => !sending && setShowSegmentDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Send Segment Reminders</Dialog.Title>
        <Dialog.Content>
          {activeSegment && (
            <View style={styles.selectedSegmentHeader}>
              <Icon 
                name={DEFAULTER_SEGMENTS[activeSegment].icon} 
                size={24} 
                color={DEFAULTER_SEGMENTS[activeSegment].color} 
              />
              <Text style={styles.selectedSegmentTitle}>
                {DEFAULTER_SEGMENTS[activeSegment].title}
              </Text>
            </View>
          )}
          
          <TextInput
            label="Reminder Message"
            value={reminderMessage}
            onChangeText={setReminderMessage}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.messageInput}
            disabled={sending}
          />
          
          <Text style={styles.channelsTitle}>Notification Channels</Text>
          <View style={styles.channelsContainer}>
            <TouchableOpacity 
              style={[
                styles.channelOption,
                selectedChannels.includes('app') && styles.channelSelected
              ]}
              onPress={() => {
                setSelectedChannels(prev => 
                  prev.includes('app') 
                    ? prev.filter(ch => ch !== 'app')
                    : [...prev, 'app']
                );
              }}
              disabled={sending}
            >
              <Icon 
                name="cellphone" 
                size={24} 
                color={selectedChannels.includes('app') ? theme.colors.primary : '#888'} 
              />
              <Text 
                style={[
                  styles.channelText,
                  selectedChannels.includes('app') && styles.channelTextSelected
                ]}
              >
                App
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.channelOption,
                selectedChannels.includes('email') && styles.channelSelected
              ]}
              onPress={() => {
                setSelectedChannels(prev => 
                  prev.includes('email') 
                    ? prev.filter(ch => ch !== 'email')
                    : [...prev, 'email']
                );
              }}
              disabled={sending}
            >
              <Icon 
                name="email" 
                size={24} 
                color={selectedChannels.includes('email') ? theme.colors.primary : '#888'} 
              />
              <Text 
                style={[
                  styles.channelText,
                  selectedChannels.includes('email') && styles.channelTextSelected
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.channelOption,
                selectedChannels.includes('whatsapp') && styles.channelSelected
              ]}
              onPress={() => {
                setSelectedChannels(prev => 
                  prev.includes('whatsapp') 
                    ? prev.filter(ch => ch !== 'whatsapp')
                    : [...prev, 'whatsapp']
                );
              }}
              disabled={sending}
            >
              <Icon 
                name="whatsapp" 
                size={24} 
                color={selectedChannels.includes('whatsapp') ? '#25D366' : '#888'} 
              />
              <Text 
                style={[
                  styles.channelText,
                  selectedChannels.includes('whatsapp') && styles.channelTextSelected
                ]}
              >
                WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
          
          <Paragraph style={styles.dialogInfo}>
            The reminder will be customized and sent to all members in the "{DEFAULTER_SEGMENTS[activeSegment]?.title}" segment.
          </Paragraph>
        </Dialog.Content>
        
        <Dialog.Actions>
          <Button 
            onPress={() => setShowSegmentDialog(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSendSegmentedReminders}
            loading={sending}
            disabled={sending || !reminderMessage.trim() || selectedChannels.length === 0 || !activeSegment}
          >
            Send to Segment
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  const renderBulkSuccessDialog = () => (
    <Portal>
      <Dialog
        visible={showBulkSuccessDialog}
        onDismiss={() => setShowBulkSuccessDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>
          <Icon 
            name="check-circle" 
            size={24} 
            color="#4CAF50" 
            style={{ marginRight: 8 }} 
          />
          Success
        </Dialog.Title>
        <Dialog.Content>
          {bulkActionResult && (
            <>
              <Text style={styles.successTitle}>{bulkActionResult.action}</Text>
              <View style={styles.successStats}>
                <View style={styles.successStatItem}>
                  <Text style={styles.successStatLabel}>Members:</Text>
                  <Text style={styles.successStatValue}>{bulkActionResult.count}</Text>
                </View>
                
                {bulkActionResult.channels && (
                  <View style={styles.successStatItem}>
                    <Text style={styles.successStatLabel}>Channels:</Text>
                    <Text style={styles.successStatValue}>
                      {bulkActionResult.channels.join(', ')}
                    </Text>
                  </View>
                )}
                
                {bulkActionResult.failedCount > 0 && (
                  <View style={styles.successStatItem}>
                    <Text style={styles.successStatLabel}>Failed:</Text>
                    <Text style={[styles.successStatValue, { color: '#F44336' }]}>
                      {bulkActionResult.failedCount}
                    </Text>
                  </View>
                )}
              </View>
              
              {bulkActionResult.failedCount > 0 && (
                <Text style={styles.failedNote}>
                  Some actions could not be completed. This may be due to unavailable notification channels or member settings.
                </Text>
              )}
            </>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="contained" onPress={() => setShowBulkSuccessDialog(false)}>
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading defaulters...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <Text style={styles.screenTitle}>Bulk Actions</Text>
          <Text style={styles.groupName}>{groupName}</Text>
        </View>
        
        <Searchbar
          placeholder="Search members..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterBar}>
          <Button 
            icon="filter-variant" 
            mode="outlined" 
            onPress={() => setShowFilterDialog(true)}
            style={styles.filterButton}
          >
            Filter
          </Button>
          
          <Button
            icon={`sort-${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
            mode="outlined"
            onPress={() => setShowSortMenu(true)}
            style={styles.sortButton}
          >
            {sortBy === 'amountDue' 
              ? 'Amount' 
              : sortBy === 'daysOverdue' 
                ? 'Days'
                : sortBy === 'name'
                  ? 'Name'
                  : 'Attempts'}
          </Button>
          
          <Menu
            visible={showSortMenu}
            onDismiss={() => setShowSortMenu(false)}
            anchor={{ x: menuAnchor.x, y: menuAnchor.y }}
          >
            <Menu.Item 
              icon={sortBy === 'amountDue' ? `sort-${sortOrder === 'asc' ? 'ascending' : 'descending'}` : undefined}
              onPress={() => handleSort('amountDue')} 
              title="Amount Due" 
            />
            <Menu.Item 
              icon={sortBy === 'daysOverdue' ? `sort-${sortOrder === 'asc' ? 'ascending' : 'descending'}` : undefined}
              onPress={() => handleSort('daysOverdue')} 
              title="Days Overdue" 
            />
            <Menu.Item 
              icon={sortBy === 'name' ? `sort-${sortOrder === 'asc' ? 'ascending' : 'descending'}` : undefined}
              onPress={() => handleSort('name')} 
              title="Name" 
            />
            <Menu.Item 
              icon={sortBy === 'failedAttempts' ? `sort-${sortOrder === 'asc' ? 'ascending' : 'descending'}` : undefined}
              onPress={() => handleSort('failedAttempts')} 
              title="Failed Attempts" 
            />
          </Menu>
        </View>
        
        <View style={styles.segmentedContainer}>
          <SegmentedButtons
            value={viewMode}
            onValueChange={setViewMode}
            buttons={[
              { value: 'all', label: 'All', icon: 'view-list' },
              { value: 'selected', label: 'Selected', icon: 'checkbox-marked-circle' },
              { value: 'segments', label: 'Segments', icon: 'tag-multiple' }
            ]}
          />
        </View>
        
        {viewMode === 'segments' && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.segmentScroll}
            contentContainerStyle={styles.segmentScrollContent}
          >
            {Object.keys(DEFAULTER_SEGMENTS).map((segment) => (
              <TouchableOpacity
                key={segment}
                style={[
                  styles.segmentButton,
                  activeSegment === segment && {
                    backgroundColor: DEFAULTER_SEGMENTS[segment].color + '20',
                    borderColor: DEFAULTER_SEGMENTS[segment].color
                  }
                ]}
                onPress={() => setActiveSegment(activeSegment === segment ? null : segment)}
              >
                <Icon 
                  name={DEFAULTER_SEGMENTS[segment].icon} 
                  size={20} 
                  color={DEFAULTER_SEGMENTS[segment].color} 
                />
                <Text 
                  style={[
                    styles.segmentButtonText,
                    activeSegment === segment && { color: DEFAULTER_SEGMENTS[segment].color }
                  ]}
                >
                  {DEFAULTER_SEGMENTS[segment].title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      
      {/* Content section */}
      <View style={styles.selectionBar}>
        <TouchableOpacity style={styles.selectAllContainer} onPress={handleSelectAll}>
          <Checkbox
            status={selectAll ? 'checked' : 'unchecked'}
            onPress={handleSelectAll}
          />
          <Text style={styles.selectAllText}>
            {selectAll ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.resultCount}>
          {sortedDefaulters.length} members {selectedMembers.length > 0 && `(${selectedMembers.length} selected)`}
        </Text>
      </View>
      
      {sortedDefaulters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="magnify-close" size={64} color="#9E9E9E" />
          <Text style={styles.emptyText}>No members found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your filters or search criteria</Text>
          <Button 
            mode="outlined" 
            onPress={handleClearFilters}
            style={styles.clearFiltersButton}
          >
            Clear Filters
          </Button>
        </View>
      ) : (
        <ScrollView 
          style={styles.membersList}
          contentContainerStyle={styles.membersListContent}
        >
          {sortedDefaulters.map(member => renderMemberItem(member))}
        </ScrollView>
      )}
      
      {/* Bottom action bar */}
      {selectedMembers.length > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.selectedCount}>
            {selectedMembers.length} selected
          </Text>
          
          <View style={styles.bottomActions}>
            <Button 
              mode="contained" 
              icon="email-send"
              onPress={() => setShowReminderDialog(true)}
              style={styles.bottomActionButton}
            >
              Send Reminders
            </Button>
            
            <Button 
              mode="contained" 
              icon="refresh"
              onPress={handleBulkRetry}
              style={styles.bottomActionButton}
            >
              Retry Payments
            </Button>
          </View>
        </View>
      )}
      
      {/* Floating action button for segmented reminders */}
      {viewMode === 'segments' && activeSegment && (
        <FAB
          icon="send"
          label="Send to Segment"
          onPress={() => setShowSegmentDialog(true)}
          style={styles.fab}
        />
      )}
      
      {/* Dialogs */}
      {renderFilterDialog()}
      {renderReminderDialog()}
      {renderSegmentDialog()}
      {renderBulkSuccessDialog()}
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
    color: theme.colors.text
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
  searchBar: {
    marginBottom: 12,
    elevation: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: 12
  },
  filterButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  sortButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  },
  segmentedContainer: {
    marginBottom: 12
  },
  segmentScroll: {
    marginBottom: 12
  },
  segmentScrollContent: {
    paddingRight: 16
  },
  segmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  segmentButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '500'
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.text
  },
  resultCount: {
    fontSize: 14,
    color: '#666'
  },
  membersList: {
    flex: 1
  },
  membersListContent: {
    padding: 16
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
  clearFiltersButton: {
    marginTop: 16
  },
  memberCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  memberCheckbox: {
    marginRight: 8
  },
  memberInfo: {
    flex: 1
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
    marginTop: 8
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
  memberCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
    height: 28
  },
  memberStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  statusChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(3, 169, 244, 0.1)',
    height: 28
  },
  retryChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    height: 28
  },
  statusChipText: {
    fontSize: 12
  },
  bottomBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text
  },
  bottomActions: {
    flexDirection: 'row'
  },
  bottomActionButton: {
    marginLeft: 8
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary
  },
  dialog: {
    borderRadius: 8,
    padding: 4
  },
  filterInput: {
    marginBottom: 16
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 8
  },
  categoryFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  categoryFilterChip: {
    marginRight: 8,
    marginBottom: 8
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
  selectedSegmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  selectedSegmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16
  },
  successStats: {
    marginBottom: 16
  },
  successStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  successStatLabel: {
    fontSize: 14,
    color: '#666'
  },
  successStatValue: {
    fontSize: 14,
    fontWeight: '500'
  },
  failedNote: {
    fontSize: 12,
    color: '#F44336',
    fontStyle: 'italic'
  }
});

export default BulkActionsScreen;import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Chip,
  Dialog,
  Portal,
  TextInput,
  Menu,
  Searchbar,
  Checkbox,
  List,
  IconButton,
  SegmentedButtons,
  FAB
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import { 
  getGroupDefaulters, 
  getDefaulterCategories
} from '../../services/api/groupPaymentReminder';
import { 
  sendBulkReminderNotifications,
  sendSegmentedReminderNotifications,
  applyBulkPaymentRetry
} from '../../services/api/multiChannelNotification';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../config/theme';

// Define defaulter segment types with descriptions
const DEFAULTER_SEGMENTS = {
  'high_amount': {
    title: 'High Amount Due',
    description: 'Members with the largest outstanding amounts',
    icon: 'cash-multiple',
    color: '#F44336'
  },
  'long_overdue': {
    title: 'Long Overdue',
    description: 'Members with payments overdue for extended periods',
    icon: 'calendar-clock',
    color: '#FF9800'
  },
  'chronic': {
    title: 'Chronic Defaulters',
    description: 'Members with pattern of repeated defaults',
    icon: 'repeat',
    color: '#9C27B0'
  },
  'first_time': {
    title: 'First-Time Defaulters',
    description: 'Members who rarely default on payments',
    icon: 'alert-circle',
    color: '#2196F3'
  },
  'responsive': {
    title: 'Responsive Members',
    description: 'Members who typically respond to reminders',
    icon: 'check-circle',
    color: '#4CAF50'
  },
  'unresponsive': {
    title: 'Unresponsive Members',
    description: 'Members who rarely respond to reminders',
    icon: 'close-circle',
    color: '#795548'
  }
};

const BulkActionsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [defaulters, setDefaulters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortBy, setSortBy] = useState('daysOverdue');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterAmount, setFilterAmount] = useState(null);
  const [filterDays, setFilterDays] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [showSegmentDialog, setShowSegmentDialog] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const [selectedChannels, setSelectedChannels] = useState(['app', 'email']);
  const [showBulkSuccessDialog, setShowBulkSuccessDialog] = useState(false);
  const [bulkActionResult, setBulkActionResult] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // all, selected, segments
  const [activeSegment, setActiveSegment] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const [sending, setSending] = useState(false);
  
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
      // Fetch defaulters list
      const defaultersData = await getGroupDefaulters(groupId);
      setDefaulters(defaultersData);
      
      // Fetch defaulter categories
      const categoriesData = await getDefaulterCategories(groupId);
      setCategories(categoriesData);
      
      // Set default reminder message
      setReminderMessage(
        "This is a reminder that your contribution to the group savings is overdue. Please make your payment as soon as possible."
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load defaulters information. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredDefaulters.map(member => member.id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleSelectMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  const handleSort = (sortOption) => {
    if (sortBy === sortOption) {
      // Toggle sort order if clicking the same option
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortOption);
      setSortOrder('desc'); // Default to descending when changing sort option
    }
    setShowSortMenu(false);
  };
  
  const handleApplyFilters = () => {
    setShowFilterDialog(false);
  };
  
  const handleClearFilters = () => {
    setFilterAmount(null);
    setFilterDays(null);
    setFilterCategory(null);
    setShowFilterDialog(false);
  };
  
  const handleSendBulkReminders = async () => {
    if (selectedMembers.length === 0) {
      Alert.alert('No Members Selected', 'Please select at least one member to send reminders.');
      return;
    }
    
    setSending(true);
    try {
      // Use multi-channel notification service for bulk reminders
      const result = await sendBulkReminderNotifications(
        groupId, 
        {
          memberIds: selectedMembers,
          message: reminderMessage,
          channels: selectedChannels
        }
      );
      
      // Update all selected members' lastReminder in the local state
      setDefaulters(prevDefaulters => 
        prevDefaulters.map(member => 
          selectedMembers.includes(member.id)
            ? { ...member, lastReminder: new Date().toISOString() }
            : member
        )
      );
      
      setShowReminderDialog(false);
      setBulkActionResult({
        action: 'Reminders Sent',
        count: result.count,
        channels: selectedChannels,
        failedCount: result.failedCount || 0
      });
      setShowBulkSuccessDialog(true);
    } catch (error) {
      console.error('Error sending bulk reminders:', error);
      Alert.alert('Error', 'Failed to send reminders. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  const handleSendSegmentedReminders = async () => {
    if (!activeSegment) {
      Alert.alert('No Segment Selected', 'Please select a segment to send reminders.');
      return;
    }
    
    setSending(true);
    try {
      // Use multi-channel notification service for segmented reminders
      const result = await sendSegmentedReminderNotifications(
        groupId, 
        {
          segmentType: activeSegment,
          message: reminderMessage,
          channels: selectedChannels
        }
      );
      
      // Get IDs of members in the segment
      const segmentMemberIds = defaulters
        .filter(member => member.categories.includes(activeSegment))
        .map(member => member.id);
      
      // Update segment members' lastReminder in the local state
      setDefaulters(prevDefaulters => 
        prevDefaulters.map(member => 
          segmentMemberIds.includes(member.id)
            ? { ...member, lastReminder: new Date().toISOString() }
            : member
        )
      );
      
      setShowSegmentDialog(false);
      setBulkActionResult({
        action: `${DEFAULTER_SEGMENTS[activeSegment].title} Reminders Sent`,
        count: result.count,
        channels: selectedChannels,
        failedCount: result.failedCount || 0
      });
      setShowBulkSuccessDialog(true);
    } catch (error) {
      console.error('Error sending segmented reminders:', error);
      Alert.alert('Error', 'Failed to send segmented reminders. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  const handleBulkRetry = async () => {
    if (selectedMembers.length === 0) {
      Alert.alert('No Members Selected', 'Please select at least one member to set up payment retries.');
      return;
    }
    
    setSending(true);
    try {
      // Use bulk payment retry service
      const result = await applyBulkPaymentRetry(
        groupId, 
        {
          memberIds: selectedMembers,
          attempts: 3, // Default to 3 attempts
          intervalHours: 24, // Default to 24 hours between attempts
          notifyOnRetry: true,
          notificationChannels: selectedChannels
        }
      );
      
      // Update all selected members' retryScheduled in the local state
      const nextRetryDate = new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString();
      setDefaulters(prevDefaulters => 
        prevDefaulters.map(member => 
          selectedMembers.includes(member.id)
            ? { 
                ...member, 
                retryScheduled: true,
                nextRetryDate
              }
            : member
        )
      );
      
      setBulkActionResult({
        action: 'Payment Retries Scheduled',
        count: result.count,
        failedCount: result.failedCount || 0
      });
      setShowBulkSuccessDialog(true);
    } catch (error) {
      console.error('Error setting up bulk retries:', error);
      Alert.alert('Error', 'Failed to schedule payment retries. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  // Apply search filter
  const searchFilteredDefaulters = useMemo(() => {
    if (!searchQuery.trim()) return defaulters;
    
    const query = searchQuery.toLowerCase();
    return defaulters.filter(member => 
      member.name.toLowerCase().includes(query) || 
      member.username.toLowerCase().includes(query)
    );
  }, [defaulters, searchQuery]);
  
  // Apply amount, days, and category filters
  const filteredDefaulters = useMemo(() => {
    let result = searchFilteredDefaulters;
    
    if (filterAmount) {
      result = result.filter(member => member.amountDue >= filterAmount);
    }
    
    if (filterDays) {
      const today = new Date();
      result = result.filter(member => {
        const dueDate = new Date(member.dueDate);
        const diffTime = Math.abs(today - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= filterDays;
      });
    }
    
    if (filterCategory) {
      result = result.filter(member => 
        member.categories && member.categories.includes(filterCategory)
      );
    }
    
    if (viewMode === 'selected') {
      result = result.filter(member => selectedMembers.includes(member.id));
    } else if (viewMode === 'segments' && activeSegment) {
      result = result.filter(member => 
        member.categories && member.categories.includes(activeSegment)
      );
    }
    
    return result;
  }, [
    searchFilteredDefaulters, 
    filterAmount, 
    filterDays, 
    filterCategory, 
    viewMode, 
    activeSegment,
    selectedMembers
  ]);
  
  // Apply sorting
  const sortedDefaulters = useMemo(() => {
    return [...filteredDefaulters].sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'amountDue') {
        aValue = a.amountDue;
        bValue = b.amountDue;
      } else if (sortBy === 'daysOverdue') {
        const today = new Date();
        const aDueDate = new Date(a.dueDate);
        const bDueDate = new Date(b.dueDate);
        const aDiffTime = Math.abs(today - aDueDate);
        const bDiffTime = Math.abs(today - bDueDate);
        aValue = Math.ceil(aDiffTime / (1000 * 60 * 60 * 24));
        bValue = Math.ceil(bDiffTime / (1000 * 60 * 60 * 24));
      } else if (sortBy === 'name') {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortBy === 'failedAttempts') {
        aValue = a.failedAttempts || 0;
        bValue = b.failedAttempts || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredDefaulters, sortBy, sortOrder]);
  
  const renderMemberItem = (member) => {
    // Calculate days overdue
    const dueDate = new Date(member.dueDate);
    const today = new Date();
    const diffTime = Math.abs(today - dueDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return (
      <Card 
        key={member.id} 
        style={styles.memberCard}
      >
        <Card.Content>
          <View style={styles.memberHeader}>
            <View style={styles.memberCheckbox}>
              <Checkbox
                status={selectedMembers.includes(member.id) ? 'checked' : 'unchecked'}
                onPress={() => handleSelectMember(member.id)}
              />
            </View>
            
            <View style={styles.memberInfo}>
              <View style={styles.memberTextInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberUsername}>@{member.username}</Text>
              </View>
            </View>
            
            <IconButton
              icon="dots-vertical"
              size={20}
              onPress={(e) => {
                // Save the anchor coordinates for the menu
                setMenuAnchor({
                  x: e.nativeEvent.pageX,
                  y: e.nativeEvent.pageY
                });
                // Open member-specific menu here if needed
              }}
            />
          </View>
          
          <View style={styles.memberDetails}>
            <View style={styles.memberDetailItem}>
              <Text style={styles.detailLabel}>Amount Due:</Text>
              <Text style={styles.detailValue}>{formatCurrency(member.amountDue)}</Text>
            </View>
            
            <View style={styles.memberDetailItem}>
              <Text style={styles.detailLabel}>Due Date:</Text>
              <Text style={styles.detailValue}>{formatDate(member.dueDate)}</Text>
            </View>
            
            <View style={styles.memberDetailItem}>
              <Text style={styles.detailLabel}>Days Overdue:</Text>
              <Chip 
                mode="outlined" 
                style={[
                  styles.overdueChip,
                  diffDays > 30 ? styles.highOverdueChip : 
                  diffDays > 7 ? styles.mediumOverdueChip : 
                  styles.lowOverdueChip
                ]}
              >
                {diffDays} days
              </Chip>
            </View>
          </View>
          
          <View style={styles.memberCategories}>
            {member.categories && member.categories.map((category) => (
              <Chip 
                key={category}
                style={[
                  styles.categoryChip,
                  { backgroundColor: DEFAULTER_SEGMENTS[category]?.color + '20' || '#ddd' }
                ]}
                textStyle={{
                  color: DEFAULTER_SEGMENTS[category]?.color || '#666'
                }}
                icon={() => (
                  <Icon 
                    name={DEFAULTER_SEGMENTS[category]?.icon || 'tag'} 
                    size={16} 
                    color={DEFAULTER_SEGMENTS[category]?.color || '#666'} 
                  />
                )}
              >
                {DEFAULTER_SEGMENTS[category]?.title || category}
              </Chip>
            ))}
          </View>
          
          <View style={styles.memberStatusRow}>
            {member.lastReminder && (
              <Chip 
                icon="email-check" 
                style={styles.statusChip}
                textStyle={styles.statusChipText}
              >
                Reminded {formatDate(member.lastReminder)}
              </Chip>
            )}
            
            {member.retryScheduled && (
              <Chip 
                icon="refresh" 
                style={styles.retryChip}
                textStyle={styles.statusChipText}
              >
                Retry {member.nextRetryDate ? formatDate(member.nextRetryDate) : 'Scheduled'}
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderFilterDialog = () => (
    <Portal>
      <Dialog
        visible={showFilterDialog}
        onDismiss={() => setShowFilterDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Filter Defaulters</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Minimum Amount Due"
            value={filterAmount ? filterAmount.toString() : ''}
            onChangeText={(text) => setFilterAmount(text ? parseFloat(text) : null)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.filterInput}
          />
          
          <TextInput
            label="Minimum Days Overdue"
            value={filterDays ? filterDays.toString() : ''}
            onChangeText={(text) => setFilterDays(text ? parseInt(text) : null)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.filterInput}
          />
          
          <Text style={styles.filterSectionTitle}>Defaulter Category</Text>
          
          <View style={styles.categoryFilters}>
            {Object.keys(DEFAULTER_SEGMENTS).map((category) => (
              <Chip
                key={category}
                selected={filterCategory === category}
                onPress={() => setFilterCategory(
                  filterCategory === category ? null : category
                )}
                style={[
                  styles.categoryFilterChip,
                  filterCategory === category && { backgroundColor: DEFAULTER_SEGMENTS[category].color + '20' }
                ]}
                textStyle={{
                  color: filterCategory === category ? DEFAULTER_SEGMENTS[category].color : '#666'
                }}
                icon={() => (
                  <Icon 
                    name={DEFAULTER_SEGMENTS[category].icon} 
                    size={16} 
                    color={filterCategory === category ? DEFAULTER_SEGMENTS[category].color : '#666'} 
                  />
                )}
              >
                {DEFAULTER_SEGMENTS[category].title}
              </Chip>
            ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleClearFilters}>Clear All</Button>
          <Button mode="contained" onPress={handleApplyFilters}>Apply Filters</Button>
        </Dialog.Actions>