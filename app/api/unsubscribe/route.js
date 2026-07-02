import { NextResponse } from 'next/server'
import { deleteUser } from '@/lib/users'

export async function POST(request) {
  const { email } = await request.json().catch(() => ({}))
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })
  await deleteUser(email)
  return NextResponse.json({ ok: true })
}
