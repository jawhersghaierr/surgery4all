import { setRequestLocale } from 'next-intl/server'
import { getSession } from '@/lib/auth'
import { getCases, getDocuments, getPosts, getSubscribers } from '@/lib/data'
import { LoginForm } from './LoginForm'
import { Dashboard } from './Dashboard'

/**
 * Port of the ADMIN `<sc-if isAdmin>` block (HANDOFF `Surgery for All.dc.html`
 * lines 318-460). Full-screen dark wrapper; `getSession()` decides whether to
 * render the login screen or the dashboard. The dashboard's data getters fall
 * back to seed data when the backend isn't configured or the tables are
 * empty (see `@/lib/data`), so the admin UI renders either way.
 */
export default async function AdminPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)

  const session = await getSession()

  if (!session?.admin) {
    return (
      <main style={{ minHeight: 'calc(100vh - 72px)', background: '#0C1512', color: '#fff' }}>
        <LoginForm />
      </main>
    )
  }

  const [cases, docs, posts, subscribers] = await Promise.all([
    getCases(),
    getDocuments(),
    getPosts(),
    getSubscribers(),
  ])

  return (
    <main style={{ minHeight: 'calc(100vh - 72px)', background: '#0C1512', color: '#fff' }}>
      <Dashboard cases={cases} docs={docs} posts={posts} subscribers={subscribers} />
    </main>
  )
}
