import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Badge } from '@setpiece/ui'
import { Clock, Calendar, Share2 } from 'lucide-react'
import Link from 'next/link'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) notFound()

  const headings = article.body.match(/^#{1,3}\s.+$/gm)?.map(h => ({
    level: h.match(/^#+/)?.[0].length || 1,
    text: h.replace(/^#+\s/, ''),
  })) || []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_250px]">
        <article className="min-w-0">
          {article.coverImage && (
            <div className="mb-8 aspect-video rounded-xl bg-gray-800 flex items-center justify-center text-gray-600">
              صورة: {article.title}
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="info">{article.category}</Badge>
            {article.isPremium && <Badge variant="warning">مميز</Badge>}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{article.readTime} دقيقة قراءة</span>
            {article.publishedAt && (
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(article.publishedAt).toLocaleDateString('ar')}</span>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            {article.body.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white mt-8 mb-4">{line.replace('# ', '')}</h1>
              if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold text-white mt-6 mb-3">{line.replace('## ', '')}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-medium text-gray-200 mt-4 mb-2">{line.replace('### ', '')}</h3>
              if (line.startsWith('- ')) return <li key={i} className="text-gray-400 mr-4">{line.replace('- ', '')}</li>
              if (line.trim()) return <p key={i} className="text-gray-400 leading-relaxed mb-4">{line}</p>
              return <br key={i} />
            })}
          </div>
          <div className="mt-8 flex items-center gap-2 border-t border-gray-800 pt-6">
            <button className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:bg-gray-800">
              <Share2 className="h-4 w-4" /> مشاركة
            </button>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">جدول المحتويات</h3>
            <nav className="space-y-2">
              {headings.map((h, i) => (
                <a key={i} href={`#${h.text}`}
                  className="block text-sm text-gray-500 hover:text-white transition-colors"
                  style={{ paddingRight: `${(h.level - 1) * 12}px` }}>
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  )
}
