import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export function PlatformGeneral() {
  const [settings, setSettings] = useState({
    general: {
      platformName: 'Remittz',
      supportEmail: 'support@remittz.com',
      defaultCurrency: 'USD',
      defaultLanguage: 'en',
    },
    branding: {
      colors: {
        primary: '#22c085',    // Cor Verde
        secondary: '#f3f3f3',  // Cor Cinza Claro
        tertiary: '#252527',   // Cor Cinza Escuro
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        baseSize: '16px',
        scale: '1.25',
      }
    },
    payments: {
      minimumAmount: 1,
      maximumAmount: 10000,
      processingFee: 2.9,
      allowedCurrencies: ['USD', 'EUR', 'GBP'],
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Settings */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Basic Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.general.platformName}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, platformName: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, supportEmail: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Currency
              </label>
              <select
                value={settings.general.defaultCurrency}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, defaultCurrency: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Language
              </label>
              <select
                value={settings.general.defaultLanguage}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, defaultLanguage: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Brand Colors</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color (Verde)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.branding.colors.primary}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: {
                      ...settings.branding,
                      colors: { ...settings.branding.colors, primary: e.target.value }
                    }
                  })}
                  className="h-10 w-20 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.branding.colors.primary}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: {
                      ...settings.branding,
                      colors: { ...settings.branding.colors, primary: e.target.value }
                    }
                  })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color (Cinza Claro)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.branding.colors.secondary}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: {
                      ...settings.branding,
                      colors: { ...settings.branding.colors, secondary: e.target.value }
                    }
                  })}
                  className="h-10 w-20 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.branding.colors.secondary}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: {
                      ...settings.branding,
                      colors: { ...settings.branding.colors, secondary: e.target.value }
                    }
                  })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tertiary Color (Cinza Escuro)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.branding.colors.tertiary}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: {
                      ...settings.branding,
                      colors: { ...settings.branding.colors, tertiary: e.target.value }
                    }
                  })}
                  className="h-10 w-20 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={settings.branding.colors.tertiary}
                  onChange={(e) => setSettings({
                    ...settings,
                    branding: {
                      ...settings.branding,
                      colors: { ...settings.branding.colors, tertiary: e.target.value }
                    }
                  })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Typography</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading Font
              </label>
              <select
                value={settings.branding.typography.headingFont}
                onChange={(e) => setSettings({
                  ...settings,
                  branding: {
                    ...settings.branding,
                    typography: { ...settings.branding.typography, headingFont: e.target.value }
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Font
              </label>
              <select
                value={settings.branding.typography.bodyFont}
                onChange={(e) => setSettings({
                  ...settings,
                  branding: {
                    ...settings.branding,
                    typography: { ...settings.branding.typography, bodyFont: e.target.value }
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Font Size
              </label>
              <input
                type="text"
                value={settings.branding.typography.baseSize}
                onChange={(e) => setSettings({
                  ...settings,
                  branding: {
                    ...settings.branding,
                    typography: { ...settings.branding.typography, baseSize: e.target.value }
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type Scale
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.branding.typography.scale}
                onChange={(e) => setSettings({
                  ...settings,
                  branding: {
                    ...settings.branding,
                    typography: { ...settings.branding.typography, scale: e.target.value }
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Payment Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={settings.payments.minimumAmount}
                  onChange={(e) => setSettings({
                    ...settings,
                    payments: { ...settings.payments, minimumAmount: Number(e.target.value) }
                  })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={settings.payments.maximumAmount}
                  onChange={(e) => setSettings({
                    ...settings,
                    payments: { ...settings.payments, maximumAmount: Number(e.target.value) }
                  })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processing Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={settings.payments.processingFee}
                  onChange={(e) => setSettings({
                    ...settings,
                    payments: { ...settings.payments, processingFee: Number(e.target.value) }
                  })}
                  className="w-full pr-8 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Currencies
              </label>
              <select
                multiple
                value={settings.payments.allowedCurrencies}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setSettings({
                    ...settings,
                    payments: { ...settings.payments, allowedCurrencies: values }
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}