import { NextRequest } from 'next/server'
import { ok } from '@/lib/api-helpers'
import { courseQueries } from '@/lib/queries'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const courses = await courseQueries.list({
    level: searchParams.get('level') || undefined,
    category: searchParams.get('category') || undefined,
  })
  return ok(courses)
}
