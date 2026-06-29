// بنية المشروع الثابتة لتطبيق Flutter الناتج، ومحتوى الملفات الثابتة
// (كل شيء عدا lib/main.dart، اللي يتولّد بالذكاء الاصطناعي حسب طلب المستخدم).

export interface TreeNode {
  /// مسار العرض (يُستخدم كمفتاح فريد أيضًا)
  path: string;
  /// اسم العنصر كما يظهر في الشجرة
  name: string;
  /// عمق المسافة البادئة
  depth: number;
  kind: 'folder' | 'file';
  /// هل هذا الملف هو main.dart (يحصل تمييز خاص له بصري)
  isGenerated?: boolean;
}

// الترتيب هنا هو نفس ترتيب الظهور التدريجي (animation) في الواجهة.
export const fileTree: TreeNode[] = [
  { path: 'my_app', name: 'my_app', depth: 0, kind: 'folder' },
  { path: 'my_app/android', name: 'android', depth: 1, kind: 'folder' },
  { path: 'my_app/ios', name: 'ios', depth: 1, kind: 'folder' },
  { path: 'my_app/web', name: 'web', depth: 1, kind: 'folder' },
  { path: 'my_app/windows', name: 'windows', depth: 1, kind: 'folder' },
  { path: 'my_app/macos', name: 'macos', depth: 1, kind: 'folder' },
  { path: 'my_app/linux', name: 'linux', depth: 1, kind: 'folder' },
  { path: 'my_app/lib', name: 'lib', depth: 1, kind: 'folder' },
  {
    path: 'my_app/lib/main.dart',
    name: 'main.dart',
    depth: 2,
    kind: 'file',
    isGenerated: true,
  },
  { path: 'my_app/test', name: 'test', depth: 1, kind: 'folder' },
  { path: 'my_app/test/widget_test.dart', name: 'widget_test.dart', depth: 2, kind: 'file' },
  { path: 'my_app/pubspec.yaml', name: 'pubspec.yaml', depth: 1, kind: 'file' },
  { path: 'my_app/pubspec.lock', name: 'pubspec.lock', depth: 1, kind: 'file' },
  { path: 'my_app/analysis_options.yaml', name: 'analysis_options.yaml', depth: 1, kind: 'file' },
  { path: 'my_app/.gitignore', name: '.gitignore', depth: 1, kind: 'file' },
  { path: 'my_app/.metadata', name: '.metadata', depth: 1, kind: 'file' },
  { path: 'my_app/README.md', name: 'README.md', depth: 1, kind: 'file' },
];

export const pubspecYamlTemplate = (appName: string) => `name: ${appName}
description: "تطبيق تم توليده عبر Flutter AI"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
`;

export const widgetTestTemplate = `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:my_app/main.dart';

void main() {
  testWidgets('يبني التطبيق بدون أخطاء', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
`;

export const gitignoreTemplate = `.dart_tool/
.packages
build/
.flutter-plugins
.flutter-plugins-dependencies
*.iml
.idea/
.vscode/
`;

export const analysisOptionsTemplate = `include: package:flutter_lints/flutter.yaml

linter:
  rules:
`;

export const readmeTemplate = (appName: string) => `# ${appName}

تطبيق Flutter تم توليد ملف lib/main.dart فيه عبر منصّة Flutter AI.

## التشغيل
\`\`\`
flutter pub get
flutter run
\`\`\`

## ملاحظة
هذه نسخة مبسّطة من بنية مشروع Flutter (تحتوي الملفات الأساسية فقط).
لمشروع جاهز فعليًا للبناء على Android/iOS بكل ملفات Gradle وXcode،
شغّل الأمر التالي مرة واحدة على جهاز فيه Flutter SDK مثبت:
\`\`\`
flutter create ${appName}
\`\`\`
ثم استبدل محتوى lib/main.dart بالملف المولَّد من المنصّة.
`;

// كود Dart افتراضي يُستخدم فقط لو فشل استدعاء خدمة الذكاء الاصطناعي
// (مثلاً المفتاح غير مهيأ بعد)، حتى تبقى تجربة الواجهة (التحريك/الكتابة) شغالة.
export const fallbackMainDart = `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'تطبيقي',
      theme: ThemeData(colorSchemeSeed: const Color(0xFF13B9FD), useMaterial3: true),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('تطبيقي')),
      body: const Center(child: Text('مرحبًا 👋')),
    );
  }
}
`;
