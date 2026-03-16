const mockFlights = [
  {
    id: '1',
    airline: 'Lufthansa',
    airlineCode: 'LH',
    flightNumber: 'LH 760',
    departsAt: '09:15',
    arrivesAt: '22:45',
    duration: '11h 30m',
    stopsCount: 0,
    pricePerPax: 287,
    deepLink: 'https://www.lufthansa.com'
  },
  {
    id: '2',
    airline: 'Thai Airways',
    airlineCode: 'TG',
    flightNumber: 'TG 920',
    departsAt: '13:40',
    arrivesAt: '06:35',
    duration: '14h 55m',
    stopsCount: 1,
    pricePerPax: 241,
    deepLink: 'https://www.thaiairways.com'
  },
  {
    id: '3',
    airline: 'Emirates',
    airlineCode: 'EK',
    flightNumber: 'EK 048',
    departsAt: '21:30',
    arrivesAt: '12:15',
    duration: '13h 45m',
    stopsCount: 1,
    pricePerPax: 310,
    deepLink: 'https://www.emirates.com'
  }
]

export async function searchFlights(
  origin: string,
  destination: string,
  date: string,
  paxCount: number
) {
  // Später durch echten Amadeus/Kiwi API-Call ersetzen
  await new Promise(r => setTimeout(r, 800)) // Simuliert API-Latenz

  return mockFlights.map(f => ({
    ...f,
    totalPrice: f.pricePerPax * paxCount,
    origin,
    destination,
    date
  }))
}