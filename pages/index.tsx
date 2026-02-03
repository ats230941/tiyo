import Layout from '../src/components/Layout'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <section className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold">Welcome to Tiyo Episcopal Church</h1>
        <p className="mt-2 text-slate-700">A Lakota-centered Episcopal community celebrating prayer, history, and gatherings.</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/calendar" className="p-4 bg-amber-50 rounded-md">
            <h3 className="font-semibold">Events & Calendar</h3>
            <p className="mt-1 text-sm text-slate-600">See upcoming services and gatherings.</p>
          </Link>

          <Link href="/prayer-requests" className="p-4 bg-emerald-50 rounded-md">
            <h3 className="font-semibold">Prayer Requests</h3>
            <p className="mt-1 text-sm text-slate-600">Share a prayer request with our community.</p>
          </Link>

          <Link href="/history" className="p-4 bg-indigo-50 rounded-md">
            <h3 className="font-semibold">Church History</h3>
            <p className="mt-1 text-sm text-slate-600">Explore the story of our community and elders.</p>
          </Link>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Latest</h2>
        <div className="mt-3 grid gap-3">
          <article className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">Sunday Service, 10 AM</h3>
            <p className="text-sm text-slate-600 mt-1">Join us for traditional prayers and sharing.</p>
          </article>
        </div>
      </section>
    </Layout>
  )
}
