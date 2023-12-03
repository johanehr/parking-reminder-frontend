import { DateTime } from "luxon";

enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7
}

type ParkingLocationData = {
  name: string;
  parkingRules: {
    cleaningTimes: CleaningTime[],
    maximum: { days: number }},
  path: { lat: number, lng: number }[];
}

type CleaningTime = {
  day: DayOfWeek
  startHour: number,
  endHour: number,
  appliesToEvenWeeks: boolean,
  appliesToOddWeeks: boolean
}

export function getParkingLocationData() {

  // TODO: This should probably come from a database in the future, for crowd-sourced data
  const rawData: ParkingLocationData[] = [
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

  return rawData.map( (parkingLocation) => { return { ...parkingLocation, color: getAppropriateDisplayColor(parkingLocation)} })
}

function getNextCleaningTime(cleaningTimes: CleaningTime[]): DateTime {
  const now = DateTime.now()
  const currentDay = now.weekday

  const allMoveDays = cleaningTimes.map((cleaningTime) => {
    const cleaningDay = cleaningTime.day
  
    // Only considering day of the week (not odd/even)
    let dayOffset = cleaningDay - currentDay
    if (dayOffset < 0) {
      dayOffset = 7 + dayOffset // Already passed, see next week
    }
    let nextCleaningWeekday = now.plus({ days: dayOffset }).set({ hour: cleaningTime.startHour })

    // Consider odd/even weeks
    if (nextCleaningWeekday.weekNumber % 2 === 0 && !cleaningTime.appliesToEvenWeeks) { // TODO: Handle case where if doesn't apply to any week (e.g. during summers)
      nextCleaningWeekday = nextCleaningWeekday.plus({ days: 7 }) // One week extra!
    }

    // TODO: Consider time of day has already passed as well!

    return nextCleaningWeekday
  })

  return allMoveDays.sort(compareLuxonDates)[0]
  
}

function compareLuxonDates(a: DateTime, b: DateTime) {
  return a.toMillis() - b.toMillis()
}

function getAppropriateDisplayColor(parkingLocation: ParkingLocationData): string {
  const now = DateTime.now()
  const nextCleaningTime = getNextCleaningTime(parkingLocation.parkingRules.cleaningTimes)
  const maximumTime = DateTime.now().plus({ days: parkingLocation.parkingRules.maximum.days })

  const lastTimeToMove = [nextCleaningTime, maximumTime].sort(compareLuxonDates)[0]
  const hoursUntilMove = lastTimeToMove.diffNow(['hours']).hours
  console.log('Hours until move: ', hoursUntilMove)

  if (hoursUntilMove > 7 * 24 ) { return 'green' }
  if (hoursUntilMove > 3 * 24 ) { return 'yellow' }
  if (hoursUntilMove > 12 ) { return 'orange' }

  return 'red'
}