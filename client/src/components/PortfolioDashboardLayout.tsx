import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun, Eye, Home, Briefcase, Award, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Api } from '@/api/api';
import { useToast } from '@/hooks/use-toast';

interface PortfolioDashboardLayoutProps {
  children: React.ReactNode;
}

const PortfolioDashboardLayout = ({ children }: PortfolioDashboardLayoutProps) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const api = Api.getInstance();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await api.post('/auth/logout', {});
      if (response.status === 200) {
        toast({
          title: "Success!",
          description: "Logged out successfully!",
        });
        navigate('/login', { replace: true });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to logout. Please try again.",
      });
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/app/dashboard',
      id: 'dashboard',
    },
    {
      label: 'Personal Information',
      icon: User,
      href: '/app/dashboard/personal',
      id: 'personal',
    },
    {
      label: 'Projects',
      icon: Briefcase,
      href: '/app/dashboard/projects',
      id: 'projects',
    },
    {
      label: 'Experience & Skills',
      icon: Award,
      href: '/app/dashboard/experience',
      id: 'experience',
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border/20 flex flex-col z-40">
        {/* Logo/Header */}
        <div className="p-6 border-b border-border/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">AJ</span>
            </div>
            <span className="font-semibold">Portfolio Builder</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Preview & Actions */}
        <div className="border-t border-border/20 p-4 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => navigate('/preview')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Portfolio
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Theme Toggle */}
        <div className="border-t border-border/20 p-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AJ</span>
                </div>
                <span className="font-semibold ml-2">Alex Johnson</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortfolioDashboardLayout;
