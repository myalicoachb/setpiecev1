import Mux from '@mux/mux-node'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const muxClient = new Mux({ tokenId: process.env.MUX_TOKEN_ID!, tokenSecret: process.env.MUX_TOKEN_SECRET! })

export async function uploadVideo(url: string) {
  const asset = await muxClient.video.assets.create({
    input: [{ url }],
    playback_policy: ['public'],
    generate_subtitles: [{ language_code: 'ar', name: 'العربية' }],
  })
  return asset
}

export async function handleVideoReady(assetId: string) {
  const asset = await muxClient.video.assets.retrieve(assetId)
  const playbackId = asset.playback_ids?.[0]?.id
  if (playbackId) {
    await prisma.video.update({ where: { muxAssetId: assetId }, data: { muxPlaybackId: playbackId } })
  }
}
