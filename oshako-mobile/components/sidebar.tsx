'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Clock,
  AlertCircle, 
  CheckCircle,
  ListTodo
} from 'lucide-react';

const SidebarLink = ({ href, icon: Icon, children, active = false }: { 
  href: string; 
  icon: React.ElementType; 
  children: React.ReactNode;
  active?: boolean;
}) => (
  <Link href={href}>
    <Button
      variant={active ? 'secondary' : 'ghost'}
      className="w-full justify-start"
    >
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="py-4 px-3 space-y-1">
        <div className="mb-6 px-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Navigation</h2>
        </div>

        <SidebarLink 
          href="/dashboard" 
          icon={LayoutDashboard} 
          active={pathname === '/dashboard'}
        >
          Dashboard
        </SidebarLink>

        <SidebarLink 
          href="/tasks" 
          icon={ListTodo} 
          active={pathname === '/tasks'}
        >
          All Tasks
        </SidebarLink>

        <div className="mt-6 mb-3 px-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Filters</h3>
        </div>

        <SidebarLink 
          href="/tasks?filter=today" 
          icon={Calendar} 
          active={pathname === '/tasks' && pathname.includes('filter=today')}
        >
          Today
        </SidebarLink>

        <SidebarLink 
          href="/tasks?filter=upcoming" 
          icon={Clock} 
          active={pathname === '/tasks' && pathname.includes('filter=upcoming')}
        >
          Upcoming
        </SidebarLink>

        <div className="mt-6 mb-3 px-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
        </div>

        <SidebarLink 
          href="/tasks?status=pending" 
          icon={AlertCircle} 
          active={pathname === '/tasks' && pathname.includes('status=pending')}
        >
          Pending
        </SidebarLink>

        <SidebarLink 
          href="/tasks?status=in-progress" 
          icon={Clock} 
          active={pathname === '/tasks' && pathname.includes('status=in-progress')}
        >
          In Progress
        </SidebarLink>

        <SidebarLink 
          href="/tasks?status=completed" 
          icon={CheckCircle} 
          active={pathname === '/tasks' && pathname.includes('status=completed')}
        >
          Completed
        </SidebarLink>

        <div className="mt-6 mb-3 px-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</h3>
        </div>

        <SidebarLink 
          href="/tasks?priority=high" 
          icon={AlertCircle} 
          active={pathname === '/tasks' && pathname.includes('priority=high')}
        >
          High Priority
        </SidebarLink>

        <SidebarLink 
          href="/tasks?priority=medium" 
          icon={CheckSquare} 
          active={pathname === '/tasks' && pathname.includes('priority=medium')}
        >
          Medium Priority
        </SidebarLink>

        <SidebarLink 
          href="/tasks?priority=low" 
          icon={CheckSquare} 
          active={pathname === '/tasks' && pathname.includes('priority=low')}
        >
          Low Priority
        </SidebarLink>
      </div>
    </div>
  );
}
