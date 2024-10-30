import { useState, useEffect } from 'react';

type PermissionName = 'camera' | 'microphone' | 'geolocation' | 'notifications';

interface PermissionState {
  status: PermissionState['state'];
  error?: string;
}

export function usePermission(name: PermissionName) {
  const [state, setState] = useState<PermissionState>({ status: 'prompt' });

  useEffect(() => {
    // Check if permissions API is supported
    if (!navigator.permissions) {
      setState({ status: 'denied', error: 'Permissions API not supported' });
      return;
    }

    let mounted = true;

    async function checkPermission() {
      try {
        const result = await navigator.permissions.query({ name: name as PermissionName });
        
        if (mounted) {
          setState({ status: result.state });
          
          // Listen for changes
          result.addEventListener('change', () => {
            if (mounted) {
              setState({ status: result.state });
            }
          });
        }
      } catch (error) {
        if (mounted) {
          setState({ status: 'denied', error: (error as Error).message });
        }
      }
    }

    checkPermission();

    return () => {
      mounted = false;
    };
  }, [name]);

  const request = async () => {
    try {
      switch (name) {
        case 'camera':
          await navigator.mediaDevices.getUserMedia({ video: true });
          break;
        case 'microphone':
          await navigator.mediaDevices.getUserMedia({ audio: true });
          break;
        case 'geolocation':
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          break;
        case 'notifications':
          const result = await Notification.requestPermission();
          setState({ status: result });
          return result;
      }
      
      // Re-check permission after request
      const status = await navigator.permissions.query({ name: name as PermissionName });
      setState({ status: status.state });
      return status.state;
    } catch (error) {
      setState({ status: 'denied', error: (error as Error).message });
      return 'denied' as PermissionState['state'];
    }
  };

  return { state: state.status, error: state.error, request };
}