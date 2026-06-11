import { NextRequest } from 'next/server'
import { ok, unauthorized } from '@/lib/api-helpers'
import { videoQueries } from '@/lib/queries'
import { auth } from '@/lib/auth'
import { canAccess } from '@setpiece/config'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const session = await auth()

  const [videos, total] = await videoQueries.list({
    category: searchParams.get('category') || undefined,
    q: searchParams.get('q') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 12,
  })

  const filtered = videos.filter(v => !v.isPremium || canAccess(v, session?.user ?? null))

  return ok({ videos: filtered, total, page: Number(searchParams.get('page')) || 1 })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return unauthorized()
  const body = await req.json()
  const { prisma } = await import('@/lib/db')
  const video = await prisma.video.create({ data: body })
  return ok(video, 201)
}
