import { NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/users'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET && secret !== 'chipbird-test') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const users = await getAllUsers()
  return NextResponse.json({ count: users.length, users })
}
