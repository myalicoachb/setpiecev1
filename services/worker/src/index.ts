import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'
import { PrismaClient } from '@prisma/client'
import Mux from '@mux/mux-node'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', { maxRetriesPerRequest: null })
const prisma = new PrismaClient()
const muxClient = new Mux({ tokenId: process.env.MUX_TOKEN_ID!, tokenSecret: process.env.MUX_TOKEN_SECRET! })

const videoQueue = new Queue('video-processing', { connection })

async function processVideoUpload(job: { data: { url: string; videoId: string } }) {
  console.log(`Processing video upload: ${job.data.videoId}`)
  const asset = await muxClient.video.assets.create({
    input: [{ url: job.data.url }],
    playback_policy: ['public'],
    generate_subtitles: [{ language_code: 'ar', name: 'العربية' }],
  })
  await prisma.video.update({ where: { id: job.data.videoId }, data: { muxAssetId: asset.id } })
  console.log(`Mux asset created: ${asset.id}`)
}

const worker = new Worker('video-processing', processVideoUpload, { connection, concurrency: 3 })

async function handleVideoReady(assetId: string) {
  const asset = await muxClient.video.assets.retrieve(assetId)
  const playbackId = asset.playback_ids?.[0]?.id
  if (playbackId) {
    await prisma.video.update({ where: { muxAssetId: assetId }, data: { muxPlaybackId: playbackId } })
    console.log(`Video ready: ${assetId}, playback: ${playbackId}`)
  }
}

console.log('🚀 Worker started')

process.on('SIGTERM', async () => {
  await worker.close()
  await connection.quit()
  await prisma.$disconnect()
})
