import { useState } from 'react'

export default function PrayerForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, text })
      })
      if (!res.ok) throw new Error('Failed to submit')
      setName('')
      setText('')
      onSuccess?.()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-700">Name (optional)</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Prayer Request</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="mt-1 block w-full rounded border px-3 py-2" required />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div>
        <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded" disabled={submitting}>{submitting ? 'Sending…' : 'Submit'}</button>
      </div>
    </form>
  )
}
