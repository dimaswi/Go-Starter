import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { usersApi, rolesApi } from '@/lib/api';
import { Users, Shield, Activity, UserPlus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { setPageTitle } from '@/lib/page-title';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRoles: 0,
    newUsersThisMonth: 0,
  });

  useEffect(() => {
    setPageTitle('Dashboard');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        usersApi.getAll(),
        rolesApi.getAll(),
      ]);

      const users = usersRes.data.data;
      const roles = rolesRes.data.data;

      // Calculate stats
      const activeUsers = users.filter((u: any) => u.is_active).length;
      
      // Get new users this month (created in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newUsers = users.filter((u: any) => {
        const createdDate = new Date(u.created_at);
        return createdDate >= thirtyDaysAgo;
      }).length;

      setStats({
        totalUsers: users.length,
        activeUsers: activeUsers,
        totalRoles: roles.length,
        newUsersThisMonth: newUsers,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { 
      title: 'Total Users', 
      value: loading ? '...' : stats.totalUsers.toString(), 
      change: stats.activeUsers > 0 ? `${stats.activeUsers} active` : 'No data',
      icon: Users, 
      color: 'text-saweria-cyan',
      bgColor: 'bg-saweria-cyan/10 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
    },
    { 
      title: 'Active Roles', 
      value: loading ? '...' : stats.totalRoles.toString(), 
      change: 'System roles',
      icon: Shield, 
      color: 'text-saweria-purple',
      bgColor: 'bg-saweria-purple/10 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
    },
    { 
      title: 'System Status', 
      value: '99.9%', 
      change: 'Uptime',
      icon: Activity, 
      color: 'text-saweria-pink',
      bgColor: 'bg-saweria-pink/10 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
    },
    { 
      title: 'New Users', 
      value: loading ? '...' : `+${stats.newUsersThisMonth}`, 
      change: 'Last 30 days',
      icon: UserPlus, 
      color: 'text-saweria-orange',
      bgColor: 'bg-saweria-orange/10 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* Page Content */}
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 bg-gradient-to-br from-saweria-cyan/5 via-white to-saweria-orange/5">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-saweria-cyan to-saweria-cyan-dark rounded-2xl border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard 🎉</h1>
          <p className="text-lg opacity-90">
            Welcome back, {user?.full_name}! Here's what's happening today.
          </p>
        </div>

        {/* Main Card Container */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-2xl">Statistik Sistem</CardTitle>
            <CardDescription className="text-base text-saweria-gray">
              Ringkasan aktivitas dan informasi sistem
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="bg-white rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-saweria-black uppercase tracking-wide">
                      {stat.title}
                    </span>
                    <div className={cn(stat.bgColor, "p-3 rounded-xl")}>
                      <Icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-saweria-black">{stat.value}</div>
                    <p className="text-sm text-saweria-gray font-medium">
                      {stat.change}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activity */}
            <div className="col-span-4 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-saweria-black">Informasi Sistem</h3>
                <p className="text-sm text-saweria-gray font-medium">Ringkasan cepat dari sistem</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 rounded-2xl border border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-12 h-12 rounded-xl bg-saweria-cyan/20 border border-black flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-saweria-cyan" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-base font-bold leading-none text-saweria-black">
                      User Management
                    </p>
                    <p className="text-sm text-saweria-gray font-medium">
                      {stats.totalUsers} total users dengan {stats.activeUsers} akun aktif
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl border border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-12 h-12 rounded-xl bg-saweria-purple/20 border border-black flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-saweria-purple" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-base font-bold leading-none text-saweria-black">
                      Role Management
                    </p>
                    <p className="text-sm text-saweria-gray font-medium">
                      {stats.totalRoles} role aktif dikonfigurasi dalam sistem
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl border border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-12 h-12 rounded-xl bg-saweria-pink/20 border border-black flex items-center justify-center flex-shrink-0">
                    <Activity className="h-6 w-6 text-saweria-pink" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-base font-bold leading-none text-saweria-black">
                      System Health
                    </p>
                    <p className="text-sm text-saweria-gray font-medium">
                      Semua layanan berjalan dengan normal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="col-span-3 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-saweria-black">Profil Anda</h3>
                <p className="text-sm text-saweria-gray font-medium">Informasi akun</p>
              </div>
              <div className="bg-white rounded-2xl border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saweria-cyan to-saweria-purple border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-3xl font-bold text-white">
                    {user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-saweria-black">{user?.full_name}</p>
                    <p className="text-sm text-saweria-gray font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-black">
                    <span className="text-sm text-saweria-gray font-semibold">Role</span>
                    <span className="text-sm font-bold text-saweria-black">{user?.role?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-black">
                    <span className="text-sm text-saweria-gray font-semibold">Status</span>
                    <span className="text-sm font-bold text-green-600">
                      {user?.is_active ? 'Active ✓' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-sm text-saweria-gray font-semibold">User ID</span>
                    <span className="text-sm font-bold text-saweria-black">#{user?.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}
