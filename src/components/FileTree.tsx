'use client';

import { Folder, FileText, FileCode2 } from 'lucide-react';
import { fileTree } from '@/data/flutterTemplate';

interface FileTreeProps {
  /// عدد العناصر المراد إظهارها حاليًا (للتحريك التدريجي)
  revealedCount: number;
}

export default function FileTree({ revealedCount }: FileTreeProps) {
  return (
    <div className="h-full overflow-y-auto px-3 py-4 font-mono text-[13px] leading-6">
      {fileTree.slice(0, revealedCount).map((node, i) => (
        <div
          key={node.path}
          className="flex items-center gap-2 text-[#A8B3C4] animate-slideIn"
          style={{ paddingRight: node.depth * 16, animationDelay: `${i * 0.02}s` }}
        >
          {node.kind === 'folder' ? (
            <Folder size={14} className="shrink-0 text-accent/80" />
          ) : node.isGenerated ? (
            <FileCode2 size={14} className="shrink-0 text-good" />
          ) : (
            <FileText size={14} className="shrink-0 text-[#5B6577]" />
          )}
          <span className={node.isGenerated ? 'text-good font-medium' : ''}>
            {node.name}
            {node.kind === 'folder' ? '/' : ''}
          </span>
        </div>
      ))}
      {revealedCount === 0 && (
        <p className="text-[#5B6577]">سيظهر هيكل المشروع هنا أثناء الإنشاء…</p>
      )}
    </div>
  );
}
