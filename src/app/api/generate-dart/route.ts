import { NextRequest, NextResponse } from 'next/server';
import { fallbackMainDart } from '@/data/flutterTemplate';

// هذا المسار يعمل على السيرفر فقط، فمفتاح الذكاء الاصطناعي (AI_API_KEY)
// لا يصل أبدًا لمتصفح المستخدم — على عكس مفاتيح NEXT_PUBLIC_* العامة.
//
// الشكل الافتراضي هنا متوافق مع تنسيق "OpenAI Chat Completions" الشائع،
// لأن أغلب مزودي الذكاء الاصطناعي (بما فيها بدائل محلية كثيرة) يدعمونه.
// إذا كانت خدمتك تستخدم تنسيق مختلف، عدّل دالة callAiProvider فقط.

interface GenerateRequestBody {
  prompt: string;
}

async function callAiProvider(prompt: string): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL; // مثال: https://provider.example.com/v1/chat/completions
  const model = process.env.AI_MODEL || 'default-model';

  if (!apiKey || !apiUrl) {
    throw new Error('AI_API_KEY أو AI_API_URL غير مهيأين في .env.local');
  }

  const systemPrompt =
    'أنت مساعد يكتب كود Dart/Flutter فقط. أعد محتوى ملف lib/main.dart كامل وقابل ' +
    'للتشغيل مباشرة بدون أي شرح أو نص خارج الكود، وبدون علامات Markdown مثل ```.';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`فشل استدعاء مزود الذكاء الاصطناعي (${response.status}): ${text}`);
  }

  const data = await response.json();
  const raw: string | undefined = data?.choices?.[0]?.message?.content;

  if (!raw) {
    throw new Error('رد غير متوقع من مزود الذكاء الاصطناعي');
  }

  // إزالة أسوار Markdown إذا أضافها النموذج رغم التعليمات
  return raw.replace(/^```(dart)?\n?/i, '').replace(/```$/i, '').trim();
}

export async function POST(req: NextRequest) {
  let body: GenerateRequestBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  if (!prompt) {
    return NextResponse.json({ error: 'الطلب فاضي' }, { status: 400 });
  }

  try {
    const code = await callAiProvider(prompt);
    return NextResponse.json({ code, usedFallback: false });
  } catch (err) {
    // لا نفشل الواجهة بالكامل لو الخدمة غير مهيأة بعد — نرجّع كود افتراضي
    // حتى تبقى تجربة الواجهة (الشجرة + الكتابة) قابلة للتجربة فورًا.
    console.error('generate-dart error:', err);
    return NextResponse.json({
      code: fallbackMainDart,
      usedFallback: true,
      error: err instanceof Error ? err.message : 'خطأ غير معروف',
    });
  }
}
