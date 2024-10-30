import { AlertTriangle } from 'lucide-react';
import { isDevelopment, TEST_PHONE_NUMBERS, TEST_VERIFICATION_CODE } from '@/lib/firebase';

export function AuthNotice() {
  if (!isDevelopment) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Phone authentication is currently in demo mode. For testing purposes, you can:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Use any valid phone number</li>
                <li>Enter "123456" as the verification code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 p-4 rounded-lg mb-6">
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Development Mode Notice</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Use these test credentials:</p>
            <div className="mt-2 space-y-1 font-mono text-xs">
              <p>Phone Numbers:</p>
              {TEST_PHONE_NUMBERS.map(number => (
                <p key={number} className="ml-4">{number}</p>
              ))}
              <p className="mt-2">Verification Code:</p>
              <p className="ml-4">{TEST_VERIFICATION_CODE}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}