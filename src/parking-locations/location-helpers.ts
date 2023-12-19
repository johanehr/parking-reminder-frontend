
import { DateTime } from "luxon";
import { AugmentedParkingLocationData, CleaningTime, DayOfWeek, ParkingLocationData } from "./types";
import assert from "assert";
import { getAppropriateDisplayColor } from "./helper-functions/getAppropriateDisplayColor";
import { getRawParkingLocationData } from "./data/getRawParkingLocationData";
import { calculateMaximumTime } from "./helper-functions/calculateMaximumTime";
import { compareLuxonDates } from "./helper-functions/compareLuxonDates";

getRawParkingLocationData() 

export function augmentParkingLocationData(rawData: ParkingLocationData[], currentTime: DateTime): AugmentedParkingLocationData[] {
  return rawData.map( (parkingLocation) => {
    
    const nextCleaningTime = calculateNextCleaningTime(parkingLocation.parkingRules.cleaningTimes, currentTime, parkingLocation.parkingRules.noCleaningMonths)
    const maximumTime = calculateMaximumTime(parkingLocation.parkingRules.maximum.days, currentTime)

    const possibleTimes = [maximumTime]
    if (nextCleaningTime) { possibleTimes.push(nextCleaningTime) }
  
    const lastTimeToMove = possibleTimes.sort(compareLuxonDates)[0]
    const hoursUntilMove = lastTimeToMove.diffNow(['hours']).hours
    console.log(`${hoursUntilMove.toFixed(2)}h until need to move from ${parkingLocation.name}`)

    return { ...parkingLocation, color: getAppropriateDisplayColor(hoursUntilMove)}
  })
}

export function calculateNextCleaningTime(cleaningTimes: CleaningTime[], currentTime: DateTime, noCleaningMonths: Number[]): DateTime | null {
  const currentDay = currentTime.weekday
  const currentHour = currentTime.hour
  const currentlyEvenWeek = currentTime.weekNumber % 2 === 0


  
  const allMoveDays = cleaningTimes.map((cleaningTime) => {


    assert(cleaningTime.startHour >= 0 && cleaningTime.startHour <= 23, 'Start hour out of range')
    assert(cleaningTime.endHour >= 0 && cleaningTime.endHour <= 23, 'End hour out of range')
    assert(cleaningTime.startHour < cleaningTime.endHour, 'Start hour after end hour')


    // Only considering day of the week (not odd/even weeks)
    let dayOffset = cleaningTime.day - currentDay

    let hourOffsetStart = cleaningTime.startHour - currentHour
    let hourOffsetEnd = cleaningTime.endHour - currentHour

    const cleaningThisWeek = (currentlyEvenWeek && cleaningTime.appliesToEvenWeeks) || (!currentlyEvenWeek && cleaningTime.appliesToOddWeeks)


    if (!noCleaningMonths.includes(currentTime.month)) {
      if (dayOffset === 0 && hourOffsetStart <= 0 && hourOffsetEnd > 0 && cleaningThisWeek) {
        console.log('Cleaning currently in progress')
        return currentTime
      }
      if (dayOffset < 0 || (dayOffset === 0 && hourOffsetEnd <= 0)) {
        console.log('Cleaning time already passed this week, continue checking next week')
        dayOffset = 7 + dayOffset // Already passed, see next week
      }
    }

    let nextCleaningWeekday = currentTime.plus({ days: dayOffset }).set({ hour: cleaningTime.startHour, minute: 0, second: 0, millisecond: 0 })

    if (noCleaningMonths.includes(nextCleaningWeekday.month)) {
      for (let i = 0; i < 10; i++) {
        nextCleaningWeekday = nextCleaningWeekday.plus({ days: 7 })
        if (!noCleaningMonths.includes(nextCleaningWeekday.month)) {
          break
        }
      }
    }

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

  const validMoveDays = allMoveDays.flatMap(day => day ? [day] : [])
  return validMoveDays.sort(compareLuxonDates)[0] ?? null
  
}