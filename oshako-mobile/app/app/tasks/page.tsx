'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSupabase } from '@/context/SupabaseContext';
import { getTasks, updateTask, deleteTask } from '@/lib/supabase';
import { Task } from '@/types/supabase';
import AuthLoading from '@/components/auth-loading';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Calendar, CheckCircle, Clock, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';

export default function TasksPage() {
  const { user, isLoading } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Extract filter parameters
  const statusFilter = searchParams.get('status');
  const priorityFilter = searchParams.get('priority');
  const timeFilter = searchParams.get('filter');

  // Page title based on filters
  const getPageTitle = () => {
    if (statusFilter) {
      return `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tasks`;
    }
    
    if (priorityFilter) {
      return `${priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)} Priority Tasks`;
    }
    
    if (timeFilter === 'today') {
      return 'Today\'s Tasks';
    }
    
    if (timeFilter === 'upcoming') {
      return 'Upcoming Tasks';
    }
    
    return 'All Tasks';
  };

  // Fetch tasks when user or filters change
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      setTasksLoading(true);
      try {
        const filters: { status?: string; priority?: string; dueDate?: Date } = {};
        
        if (statusFilter) {
          filters.status = statusFilter;
        }
        
        if (priorityFilter) {
          filters.priority = priorityFilter;
        }
        
        if (timeFilter === 'today') {
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          filters.dueDate = today;
        } else if (timeFilter === 'upcoming') {
          // Upcoming tasks - due in the next 7 days
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          filters.dueDate = nextWeek;
        }
        
        const { data, error } = await getTasks(user.id, filters);
        
        if (error) {
          console.error('Error fetching tasks:', error);
          return;
        }
        
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, [user, statusFilter, priorityFilter, timeFilter]);

  // Mark task as complete/incomplete
  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      
      const { error } = await updateTask(taskId, { status: newStatus });
      
      if (error) {
        console.error('Error updating task status:', error);
        return;
      }
      
      // Update the task in the local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
      
      toast({
        title: newStatus === 'completed' ? 'Task completed' : 'Task reopened',
        description: newStatus === 'completed' 
          ? 'The task has been marked as complete.' 
          : 'The task has been marked as pending.',
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const { error } = await deleteTask(taskId);
        
        if (error) {
          console.error('Error deleting task:', error);
          return;
        }
        
        // Remove the task from the local state
        setTasks(tasks.filter(task => task.id !== taskId));
        
        toast({
          title: 'Task deleted',
          description: 'The task has been deleted successfully.',
        });
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <AuthLoading message="Loading tasks..." />;
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Get status badge color
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="text-green-500 h-5 w-5" />;
      case 'in-progress':
        return <Clock className="text-yellow-500 h-5 w-5" />;
      case 'pending':
      default:
        return <AlertCircle className="text-gray-400 h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
        <Button onClick={() => router.push('/tasks/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {tasksLoading ? (
        <div className="flex justify-center py-12">
          <Clock className="h-8 w-8 animate-pulse text-gray-400" />
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No tasks found</CardTitle>
            <CardDescription>
              {statusFilter || priorityFilter || timeFilter 
                ? 'No tasks match the current filters.'
                : 'You haven\'t created any tasks yet.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              onClick={() => router.push('/tasks/new')}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                      className="mt-1"
                    />
                    <div>
                      <Link 
                        href={`/tasks/${task.id}`}
                        className={`text-lg font-semibold hover:text-blue-600 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}
                      >
                        {task.title}
                      </Link>
                      {task.description && (
                        <p className="text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap items-center mt-2 gap-2">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(task.due_date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">{task.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Task</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleTaskStatus(task.id, task.status)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>{task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Task</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
