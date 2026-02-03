import Layout from '../src/components/Layout'

const sampleEvents = [
  { id: 1, title: 'Sunday Service', date: '2026-02-08', time: '10:00' },
  { id: 2, title: 'Community Potluck', date: '2026-02-14', time: '12:00' }
]

export default function CalendarPage() {
  return (
    <Layout>
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="mt-1 text-slate-600">Upcoming events — you can sync these with your calendar later.</p>

        <div className="mt-6 grid gap-3">
          {sampleEvents.map((e) => (
            <div key={e.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{e.title}</div>
                <div className="text-sm text-slate-500">{e.date} • {e.time}</div>
              </div>
              <div>
                <a href={`mailto:?subject=${encodeURIComponent(e.title)}&body=${encodeURIComponent(`${e.title} on ${e.date} at ${e.time}`)}`} className="text-amber-600 text-sm">Add to calendar</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
