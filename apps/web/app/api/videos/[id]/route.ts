import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { notFound, unauthorized, ok } from '@/lib/api-helpers'
import { canAccess } from '@setpiece/config'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { prisma } = await import('@/lib/db')
  const session = await auth()
  const video = await prisma.video.findUnique({ where: { id: params.id } })
  if (!video) return notFound()
  if (video.isPremium && !canAccess(video, session?.user ?? null)) return unauthorized()
  return ok(video)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return unauthorized()
  const { prisma } = await import('@/lib/db')
  await prisma.video.delete({ where: { id: params.id } })
  return ok({ deleted: true })
}
