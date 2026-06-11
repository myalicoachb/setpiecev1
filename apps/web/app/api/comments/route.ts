import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { unauthorized, ok } from '@/lib/api-helpers'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const { prisma } = await import('@/lib/db')
  const { contentId, body } = await req.json()
  const comment = await prisma.comment.create({
    data: { body, contentId, userId: session.user.id },
    include: { user: { select: { name: true, avatar: true } } },
  })
  return ok(comment, 201)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const { prisma } = await import('@/lib/db')
  const comments = await prisma.comment.findMany({
    where: { contentId: searchParams.get('contentId') || undefined },
    include: { user: { select: { name: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return ok(comments)
}
