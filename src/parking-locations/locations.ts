import { DateTime } from "luxon";
import { AugmentedParkingLocationData, CleaningTime, DayOfWeek, ParkingLocationData } from "./types";

function getRawParkingLocationData(): ParkingLocationData[] {
  // TODO: This should probably come from a database in the future, for crowd-sourced data

  return [
    {
      name: "Gamla vägen (kort)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true  },
          // TODO: Specific parts of the year, e.g. not summer
          // TODO: Deal with e.g. sundays
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377882, "lng": 18.040977 },
        { "lat": 59.377689, "lng": 18.041092 },
        { "lat": 59.377712, "lng": 18.041240 },
        { "lat": 59.377887, "lng": 18.041116 },
      ]
    },
    {
      name: "Gamla vägen (utanför gul villa)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.TUESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true  },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377177, "lng": 18.041602 },
        { "lat": 59.377065, "lng": 18.042051 },
        { "lat": 59.377122, "lng": 18.042130 },
        { "lat": 59.377232, "lng": 18.041778 },
      ]
    },
    {
      name: "Björnstigen vid äldreboendet",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.WEDNESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false  },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.380511, "lng": 18.039990 },
        { "lat": 59.380514, "lng": 18.040109 },
        { "lat": 59.381119, "lng": 18.040168 },
        { "lat": 59.381412, "lng": 18.040050 },
        { "lat": 59.381596, "lng": 18.039722 },
        { "lat": 59.381538, "lng": 18.039619 },
        { "lat": 59.381339, "lng": 18.039921 },
        { "lat": 59.381162, "lng": 18.040013 },
      ]
    }
  ]
}

export function augmentParkingLocationData(): AugmentedParkingLocationData[] {
  const rawData = getRawParkingLocationData()
  return rawData.map( (parkingLocation) => { return { ...parkingLocation, color: getAppropriateDisplayColor(parkingLocation, DateTime.now())} }) // TODO: Ensure right TZ is used
}

export function calculateNextCleaningTime(cleaningTimes: CleaningTime[], currentTime: DateTime): DateTime {
  const currentDay = currentTime.weekday

  const allMoveDays = cleaningTimes.map((cleaningTime) => {
    const cleaningDay = cleaningTime.day
  
    // Only considering day of the week (not odd/even)
    let dayOffset = cleaningDay - currentDay
    if (dayOffset < 0) {
      console.log('Already passed, move next week')
      dayOffset = 7 + dayOffset // Already passed, see next week
    }
    let nextCleaningWeekday = currentTime.plus({ days: dayOffset }).set({ hour: cleaningTime.startHour, minute: 0, second: 0, millisecond: 0 })

    // Consider odd/even weeks
    if (nextCleaningWeekday.weekNumber % 2 === 0 && !cleaningTime.appliesToEvenWeeks) { // TODO: Handle case where if doesn't apply to any week (e.g. during summers)
      nextCleaningWeekday = nextCleaningWeekday.plus({ days: 7 }) // One week extra!
    }

    // TODO: Consider time of day has already passed as well! (endHour)

    return nextCleaningWeekday
  })

  return allMoveDays.sort(compareLuxonDates)[0]
  
}

export function calculateMaximumTime(maximumDays: number, currentTime: DateTime): DateTime {
  return currentTime.plus({ days: maximumDays })
}

function compareLuxonDates(a: DateTime, b: DateTime) {
  return a.toMillis() - b.toMillis()
}

export function getAppropriateDisplayColor(parkingLocation: ParkingLocationData, currentTime: DateTime): string {
  const nextCleaningTime = calculateNextCleaningTime(parkingLocation.parkingRules.cleaningTimes, currentTime)
  const maximumTime = calculateMaximumTime(parkingLocation.parkingRules.maximum.days, currentTime)

  const lastTimeToMove = [nextCleaningTime, maximumTime].sort(compareLuxonDates)[0]
  console.log(`Move before: ${lastTimeToMove.toISO()}`)
  const hoursUntilMove = lastTimeToMove.diffNow(['hours']).hours
  console.log(`${hoursUntilMove.toFixed(2)}h until need to move from ${parkingLocation.name}`)

  if (hoursUntilMove > 7 * 24 ) { return 'green' }
  if (hoursUntilMove > 3 * 24 ) { return 'yellow' }
  if (hoursUntilMove > 12 ) { return 'orange' }

  return 'red'
}