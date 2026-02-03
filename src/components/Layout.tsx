import Head from 'next/head'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Tiyo Episcopal — Lakota Community</title>
        <meta name="description" content="Tiyo Episcopal Church — Lakota culture centered church" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center font-bold">T</div>
            <div>
              <div className="font-semibold">Tiyo Episcopal</div>
              <div className="text-xs text-slate-500">Lakota-centered community</div>
            </div>
          </div>
          <nav className="space-x-4 text-slate-700">
            <Link href="/">Home</Link>
            <Link href="/calendar">Calendar</Link>
            <Link href="/prayer-requests">Prayer Requests</Link>
            <Link href="/history">History</Link>
            <Link href="/admin" className="ml-2 text-sm text-amber-600">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white border-t mt-8">
        <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-slate-500">© Tiyo Episcopal Church — Built with respect for Lakota culture</div>
      </footer>
    </div>
  )
}
