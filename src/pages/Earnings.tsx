import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, TrendingUp, Calendar, Users, Loader2 } from 'lucide-react';

export default function Earnings() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('consultations')
        .select('*')
        .eq('lawyer_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setConsultations(data);
      setLoading(false);
    };
    fetchEarnings();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-electric" />
      </div>
    );
  }

  const totalRevenue = consultations.filter(c => c.payment_status === 'paid').reduce((sum, c) => sum + (c.fee || 0), 0);
  const completedCount = consultations.filter(c => c.status === 'completed').length;
  const upcomingCount = consultations.filter(c => c.status === 'accepted').length;
  const totalCount = consultations.length;

  // Group by month
  const monthlyMap: Record<string, { sessions: number; revenue: number }> = {};
  consultations.forEach(c => {
    const month = new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!monthlyMap[month]) monthlyMap[month] = { sessions: 0, revenue: 0 };
    monthlyMap[month].sessions++;
    if (c.payment_status === 'paid') monthlyMap[month].revenue += c.fee || 0;
  });
  const monthly = Object.entries(monthlyMap).map(([month, data]) => ({ month, ...data }));
  const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1);

  const STATS = [
    { label: 'Total Consultations', value: String(totalCount), icon: Users, color: 'text-electric' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-gold' },
    { label: 'Completed', value: String(completedCount), icon: TrendingUp, color: 'text-green-500' },
    { label: 'Upcoming', value: String(upcomingCount), icon: Calendar, color: 'text-purple-400' },
  ];

  // Upcoming sessions
  const upcoming = consultations
    .filter(c => c.status === 'accepted')
    .slice(0, 5);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">My Earnings</h2>
        <p className="text-sm text-muted-foreground">Track your consultation revenue and sessions.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card p-5 text-center">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
              <p className="font-serif text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {monthly.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-serif font-semibold mb-4">Monthly Breakdown</h3>
          <div className="space-y-3">
            {monthly.map(m => (
              <div key={m.month} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-20 shrink-0">{m.month}</span>
                <div className="flex-1 h-6 bg-secondary/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full gradient-electric transition-all duration-500"
                    style={{ width: `${(m.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gold w-16 text-right">₹{m.revenue.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground w-16 text-right">{m.sessions} sessions</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-serif font-semibold mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {upcoming.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border/30">
                <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-electric" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.category}</p>
                  <p className="text-xs text-muted-foreground">₹{s.fee}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-electric">{s.scheduled_date}</p>
                  <p className="text-xs text-muted-foreground">{s.scheduled_time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {consultations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No consultations yet. Earnings will appear once clients book you.</p>
        </div>
      )}
    </div>
  );
}
