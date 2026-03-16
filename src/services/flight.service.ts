import 'dotenv/config'
import axios from 'axios'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ''

export async function searchFlights(
  origin: string,
  destination: string,
  date: string,
  paxCount: number
) {
  const legs = [{ origin, destination, date }]

  const response = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlightsMultiStops', {
    params: {
      legs: JSON.stringify(legs),
      adults: paxCount,
      currency: 'EUR',
      countryCode: 'DE',
      market: 'de-DE',
      cabinClass: 'economy',
      sortBy: 'best'
    },
    headers: {
      'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      'x-rapidapi-key': RAPIDAPI_KEY
    }
  })

  const itineraries = response.data?.data?.itineraries || []

  return itineraries.slice(0, 5).map((item: any, index: number) => {
    const leg = item.legs?.[0]
    const segment = leg?.segments?.[0]
    return {
      id: item.id || String(index),
      airline: leg?.carriers?.marketing?.[0]?.name || 'Unbekannt',
      airlineCode: leg?.carriers?.marketing?.[0]?.alternateId || '??',
      flightNumber: segment?.flightNumber || '',
      departsAt: leg?.departure?.split('T')[1]?.slice(0, 5) || '',
      arrivesAt: leg?.arrival?.split('T')[1]?.slice(0, 5) || '',
      duration: `${Math.floor((leg?.durationInMinutes || 0) / 60)}h ${(leg?.durationInMinutes || 0) % 60}m`,
      stopsCount: leg?.stopCount || 0,
      pricePerPax: Math.round((item.price?.raw || 0) / paxCount),
      totalPrice: Math.round(item.price?.raw || 0),
      deepLink: `https://www.skyscanner.de/transport/flights/${origin}/${destination}/${date}/`
    }
  })
}

export async function searchFlightsMultiStop(
  stops: { origin: string, destination: string, date: string }[],
  paxCount: number
) {
  const response = await axios.get('https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlightsMultiStops', {
    params: {
      legs: JSON.stringify(stops),
      adults: paxCount,
      currency: 'EUR',
      countryCode: 'DE',
      market: 'de-DE',
      cabinClass: 'economy',
      sortBy: 'best'
    },
    headers: {
      'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      'x-rapidapi-key': RAPIDAPI_KEY
    }
  })

  const itineraries = response.data?.data?.itineraries || []

  return itineraries.slice(0, 5).map((item: any, index: number) => {
    const leg = item.legs?.[0]
    const segment = leg?.segments?.[0]
    return {
      id: item.id || String(index),
      airline: leg?.carriers?.marketing?.[0]?.name || 'Unbekannt',
      airlineCode: leg?.carriers?.marketing?.[0]?.alternateId || '??',
      flightNumber: segment?.flightNumber || '',
      departsAt: leg?.departure?.split('T')[1]?.slice(0, 5) || '',
      arrivesAt: leg?.arrival?.split('T')[1]?.slice(0, 5) || '',
      duration: `${Math.floor((leg?.durationInMinutes || 0) / 60)}h ${(leg?.durationInMinutes || 0) % 60}m`,
      stopsCount: leg?.stopCount || 0,
      pricePerPax: Math.round((item.price?.raw || 0) / paxCount),
      totalPrice: Math.round(item.price?.raw || 0),
      deepLink: `https://www.skyscanner.de`
    }
  })
}