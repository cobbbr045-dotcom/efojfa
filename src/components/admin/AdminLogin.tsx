import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onBackToStorefront: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStorefront }) => {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(password);
    } catch (err: any) {
      setError(err.message || 'Incorrect password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 text-stone-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <button
          onClick={onBackToStorefront}
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Storefront</span>
        </button>

        <span className="text-3xl font-serif font-bold tracking-widest text-white uppercase block">
          CLEVARA
        </span>
        <h2 className="text-xl font-medium text-stone-200">
          Owner Portal & Administration
        </h2>
        <p className="text-xs text-stone-400 max-w-sm mx-auto font-light">
          Authorized owner access to catalog, real-time inventory, order dispatch, and Nepalese fulfillment.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-stone-950/80 border border-stone-800 py-8 px-6 sm:px-10 rounded-2xl shadow-2xl backdrop-blur-md space-y-6">
          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Owner Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-3.5 pr-10 py-2.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3 bg-stone-100 hover:bg-white text-stone-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Verifying Credentials...' : 'Authenticate to Dashboard'}
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-500 text-center">
            <p>Protected by cryptographic PBKDF2 hash verification.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
