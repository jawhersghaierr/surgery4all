import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getPosts } from '@/lib/data'
import { BlogCard } from '@/components/site/BlogCard'

/** Port of the BLOG `<main>` block (HANDOFF `Surgery for All.dc.html` lines 235-252). */
export default async function BlogPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)

  const t = await getTranslations('blog')
  const posts = await getPosts()

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px 90px' }}>
      <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: '#0FA893', letterSpacing: '.04em', textTransform: 'uppercase' }}>
        {t('eyebrow')}
      </div>
      <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 44, letterSpacing: '-.03em', marginBottom: 38 }}>
        {t('title')}
      </h1>

      <div className="sfa-g2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 22 }}>
        {posts.map((p) => (
          <BlogCard key={p.id} p={p} />
        ))}
      </div>
    </main>
  )
}
