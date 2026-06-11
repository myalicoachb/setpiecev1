import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { unauthorized, notFound, ok } from '@/lib/api-helpers'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const { prisma } = await import('@/lib/db')
  const existing = await prisma.drawing.findUnique({ where: { id: params.id } })
  if (!existing || existing.userId !== session.user.id) return notFound()
  const body = await req.json()
  const drawing = await prisma.drawing.update({ where: { id: params.id }, data: body })
  return ok(drawing)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const { prisma } = await import('@/lib/db')
  const existing = await prisma.drawing.findUnique({ where: { id: params.id } })
  if (!existing || existing.userId !== session.user.id) return notFound()
  await prisma.drawing.delete({ where: { id: params.id } })
  return ok({ deleted: true })
}
