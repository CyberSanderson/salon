// src/app/login/page.tsx
'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert('Error signing up: ' + error.message);
    } else {
      alert('Success! Please check your email to confirm your sign up.');
      router.push('/');
    }
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Error signing in: ' + error.message);
    } else {
      // --- THIS IS THE FIX ---
      // This forces a full page reload to the dashboard,
      // ensuring the header and all components are updated correctly.
      window.location.assign('/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sign In or Sign Up
        </h1>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md"
              placeholder="••••••••"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleSignIn}
            className="w-full px-4 py-2 font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            className="w-full px-4 py-2 font-semibold text-teal-500 border border-teal-500 rounded-md hover:bg-teal-50"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}