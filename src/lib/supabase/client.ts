import { createClient } from '@supabase/supabase-js';

// رابط ومفتاح anon لمشروع Supabase. يُقرآن من متغيرات البيئة بدل أن
// يكونا مكتوبين مباشرة في الكود، حتى تقدر تغيّرهما بدون تعديل الكود.
// انظر .env.local.example لمعرفة القيم المطلوبة.
// قيم احتياطية وهمية تمنع كسر البناء (build) لو نسخة .env.local ناقصة؛
// الاستخدام الفعلي (تسجيل الدخول) سيظهر خطأ واضح وقتها فقط، بدل أن
// تفشل كل الصفحة بسبب هذا الملف.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
