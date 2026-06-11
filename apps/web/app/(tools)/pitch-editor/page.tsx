'use client'
import dynamic from 'next/dynamic'

const PitchEditor = dynamic(() => import('./components/PitchEditor'), { ssr: false })

export default function PitchEditorPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <PitchEditor />
    </div>
  )
}
