import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Scale, Clock, CheckCircle } from 'lucide-react';

const CATEGORIES = ['Criminal Law', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights', 'Labour Law'];
const SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'];

export default function Consultation() {
  const [category, setCategory] = useState('');
  const [slot, setSlot] = useState('');
  const [booked, setBooked] = useState(false);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">Lawyer Consultation</h2>
        <p className="text-sm text-muted-foreground">Book a demo consultation with a legal expert.</p>
      </div>

      {booked ? (
        <div className="glass-card p-8 text-center max-w-md mx-auto">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold mb-2">Consultation Scheduled!</h3>
          <p className="text-muted-foreground mb-1">{category} • {slot}</p>
          <Badge variant="outline" className="border-gold/40 text-gold mt-2">Prototype Simulation</Badge>
          <Button className="mt-6" variant="ghost" onClick={() => { setBooked(false); setCategory(''); setSlot(''); }}>Book Another</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="font-serif font-semibold mb-4 flex items-center gap-2"><Scale className="w-4 h-4 text-gold" /> Select Category</h3>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`text-sm p-3 rounded-lg border transition-all text-left ${category === c ? 'border-electric bg-electric/10 text-electric' : 'border-border hover:border-electric/30'}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-serif font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-electric" /> Choose Time Slot</h3>
            <div className="space-y-2">
              {SLOTS.map(s => (
                <button key={s} onClick={() => setSlot(s)} className={`w-full text-sm p-3 rounded-lg border transition-all text-left ${slot === s ? 'border-gold bg-gold/10 text-gold' : 'border-border hover:border-gold/30'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => { if (category && slot) setBooked(true); }} disabled={!category || !slot} className="w-full gradient-electric glow-electric">Book Consultation</Button>
          </div>
        </div>
      )}
    </div>
  );
}
