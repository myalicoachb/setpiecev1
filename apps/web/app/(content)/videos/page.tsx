'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@setpiece/ui'
import { Search, Clock, Filter } from 'lucide-react'
import { SET_PIECE_TYPES, LEVELS } from '@setpiece/config'

interface Video {
  id: string; title: string; description: string; duration: number
  category: string; thumbnail: string; tags: string[]; isPremium: boolean; createdAt: string
}

export default function VideosPage() {
  const searchParams = useSearchParams()
  const [videos, setVideos] = useState<Video[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => { setPage(1); setVideos([]); setHasMore(true) }, [debouncedSearch, category])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (debouncedSearch) params.set('q', debouncedSearch)
    if (category !== 'ALL') params.set('category', category)
    params.set('page', String(page))
    params.set('limit', '12')

    fetch(`/api/videos?${params}`)
      .then(res => res.json())
      .then(data => {
        setVideos(prev => page === 1 ? data.videos : [...prev, ...data.videos])
        setHasMore(data.videos.length === 12)
      })
      .finally(() => setLoading(false))
  }, [page, debouncedSearch, category])

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) setPage(p => p + 1)
    })
    if (loadRef.current) observerRef.current.observe(loadRef.current)
    return () => observerRef.current?.disconnect()
  }, [hasMore, loading])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">الفيديوهات</h1>
        <p className="text-gray-500">تصفح مجموعة من أفضل تحليلات وشرح الكرات الثابتة</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث عن فيديو..." className="pr-10" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 ml-2" /><SelectValue placeholder="النوع" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">الكل</SelectItem>
            {SET_PIECE_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.labelAr}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {videos.map(video => (
          <Link key={video.id} href={`/videos/${video.id}`}
            className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 transition-all hover:border-blue-500/50">
            <div className="aspect-video bg-gray-800 flex items-center justify-center">
              <span className="text-4xl opacity-30">▶</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="info">{video.category}</Badge>
                {video.isPremium && <Badge variant="warning">مميز</Badge>}
              </div>
              <h3 className="font-semibold text-white group-hover:text-blue-400">{video.title}</h3>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {loading && <div className="mt-8 text-center text-gray-500">جاري التحميل...</div>}
      <div ref={loadRef} className="h-10" />
    </div>
  )
}
