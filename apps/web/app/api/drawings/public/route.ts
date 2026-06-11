import { ok } from '@/lib/api-helpers'
import { drawingQueries } from '@/lib/queries'

export async function GET() {
  const drawings = await drawingQueries.getPublicDrawings()
  return ok(drawings)
}
