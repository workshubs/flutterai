'use client';

import { useState } from 'react';
import { Sparkles, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

function arabicError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
  }
  if (m.includes('email not confirmed')) {
    return 'البريد الإلكتروني غير مفعّل بعد. تحقق من بريدك أو فعّله من لوحة Supabase.';
  }
  return message;
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (authError) {
      setError(arabicError(authError.message));
      return;
    }

    window.location.href = '/';
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4" dir="rtl">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-panel p-8"
      >
        <div className="mb-6 flex flex-col items-center gap-2">
          <Sparkles size={28} className="text-accent" />
          <h1 className="text-lg font-semibold">Flutter AI</h1>
          <p className="text-sm text-[#8A93A3]">سجّل دخولك للوصول إلى المنصّة</p>
        </div>

        <label className="mb-1 block text-xs text-[#8A93A3]">البريد الإلكتروني</label>
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-line bg-bg px-3">
          <Mail size={16} className="text-[#5B6577]" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent py-2.5 text-sm outline-none"
            placeholder="name@example.com"
          />
        </div>

        <label className="mb-1 block text-xs text-[#8A93A3]">كلمة المرور</label>
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-line bg-bg px-3">
          <Lock size={16} className="text-[#5B6577]" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent py-2.5 text-sm outline-none"
            placeholder="••••••••"
          />
          <button type="button" onClick={() => setShowPassword((s) => !s)}>
            {showPassword ? (
              <EyeOff size={16} className="text-[#5B6577]" />
            ) : (
              <Eye size={16} className="text-[#5B6577]" />
            )}
          </button>
        </div>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 w-full rounded-xl bg-accent py-3 text-sm font-medium text-[#021018] disabled:opacity-50"
        >
          {isLoading ? 'جاري الدخول…' : 'دخول'}
        </button>

        <p className="mt-4 text-center text-xs text-[#5B6577]">
          لا يوجد حساب؟ تواصل مع المسؤول لإنشاء حسابك من لوحة Supabase.
        </p>
      </form>
    </div>
  );
}
