'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/context/SupabaseContext';
import { getTasks, updateTask, deleteTask } from '@/lib/supabase';
import { Task } from '@/types/supabase';
import AuthLoading from '@/components/auth-loading';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const { user, isLoading } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();
  const { id } = params;
  
  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskLoading, setTaskLoading] = useState(true);

  // Fetch task details when component mounts
  useEffect(() => {
    const fetchTask = async () => {
      if (!user) return;
      
      setTaskLoading(true);
      try {
        const { data, error } = await getTasks(user.id);
        
        if (error) {
          console.error('Error fetching task:', error);
          setError('Failed to load task details.');
          return;
        }
        
        const foundTask = data?.find(t => t.id === id);
        
        if (!foundTask) {
          setError('Task not found.');
          return;
        }
        
        setTask(foundTask);
        setTitle(foundTask.title);
        setDescription(foundTask.description || '');
        setStatus(foundTask.status);
        setPriority(foundTask.priority);
        if (foundTask.due_date) {
          setDueDate(new Date(foundTask.due_date));
        }
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('An unexpected error occurred while loading the task.');
      } finally {
        setTaskLoading(false);
      }
    };

    fetchTask();
  }, [user, id]);

  // Update task handler
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !task) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const updates = {
        title,
        description,
        status,
        priority,
        due_date: dueDate ? dueDate.toISOString() : null
      };

      const { error } = await updateTask(id, updates);
      
      if (error) {
        setError(error.message);
        return;
      }

      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });

      // Update the local task state
      setTask({
        ...task,
        ...updates
      });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Update task error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete task handler
  const handleDeleteTask = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsSubmitting(true);
        const { error } = await deleteTask(id);
        
        if (error) {
          setError(error.message);
          return;
        }

        toast({
          title: "Task deleted",
          description: "Your task has been deleted successfully.",
        });

        // Redirect to tasks page
        router.push('/tasks');
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        console.error('Delete task error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Show loading state while authentication or task is being checked
  if (isLoading || taskLoading) {
    return <AuthLoading message="Loading task details..." />;
  }

  // Show error if task not found
  if (error && !task) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => router.back()} 
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => router.push('/tasks')}>
              Go to Tasks
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold mb-8">Edit Task</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Update your task information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleUpdateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={status}
                  onValueChange={setStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={priority}
                  onValueChange={setPriority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {dueDate && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1"
                  onClick={() => setDueDate(undefined)}
                >
                  Clear date
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            type="button" 
            onClick={handleDeleteTask}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Task
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleUpdateTask} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
