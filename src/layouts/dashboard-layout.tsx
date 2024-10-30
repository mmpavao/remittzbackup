import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/ui/sidebar';
import RightPanel from '@/components/dashboard/right-panel';
import { Menu, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIDEBAR_STATE_KEY = 'dashboard_sidebar_state';

interface SidebarState {
  leftSidebar: boolean;
  rightSidebar: boolean;
}

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileRightPanelOpen, setMobileRightPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const isAdminPage = location.pathname.includes('/admin/analytics') || location.pathname.includes('/admin/transactions');

  useEffect(() => {
    const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState) as SidebarState;
      setSidebarCollapsed(state.leftSidebar);
      setRightPanelCollapsed(state.rightSidebar);
    }
  }, [location.pathname]);

  useEffect(() => {
    const state: SidebarState = {
      leftSidebar: sidebarCollapsed,
      rightSidebar: rightPanelCollapsed
    };
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(state));
  }, [sidebarCollapsed, rightPanelCollapsed]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
        setMobileRightPanelOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileRightPanelOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (mobileRightPanelOpen && rightPanelRef.current && !rightPanelRef.current.contains(event.target as Node)) {
        setMobileRightPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen, mobileRightPanelOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-semibold">Remittz</span>
          </div>
          <button
            onClick={() => setMobileRightPanelOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Left Sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-20",
          isMobile ? cn(
            "w-64 transform",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          ) : cn(
            sidebarCollapsed ? "w-20" : "w-64"
          )
        )}
      >
        <div className="h-full flex flex-col bg-white">
          <div className={cn(
            "p-4 border-b border-gray-200",
            sidebarCollapsed && !isMobile ? "items-center" : ""
          )}>
            <div className={cn(
              "flex items-center gap-3",
              sidebarCollapsed && !isMobile ? "justify-center" : ""
            )}>
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              {(!sidebarCollapsed || isMobile) && (
                <span className="text-xl font-semibold">Remittz</span>
              )}
              {isMobile && (
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="ml-auto p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <Sidebar collapsed={isMobile ? false : sidebarCollapsed} onToggle={() => setMobileMenuOpen(false)} />
        </div>
        {!isMobile && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 hover:bg-emerald-600 group overflow-hidden z-30"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-white relative z-10" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-white relative z-10" />
            )}
          </button>
        )}
      </div>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        !isMobile && cn(
          sidebarCollapsed ? "ml-20" : "ml-64",
          rightPanelCollapsed ? "mr-20" : "mr-80"
        ),
        isMobile && "mt-16"
      )}>
        <div className={cn(
          "h-full",
          isAdminPage ? "p-6" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        )}>
          <Outlet />
        </div>
      </main>

      {/* Right Panel */}
      <div 
        ref={rightPanelRef}
        className={cn(
          "fixed right-0 top-0 h-full bg-white transition-all duration-300 ease-in-out z-20",
          isMobile ? cn(
            "w-80 transform",
            mobileRightPanelOpen ? "translate-x-0" : "translate-x-full"
          ) : cn(
            rightPanelCollapsed ? "w-20" : "w-80"
          ),
          isMobile && "top-16"
        )}
      >
        <RightPanel collapsed={isMobile ? false : rightPanelCollapsed} />
        {!isMobile && (
          <button
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-200 hover:scale-110 hover:bg-emerald-600 group overflow-hidden z-30"
          >
            {rightPanelCollapsed ? (
              <ChevronLeft className="w-4 h-4 text-white relative z-10" />
            ) : (
              <ChevronRight className="w-4 h-4 text-white relative z-10" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}