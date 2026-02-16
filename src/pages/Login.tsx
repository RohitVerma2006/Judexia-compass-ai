import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import judexiaLogo from '@/assets/judexia-logo.jpg';
import heroScales from '@/assets/hero-scales.jpeg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen gradient-bg flex">
      {/* Left - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <img src={heroScales} alt="Justice" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
        <div className="relative z-10 p-12 max-w-md">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
            Train Your <span className="text-gold">Legal Mind</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            with Intelligent Systems powered by AI.
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="glass-card-gold p-8 w-full max-w-md animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <img src={judexiaLogo} alt="Judexia" className="w-20 h-20 rounded-xl mb-4 object-cover" />
            <h2 className="font-serif text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground text-sm mt-1">Sign in to continue learning</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-electric"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-electric"
              />
            </div>
            <Button type="submit" className="w-full gradient-electric text-foreground font-semibold glow-electric hover:opacity-90 transition-opacity">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-electric hover:underline">Sign up</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground/60 mt-4">
            Authentication will be secured in the production version.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
