import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { unauthorized, ok } from '@/lib/api-helpers'
import { drawingQueries } from '@/lib/queries'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const drawings = await drawingQueries.getUserDrawings(session.user.id)
  return ok(drawings)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return unauthorized()
  const { prisma } = await import('@/lib/db')
  const body = await req.json()
  const drawing = await prisma.drawing.create({
    data: { title: body.title, data: body.data, thumbnail: body.thumbnail, isPublic: body.isPublic ?? false, userId: session.user.id },
  })
  return ok(drawing, 201)
}
