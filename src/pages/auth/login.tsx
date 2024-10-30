import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { loginUser } from '@/lib/auth';
import { PasswordInput } from '@/components/ui/password-input';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const { user, userData } = await loginUser(data);
      
      if (userData.status === 'pending') {
        toast.error('Your account is pending approval.');
        return;
      }

      if (userData.status === 'suspended') {
        toast.error('Your account has been suspended. Please contact support.');
        return;
      }
      
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.code === 'auth/user-not-found' 
        ? 'No account found with this email. Please check your email or sign up.'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password. Please try again.'
        : err.code === 'auth/too-many-requests'
        ? 'Too many failed attempts. Please try again later.'
        : 'Login failed. Please check your credentials.';

      if (err.code === 'auth/user-not-found') {
        setError('email', { message: errorMessage });
      } else if (err.code === 'auth/wrong-password') {
        setError('password', { message: errorMessage });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-black rounded-lg p-2">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Remittz</h1>
      </div>

      <h2 className="text-2xl font-bold mb-8">Login to your account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className={cn(
              "w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500",
              errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <PasswordInput
            {...register('password')}
            error={errors.password?.message}
          />
          <div className="flex justify-end mt-1">
            <Link 
              to="/forgot-password" 
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            'Login'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-emerald-500 hover:text-emerald-600 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}