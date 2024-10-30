import { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export function PlatformSEO() {
  const [settings, setSettings] = useState({
    branding: {
      logo: '',
      favicon: '',
      socialBanner: '',
    },
    seo: {
      title: 'Remittz - Secure Payment Platform',
      description: 'Send and receive payments securely with Remittz',
      keywords: 'payments, secure payments, money transfer, remittz',
      ogImage: '',
      twitterHandle: '@remittz',
    },
    analytics: {
      googleAnalyticsId: '',
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('SEO settings saved successfully');
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">Branding</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  {settings.branding.logo ? (
                    <img 
                      src={settings.branding.logo} 
                      alt="Logo" 
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <Upload className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Change Logo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                  {settings.branding.favicon ? (
                    <img 
                      src={settings.branding.favicon} 
                      alt="Favicon" 
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <Upload className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Change Favicon
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Share Banner
            </label>
            <div className="mt-1">
              <div className="border-2 border-gray-300 border-dashed rounded-lg p-12 text-center">
                {settings.branding.socialBanner ? (
                  <img 
                    src={settings.branding.socialBanner} 
                    alt="Social Banner" 
                    className="mx-auto h-32 object-contain"
                  />
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Upload Banner
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-gray-900">SEO Settings</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={settings.seo.title}
              onChange={(e) => setSettings({
                ...settings,
                seo: { ...settings.seo, title: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Recommended length: 50-60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={settings.seo.description}
              onChange={(e) => setSettings({
                ...settings,
                seo: { ...settings.seo, description: e.target.value }
              })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Recommended length: 150-160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              value={settings.seo.keywords}
              onChange={(e) => setSettings({
                ...settings,
                seo: { ...settings.seo, keywords: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate keywords with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter Handle
            </label>
            <input
              type="text"
              value={settings.seo.twitterHandle}
              onChange={(e) => setSettings({
                ...settings,
                seo: { ...settings.seo, twitterHandle: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Analytics ID
            </label>
            <input
              type="text"
              value={settings.analytics.googleAnalyticsId}
              onChange={(e) => setSettings({
                ...settings,
                analytics: { ...settings.analytics, googleAnalyticsId: e.target.value }
              })}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            />
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