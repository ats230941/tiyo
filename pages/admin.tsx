import Layout from '../src/components/Layout'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { supabase } from '../src/lib/supabaseClient'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminPage() {
  const [session, setSession] = useState<any>(null)
  const { data, mutate } = useSWR(session ? '/api/prayers?all=1' : '/api/prayers', fetcher)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    getSession()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function toggleApprove(id: number, approved: boolean) {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    await fetch('/api/prayers', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, approved }) })
    mutate()
  }

  return (
    <Layout>
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-1 text-slate-600">Moderate prayer requests here. Use the sign-in form below to authenticate (magic link).</p>

        {!session ? <AuthBox /> : (
          <div>
            <div className="text-sm text-slate-600">Signed in as <strong>{session.user.email}</strong></div>

            <div className="mt-4 space-y-3">
              {data?.length === 0 && <div className="text-sm text-slate-500">No published requests.</div>}
              {data?.map((p: any) => (
                <div key={p.id} className="p-3 border rounded flex justify-between items-center">
                  <div>
                    <div className="text-sm text-slate-700">{p.text}</div>
                    <div className="text-xs text-slate-500 mt-1">{p.name ? `${p.name}` : 'Anonymous'}</div>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => toggleApprove(p.id, false)} className="text-sm text-red-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <details className="mt-6">
              <summary className="text-sm text-slate-600">View all submissions (including unapproved)</summary>
              <AllSubmissions token={(session as any).access_token} />
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
  const { data, mutate } = useSWR(token ? ['/api/prayers?all=1', token] : null, async ([url, token]) => {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }})
    return r.json()
  })

  async function setApproved(id: number, approved: boolean) {
    const token = (await supabase.auth.getSession()).data.session?.access_token
    await fetch('/api/prayers', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, approved }) })
    mutate()
  }

  return (
    <div className="mt-3 space-y-3">
      {data?.length === 0 && <div className="text-sm text-slate-500">No submissions yet.</div>}
      {data?.map((p: any) => (
        <div key={p.id} className="p-3 border rounded flex justify-between items-center">
          <div>
            <div className="text-sm text-slate-700">{p.text}</div>
            <div className="text-xs text-slate-500 mt-1">{p.name ? `${p.name}` : 'Anonymous'} • {new Date(p.created_at || p.createdAt).toLocaleString()}</div>
          </div>
          <div className="space-x-2">
            <button onClick={() => setApproved(p.id, true)} className="text-sm text-amber-600">Approve</button>
            <button onClick={() => setApproved(p.id, false)} className="text-sm text-red-600">Reject</button>
          </div>
        </div>
      ))}
    </div>
  )
}
