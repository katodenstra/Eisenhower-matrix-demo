
import React, { useState } from 'react';

interface AuthViewProps {
  onLogin: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Manage your priorities with AI intelligence</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white p-3 rounded-2xl font-semibold hover:bg-slate-800 transition-all"
          >
            Sign In
          </button>
          <div className="text-center">
            <button type="button" className="text-sm text-blue-600 hover:underline">Forgot password?</button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['Google', 'Apple', 'Facebook'].map((social) => (
            <button
              key={social}
              onClick={onLogin}
              className="flex items-center justify-center p-3 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
            >
              <span className="text-xs font-medium">{social}</span>
            </button>
          ))}
        </div>
        
        <p className="text-center text-xs text-slate-400">
          All data is encrypted in our secure database for your privacy.
        </p>
      </div>
    </div>
  );
};

export default AuthView;
