import { DateTime } from "luxon";
import { AugmentedParkingLocationData, CleaningTime, DayOfWeek, ParkingLocationData } from "./types";
import assert from "assert";

export default class ParkingLocationHelpers {
  static getRawParkingLocationData(): ParkingLocationData[] {
    // TODO: This should probably come from a database in the future, for crowd-sourced data
  
    return [
      {
        name: "Gamla vägen (kort, södra sidan)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true  },
            // TODO: Specific parts of the year, e.g. not summer
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
        name: "Gamla vägen (lång, norra sidan)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true  },
            // TODO: Specific parts of the year, e.g. not summer
          ],
          maximum: { days: 14 }
        },
        path: [
          { "lat": 59.377966, "lng": 18.041108 },
          { "lat": 59.377978, "lng": 18.041221 },
          { "lat": 59.377575, "lng": 18.041462 },
          { "lat": 59.377554, "lng": 18.041365 },
        ]
      },
      {
        name: "Gamla vägen (södra sidan, utanför gul villa)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.TUESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true  },
          ],
          maximum: { days: 14 }
        },
        path: [
          { "lat": 59.377206, "lng": 18.041788 },
          { "lat": 59.376925, "lng": 18.043562 },
          { "lat": 59.376879, "lng": 18.043547 },
          { "lat": 59.377159, "lng": 18.041738 },
        ]
      },
      {
        name: "Björnstigen vid äldreboendet",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.TUESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false  },
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
      },
      {
        name: "Ripstigen (vid bron)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.TUESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true },
          ],
          maximum: { days: 14 }
        },
        path: [
          { "lat": 59.378461, "lng": 18.041792 },
          { "lat": 59.378692, "lng": 18.042349 },
          { "lat": 59.378630, "lng": 18.042451 },
          { "lat": 59.378410, "lng": 18.041877 },
        ]
      },
      {
        name: "Bockholmsvägen (västra)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.WEDNESDAY, startHour: 7, endHour: 10, appliesToEvenWeeks: true, appliesToOddWeeks: false },
          ],
          maximum: { days: 14 }
        },
        path: [
          { "lat": 59.376407, "lng": 18.049888 },
          { "lat": 59.376416, "lng": 18.049750 },
          { "lat": 59.377539, "lng": 18.049959 },
          { "lat": 59.377386, "lng": 18.050336 },
        ]
      },
      {
        name: "Bockholmsvägen (vid bron)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.THURSDAY, startHour: 7, endHour: 10, appliesToEvenWeeks: true, appliesToOddWeeks: false },
          ],
          maximum: { days: 14 }
        },
        path: [
          { "lat": 59.377367, "lng": 18.050386 },
          { "lat": 59.377018, "lng": 18.050181 },
          { "lat": 59.377195, "lng": 18.050621 },
        ]
      },
      {
        name: "Stocksundstorpsvägen (mot Bockholmen)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.THURSDAY, startHour: 7, endHour: 10, appliesToEvenWeeks: true, appliesToOddWeeks: false },
          ],
          maximum: { days: 14 }
        },
        path: [
          { "lat": 59.377525, "lng": 18.050377 },
          { "lat": 59.377487, "lng": 18.050110 },
          { "lat": 59.378043, "lng": 18.049440 },
          { "lat": 59.378097, "lng": 18.049707 },
        ]
      },
      {
        name: "Stocksundstorpsvägen (villaområdet)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false },
          ],
          maximum: { days: 14 }
        },
        path: [
          { "lat": 59.379509, "lng": 18.046031 },
          { "lat": 59.379464, "lng": 18.045999 },
          { "lat": 59.379330, "lng": 18.046605 },
          { "lat": 59.379392, "lng": 18.046632 },
        ]
      },
      {
        name: "Pipersväg (östra)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.WEDNESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true },
          ],
          maximum: { days: 14 }
        },
        path: [
          { "lat": 59.377517, "lng": 18.030680 },
          { "lat": 59.377581, "lng": 18.030698 },
          { "lat": 59.377660, "lng": 18.029811 },
          { "lat": 59.377747, "lng": 18.029400 },
          { "lat": 59.377682, "lng": 18.029361 },
          { "lat": 59.377598, "lng": 18.029790 },
        ]
      },
      {
        name: "Pipersväg (västra)",
        parkingRules: {
          cleaningTimes: [
            { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true },
          ],
          maximum: { days: 14 }
        },
        path: [
          { "lat": 59.377956, "lng": 18.028728 },
          { "lat": 59.377904, "lng": 18.028642 },
          { "lat": 59.378283, "lng": 18.027840 },
          { "lat": 59.378326, "lng": 18.027958 },
        ]
      },
    ]
  }
  
  static augmentParkingLocationData(rawData: ParkingLocationData[], currentTime: DateTime): AugmentedParkingLocationData[] {
    return rawData.map( (parkingLocation) => {
      const nextCleaningTime = ParkingLocationHelpers.calculateNextCleaningTime(parkingLocation.parkingRules.cleaningTimes, currentTime)
      const maximumTime = ParkingLocationHelpers.calculateMaximumTime(parkingLocation.parkingRules.maximum.days, currentTime)

      const possibleTimes = [maximumTime]
      if (nextCleaningTime) { possibleTimes.push(nextCleaningTime) }
    
      const lastTimeToMove = possibleTimes.sort(ParkingLocationHelpers.compareLuxonDates)[0]
      const hoursUntilMove = lastTimeToMove.diffNow(['hours']).hours
      console.log(`${hoursUntilMove.toFixed(2)}h until need to move from ${parkingLocation.name}`)

      return { ...parkingLocation, color: ParkingLocationHelpers.getAppropriateDisplayColor(hoursUntilMove)}
    })
  }
  
  static calculateNextCleaningTime(cleaningTimes: CleaningTime[], currentTime: DateTime): DateTime | null {
    const currentDay = currentTime.weekday
    const currentHour = currentTime.hour
  
    const allMoveDays = cleaningTimes.map((cleaningTime) => {

      assert(cleaningTime.startHour >= 0 && cleaningTime.startHour <= 23, 'Start hour out of range')
      assert(cleaningTime.endHour >= 0 && cleaningTime.endHour <= 23, 'End hour out of range')
      assert(cleaningTime.startHour < cleaningTime.endHour, 'Start hour after end hour')

      // Only considering day of the week (not odd/even)
      let dayOffset = cleaningTime.day - currentDay
      let hourOffsetStart = cleaningTime.startHour - currentHour
      let hourOffsetEnd = cleaningTime.endHour - currentHour

      if (dayOffset === 0 && hourOffsetStart < 0 && hourOffsetEnd > 0) {
        console.log('Cleaning currently in progress')
        return currentTime
      }

      if (dayOffset < 0 || (dayOffset === 0 && hourOffsetStart < 0)) {
        console.log('Cleaning already passed, check next week')
        dayOffset = 7 + dayOffset // Already passed, see next week
      }

      let nextCleaningWeekday = currentTime.plus({ days: dayOffset }).set({ hour: cleaningTime.startHour, minute: 0, second: 0, millisecond: 0 })
  
      // Consider odd/even weeks
      const isEvenWeek = nextCleaningWeekday.weekNumber % 2 === 0
      if ( isEvenWeek && cleaningTime.appliesToEvenWeeks) {
        return nextCleaningWeekday
      } 
      if (!isEvenWeek && cleaningTime.appliesToOddWeeks) {
        return nextCleaningWeekday
      }

      if (isEvenWeek && !cleaningTime.appliesToEvenWeeks && cleaningTime.appliesToOddWeeks) {
        return nextCleaningWeekday.plus({ days: 7 }) // One week extra!
      }
      if (!isEvenWeek && cleaningTime.appliesToEvenWeeks && !cleaningTime.appliesToOddWeeks) {
        return nextCleaningWeekday.plus({ days: 7 }) // One week extra!
      }

      // Default for special cases (e.g. no cleaning times)
      return null
    })
  
    const validMoveDays = allMoveDays.flatMap(day => day ? [day] : []);
    return validMoveDays.sort(ParkingLocationHelpers.compareLuxonDates)[0] ?? null
    
  }
  
  static calculateMaximumTime(maximumDays: number, currentTime: DateTime): DateTime {
    return currentTime.plus({ days: maximumDays })
  }
  
  private static compareLuxonDates(a: DateTime, b: DateTime) {
    return a.toMillis() - b.toMillis()
  }
  
  static getAppropriateDisplayColor(hoursUntilMove: number): string {
    if (hoursUntilMove > 5 * 24 ) { return 'green' }
    if (hoursUntilMove > 3 * 24 ) { return 'yellow' }
    if (hoursUntilMove > 12 ) { return 'orange' }
  
    return 'red'
  }
}
