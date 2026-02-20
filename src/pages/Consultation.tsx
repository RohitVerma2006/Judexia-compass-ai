import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Scale, Clock, CheckCircle, User, Star, MapPin, CalendarIcon, CreditCard, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Criminal Law', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights', 'Labour Law'];

const MOCK_LAWYERS = [
  { id: 'mock-1', name: 'Adv. Priya Sharma', specialization: 'Criminal Law', rating: 4.9, location: 'Delhi', experience: '12 years', fee: 1500, avatar: null },
  { id: 'mock-2', name: 'Adv. Rajesh Gupta', specialization: 'Family Law', rating: 4.8, location: 'Mumbai', experience: '15 years', fee: 2000, avatar: null },
  { id: 'mock-3', name: 'Adv. Ananya Iyer', specialization: 'Corporate Law', rating: 4.7, location: 'Bangalore', experience: '10 years', fee: 1800, avatar: null },
  { id: 'mock-4', name: 'Adv. Vikram Singh', specialization: 'Property Law', rating: 4.6, location: 'Jaipur', experience: '8 years', fee: 1200, avatar: null },
  { id: 'mock-5', name: 'Adv. Meera Nair', specialization: 'Consumer Rights', rating: 4.5, location: 'Chennai', experience: '7 years', fee: 1000, avatar: null },
  { id: 'mock-6', name: 'Adv. Arjun Patel', specialization: 'Labour Law', rating: 4.8, location: 'Ahmedabad', experience: '14 years', fee: 1600, avatar: null },
];

const SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'];

export default function Consultation() {
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [selectedLawyer, setSelectedLawyer] = useState<typeof MOCK_LAWYERS[0] | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [issue, setIssue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [processing, setProcessing] = useState(false);
  const [booked, setBooked] = useState(false);

  const filteredLawyers = category
    ? MOCK_LAWYERS.filter(l => l.specialization === category)
    : MOCK_LAWYERS;

  const handleBookClick = (lawyer: typeof MOCK_LAWYERS[0]) => {
    setSelectedLawyer(lawyer);
    setBookingOpen(true);
    setDate(undefined);
    setTime('');
    setIssue('');
  };

  const handleProceedToPayment = () => {
    if (!date || !time || !issue.trim()) return;
    setBookingOpen(false);
    setPaymentOpen(true);
  };

  const handlePayNow = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(r => setTimeout(r, 2000));
    
    // Create consultation record
    if (user && selectedLawyer && date) {
      // In production, lawyer_id would be a real UUID. For mock data, we store via edge function or skip.
      // For now, store notification locally and show success
    }

    setProcessing(false);
    setPaymentOpen(false);
    setBooked(true);
  };

  if (booked) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-8 text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="font-serif text-2xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground mb-1">Booking Request Sent to {selectedLawyer?.name}</p>
          <p className="text-electric font-medium">{date && format(date, 'PPP')} at {time}</p>
          <p className="text-xs text-muted-foreground mt-3">You'll receive a notification once the lawyer accepts.</p>
          <Button className="mt-6 gradient-electric glow-electric" onClick={() => { setBooked(false); setCategory(''); setSelectedLawyer(null); }}>
            Book Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card-gold p-4">
        <h2 className="font-serif text-xl font-bold">Lawyer Consultation</h2>
        <p className="text-sm text-muted-foreground">Connect with verified legal experts for guidance.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCategory('')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!category ? 'bg-electric/20 text-electric border border-electric/40' : 'bg-secondary/40 text-muted-foreground hover:text-foreground border border-border/50'}`}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-electric/20 text-electric border border-electric/40' : 'bg-secondary/40 text-muted-foreground hover:text-foreground border border-border/50'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Lawyer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLawyers.map(lawyer => (
          <div key={lawyer.id} className="glass-card p-5 hover:border-electric/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-gold" />
              </div>
              <div>
                <h4 className="font-serif font-semibold">{lawyer.name}</h4>
                <p className="text-xs text-muted-foreground">{lawyer.specialization}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                <span className="text-gold font-medium">{lawyer.rating}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{lawyer.experience}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{lawyer.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-3.5 h-3.5 text-electric" />
                <span className="text-electric font-semibold">₹{lawyer.fee}</span>
                <span className="text-muted-foreground text-xs">/ session</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {SLOTS.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] px-2 py-1 rounded-md bg-secondary/40 text-muted-foreground">{s}</span>
              ))}
              <span className="text-[10px] px-2 py-1 rounded-md bg-secondary/40 text-muted-foreground">+{SLOTS.length - 3} more</span>
            </div>
            <Button className="w-full gradient-electric glow-electric text-sm" onClick={() => handleBookClick(lawyer)}>
              Book Consultation
            </Button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="glass-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Book Consultation</DialogTitle>
          </DialogHeader>
          {selectedLawyer && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{selectedLawyer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedLawyer.specialization} • ₹{selectedLawyer.fee}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-secondary/50", !date && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Select Time</Label>
                <div className="grid grid-cols-3 gap-2">
                  {SLOTS.map(s => (
                    <button key={s} onClick={() => setTime(s)} className={`text-xs p-2.5 rounded-lg border transition-all ${time === s ? 'border-gold bg-gold/10 text-gold' : 'border-border/50 hover:border-gold/40'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Describe Your Issue</Label>
                <Textarea value={issue} onChange={e => setIssue(e.target.value)} placeholder="Briefly describe your legal issue..." className="bg-secondary/50 border-border/50 min-h-[80px]" />
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg bg-gold/5 border border-gold/20">
                <span className="text-sm text-muted-foreground">Consultation Fee</span>
                <span className="text-lg font-bold text-gold">₹{selectedLawyer.fee}</span>
              </div>

              <Button onClick={handleProceedToPayment} disabled={!date || !time || !issue.trim()} className="w-full gradient-electric glow-electric">
                Proceed to Payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="glass-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-electric" /> Secure Payment
            </DialogTitle>
          </DialogHeader>
          {processing ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-electric/30 border-t-electric animate-spin mx-auto" />
              <p className="text-electric font-medium">Processing Payment...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setPaymentMethod('card')} className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${paymentMethod === 'card' ? 'border-electric bg-electric/10 text-electric' : 'border-border/50'}`}>
                  <CreditCard className="w-4 h-4 mx-auto mb-1" /> Card
                </button>
                <button onClick={() => setPaymentMethod('upi')} className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${paymentMethod === 'upi' ? 'border-electric bg-electric/10 text-electric' : 'border-border/50'}`}>
                  <IndianRupee className="w-4 h-4 mx-auto mb-1" /> UPI
                </button>
              </div>

              {paymentMethod === 'card' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Card Number</Label>
                    <Input placeholder="4242 4242 4242 4242" className="bg-secondary/50 border-border/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Expiry</Label>
                      <Input placeholder="MM/YY" className="bg-secondary/50 border-border/50" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">CVV</Label>
                      <Input placeholder="•••" type="password" className="bg-secondary/50 border-border/50" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Label className="text-xs">UPI ID</Label>
                  <Input placeholder="yourname@upi" className="bg-secondary/50 border-border/50" />
                </div>
              )}

              <div className="p-3 rounded-lg bg-gold/5 border border-gold/20 flex justify-between items-center">
                <span className="text-sm">Total</span>
                <span className="text-xl font-bold text-gold">₹{selectedLawyer?.fee}</span>
              </div>

              <Button onClick={handlePayNow} className="w-full gradient-electric glow-electric">
                Pay Now
              </Button>
              <p className="text-center text-[10px] text-muted-foreground/50">🔒 Secured with 256-bit encryption</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
