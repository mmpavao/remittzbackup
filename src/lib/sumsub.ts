import { auth } from './firebase';

// Types
export interface VerificationConfig {
  containerId: string;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface VerificationStatus {
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  updatedAt: Date;
}

// Constants
const SUMSUB_CONFIG = {
  apiUrl: import.meta.env.VITE_SUMSUB_API_URL || 'https://api.sumsub.com',
  flowName: 'basic-kyc',
  tokenEndpoint: '/api/sumsub/access-token'
};

// Main verification function
export async function initSumsubVerification(config: VerificationConfig) {
  const { containerId, onComplete, onError } = config;
  const container = document.getElementById(containerId);
  
  if (!container) {
    throw new Error('Container element not found');
  }

  try {
    // Load SDK script
    await loadSDKScript();

    // Get user token
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const accessToken = await getAccessToken(user.uid);
    
    // Initialize SDK
    const sdkInstance = await window.SNSWebSDK.init({
      accessToken,
      apiUrl: SUMSUB_CONFIG.apiUrl,
      flowName: SUMSUB_CONFIG.flowName,
      externalUserId: user.uid,
      customization: {
        logo: '/logo.svg',
        primaryColor: '#10B981',
        primaryColorHover: '#059669',
        primaryColorActive: '#047857'
      },
      onMessage: (type: string, payload: any) => {
        handleSDKMessage(type, payload, user.uid);
      },
      onError: (error: Error) => {
        console.error('Sumsub SDK Error:', error);
        if (onError) onError(error);
      },
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Launch verification
    await sdkInstance.launch(`#${containerId}`);
    
    return sdkInstance;
  } catch (error) {
    console.error('Failed to initialize Sumsub:', error);
    if (onError) onError(error as Error);
    throw error;
  }
}

// Helper functions
async function loadSDKScript(): Promise<void> {
  if (window.SNSWebSDK) return;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://static.sumsub.com/idensic/static/sns-websdk-v2.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
}

async function getAccessToken(userId: string): Promise<string> {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    
    const response = await fetch(SUMSUB_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

async function handleSDKMessage(type: string, payload: any, userId: string) {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    
    await fetch('/api/sumsub/update-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        userId,
        type,
        payload
      })
    });
  } catch (error) {
    console.error('Error updating verification status:', error);
  }
}