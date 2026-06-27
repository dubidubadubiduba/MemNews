import { NextResponse } from 'next/server'
import { getUser, saveUser } from '@/lib/users'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const user = getUser(email)
  return NextResponse.json({ user })
}

export async function POST(request) {
  const body = await request.json()
  const { email, keywords } = body

  if (!email || !Array.isArray(keywords)) {
    return NextResponse.json({ error: 'email and keywords required' }, { status: 400 })
  }

  saveUser(email, keywords)
  return NextResponse.json({ ok: true })
}
