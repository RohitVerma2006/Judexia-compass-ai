import { useState, useEffect } from 'react';
import { Bell, CheckCircle, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    // Default mock notifications
    { id: 'mock-1', message: 'Your consultation with Adv. Priya Sharma is confirmed.', read: false, created_at: new Date().toISOString() },
    { id: 'mock-2', message: 'Welcome to Judexia! Start exploring legal modules.', read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  ]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-secondary/40 transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 glass-card border-border/50" align="end">
        <div className="flex items-center justify-between p-3 border-b border-border/30">
          <h4 className="font-serif font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[10px] text-electric hover:underline">Mark all read</button>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-6">No notifications</p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-3 border-b border-border/20 cursor-pointer hover:bg-secondary/20 transition-colors ${!n.read ? 'bg-electric/5' : ''}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <div className="w-2 h-2 rounded-full bg-electric mt-1.5 shrink-0" />}
                  <p className={`text-xs ${!n.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{n.message}</p>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-1 ml-4">
                  {new Date(n.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
