import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export async function signUp(email: string, password: string, userData: { 
  username: string, 
  full_name?: string 
}) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: userData.username,
        full_name: userData.full_name || ''
      }
    }
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Profile helper functions
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
}

export async function updateProfile(userId: string, updates: { 
  username?: string, 
  full_name?: string, 
  avatar_url?: string 
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
}

// Task helper functions
export async function getTasks(userId: string, filters?: { 
  status?: string, 
  priority?: string, 
  dueDate?: Date 
}) {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }
  
  if (filters?.dueDate) {
    query = query.lte('due_date', filters.dueDate.toISOString());
  }
  
  const { data, error } = await query.order('due_date', { ascending: true });
  
  return { data, error };
}

export async function createTask(taskData: {
  title: string,
  description?: string,
  status?: string,
  priority?: string,
  due_date?: string,
  user_id: string
}) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(taskData)
    .select()
    .single();
  
  return { data, error };
}

export async function updateTask(taskId: string, updates: {
  title?: string,
  description?: string,
  status?: string,
  priority?: string,
  due_date?: string
}) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();
  
  return { data, error };
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  return { error };
}
