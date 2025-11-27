import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi, settingsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { setPageTitle, getAppName } from '@/lib/page-title';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [appName, setAppName] = useState('StarterKits');

  useEffect(() => {
    setPageTitle('Login');
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsApi.getAll();
      const settings = response.data.data;
      
      if (settings.app_name) {
        setAppName(settings.app_name);
        localStorage.setItem('appName', settings.app_name);
      }
      if (settings.app_subtitle) {
        localStorage.setItem('appSubtitle', settings.app_subtitle);
      }
    } catch (error) {
      // Use default if API fails
      setAppName(getAppName());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saweria-cyan/10 via-white to-saweria-orange/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex aspect-square size-16 items-center justify-center rounded-2xl bg-saweria-cyan border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Building2 className="size-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-saweria-black mb-2">{appName}</h1>
          <p className="text-lg text-saweria-gray">Jembatan interaksi dengan penontonmu! 🎉</p>
        </div>

        {/* Login Card */}
        <Card className="w-full">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center text-base text-saweria-gray">
              Masuk ke akun Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-saweria-black">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@simrs.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-saweria-black">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="text-sm text-white bg-red-500 p-3 rounded-xl border border-black font-medium">
                  {error}
                </div>
              )}
              <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>
            <div className="mt-6 text-sm text-center">
              <div className="bg-saweria-gray-light p-4 rounded-xl border border-black">
                <p className="font-semibold text-saweria-black mb-2">Demo credentials</p>
                <div className="font-mono bg-white p-3 rounded-lg text-sm border border-black">
                  admin@simrs.com / admin123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-saweria-gray">
          <p>Cara memulai:</p>
          <ol className="mt-2 space-y-1 text-left inline-block">
            <li>1. Daftarkan dirimu</li>
            <li>2. Verifikasi akun kamu</li>
            <li>3. Atur overlay yang ingin digunakan</li>
            <li>4. Jangan lupa pasang QR code atau link saweriamu</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
