export type CaseType = 'photo' | 'video'

export interface Case {
  id: string
  title: string
  specialty: string
  type: CaseType
  duration: string
  description: string
  media_url: string | null
  media_urls: string[]
  premium: boolean
  sensitive: boolean
}

export interface Doc {
  id: string
  title: string
  journal: string
  year: string
  pdf_url: string | null
  premium: boolean
}

export interface Post {
  id: string
  title: string
  category: string
  excerpt: string
  cover_url: string | null
  date: string
}

export interface Sponsor {
  id: string
  name: string
  logo_url: string | null
  url: string | null
}

export type SubStatus = 'active' | 'free' | 'paused'

export interface Subscriber {
  id: string
  name: string
  initial: string
  plan: string
  since: string
  status: SubStatus
}

export const SPECIALTIES = [
  'Implantologie',
  'Greffe osseuse',
  'Extraction',
  'Sinus lift',
  'Parodontologie',
] as const
