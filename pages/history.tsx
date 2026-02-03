import Layout from '../src/components/Layout'

export default function HistoryPage() {
  return (
    <Layout>
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold">Our History</h1>
        <p className="mt-2 text-slate-600">This space will highlight the founding, elders, and oral histories of our Lakota Episcopal community. Please consult elders and permission documents before publishing sensitive material.</p>

        <div className="mt-6 space-y-4">
          <article className="p-4 border rounded">
            <h3 className="font-semibold">Founding</h3>
            <p className="text-sm text-slate-700 mt-1">A short placeholder about the church's founding. Replace with verified history and audio interviews.</p>
          </article>

          <article className="p-4 border rounded">
            <h3 className="font-semibold">Oral Histories</h3>
            <p className="text-sm text-slate-700 mt-1">Audio clips and transcripts will be listed here with permissions and dates.</p>
          </article>
        </div>
      </div>
    </Layout>
  )
}
