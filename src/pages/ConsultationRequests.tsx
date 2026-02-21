import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Clock, CheckCircle, XCircle, Calendar, IndianRupee, Loader2 } from 'lucide-react';

interface Request {
  id: string;
  citizen_id: string;
  issue_description: string;
  scheduled_date: string;
  scheduled_time: string;
  fee: number;
  payment_status: string;
  status: string;
  category: string;
  citizen_name?: string;
}

export default function ConsultationRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('consultations')
      .select('*')
      .eq('lawyer_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      // Fetch citizen names
      const citizenIds = [...new Set(data.map((d: any) => d.citizen_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', citizenIds.length ? citizenIds : ['none']);

      const nameMap = new Map((profiles || []).map((p: any) => [p.user_id, p.full_name]));
      setRequests(data.map((d: any) => ({ ...d, citizen_name: nameMap.get(d.citizen_id) || 'Unknown' })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();

    // Real-time updates
    if (user) {
      const channel = supabase
        .channel('lawyer-consultations')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'consultations',
          filter: `lawyer_id=eq.${user.id}`,
        }, () => fetchRequests())
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const handleAction = async (id: string, action: 'accepted' | 'rejected') => {
    await supabase.from('consultations').update({ status: action }).eq('id', id);
    
    // Find the request to get citizen info
    const req = requests.find(r => r.id === id);
    if (req && user) {
      const message = action === 'accepted'
        ? `Your consultation with ${user.fullName} is confirmed for ${req.scheduled_date} at ${req.scheduled_time}.`
        : `Your consultation request has been declined. Please try booking another lawyer.`;
      
      await supabase.from('notifications').insert({
        user_id: req.citizen_id,
        message,
        consultation_id: id,
      });
    }

    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const renderCard = (req: Request) => (
    <div key={req.id} className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-electric/10 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-electric" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{req.citizen_name}</h4>
          <p className="text-xs text-muted-foreground truncate">{req.issue_description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-3 h-3" /> {req.scheduled_date}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3 h-3" /> {req.scheduled_time}
        </div>
        <div className="flex items-center gap-1.5 text-gold">
          <IndianRupee className="w-3 h-3" /> ₹{req.fee}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-medium">{req.payment_status}</span>
        </div>
      </div>
      {req.status === 'pending' && (
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gradient-electric glow-electric text-xs" onClick={() => handleAction(req.id, 'accepted')}>
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 text-xs" onClick={() => handleAction(req.id, 'rejected')}>
            <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
          </Button>
        </div>
      )}
      {req.status === 'accepted' && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-electric/5 border border-electric/20">
          <CheckCircle className="w-4 h-4 text-electric" />
          <span className="text-xs text-electric font-medium">Accepted — Join Consultation</span>
        </div>
      )}
      {req.status === 'completed' && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/5 border border-green-500/20">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-500 font-medium">Completed</span>
        </div>
      )}
      {req.status === 'rejected' && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 border border-destructive/20">
          <XCircle className="w-4 h-4 text-destructive" />
          <span className="text-xs text-destructive font-medium">Rejected</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-electric" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">Consultation Requests</h2>
        <p className="text-sm text-muted-foreground">Manage your client consultation requests.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/40">
          <TabsTrigger value="pending">Pending ({requests.filter(r => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({requests.filter(r => r.status === 'accepted').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({requests.filter(r => r.status === 'completed').length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-3 mt-4">
          {requests.filter(r => r.status === 'pending').map(renderCard)}
          {requests.filter(r => r.status === 'pending').length === 0 && (
            <p className="text-center text-muted-foreground py-8">No pending requests</p>
          )}
        </TabsContent>
        <TabsContent value="accepted" className="space-y-3 mt-4">
          {requests.filter(r => r.status === 'accepted').map(renderCard)}
          {requests.filter(r => r.status === 'accepted').length === 0 && (
            <p className="text-center text-muted-foreground py-8">No accepted requests</p>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-3 mt-4">
          {requests.filter(r => r.status === 'completed').map(renderCard)}
          {requests.filter(r => r.status === 'completed').length === 0 && (
            <p className="text-center text-muted-foreground py-8">No completed requests</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
