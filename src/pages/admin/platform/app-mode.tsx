import { useState } from 'react';
import { ClipboardCopy, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImplementationStep {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  status: 'pending' | 'testing' | 'success' | 'error';
  mode: 'sandbox' | 'production';
  logs: string[];
}

const implementationSteps: ImplementationStep[] = [
  {
    id: 'firebase-config',
    title: 'Firebase Configuration',
    description: 'Set up and validate Firebase project settings',
    instructions: [
      'Create production Firebase project',
      'Configure Authentication settings',
      'Set up Firestore database rules',
      'Configure Storage bucket permissions',
      'Set up Firebase hosting'
    ],
    status: 'pending',
    mode: 'sandbox',
    logs: []
  },
  {
    id: 'payment-gateway',
    title: 'Payment Gateway Integration',
    description: 'Configure payment processing systems',
    instructions: [
      'Set up Stripe production account',
      'Configure webhook endpoints',
      'Set up payment success/failure handlers',
      'Implement refund mechanisms',
      'Configure payment analytics'
    ],
    status: 'pending',
    mode: 'sandbox',
    logs: []
  },
  {
    id: 'kyc-verification',
    title: 'KYC Verification System',
    description: 'Identity verification and compliance',
    instructions: [
      'Configure SumSub production environment',
      'Set up verification workflows',
      'Implement document validation',
      'Configure compliance reporting',
      'Set up audit logging'
    ],
    status: 'pending',
    mode: 'sandbox',
    logs: []
  },
  {
    id: 'notifications',
    title: 'Notification System',
    description: 'Push notifications and alerts setup',
    instructions: [
      'Configure FCM production credentials',
      'Set up notification templates',
      'Implement notification scheduling',
      'Configure delivery tracking',
      'Set up notification analytics'
    ],
    status: 'pending',
    mode: 'sandbox',
    logs: []
  },
  {
    id: 'security',
    title: 'Security Implementation',
    description: 'Security measures and monitoring',
    instructions: [
      'Configure SSL certificates',
      'Set up WAF rules',
      'Implement rate limiting',
      'Configure DDoS protection',
      'Set up security monitoring'
    ],
    status: 'pending',
    mode: 'sandbox',
    logs: []
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Analytics',
    description: 'System monitoring and analytics setup',
    instructions: [
      'Set up error tracking',
      'Configure performance monitoring',
      'Implement user analytics',
      'Set up automated alerts',
      'Configure logging system'
    ],
    status: 'pending',
    mode: 'sandbox',
    logs: []
  }
];

export function AppMode() {
  const [steps, setSteps] = useState<ImplementationStep[]>(implementationSteps);
  const [selectedStep, setSelectedStep] = useState<ImplementationStep | null>(null);

  const handleModeToggle = (stepId: string) => {
    setSteps(steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          mode: step.mode === 'sandbox' ? 'production' : 'sandbox'
        };
      }
      return step;
    }));
  };

  const handleTest = async (step: ImplementationStep) => {
    setSteps(steps.map(s => {
      if (s.id === step.id) {
        return {
          ...s,
          status: 'testing',
          logs: [...s.logs, `[${new Date().toISOString()}] Starting ${s.title} test...`]
        };
      }
      return s;
    }));

    // Simulate test process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSteps(steps.map(s => {
      if (s.id === step.id) {
        const success = Math.random() > 0.5;
        return {
          ...s,
          status: success ? 'success' : 'error',
          logs: [
            ...s.logs,
            `[${new Date().toISOString()}] Test ${success ? 'completed successfully' : 'failed'}`
          ]
        };
      }
      return s;
    }));
  };

  const copyLogs = (logs: string[]) => {
    navigator.clipboard.writeText(logs.join('\n'));
    toast.success('Logs copied to clipboard');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">APP Mode Configuration</h2>
        <p className="text-sm text-gray-500">
          Configure and test each component for production deployment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {steps.map(step => (
          <div
            key={step.id}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              {step.status === 'testing' ? (
                <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
              ) : step.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : step.status === 'error' ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : null}
            </div>

            <div className="space-y-2 mb-4">
              {step.instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  {instruction}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleModeToggle(step.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                    step.mode === 'production'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {step.mode === 'production' ? 'Production' : 'Sandbox'}
                </button>
                <button
                  onClick={() => setSelectedStep(step)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  View Logs
                </button>
              </div>
              <button
                onClick={() => handleTest(step)}
                disabled={step.status === 'testing'}
                className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Test
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Logs Modal */}
      {selectedStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">{selectedStep.title} Logs</h3>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap max-h-96 overflow-auto">
                  {selectedStep.logs.length > 0 
                    ? selectedStep.logs.join('\n')
                    : 'No logs available'}
                </pre>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => copyLogs(selectedStep.logs)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <ClipboardCopy className="w-4 h-4" />
                  Copy Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}