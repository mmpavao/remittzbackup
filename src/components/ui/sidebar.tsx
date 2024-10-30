import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Wallet, 
  CreditCard, 
  ListOrdered, 
  Link as LinkIcon,
  Users,
  BarChart4,
  Sliders,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { hasAdminAccess } from '@/lib/auth';
import { logoutUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, setUser, setUserData } = useAuthStore();

  const mainMenu = [
    {
      icon: Grid,
      path: '/dashboard',
      label: 'Dashboard'
    },
    {
      icon: Wallet,
      path: '/wallet',
      label: 'Wallet'
    },
    {
      icon: CreditCard,
      path: '/cards',
      label: 'Cards'
    },
    {
      icon: ListOrdered,
      path: '/transactions',
      label: 'Transactions'
    },
    {
      icon: LinkIcon,
      path: '/smart-links',
      label: 'SmartLinks'
    },
    {
      icon: UserPlus,
      path: '/connections',
      label: 'Connections'
    }
  ];

  const adminMenu = [
    {
      icon: BarChart4,
      path: '/admin/analytics',
      label: 'Analytics'
    },
    {
      icon: ListOrdered,
      path: '/admin/transactions',
      label: 'Transactions'
    },
    {
      icon: Users,
      path: '/admin/users',
      label: 'Users'
    },
    {
      icon: Sliders,
      path: '/admin/platform',
      label: 'Platform'
    }
  ];

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setUserData(null);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Main Menu */}
        <nav className="p-4">
          <div className="space-y-1">
            {mainMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onToggle}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors",
                  isActive(item.path) && "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Admin Menu */}
        {hasAdminAccess(userData?.role) && (
          <nav className="p-4 border-t border-gray-200">
            <div className={cn("mb-2", collapsed ? "px-3" : "px-4")}>
              <p className="text-xs font-medium text-gray-400 uppercase">Admin</p>
            </div>
            <div className="space-y-1">
              {adminMenu.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onToggle}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors",
                    isActive(item.path) && "bg-emerald-50 text-emerald-600 hover:bg-emerald-50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}