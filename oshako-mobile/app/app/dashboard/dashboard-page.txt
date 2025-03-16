'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/context/SupabaseContext';
import { getTasks } from '@/lib/supabase';
import { Task } from '@/types/supabase';
import AuthLoading from '@/components/auth-loading';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, CheckCircle, Circle, Clock, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading } = useSupabase();
  const router = useRouter();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Fetch tasks when user is available
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      setTasksLoading(true);
      try {
        const { data, error } = await getTasks(user.id);
        
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
  }, [user]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <AuthLoading message="Loading your dashboard..." />;
  }

  // Get pending tasks
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  
  // Get tasks due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const tasksDueToday = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });
  
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => router.push('/tasks/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {tasksLoading ? (
        <div className="flex justify-center py-12">
          <Clock className="h-8 w-8 animate-pulse text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                Today's Tasks
              </CardTitle>
              <CardDescription>
                Tasks due today: {tasksDueToday.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasksDueToday.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No tasks due today</p>
              ) : (
                <ul className="space-y-3">
                  {tasksDueToday.map((task) => (
                    <li key={task.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          {task.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-300 mr-2" />
                          )}
                          <div>
                            <Link 
                              href={`/tasks/${task.id}`}
                              className="font-medium hover:text-blue-600"
                            >
                              {task.title}
                            </Link>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push('/tasks?filter=today')}>
                View All Today's Tasks
              </Button>
            </CardFooter>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                Pending Tasks
              </CardTitle>
              <CardDescription>
                Tasks awaiting completion: {pendingTasks.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No pending tasks</p>
              ) : (
                <ul className="space-y-3">
                  {pendingTasks.slice(0, 5).map((task) => (
                    <li key={task.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link 
                            href={`/tasks/${task.id}`}
                            className="font-medium hover:text-blue-600"
                          >
                            {task.title}
                          </Link>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Due: {formatDate(task.due_date)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push('/tasks?status=pending')}>
                View All Pending Tasks
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
