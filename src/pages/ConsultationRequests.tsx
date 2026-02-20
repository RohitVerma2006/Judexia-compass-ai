import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Clock, CheckCircle, XCircle, Calendar, IndianRupee } from 'lucide-react';

interface Request {
  id: string;
  citizenName: string;
  issue: string;
  date: string;
  time: string;
  fee: number;
  paymentStatus: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

const MOCK_REQUESTS: Request[] = [
  { id: '1', citizenName: 'Rahul Kumar', issue: 'Property dispute with neighbor regarding boundary wall construction', date: '2026-02-25', time: '10:00 AM', fee: 1500, paymentStatus: 'paid', status: 'pending' },
  { id: '2', citizenName: 'Sneha Patel', issue: 'Seeking divorce proceedings guidance and child custody rights', date: '2026-02-26', time: '2:00 PM', fee: 1500, paymentStatus: 'paid', status: 'pending' },
  { id: '3', citizenName: 'Amit Singh', issue: 'Wrongful termination from employment, seeking compensation', date: '2026-02-22', time: '11:30 AM', fee: 1500, paymentStatus: 'paid', status: 'accepted' },
  { id: '4', citizenName: 'Kavitha Nair', issue: 'Consumer complaint against e-commerce platform for defective product', date: '2026-02-18', time: '3:30 PM', fee: 1500, paymentStatus: 'paid', status: 'completed' },
];

export default function ConsultationRequests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const handleAction = (id: string, action: 'accepted' | 'rejected') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const renderCard = (req: Request) => (
    <div key={req.id} className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-electric/10 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-electric" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{req.citizenName}</h4>
          <p className="text-xs text-muted-foreground truncate">{req.issue}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-3 h-3" /> {req.date}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3 h-3" /> {req.time}
        </div>
        <div className="flex items-center gap-1.5 text-gold">
          <IndianRupee className="w-3 h-3" /> ₹{req.fee}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-medium">{req.paymentStatus}</span>
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
