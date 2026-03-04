import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authApi } from '@/services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      localStorage.setItem('sms_token', data.access_token);
      localStorage.setItem('sms_user', JSON.stringify({ email: data.email, fullName: data.full_name }));
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/60 via-background to-primary/5 p-4 relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
        backgroundSize: '36px 36px'
      }} />

      <div className="w-full max-w-md relative z-10">

        {/* Header — KDU Logo + Title */}
        <div className="text-center mb-8 slide-up">
          {/* Logo card with glow */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl scale-125" />
            <div className="relative w-28 h-28 rounded-3xl bg-white shadow-2xl border border-border/30 flex items-center justify-center p-3">
              <img
                src="/KDU-LOGO.png"
                alt="KDU Logo"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">KDU</h1>
          <p className="text-base font-semibold text-primary mt-0.5">Student Management System</p>
          <p className="text-sm text-muted-foreground mt-1">University Administration Portal</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Card header */}
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground leading-tight">Welcome back</h2>
              <p className="text-sm text-muted-foreground">Sign in to your admin account</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  className={`pl-10 h-12 input-field text-base ${errors.email ? 'border-destructive focus:ring-destructive/20' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  className={`pl-10 pr-10 h-12 input-field text-base ${errors.password ? 'border-destructive focus:ring-destructive/20' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full h-12 btn-glow font-semibold text-base mt-2" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/40">
            <p className="text-xs text-center text-muted-foreground">
              Default credentials: <span className="font-mono font-medium text-foreground">admin@university.edu</span> / <span className="font-mono font-medium text-foreground">admin123</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 opacity-60">
          © {new Date().getFullYear()} KDU — All rights reserved
        </p>
      </div>
    </div>
  );
}
