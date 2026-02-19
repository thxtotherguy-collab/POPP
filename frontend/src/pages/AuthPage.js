import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplets, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(regForm.name, regForm.email, regForm.password, regForm.phone);
      toast.success('Account created! Welcome to POPP.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)] flex items-center justify-center px-4 py-12" data-testid="auth-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Droplets className="h-8 w-8 text-[hsl(214,100%,40%)]" />
            <span className="font-manrope font-bold text-2xl text-[hsl(222,47%,11%)]">POPP</span>
          </Link>
          <p className="text-sm text-[hsl(215,16%,47%)]">Sign in or create an account to manage your quotes</p>
        </div>

        <div className="bg-white border border-[hsl(214,32%,91%)] rounded-sm p-6">
          <Tabs defaultValue="login">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1" data-testid="login-tab">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="flex-1" data-testid="register-tab">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-1.5">Email</label>
                  <input
                    type="email" required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(f => ({...f, email: e.target.value}))}
                    className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                    data-testid="login-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-1.5">Password</label>
                  <input
                    type="password" required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(f => ({...f, password: e.target.value}))}
                    className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                    data-testid="login-password"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm font-semibold" data-testid="login-submit">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-1.5">Full Name</label>
                  <input
                    type="text" required
                    value={regForm.name}
                    onChange={(e) => setRegForm(f => ({...f, name: e.target.value}))}
                    className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                    data-testid="register-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-1.5">Email</label>
                  <input
                    type="email" required
                    value={regForm.email}
                    onChange={(e) => setRegForm(f => ({...f, email: e.target.value}))}
                    className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                    data-testid="register-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={regForm.phone}
                    onChange={(e) => setRegForm(f => ({...f, phone: e.target.value}))}
                    className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                    data-testid="register-phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(222,47%,11%)] mb-1.5">Password</label>
                  <input
                    type="password" required minLength={6}
                    value={regForm.password}
                    onChange={(e) => setRegForm(f => ({...f, password: e.target.value}))}
                    className="w-full h-11 px-3 border border-[hsl(214,32%,91%)] rounded-sm text-sm outline-none focus:ring-2 focus:ring-[hsl(214,100%,40%)]"
                    data-testid="register-password"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 bg-[hsl(214,100%,40%)] hover:bg-[hsl(214,100%,35%)] text-white rounded-sm font-semibold" data-testid="register-submit">
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
