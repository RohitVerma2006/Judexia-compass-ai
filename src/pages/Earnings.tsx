import { DollarSign, TrendingUp, Calendar, Users } from 'lucide-react';

const STATS = [
  { label: 'Total Consultations', value: '47', icon: Users, color: 'text-electric' },
  { label: 'Total Revenue', value: '₹70,500', icon: DollarSign, color: 'text-gold' },
  { label: 'This Month', value: '₹12,000', icon: TrendingUp, color: 'text-green-500' },
  { label: 'Upcoming Sessions', value: '3', icon: Calendar, color: 'text-purple-400' },
];

const MONTHLY = [
  { month: 'Sep 2025', sessions: 4, revenue: 6000 },
  { month: 'Oct 2025', sessions: 6, revenue: 9000 },
  { month: 'Nov 2025', sessions: 8, revenue: 12000 },
  { month: 'Dec 2025', sessions: 7, revenue: 10500 },
  { month: 'Jan 2026', sessions: 10, revenue: 15000 },
  { month: 'Feb 2026', sessions: 8, revenue: 12000 },
];

export default function Earnings() {
  const maxRevenue = Math.max(...MONTHLY.map(m => m.revenue));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">My Earnings</h2>
        <p className="text-sm text-muted-foreground">Track your consultation revenue and sessions.</p>
      </div>

      {/* Stats Grid */}
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

      {/* Monthly Breakdown */}
      <div className="glass-card p-6">
        <h3 className="font-serif font-semibold mb-4">Monthly Breakdown</h3>
        <div className="space-y-3">
          {MONTHLY.map(m => (
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

      {/* Upcoming Sessions */}
      <div className="glass-card p-6">
        <h3 className="font-serif font-semibold mb-4">Upcoming Sessions</h3>
        <div className="space-y-3">
          {[
            { name: 'Rahul Kumar', date: 'Feb 25, 2026', time: '10:00 AM', category: 'Property Law' },
            { name: 'Amit Singh', date: 'Feb 26, 2026', time: '2:00 PM', category: 'Labour Law' },
            { name: 'Priya Verma', date: 'Feb 28, 2026', time: '11:30 AM', category: 'Family Law' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border/30">
              <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-electric" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-electric">{s.date}</p>
                <p className="text-xs text-muted-foreground">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
