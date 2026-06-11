import { NextRequest } from 'next/server'
import { notFound, ok } from '@/lib/api-helpers'
import { articleQueries } from '@/lib/queries'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const article = await articleQueries.bySlug(params.slug)
  if (!article) return notFound()
  return ok(article)
}
