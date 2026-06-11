import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    if (type === 'video.asset.ready') {
      const { prisma } = await import('@/lib/db')
      const assetId = data.id
      const playbackId = data.playback_ids?.[0]?.id

      if (playbackId) {
        await prisma.video.update({
          where: { muxAssetId: assetId },
          data: { muxPlaybackId: playbackId },
        })
      }
    }

    return Response.json({ received: true })
  } catch {
    return Response.json({ error: 'Invalid webhook' }, { status: 400 })
  }
}
