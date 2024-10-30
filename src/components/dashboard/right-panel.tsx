import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Send, Download, Plus, ChevronDown, Settings, LogOut, HelpCircle, Book, Key, Cog } from 'lucide-react';
import { QuickTransfer } from './quick-transfer';
import { NotificationsFeed } from './notifications-feed';
import { SendMoneyForm } from './send-money-form';
import { ReceiveMoneyForm } from './receive-money-form';
import { cn } from '@/lib/utils';

interface RightPanelProps {
  collapsed: boolean;
}

export default function RightPanel({ collapsed }: RightPanelProps) {
  const { userData } = useAuthStore();
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [showReceiveMoney, setShowReceiveMoney] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickTransferContacts = [
    { id: '1', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: '2', name: 'Mike', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { id: '3', name: 'Lisa', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }
  ];

  return (
    <div className="h-full p-4 flex flex-col">
      {/* User Profile */}
      <div className={cn(
        "flex items-center",
        collapsed ? "justify-center mb-4" : "justify-between mb-8"
      )}>
        <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
          <img
            src={`https://ui-avatars.com/api/?name=${userData?.fullName}&background=random`}
            alt={userData?.fullName}
            className="w-12 h-12 rounded-full"
          />
          {!collapsed && (
            <div>
              <h3 className="font-medium">{userData?.fullName}</h3>
              <p className="text-sm text-gray-500">{userData?.email}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <MenuItems onClose={() => setShowUserMenu(false)} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Balance */}
      {!collapsed && (
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Total Balance</p>
          <h2 className="text-3xl font-semibold">$32,819.00</h2>
          <p className="text-sm text-emerald-600 mt-1">
            ↑ 12.81%
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className={cn(
        "grid gap-4 mb-8",
        collapsed ? "grid-cols-1" : "grid-cols-2"
      )}>
        <button 
          onClick={() => setShowSendMoney(true)}
          className={cn(
            "flex flex-col items-center justify-center py-4 px-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors group",
            collapsed && "p-3"
          )}
          title={collapsed ? "Send Money" : undefined}
        >
          <Send className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
          {!collapsed && <span className="text-sm font-medium">Send</span>}
        </button>
        <button 
          onClick={() => setShowReceiveMoney(true)}
          className={cn(
            "flex flex-col items-center justify-center py-4 px-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors group",
            collapsed && "p-3"
          )}
          title={collapsed ? "Receive Money" : undefined}
        >
          <Download className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
          {!collapsed && <span className="text-sm font-medium">Receive</span>}
        </button>
      </div>

      {/* Quick Transfer */}
      <div className="mb-8">
        {!collapsed && (
          <h3 className="text-lg font-semibold mb-4">Quick Transfer</h3>
        )}
        <div className={cn(
          "flex gap-2",
          collapsed ? "flex-col items-center" : "flex-row items-center"
        )}>
          {quickTransferContacts.map((contact) => (
            <button
              key={contact.id}
              className="block group relative"
              onClick={() => setShowSendMoney(true)}
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full ring-2 ring-white group-hover:ring-emerald-500 transition-all"
              />
              {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {contact.name}
                </span>
              )}
            </button>
          ))}
          <button 
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            onClick={() => setShowSendMoney(true)}
          >
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {!collapsed && <NotificationsFeed />}

      {/* Forms */}
      {showSendMoney && (
        <SendMoneyForm
          onClose={() => setShowSendMoney(false)}
          balance={32819.00}
        />
      )}

      {showReceiveMoney && (
        <ReceiveMoneyForm
          onClose={() => setShowReceiveMoney(false)}
        />
      )}
    </div>
  );
}

function MenuItems({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Profile', icon: Settings, onClick: () => navigate('/settings/profile') },
    { label: 'API Store', icon: Key, onClick: () => navigate('/admin/api-keys') },
    { label: 'Documentation', icon: Book, onClick: () => window.open('/docs', '_blank') },
    { label: 'Support', icon: HelpCircle, onClick: () => window.open('/support', '_blank') },
    { label: 'Settings', icon: Cog, onClick: () => navigate('/settings/general') },
  ];

  return (
    <>
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </button>
      ))}
      <div className="my-1 border-t border-gray-200" />
      <button
        onClick={() => {
          // Handle logout
          onClose();
        }}
        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </>
  );
}