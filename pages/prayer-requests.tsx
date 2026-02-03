import Layout from '../src/components/Layout'
import PrayerForm from '../src/components/PrayerForm'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function PrayerRequestsPage() {
  const { data, mutate } = useSWR('/api/prayers', fetcher)

  return (
    <Layout>
      <div className="bg-white rounded shadow p-6">
        <div className="md:flex md:justify-between md:items-start gap-6">
          <div className="md:w-1/2">
            <h1 className="text-2xl font-bold">Prayer Requests</h1>
            <p className="mt-1 text-slate-600">Share your prayer — submissions are reviewed by church staff.</p>

            <div className="mt-4">
              <PrayerForm onSuccess={() => mutate()} />
            </div>
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <h2 className="font-semibold">Recent Requests</h2>
            <div className="mt-3 space-y-3">
              {data?.length === 0 && <div className="text-sm text-slate-500">No requests yet.</div>}
              {data?.map((p: any) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded border">
                  <div className="text-sm text-slate-700">{p.text}</div>
                  <div className="text-xs text-slate-500 mt-2">{p.name ? `${p.name}` : 'Anonymous'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
