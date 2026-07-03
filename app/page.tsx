'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateLogin } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [workerId, setWorkerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const worker = validateLogin(workerId, password);

    if (worker) {
      localStorage.setItem('currentWorker', JSON.stringify(worker));
      router.push('/dashboard');
    } else {
      setError('Invalid Worker ID or Password');
    }

    setIsLoading(false);
  };

  const handleAdminLogin = () => {
    router.push('/admin');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #134e4a 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo card */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl px-8 py-4 shadow-2xl">
            <img src="/ati-logo.jpg" alt="ATi Motors" className="h-14 w-auto" />
          </div>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #1BBFB2, #0d9488)' }} />

          <div className="p-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1 text-center">Mess Management</h1>
            <p className="text-gray-400 text-sm text-center mb-8">Office Meal Scanner System</p>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">Worker ID</label>
                <input
                  type="text"
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value.toUpperCase())}
                  placeholder="e.g., W001"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 font-medium"
                  style={{ '--tw-ring-color': '#1BBFB2' } as any}
                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #1BBFB2')}
                  onBlur={e => (e.target.style.boxShadow = '')}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none text-gray-900"
                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px #1BBFB2')}
                  onBlur={e => (e.target.style.boxShadow = '')}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-white text-base transition hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1BBFB2, #0d9488)' }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <button
                onClick={handleAdminLogin}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition active:scale-95"
              >
                Admin Dashboard
              </button>
            </div>

            <div className="mt-5 bg-gray-50 border border-gray-100 p-4 rounded-xl">
              <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">Demo Credentials</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ID: W001, W002, W003, W004, W005</li>
                <li>• Password: password123</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">© ATi Motors · Mess Management System</p>
      </div>
    </div>
  );
}
