import Layout from '../src/components/Layout'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabaseClient'

const fetcher = (url: string) => fetch(url).then((r) => r.ok ? r.json() : Promise.reject(new Error('Fetch error')))

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  // Always fetch the public (approved) list for the main area. Full list is fetched in AllSubmissions with auth.
  const { data, mutate } = useSWR('/api/prayers', fetcher)

  const [isAdmin, setIsAdmin] = useState(false)
  const [adminDisabled, setAdminDisabled] = useState(false)

  useEffect(() => {
    let sub: any
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!error) {
        const session = data?.session ?? null
        setSession(session)
        // check admin status
        const token = session?.access_token
        if (token) {
          const r = await fetch('/api/admin-check', { headers: { Authorization: `Bearer ${token}` } })
          const j = await r.json().catch(() => ({ isAdmin: false, disabled: false }))
          setIsAdmin(!!j.isAdmin)
          setAdminDisabled(!!j.disabled)
        } else {
          setIsAdmin(false)
          setAdminDisabled(false)
        }
      }
    }
    getSession()

    const resp = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null)
      const token = session?.access_token
      if (token) {
        const r = await fetch('/api/admin-check', { headers: { Authorization: `Bearer ${token}` } })
        const j = await r.json().catch(() => ({ isAdmin: false, disabled: false }))
        setIsAdmin(!!j.isAdmin)
        setAdminDisabled(!!j.disabled)
      } else {
        setIsAdmin(false)
        setAdminDisabled(false)
      }
    })
    sub = resp?.data?.subscription

    return () => sub?.unsubscribe?.()
  }, [])

  async function toggleApprove(id: number, approved: boolean) {
    if (!isAdmin) { alert('You are not authorized to perform this action.'); return }
    const token = (await supabase.auth.getSession()).data.session?.access_token
    if (!token) {
      alert('You must be signed in to perform this action.')
      return
    }

    const res = await fetch('/api/prayers', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, approved }) })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Unknown error' }))
      alert('Error: ' + (err.message || 'Failed to update'))
      return
    }
    mutate()
  }

  return (
    <Layout>
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-slate-600">Moderate prayer requests here. Use the sign-in form below to authenticate (magic link).</p>

        {!session ? <AuthBox /> : (
          <div>
            <div className="text-sm text-slate-600">Signed in as <strong>{session.user?.email}</strong></div>
            {!isAdmin && !adminDisabled && <div className="mt-2 p-2 rounded bg-yellow-50 text-yellow-700 text-sm">You are signed in but not an admin. To become an admin, ask the site owner to add your email to <code className="bg-white px-1 rounded">SUPABASE_ADMIN_EMAILS</code> or, for local development, set <code className="bg-white px-1 rounded">DEV_ADMIN_TOKEN</code> and use it as a bearer token.</div>}
            {adminDisabled && <div className="mt-2 p-2 rounded bg-red-50 text-red-700 text-sm">Admin features are currently disabled while the site is staged. Admin actions (approve/reject, view all submissions) are temporarily unavailable.</div>}

            <div className="mt-4 space-y-3">
              {data?.length === 0 && <div className="text-sm text-slate-500">No published requests.</div>}
              {data?.map((p: any) => (
                <div key={p.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-700">{p.text}</div>
                    <div className="text-xs text-slate-500 mt-1">{p.name ? `${p.name}` : 'Anonymous'}</div>
                  </div>
                  <div className="space-x-2">
                    <button disabled={!isAdmin} onClick={() => toggleApprove(p.id, false)} className={`text-sm ${isAdmin ? 'text-red-600' : 'text-slate-400 cursor-not-allowed'}`}>{isAdmin ? 'Remove' : 'Not authorized'}</button>
                  </div>
                </div>
              ))}
            </div>

            <details className="mt-6">
              <summary className="text-sm text-slate-600">View all submissions (including unapproved)</summary>
              <AllSubmissions token={session?.access_token || (session as any)?.access_token} />
            </details>

            <div className="mt-4">
              <button onClick={async () => { await supabase.auth.signOut(); window.location.reload() }} className="text-sm text-amber-600">Sign out</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function AuthBox() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    // respect adminDisabled (no sign-ins while admin is disabled)
    const r = await fetch('/api/admin-check')
    const j = await r.json().catch(() => ({ disabled: false }))
    if (j.disabled) { setMsg('Admin sign-in is temporarily disabled.'); return }

    setMsg('Sending sign-in link…')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMsg('Error: ' + error.message)
    else setMsg('Check your email for a sign-in link.')
  }

  return (
    <form onSubmit={sendLink} className="space-y-3 mt-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Admin email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" placeholder="pastor@example.com" />
      </div>
      <div>
        <button className="bg-amber-600 text-white px-4 py-2 rounded">Send magic link</button>
      </div>
      {msg && <div className="text-sm text-slate-600 mt-1">{msg}</div>}
    </form>
  )
}

function AllSubmissions({ token }: { token?: string }) {
  const { data, mutate, isValidating } = useSWR(token ? ['/api/prayers?all=1', token] : null, async ([url, token]) => {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }})
    if (!r.ok) throw new Error('Failed to fetch')
    return r.json()
  })

  async function setApproved(id: number, approved: boolean) {
    const r = await fetch('/api/admin-check')
    const j = await r.json().catch(() => ({ disabled: false }))
    if (j.disabled) { alert('Admin actions are temporarily disabled'); return }
    const token = (await supabase.auth.getSession()).data.session?.access_token
    if (!token) { alert('Sign in required'); return }
    const res = await fetch('/api/prayers', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, approved }) })
    if (!res.ok) { alert('Failed to update'); return }
    mutate()
  }

  return (
    <div className="mt-3 space-y-3">
      {isValidating && <div className="text-sm text-slate-500">Loading…</div>}
      {data?.length === 0 && !isValidating && <div className="text-sm text-slate-500">No submissions yet.</div>}
      {data?.map((p: any) => (
        <div key={p.id} className="p-3 border rounded flex justify-between items-center">
          <div>
            <div className="text-sm text-slate-700">{p.text}</div>
            <div className="text-xs text-slate-500 mt-1">{p.name ? `${p.name}` : 'Anonymous'} • {new Date(p.created_at || p.createdAt).toLocaleString()}</div>
          </div>
          <div className="space-x-2">
            <button disabled={adminDisabled} onClick={() => setApproved(p.id, true)} className={`text-sm ${adminDisabled ? 'text-slate-400 cursor-not-allowed' : 'text-amber-600'}`}>{adminDisabled ? 'Disabled' : 'Approve'}</button>
            <button disabled={adminDisabled} onClick={() => setApproved(p.id, false)} className={`text-sm ${adminDisabled ? 'text-slate-400 cursor-not-allowed' : 'text-red-600'}`}>{adminDisabled ? 'Disabled' : 'Reject'}</button>
          </div>
        </div>
      ))}
    </div>
  )
}
