import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Scale, Clock, CheckCircle, User, Star, MapPin } from 'lucide-react';

const CATEGORIES = ['Criminal Law', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights', 'Labour Law'];
const SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'];

const LAWYERS = [
  { name: 'Adv. Priya Sharma', speciality: 'Criminal Law', rating: 4.9, location: 'Delhi', experience: '12 years' },
  { name: 'Adv. Rajesh Gupta', speciality: 'Family Law', rating: 4.8, location: 'Mumbai', experience: '15 years' },
  { name: 'Adv. Ananya Iyer', speciality: 'Corporate Law', rating: 4.7, location: 'Bangalore', experience: '10 years' },
];

export default function Consultation() {
  const [category, setCategory] = useState('');
  const [slot, setSlot] = useState('');
  const [booked, setBooked] = useState(false);
  const [step, setStep] = useState(1);

  const handleBook = () => {
    if (category && slot) {
      setBooked(true);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">Lawyer Consultation</h2>
        <p className="text-sm text-muted-foreground">Connect with verified legal experts for guidance.</p>
      </div>

      {booked ? (
        <div className="glass-card p-8 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="font-serif text-xl font-bold mb-2">Consultation Scheduled!</h3>
          <p className="text-muted-foreground mb-1">{category}</p>
          <p className="text-electric font-medium">{slot}</p>
          <p className="text-xs text-muted-foreground mt-3">You'll receive a confirmation email with meeting details.</p>
          <Button className="mt-6 gradient-electric glow-electric" onClick={() => { setBooked(false); setCategory(''); setSlot(''); setStep(1); }}>Book Another</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-electric text-white' : 'bg-muted text-muted-foreground'}`}>{s}</div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-electric' : 'bg-border'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="glass-card p-6">
              <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-gold" /> Select Legal Category
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setStep(2); }}
                    className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] ${category === c ? 'border-electric bg-electric/10 text-electric shadow-lg shadow-electric/10' : 'border-border hover:border-electric/40'}`}
                  >
                    <Scale className="w-4 h-4 mb-2 text-gold" />
                    <span className="text-sm font-medium block">{c}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-electric" /> Recommended Lawyers
                </h3>
                <div className="grid gap-3">
                  {LAWYERS.map((l, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-electric/40 transition-all">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-gold" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{l.name}</h4>
                        <p className="text-xs text-muted-foreground">{l.speciality} • {l.experience}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-3 h-3 text-gold fill-gold" />
                          <span className="text-xs text-gold">{l.rating}</span>
                          <MapPin className="w-3 h-3 text-muted-foreground ml-1" />
                          <span className="text-xs text-muted-foreground">{l.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-serif font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-electric" /> Choose Time Slot
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {SLOTS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setSlot(s); setStep(3); }}
                      className={`text-sm p-3 rounded-xl border-2 transition-all text-center hover:scale-[1.02] ${slot === s ? 'border-gold bg-gold/10 text-gold shadow-lg shadow-gold/10' : 'border-border hover:border-gold/40'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
            </div>
          )}

          {step === 3 && (
            <div className="glass-card p-6 max-w-md mx-auto space-y-4">
              <h3 className="font-serif font-semibold text-center">Confirm Booking</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-electric">{category}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-muted-foreground">Time Slot</span>
                  <span className="font-medium text-gold">{slot}</span>
                </div>
              </div>
              <Button onClick={handleBook} className="w-full gradient-electric glow-electric">Confirm Consultation</Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep(2)}>← Back</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
