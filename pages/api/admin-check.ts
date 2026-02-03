import type { NextApiRequest, NextApiResponse } from 'next'

// Returns whether provided bearer token belongs to an allowed admin email
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(200).json({ isAdmin: false })

  // If Supabase isn't configured, allow dev token as admin (for local/testing only)
  const devAdminToken = process.env.DEV_ADMIN_TOKEN || ''
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (token && devAdminToken && token === devAdminToken) return res.status(200).json({ isAdmin: true, email: 'dev-admin' })
    return res.status(200).json({ isAdmin: false })
  }

  try {
    const { supabaseServer } = require('../../src/lib/supabaseServer')
    const { data: userData, error } = await supabaseServer.auth.getUser(token)
    if (error || !userData?.user?.email) return res.status(200).json({ isAdmin: false })
    const adminEmails = (process.env.SUPABASE_ADMIN_EMAILS || '').split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean)
    const userEmail = (userData.user.email || '').toLowerCase()
    return res.status(200).json({ isAdmin: adminEmails.includes(userEmail), email: userEmail })
  } catch (err) {
    console.error(err)
    return res.status(200).json({ isAdmin: false })
  }
}
