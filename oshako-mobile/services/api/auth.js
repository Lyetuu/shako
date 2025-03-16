import supabase from '../../config/supabase';

/**
 * Register a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {object} userData - Additional user data (name, phone, etc.)
 * @returns {Promise} - Registration result
 */
export const registerUser = async (email, password, userData) => {
  // Register the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  // Create a user profile in the profiles table
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: email,
          full_name: userData.fullName,
          phone: userData.phone,
          created_at: new Date(),
          updated_at: new Date(),
          ...userData
        }
      ]);

    if (profileError) throw profileError;
  }

  return authData;
};

/**
 * Login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Login result
 */
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

/**
 * Logout user
 * @returns {Promise} - Logout result
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get the current user
 * @returns {Promise} - Current user data
 */
export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) throw error;
  
  if (!session) return null;

  // Get user profile data
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') throw profileError;

  return {
    ...session.user,
    profile: profileData || {}
  };
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {object} profileData - Profile data to update
 * @returns {Promise} - Update result
 */
export const updateUserProfile = async (userId, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date()
    })
    .eq('id', userId);

  if (error) throw error;
  return data;
};

/**
 * Reset password
 * @param {string} email - User's email
 * @returns {Promise} - Reset password result
 */
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'yourapp://reset-password',
  });

  if (error) throw error;
  return data;
};

/**
 * Change password
 * @param {string} newPassword - New password
 * @returns {Promise} - Change password result
 */
export const changePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
  return data;
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise} - User data
 */
export const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};