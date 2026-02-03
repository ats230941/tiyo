import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// If SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set, use Supabase server client.
let useSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

if (useSupabase) {
  // lazy require to avoid import issues when not configured
  var { supabaseServer } = require('../../src/lib/supabaseServer')
}

const DATA_PATH = path.join(process.cwd(), 'data')
const FILE = path.join(DATA_PATH, 'prayers.json')

function ensure() {
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH)
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]))
}

async function getAllFromSupabase() {
  const { data, error } = await supabaseServer.from('prayers').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

async function getApprovedFromSupabase() {
  const { data, error } = await supabaseServer.from('prayers').select('*').eq('approved', true).order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // If Supabase is configured, use DB-backed implementation
  if (useSupabase) {
    try {
      if (req.method === 'GET') {
        const token = req.headers.authorization?.split(' ')[1]
        if ((req.query.all === '1' || req.query.all === 'true') && token) {
          // verify token
          const { data: userData } = await supabaseServer.auth.getUser(token)
          if (!userData?.user) return res.status(401).json({ message: 'Unauthorized' })
          const rows = await getAllFromSupabase()
          return res.status(200).json(rows)
        }

        const rows = await getApprovedFromSupabase()
        return res.status(200).json(rows)
      }

      if (req.method === 'POST') {
        const { name, text } = req.body
        if (!text || typeof text !== 'string') return res.status(400).json({ message: 'Missing text' })
        const { error } = await supabaseServer.from('prayers').insert({ name: name || null, text, approved: false })
        if (error) throw error
        return res.status(201).json({ ok: true })
      }

      if (req.method === 'PUT') {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) return res.status(401).json({ message: 'Unauthorized' })
        const { data: userData } = await supabaseServer.auth.getUser(token)
        if (!userData?.user) return res.status(401).json({ message: 'Unauthorized' })

        const { id, approved } = req.body
        const { error } = await supabaseServer.from('prayers').update({ approved: !!approved }).eq('id', id)
        if (error) throw error
        return res.status(200).json({ ok: true })
      }

      return res.status(405).end()
    } catch (err: any) {
      console.error(err)
      return res.status(500).json({ message: err.message || 'Error' })
    }
  }

  // Fallback: file-based storage (development only)
  ensure()
  const raw = fs.readFileSync(FILE, 'utf-8')
  const items = JSON.parse(raw)

  if (req.method === 'GET') {
    // Allow admin view to fetch all submissions with ?all=1
    if (req.query.all === '1' || req.query.all === 'true') {
      return res.status(200).json(items)
    }
    return res.status(200).json(items.filter((i: any) => i.approved))
  }

  if (req.method === 'POST') {
    const { name, text } = req.body
    if (!text || typeof text !== 'string') return res.status(400).json({ message: 'Missing text' })
    const id = Date.now()
    const item = { id, name: name || null, text, approved: false, createdAt: new Date().toISOString() }
    items.unshift(item)
    fs.writeFileSync(FILE, JSON.stringify(items, null, 2))
    return res.status(201).json({ ok: true })
  }

  if (req.method === 'PUT') {
    const { id, approved } = req.body
    const idx = items.findIndex((i: any) => i.id === id)
    if (idx === -1) return res.status(404).json({ message: 'Not found' })
    items[idx].approved = !!approved
    fs.writeFileSync(FILE, JSON.stringify(items, null, 2))
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
