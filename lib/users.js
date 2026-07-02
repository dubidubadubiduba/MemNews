import { kv } from '@vercel/kv'

export async function getUser(email) {
  return await kv.get(`user:${email}`)
}

export async function getAllUsers() {
  const keys = await kv.keys('user:*')
  if (!keys.length) return []
  return await Promise.all(keys.map(k => kv.get(k)))
}

export async function saveUser(email, keywords) {
  await kv.set(`user:${email}`, {
    email,
    keywords,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteUser(email) {
  await kv.del(`user:${email}`)
}
