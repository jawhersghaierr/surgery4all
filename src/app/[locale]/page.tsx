import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { CalendarCheck, Stethoscope, Sparkles, ShieldCheck } from 'lucide-react'

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  return <Home />
}

function Home() {
  const t = useTranslations('home')
  const services = [
    { icon: Stethoscope, key: 'care' },
    { icon: Sparkles, key: 'aesthetic' },
    { icon: ShieldCheck, key: 'implant' },
  ] as const

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-clinic-50 to-background dark:from-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="animate-fadeUp text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="text-clinic-gradient">{t('hero.title')}</span>
          </h1>
          <p className="animate-fadeUp-1 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t('hero.subtitle')}
          </p>
          <div className="animate-fadeUp-2 mt-10 flex flex-wrap justify-center gap-4">
            <a href="#contact" className="btn-clinic inline-flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              {t('hero.cta')}
            </a>
            <a href="#services" className="btn-outline-clinic">
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold">{t('services.title')}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {services.map(({ icon: Icon, key }) => (
            <div key={key} className="rounded-xl border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clinic-100 text-clinic-700 dark:bg-slate-800 dark:text-clinic-400">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{t(`services.${key}.title`)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(`services.${key}.desc`)}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
