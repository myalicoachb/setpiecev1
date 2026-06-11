import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold text-white">ست بيس</h3>
            <p className="text-sm text-gray-400">المنصة التخصصية الأولى في الكرات الثابتة لكرة القدم الحديثة</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-300">المحتوى</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/videos" className="hover:text-white">الفيديوهات</Link></li>
              <li><Link href="/courses" className="hover:text-white">الدورات</Link></li>
              <li><Link href="/articles" className="hover:text-white">المقالات</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-300">الأدوات</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/pitch-editor" className="hover:text-white">محرر الملعب</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-300">الحساب</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/login" className="hover:text-white">تسجيل الدخول</Link></li>
              <li><Link href="/register" className="hover:text-white">إنشاء حساب</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} ست بيس. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}
