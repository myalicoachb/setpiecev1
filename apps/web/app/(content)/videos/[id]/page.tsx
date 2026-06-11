import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Badge } from '@setpiece/ui'
import { Clock, Calendar, Tag } from 'lucide-react'
import { VideoPlayer } from '@/components/video-player'
import { CommentsSection } from '@/components/comments-section'
import Link from 'next/link'

export default async function VideoPage({ params }: { params: { id: string } }) {
  const video = await prisma.video.findUnique({ where: { id: params.id } })
  if (!video) notFound()

  const related = await prisma.video.findMany({
    where: { category: video.category, id: { not: video.id } },
    take: 4, orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl bg-gray-900">
            <VideoPlayer playbackId={video.muxPlaybackId} title={video.title} />
          </div>
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-white">{video.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(video.createdAt).toLocaleDateString('ar')}</span>
              <Badge variant="info">{video.category}</Badge>
              {video.isPremium && <Badge variant="warning">محتوى مميز</Badge>}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {video.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400">
                  <Tag className="h-3 w-3" />{tag}
                </span>
              ))}
            </div>
            <p className="mt-6 text-gray-400 leading-relaxed">{video.description}</p>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8">
            <h2 className="mb-4 text-lg font-semibold text-white">التعليقات</h2>
            <CommentsSection contentId={video.id} />
          </div>
        </div>
        <aside className="lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-white">فيديوهات ذات صلة</h2>
          <div className="space-y-4">
            {related.map(r => (
              <Link key={r.id} href={`/videos/${r.id}`}
                className="flex gap-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3 transition-all hover:border-blue-500/50">
                <div className="h-16 w-24 flex-shrink-0 rounded-md bg-gray-800 flex items-center justify-center text-gray-600 text-sm">▶</div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{r.title}</h3>
                  <span className="text-xs text-gray-500">{Math.floor(r.duration / 60)} دقيقة</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
