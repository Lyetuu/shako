import supabase from '../../config/supabase';

/**
 * Create a new transaction
 * @param {object} transactionData - Transaction data
 * @returns {Promise} - New transaction data
 */
export const createTransaction = async (transactionData) => {
  // Create the transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert([
      {
        ...transactionData,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ])
    .select();

  if (transactionError) throw transactionError;
  
  // Update the group's total savings if the transaction is a contribution
  if (transactionData.transaction_type === 'contribution') {
    const { error: updateError } = await supabase.rpc('update_group_savings', {
      group_id: transactionData.group_id,
      amount: transactionData.amount
    });
    
    if (updateError) throw updateError;
  }
  
  // Update the group's total withdrawals if the transaction is a withdrawal
  if (transactionData.transaction_type === 'withdrawal') {
    const { error: updateError } = await supabase.rpc('update_group_withdrawals', {
      group_id: transactionData.group_id,
      amount: transactionData.amount
    });
    
    if (updateError) throw updateError;
  }
  
  return transaction[0];
};

/**
 * Get transactions for a group
 * @param {string} groupId - Group ID
 * @param {object} filters - Optional filters (transaction_type, date range, etc.)
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Page size for pagination
 * @returns {Promise} - Array of transactions and count
 */
export const getGroupTransactions = async (groupId, filters = {}, page = 1, pageSize = 20) => {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url
      )
    `, { count: 'exact' })
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  
  // Apply filters if provided
  if (filters.transaction_type) {
    query = query.eq('transaction_type', filters.transaction_type);
  }
  
  if (filters.start_date) {
    query = query.gte('created_at', filters.start_date);
  }
  
  if (filters.end_date) {
    query = query.lte('created_at', filters.end_date);
  }
  
  if (filters.member_id) {
    query = query.eq('member_id', filters.member_id);
  }
  
  const { data, error, count } = await query;

  if (error) throw error;
  
  // Transform the data for easier use
  const transformedData = data.map(transaction => ({
    ...transaction,
    member: transaction.profiles ? {
      id: transaction.profiles.id,
      name: transaction.profiles.full_name,
      avatar: transaction.profiles.avatar_url
    } : null
  }));
  
  return {
    transactions: transformedData,
    count: count
  };
};

/**
 * Get transactions for a user across all groups
 * @param {string} userId - User ID
 * @param {object} filters - Optional filters
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Page size for pagination
 * @returns {Promise} - Array of transactions and count
 */
export const getUserTransactions = async (userId, filters = {}, page = 1, pageSize = 20) => {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      groups (
        id,
        name,
        logo_url
      )
    `, { count: 'exact' })
    .eq('member_id', userId)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);
  
  // Apply filters if provided
  if (filters.transaction_type) {
    query = query.eq('transaction_type', filters.transaction_type);
  }
  
  if (filters.start_date) {
    query = query.gte('created_at', filters.start_date);
  }
  
  if (filters.end_date) {
    query = query.lte('created_at', filters.end_date);
  }
  
  if (filters.group_id) {
    query = query.eq('group_id', filters.group_id);
  }
  
  const { data, error, count } = await query;

  if (error) throw error;
  
  // Transform the data for easier use
  const transformedData = data.map(transaction => ({
    ...transaction,
    group: transaction.groups ? {
      id: transaction.groups.id,
      name: transaction.groups.name,
      logo: transaction.groups.logo_url
    } : null
  }));
  
  return {
    transactions: transformedData,
    count: count
  };
};

/**
 * Get transaction details
 * @param {string} transactionId - Transaction ID
 * @returns {Promise} - Transaction details
 */
export const getTransactionDetails = async (transactionId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url,
        email
      ),
      groups (
        id,
        name,
        logo_url,
        currency
      )
    `)
    .eq('id', transactionId)
    .single();

  if (error) throw error;
  
  // Transform the data for easier use
  const transformedData = {
    ...data,
    member: data.profiles ? {
      id: data.profiles.id,
      name: data.profiles.full_name,
      avatar: data.profiles.avatar_url,
      email: data.profiles.email
    } : null,
    group: data.groups ? {
      id: data.groups.id,
      name: data.groups.name,
      logo: data.groups.logo_url,
      currency: data.groups.currency
    } : null
  };
  
  // Remove the original nested data
  delete transformedData.profiles;
  delete transformedData.groups;
  
  return transformedData;
};

/**
 * Update transaction status
 * @param {string} transactionId - Transaction ID
 * @param {string} newStatus - New status ('pending', 'approved', 'rejected')
 * @param {string} userId - ID of user making the change
 * @returns {Promise} - Updated transaction
 */
export const updateTransactionStatus = async (transactionId, newStatus, userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      status: newStatus,
      approved_by: newStatus === 'approved' ? userId : null,
      rejected_by: newStatus === 'rejected' ? userId : null,
      updated_at: new Date()
    })
    .eq('id', transactionId)
    .select();

  if (error) throw error;
  return data[0];
};

/**
 * Get transaction statistics for a group
 * @param {string} groupId - Group ID
 * @param {string} period - Time period ('week', 'month', 'year', 'all')
 * @returns {Promise} - Transaction statistics
 */
export const getGroupTransactionStats = async (groupId, period = 'month') => {
  let startDate;
  const now = new Date();
  
  // Calculate start date based on period
  switch (period) {
    case 'week':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case 'year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    case 'all':
    default:
      startDate = new Date(0); // Beginning of time
      break;
  }
  
  // Format date for Supabase query
  const formattedStartDate = startDate.toISOString();
  
  // Get transaction stats
  const { data, error } = await supabase.rpc('get_group_transaction_stats', {
    group_id: groupId,
    start_date: formattedStartDate
  });

  if (error) throw error;
  return data;
};

/**
 * Get member contribution summary
 * @param {string} groupId - Group ID
 * @param {string} period - Time period ('week', 'month', 'year', 'all')
 * @returns {Promise} - Member contribution summary
 */
export const getMemberContributionSummary = async (groupId, period = 'month') => {
  let startDate;
  const now = new Date();
  
  // Calculate start date based on period
  switch (period) {
    case 'week':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case 'year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    case 'all':
    default:
      startDate = new Date(0); // Beginning of time
      break;
  }
  
  // Format date for Supabase query
  const formattedStartDate = startDate.toISOString();
  
  // Get member contribution summary
  const { data, error } = await supabase.rpc('get_member_contribution_summary', {
    group_id: groupId,
    start_date: formattedStartDate
  });

  if (error) throw error;
  return data;
};