'use client';

interface CodePanelProps {
  typedCode: string;
  isTyping: boolean;
}

export default function CodePanel({ typedCode, isTyping }: CodePanelProps) {
  return (
    <div className="h-full overflow-y-auto bg-panel px-5 py-4">
      <div className="mb-3 flex items-center gap-2 text-xs text-[#5B6577]">
        <span className="rounded bg-bg px-2 py-1 font-mono">lib/main.dart</span>
        {isTyping && <span className="text-accent">يكتب…</span>}
      </div>
      <pre className="whitespace-pre-wrap font-mono text-[13px] leading-6 text-[#D6DCE5]" dir="ltr">
        {typedCode}
        {isTyping && <span className="animate-blink text-accent">▌</span>}
      </pre>
      {!typedCode && !isTyping && (
        <p className="font-mono text-[13px] text-[#5B6577]" dir="ltr">
          // سيظهر هنا كود main.dart فور بدء الإنشاء
        </p>
      )}
    </div>
  );
}
