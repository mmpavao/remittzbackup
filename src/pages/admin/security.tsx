import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Shield, AlertTriangle, Lock, Key } from 'lucide-react';
import toast from 'react-hot-toast';

interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  twoFactor: {
    required: boolean;
    allowedMethods: string[];
    graceLoginCount: number;
  };
  session: {
    timeout: number;
    maxConcurrent: number;
    enforceIpLock: boolean;
  };
  rateLimit: {
    maxAttempts: number;
    windowMinutes: number;
    blockDurationMinutes: number;
  };
}

const initialSettings: SecuritySettings = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
  },
  twoFactor: {
    required: true,
    allowedMethods: ['authenticator', 'sms'],
    graceLoginCount: 3,
  },
  session: {
    timeout: 30,
    maxConcurrent: 3,
    enforceIpLock: true,
  },
  rateLimit: {
    maxAttempts: 5,
    windowMinutes: 15,
    blockDurationMinutes: 30,
  },
};

export function AdminSecurity() {
  const [settings, setSettings] = useState<SecuritySettings>(initialSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Security settings updated successfully');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security Controls"
        subtitle="Configure platform-wide security settings and policies"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin', href: '/admin' },
          { label: 'Security' }
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Policy */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-medium text-gray-900">Password Policy</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Length
                </label>
                <input
                  type="number"
                  value={settings.passwordPolicy.minLength}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      minLength: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Expiry (days)
                </label>
                <input
                  type="number"
                  value={settings.passwordPolicy.expiryDays}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      expiryDays: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireUppercase}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireUppercase: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Require uppercase letters
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireLowercase}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireLowercase: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Require lowercase letters
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireNumbers}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireNumbers: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Require numbers
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.passwordPolicy.requireSpecialChars}
                  onChange={(e) => setSettings({
                    ...settings,
                    passwordPolicy: {
                      ...settings.passwordPolicy,
                      requireSpecialChars: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Require special characters
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Require 2FA</h3>
                  <p className="text-sm text-gray-500">Enforce two-factor authentication for all users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.twoFactor.required}
                    onChange={(e) => setSettings({
                      ...settings,
                      twoFactor: {
                        ...settings.twoFactor,
                        required: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed Methods
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.twoFactor.allowedMethods.includes('authenticator')}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...settings.twoFactor.allowedMethods, 'authenticator']
                          : settings.twoFactor.allowedMethods.filter(m => m !== 'authenticator');
                        setSettings({
                          ...settings,
                          twoFactor: {
                            ...settings.twoFactor,
                            allowedMethods: methods
                          }
                        });
                      }}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Authenticator App
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.twoFactor.allowedMethods.includes('sms')}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...settings.twoFactor.allowedMethods, 'sms']
                          : settings.twoFactor.allowedMethods.filter(m => m !== 'sms');
                        setSettings({
                          ...settings,
                          twoFactor: {
                            ...settings.twoFactor,
                            allowedMethods: methods
                          }
                        });
                      }}
                      className="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      SMS
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grace Period (login count)
                </label>
                <input
                  type="number"
                  value={settings.twoFactor.graceLoginCount}
                  onChange={(e) => setSettings({
                    ...settings,
                    twoFactor: {
                      ...settings.twoFactor,
                      graceLoginCount: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Number of logins allowed before 2FA setup is required
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-medium text-gray-900">Session Management</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.session.timeout}
                  onChange={(e) => setSettings({
                    ...settings,
                    session: {
                      ...settings.session,
                      timeout: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Concurrent Sessions
                </label>
                <input
                  type="number"
                  value={settings.session.maxConcurrent}
                  onChange={(e) => setSettings({
                    ...settings,
                    session: {
                      ...settings.session,
                      maxConcurrent: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">IP Lock</h3>
                  <p className="text-sm text-gray-500">Lock sessions to the IP address they were created from</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.session.enforceIpLock}
                    onChange={(e) => setSettings({
                      ...settings,
                      session: {
                        ...settings.session,
                        enforceIpLock: e.target.checked
                      }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-medium text-gray-900">Rate Limiting</h2>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Attempts
                </label>
                <input
                  type="number"
                  value={settings.rateLimit.maxAttempts}
                  onChange={(e) => setSettings({
                    ...settings,
                    rateLimit: {
                      ...settings.rateLimit,
                      maxAttempts: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Window (minutes)
                </label>
                <input
                  type="number"
                  value={settings.rateLimit.windowMinutes}
                  onChange={(e) => setSettings({
                    ...settings,
                    rateLimit: {
                      ...settings.rateLimit,
                      windowMinutes: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Block Duration (minutes)
                </label>
                <input
                  type="number"
                  value={settings.rateLimit.blockDurationMinutes}
                  onChange={(e) => setSettings({
                    ...settings,
                    rateLimit: {
                      ...settings.rateLimit,
                      blockDurationMinutes: Number(e.target.value)
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}