import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import judexiaLogo from '@/assets/judexia-logo.jpg';
import heroLibrary from '@/assets/hero-library.jpeg';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    signup(fullName, email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen gradient-bg flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <img src={heroLibrary} alt="Library" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
        <div className="relative z-10 p-12 max-w-md">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
            Begin Your <span className="text-gold">Legal Journey</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Join thousands of aspiring legal professionals.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="glass-card-gold p-8 w-full max-w-md animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <img src={judexiaLogo} alt="Judexia" className="w-20 h-20 rounded-xl mb-4 object-cover" />
            <h2 className="font-serif text-2xl font-bold text-foreground">Create Account</h2>
            <p className="text-muted-foreground text-sm mt-1">Start training your legal mind</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground/80">Full Name</Label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80">Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80">Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground/80">Confirm Password</Label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground" />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full gradient-electric text-foreground font-semibold glow-electric hover:opacity-90 transition-opacity">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-electric hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground/60 mt-4">
            Authentication will be secured in the production version.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
