'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button, Input } from '@setpiece/ui'
import { Send, User } from 'lucide-react'

interface Comment { id: string; body: string; user: { name: string; avatar?: string }; createdAt: string }

export function CommentsSection({ contentId }: { contentId: string }) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [body, setBody] = useState('')

  const addComment = async () => {
    if (!body.trim()) return
    const res = await fetch('/api/comments', { method: 'POST', body: JSON.stringify({ contentId, body }) })
    if (res.ok) setBody('')
  }

  return (
    <div>
      {session ? (
        <div className="mb-6 flex gap-3">
          <Input value={body} onChange={e => setBody(e.target.value)} placeholder="اكتب تعليقاً..." />
          <Button onClick={addComment} size="sm"><Send className="h-4 w-4" /></Button>
        </div>
      ) : (
        <p className="mb-6 text-sm text-gray-500">سجل الدخول لإضافة تعليق</p>
      )}
      <div className="space-y-4">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3 rounded-lg bg-gray-800/50 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{c.user.name}</span>
                <span className="text-xs text-gray-600">{new Date(c.createdAt).toLocaleDateString('ar')}</span>
              </div>
              <p className="mt-1 text-sm text-gray-400">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
