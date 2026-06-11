import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { unauthorized, ok } from '@/lib/api-helpers'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const { prisma } = await import('@/lib/db')
  await prisma.savedContent.delete({ where: { id: params.id, userId: session.user.id } })
  return ok({ deleted: true })
}
