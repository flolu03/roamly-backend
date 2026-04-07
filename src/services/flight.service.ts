import axios from 'axios'

const DUFFEL_BASE_URL = 'https://api.duffel.com'

function getDuffelHeaders() {
  return {
    Authorization: `Bearer ${process.env.DUFFEL_API_KEY}`,
    'Duffel-Version': 'v2',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  const h = match?.[1] || '0'
  const m = match?.[2] || '0'
  return `${h}h ${m}m`
}

function formatTime(datetime: string): string {
  return datetime?.split('T')[1]?.slice(0, 5) || ''
}

export async function searchFlights(
  origin: string,
  destination: string,
  date: string,
  paxCount: number
) {
  const passengers = Array.from({ length: paxCount }, () => ({ type: 'adult' }))

  const response = await axios.post(
    `${DUFFEL_BASE_URL}/air/offer_requests?return_offers=true`,
    {
      data: {
        slices: [{ origin, destination, departure_date: date }],
        passengers,
        cabin_class: 'economy',
      },
    },
    { headers: getDuffelHeaders() }
  )

  const offers: any[] = response.data?.data?.offers || []

  return offers.slice(0, 5).map((offer: any, index: number) => {
    const slice = offer.slices?.[0]
    const firstSegment = slice?.segments?.[0]
    const stopsCount = (slice?.segments?.length || 1) - 1

    const segments = (slice?.segments || []).map((seg: any) => ({
      origin: seg.origin?.iata_code || '',
      originCity: seg.origin?.city_name || seg.origin?.name || '',
      destination: seg.destination?.iata_code || '',
      destinationCity: seg.destination?.city_name || seg.destination?.name || '',
      departsAt: formatTime(seg.departing_at),
      arrivesAt: formatTime(seg.arriving_at),
      duration: parseDuration(seg.duration || 'PT0H'),
      flightNumber: `${seg.marketing_carrier?.iata_code || ''} ${seg.marketing_carrier_flight_number || ''}`.trim(),
      airline: seg.marketing_carrier?.name || '',
    }))

    return {
      id: offer.id || String(index),
      airline: offer.owner?.name || 'Unbekannt',
      airlineCode: offer.owner?.iata_code || '??',
      flightNumber: `${firstSegment?.marketing_carrier?.iata_code || ''} ${firstSegment?.marketing_carrier_flight_number || ''}`.trim(),
      departsAt: formatTime(firstSegment?.departing_at),
      arrivesAt: formatTime(slice?.segments?.[slice.segments.length - 1]?.arriving_at),
      duration: parseDuration(slice?.duration || 'PT0H'),
      stopsCount,
      segments,
      pricePerPax: Math.round(parseFloat(offer.total_amount || '0') / paxCount),
      totalPrice: Math.round(parseFloat(offer.total_amount || '0')),
      logoUrl: `https://logos.skyscnr.com/images/airlines/favicon/${offer.owner?.iata_code}.png`,
      deepLink: offer.booking_url || 'https://www.duffel.com',
      origin,
      destination,
      date,
    }
  })
}

export async function searchFlightsMultiStop(
  stops: { origin: string; destination: string; date: string }[],
  paxCount: number
) {
  const passengers = Array.from({ length: paxCount }, () => ({ type: 'adult' }))

  const response = await axios.post(
    `${DUFFEL_BASE_URL}/air/offer_requests?return_offers=true`,
    {
      data: {
        slices: stops.map((s) => ({
          origin: s.origin,
          destination: s.destination,
          departure_date: s.date,
        })),
        passengers,
        cabin_class: 'economy',
      },
    },
    { headers: getDuffelHeaders() }
  )

  const offers: any[] = response.data?.data?.offers || []

  return offers.slice(0, 5).map((offer: any, index: number) => {
    const slice = offer.slices?.[0]
    const firstSegment = slice?.segments?.[0]
    const stopsCount = (slice?.segments?.length || 1) - 1

    return {
      id: offer.id || String(index),
      airline: offer.owner?.name || 'Unbekannt',
      airlineCode: offer.owner?.iata_code || '??',
      flightNumber: `${firstSegment?.marketing_carrier?.iata_code || ''} ${firstSegment?.marketing_carrier_flight_number || ''}`.trim(),
      departsAt: formatTime(firstSegment?.departing_at),
      arrivesAt: formatTime(slice?.segments?.[slice.segments.length - 1]?.arriving_at),
      duration: parseDuration(slice?.duration || 'PT0H'),
      stopsCount,
      pricePerPax: Math.round(parseFloat(offer.total_amount || '0') / paxCount),
      totalPrice: Math.round(parseFloat(offer.total_amount || '0')),
      logoUrl: `https://logos.skyscnr.com/images/airlines/favicon/${offer.owner?.iata_code}.png`,
      deepLink: offer.booking_url || 'https://www.duffel.com',
    }
  })
}
