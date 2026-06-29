'use client';

import { useRef, useState } from 'react';
import JSZip from 'jszip';
import { Sparkles, Download, LogOut } from 'lucide-react';
import FileTree from './FileTree';
import CodePanel from './CodePanel';
import {
  fileTree,
  pubspecYamlTemplate,
  readmeTemplate,
  analysisOptionsTemplate,
  gitignoreTemplate,
  widgetTestTemplate,
  fallbackMainDart,
} from '@/data/flutterTemplate';
import { supabase } from '@/lib/supabase/client';

const MAIN_DART_INDEX = fileTree.findIndex((n) => n.isGenerated);
const APP_NAME = 'my_app';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ChatBuilderProps {
  userEmail: string;
}

export default function ChatBuilder({ userEmail }: ChatBuilderProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [typedCode, setTypedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fullCode, setFullCode] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const cancelled = useRef(false);

  async function handleGenerate() {
    const trimmed = prompt.trim();
    if (!trimmed || isGenerating) return;

    cancelled.current = false;
    setIsGenerating(true);
    setRevealedCount(0);
    setTypedCode('');
    setFullCode(null);
    setStatusNote(null);

    // نبدأ استدعاء الذكاء الاصطناعي بالتوازي مع تحريك الشجرة، حتى لا ينتظر
    // المستخدم الاستدعاء فاضي الشاشة.
    const aiPromise = fetch('/api/generate-dart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: trimmed }),
    })
      .then((r) => r.json())
      .catch(() => ({ code: fallbackMainDart, usedFallback: true }));

    // المرحلة ١: إظهار المجلدات حتى ملف main.dart تدريجيًا
    for (let i = 0; i <= MAIN_DART_INDEX; i++) {
      if (cancelled.current) return;
      setRevealedCount(i + 1);
      await sleep(140);
    }

    const result = await aiPromise;
    const code: string = result.code || fallbackMainDart;
    if (result.usedFallback) {
      setStatusNote(
        'تنبيه: خدمة الذكاء الاصطناعي غير مهيأة بعد (AI_API_KEY/AI_API_URL)، فعرضنا كود نموذجي مؤقت.'
      );
    }

    // المرحلة ٢: تأثير الكتابة لكود main.dart
    setIsTyping(true);
    let shown = '';
    const step = Math.max(2, Math.floor(code.length / 200));
    for (let i = 0; i < code.length; i += step) {
      if (cancelled.current) return;
      shown = code.slice(0, i + step);
      setTypedCode(shown);
      await sleep(10);
    }
    setTypedCode(code);
    setIsTyping(false);
    setFullCode(code);

    // المرحلة ٣: إكمال باقي ملفات الهيكل
    for (let i = MAIN_DART_INDEX + 1; i < fileTree.length; i++) {
      if (cancelled.current) return;
      setRevealedCount(i + 1);
      await sleep(110);
    }

    setIsGenerating(false);
  }

  async function handleDownload() {
    const zip = new JSZip();
    const root = zip.folder(APP_NAME)!;

    root.file('pubspec.yaml', pubspecYamlTemplate(APP_NAME));
    root.file('README.md', readmeTemplate(APP_NAME));
    root.file('analysis_options.yaml', analysisOptionsTemplate);
    root.file('.gitignore', gitignoreTemplate);
    root.folder('lib')!.file('main.dart', fullCode ?? fallbackMainDart);
    root.folder('test')!.file('widget_test.dart', widgetTestTemplate);

    const placeholderNote =
      'هذا المجلد يحتاج ملفات Gradle/Xcode الحقيقية.\n' +
      'شغّل الأمر التالي مرة واحدة على جهاز فيه Flutter SDK مثبت:\n' +
      `flutter create ${APP_NAME}\n` +
      'ثم استبدل lib/main.dart بالنسخة المولَّدة من هذه المنصة.\n';

    for (const platform of ['android', 'ios', 'web', 'windows', 'macos', 'linux']) {
      root.folder(platform)!.file('NOTE.txt', placeholderNote);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${APP_NAME}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div className="flex h-screen flex-col bg-bg text-[#E6E9EF]" dir="rtl">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          <span className="font-semibold tracking-wide">Flutter AI</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-[#8A93A3]">
          <span>{userEmail}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 hover:border-accent hover:text-accent"
          >
            <LogOut size={14} />
            خروج
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col">
          <div className="flex-1 overflow-hidden border-l border-line">
            <CodePanel typedCode={typedCode} isTyping={isTyping} />
          </div>

          <div className="border-t border-line bg-panel p-4">
            {statusNote && (
              <p className="mb-2 text-xs text-amber-400">{statusNote}</p>
            )}
            <div className="flex items-end gap-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="اكتب وصف التطبيق اللي تبيه… مثلاً: شاشة قائمة مهام بسيطة"
                rows={2}
                className="flex-1 resize-none rounded-xl border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-accent"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="rounded-xl bg-accent px-5 py-3 text-sm font-medium text-[#021018] transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isGenerating ? 'يبني…' : 'إنشاء'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!fullCode}
                className="flex items-center gap-1 rounded-xl border border-line px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                title="تنزيل المشروع كملف zip"
              >
                <Download size={16} />
                تنزيل
              </button>
            </div>
          </div>
        </main>

        <aside className="w-72 shrink-0 border-r border-line bg-panel">
          <div className="border-b border-line px-3 py-3 text-xs text-[#8A93A3]">
            هيكل المشروع
          </div>
          <FileTree revealedCount={revealedCount} />
        </aside>
      </div>
    </div>
  );
}
