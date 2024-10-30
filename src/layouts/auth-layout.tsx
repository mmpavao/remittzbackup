import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <Outlet />
      </div>

      {/* Right side - Statistics */}
      <div className="hidden lg:block w-1/2 bg-emerald-500 p-12 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626908013943-df94de54984c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Visual payment statistics
          </h2>
          <p className="text-emerald-50 text-lg">
            These visuals are used to analyze and understand various aspects of payment activity, trends, and patterns.
          </p>
        </div>
      </div>
    </div>
  );
}