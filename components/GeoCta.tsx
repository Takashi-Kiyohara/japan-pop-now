'use client'

import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import geoConfig from '@/lib/geo-config.json'

type Region = keyof typeof geoConfig.regions
type CtaType = 'esim' | 'hotel' | 'transport'

interface GeoCtaProps {
  type: CtaType
  className?: string
  showCurrencyNote?: boolean
}

function getRegionFromCountry(country: string): Region {
  for (const [region, config] of Object.entries(geoConfig.regions)) {
    if ((config.countries as string[]).includes(country)) {
      return region as Region
    }
  }
  return geoConfig.default as Region
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const cookie = document.cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${name}=`))
  return cookie ? cookie.split('=')[1] : null
}

export default function GeoCta({
  type,
  className = '',
  showCurrencyNote = true,
}: GeoCtaProps) {
  const [state, setState] = useState<{ region: Region | null; mounted: boolean }>({
    region: null,
    mounted: false,
  })

  useEffect(() => {
    const geoCountry = getCookie('jpn-geo') || geoConfig.fallback_country
    const detectedRegion = getRegionFromCountry(geoCountry)
    setState({ region: detectedRegion, mounted: true })
  }, [])

  if (!state.mounted || !state.region) {
    return null
  }

  const regionConfig = geoConfig.regions[state.region]

  let url = ''
  let partner = ''
  let cta = ''

  switch (type) {
    case 'esim':
      url = regionConfig.esim_url
      partner = regionConfig.esim_partner
      cta = regionConfig.esim_cta
      break
    case 'hotel':
      url = regionConfig.hotel_url
      partner = regionConfig.hotel_partner
      cta = `Book on ${partner}`
      break
    case 'transport':
      url = regionConfig.transport_url
      partner = regionConfig.transport_partner
      cta = `Book on ${partner}`
      break
  }

  const defaultClasses = 'jpn-cta group inline-flex items-center gap-2'
  const fullClassName = className ? `${defaultClasses} ${className}` : defaultClasses

  return (
    <div className={fullClassName}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white font-semibold transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
        aria-label={`${cta} - ${partner}`}
      >
        {cta}
        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>

      {showCurrencyNote && type === 'esim' && (
        <span className="text-xs text-gray-600 dark:text-gray-400 ml-3">
          {regionConfig.currency_symbol}1 = ¥{regionConfig.currency_jpy_to_local}
        </span>
      )}
    </div>
  )
}
