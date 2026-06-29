'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import ChatBuilder from '@/components/ChatBuilder';

export default function HomePage() {
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.href = '/login';
        return;
      }
      setEmail(data.session.user.email ?? '');
      setChecked(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) window.location.href = '/login';
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg text-sm text-[#5B6577]">
        جاري التحقق من الجلسة…
      </div>
    );
  }

  return <ChatBuilder userEmail={email ?? ''} />;
}
