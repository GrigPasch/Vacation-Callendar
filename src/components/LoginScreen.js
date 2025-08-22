import React, { useState } from 'react';
import { Calendar, User, Lock } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleSubmit = () => {
    setLoginError('');
    const result = onLogin(loginForm.username, loginForm.password);
    
    if (!result.success) {
      setLoginError('Username or Password Incorrect! Please try again.');
    } else {
      setLoginForm({ username: '', password: '' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-calm-blue-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-calm-green-gradient" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vacation Calendar</h1>
          <p className="text-gray-600">Log in to manage your vacation dates.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Type your username"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Type your password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyDown={handleKeyPress}
              />
            </div>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-calm-green-gradient text-black font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2 font-medium">Demo Credentials for Testing:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <div><span className="font-medium">Employee:</span> john.smith / password123</div>
            <div><span className="font-medium">Manager:</span> emily.davis / manager123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;