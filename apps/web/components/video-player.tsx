'use client'
import dynamic from 'next/dynamic'

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false })

export function VideoPlayer({ playbackId, title }: { playbackId: string; title: string }) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title }}
      streamType="on-demand"
      accentColor="#1E88E5"
      className="w-full aspect-video"
    />
  )
}
