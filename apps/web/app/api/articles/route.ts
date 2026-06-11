import { NextRequest } from 'next/server'
import { ok } from '@/lib/api-helpers'
import { articleQueries } from '@/lib/queries'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const [articles, total] = await articleQueries.list({
    category: searchParams.get('category') || undefined,
    q: searchParams.get('q') || undefined,
    page: Number(searchParams.get('page')) || 1,
  })
  return ok({ articles, total })
}
