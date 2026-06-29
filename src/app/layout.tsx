import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Flutter AI',
  description: 'منصّة لتوليد تطبيقات Flutter بالذكاء الاصطناعي',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
