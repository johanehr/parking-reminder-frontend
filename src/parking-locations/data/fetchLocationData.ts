import axios from 'axios'
import { DayOfWeek, MonthOfYear, ParkingLocationData, RecievedParkingLocationData } from '../types'

function mapStringToDay(day: string): DayOfWeek | null {
  switch (day.toUpperCase()) {
    case "MONDAY":
      return DayOfWeek.MONDAY
    case "TUESDAY":
      return DayOfWeek.TUESDAY
    case "WEDNESDAY":
      return DayOfWeek.WEDNESDAY
    case "THURSDAY":
      return DayOfWeek.THURSDAY
    case "FRIDAY":
      return DayOfWeek.FRIDAY
    case "SATURDAY":
      return DayOfWeek.SATURDAY
    case "SUNDAY":
      return DayOfWeek.SUNDAY
    default:
      return null
  }
}

function mapStringToMonth(month: string): MonthOfYear | null {
  switch (month.toUpperCase()) {
    case "JANUARY":
      return MonthOfYear.JANUARY
    case "FEBRUARY":
      return MonthOfYear.FEBRUARY
    case "MARCH":
      return MonthOfYear.MARCH
    case "APRIL":
      return MonthOfYear.APRIL
    case "MAY":
      return MonthOfYear.MAY
    case "JUNE":
      return MonthOfYear.JUNE
    case "JULY":
      return MonthOfYear.JULY
    case "AUGUST":
      return MonthOfYear.AUGUST
    case "SEPTEMBER":
      return MonthOfYear.SEPTEMBER
    case "OCTOBER":
      return MonthOfYear.OCTOBER
    case "NOVEMBER":
      return MonthOfYear.NOVEMBER
    case "DECEMBER":
      return MonthOfYear.DECEMBER
    default:
      return null
  }
}

export const fetchLocationData = async (): Promise<ParkingLocationData[]> => {
  try {
    const res = await axios.get<RecievedParkingLocationData[]>('/api/fetch_all_locations')
    return res.data.map(location => ({
      ...location,
      parkingRules: {
        ...location.parkingRules,
        cleaningTimes: location.parkingRules.cleaningTimes
          .map(time => {
            const day = mapStringToDay(time.day as string)
            const noCleaningMonths = (time.noCleaningMonths as string[]).map(mapStringToMonth)
            return {
              ...time,
              day: day as DayOfWeek,
              noCleaningMonths: noCleaningMonths as MonthOfYear[],
            }
          })
      },
    }))
  } catch (error) {
    console.error('Error fetching data in fetchLocationData:', error)
    throw new Error('Failed to fetch parking location data')
  }
}