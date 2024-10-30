import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { usePermission } from '@/hooks/use-permissions';

export function InstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  
  const notificationPermission = usePermission('notifications');
  const locationPermission = usePermission('geolocation');

  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const hasPromptBeenShown = localStorage.getItem('pwa-prompt-shown');
      if (!hasPromptBeenShown) {
        setShowPrompt(true);
      }
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const installed = await install();
    if (installed) {
      setShowPrompt(false);
      setShowPermissions(true);
      localStorage.setItem('pwa-prompt-shown', 'true');
    }
  };

  const handlePermissions = async () => {
    await Promise.all([
      notificationPermission.request(),
      locationPermission.request()
    ]);
    setShowPermissions(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-shown', 'true');
  };

  if ((!showPrompt && !showPermissions) || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50 md:left-auto md:right-4 md:w-96">
      {showPrompt ? (
        <div className="flex items-start gap-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Download className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-medium">Install Remittz</h3>
              <button onClick={handleDismiss} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Install our app for a better experience with quick access and offline capabilities
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Not Now
              </button>
              <button
                onClick={handleInstall}
                className="px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      ) : showPermissions && (
        <div>
          <h3 className="font-medium mb-2">Enable Features</h3>
          <p className="text-sm text-gray-500 mb-4">
            Allow permissions to get the most out of Remittz
          </p>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Notifications</span>
              <span className="text-xs text-gray-500">
                {notificationPermission.state}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Location</span>
              <span className="text-xs text-gray-500">
                {locationPermission.state}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowPermissions(false)}
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Skip
            </button>
            <button
              onClick={handlePermissions}
              className="px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Allow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}