import type {NextApiRequest, NextApiResponse} from 'next'
import axios from "axios"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const url = 'https://calendar.google.com/calendar/ical/japanese__ja%40holiday.calendar.google.com/public/full.ics'
  const response = await axios.get(url)
  const lines = response.data.split("\n")
  const holidays: any = []

  let day: string|null = null;
  lines.forEach((value: string) => {
    const line = value.trim()
    if (line.startsWith('DTSTART;')) {
      const split = line.split(':')
      day = split[1].toString()
      day = day.substr(0, 4) + '-' + day.substr(4, 2) + '-' + day.substr(6, 2)
    }
    if (line.startsWith('SUMMARY:') && day !== null) {
      const split = line.split(':')
      holidays.push({date: day, name: split[1]})
    }
  })

  holidays.sort((a: any, b: any) => {
    if (a['date'] > b['date']) { return 1 }
    if (a['date'] < b['date']) { return -1 }
    return 0
  })

  res.status(200).json(holidays)
}
