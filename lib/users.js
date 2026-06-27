import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json')

function readUsers() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

export function getUser(email) {
  const users = readUsers()
  return users.find(u => u.email === email) || null
}

export function getAllUsers() {
  return readUsers()
}

export function saveUser(email, keywords) {
  const users = readUsers()
  const idx = users.findIndex(u => u.email === email)
  if (idx >= 0) {
    users[idx].keywords = keywords
    users[idx].updatedAt = new Date().toISOString()
  } else {
    users.push({ email, keywords, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }
  writeUsers(users)
}
