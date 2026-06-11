import { NextResponse } from 'next/server'
import { auth } from './auth'
import { canAccess } from '@setpiece/config'

export async function getSession() {
  const session = await auth()
  return session
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export function notFound(message = 'Not found') {
  return NextResponse.json({ error: message }, { status: 404 })
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function checkPremiumAccess(content: { isPremium: boolean }) {
  return async () => {
    const session = await getSession()
    return canAccess(content, session?.user ?? null)
  }
}
