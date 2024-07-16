
import { DateTime } from "luxon"
import { AugmentedParkingLocationData, CleaningTime, ParkingLocationData, ParkingRules } from "./types"
import assert from "assert"
import { getAppropriateDisplayColor } from "./helper-functions/getAppropriateDisplayColor"
import { calculateMaximumTime } from "./helper-functions/calculateMaximumTime"
import { compareLuxonDates } from "./helper-functions/compareLuxonDates"
import { getRawParkingLocationData } from "./data/getRawParkingLocationData"
import { WEEKS_PER_YEAR } from "../app/constants"

export function augmentParkingLocationData(parkingLocation: ParkingLocationData, currentTime: DateTime): AugmentedParkingLocationData {
  const nextCleaningTime = calculateNextCleaningTime(parkingLocation.parkingRules, currentTime)
  const maximumTime = calculateMaximumTime(parkingLocation.parkingRules.maximum.days, currentTime)
  const possibleTimes = [maximumTime]
  let lastTimeToMove = maximumTime
  if (nextCleaningTime) {
    possibleTimes.push(nextCleaningTime)
  }
  lastTimeToMove = possibleTimes.sort(compareLuxonDates)[0]
  const hoursUntilMove = lastTimeToMove.diff(currentTime, 'hours').hours
  return { ...parkingLocation, color: getAppropriateDisplayColor(hoursUntilMove), nextCleaningTime: nextCleaningTime}
}



export const getAugmentedParkingLocationData = (
  parkingLocationData: ParkingLocationData[] = getRawParkingLocationData(),
  currentTime: DateTime = DateTime.local()
): AugmentedParkingLocationData[] => {
  return parkingLocationData.map((parkingLocation: ParkingLocationData) => augmentParkingLocationData(parkingLocation, currentTime))
}



export function calculateNextCleaningTime(parkingRules: ParkingRules, currentTime: DateTime): DateTime | null {
  const currentDay = currentTime.weekday
  const currentHour = currentTime.hour
  const currentlyEvenWeek = currentTime.weekNumber % 2 === 0
  const cleaningTimes: CleaningTime[] = parkingRules.cleaningTimes
  const noCleaningMonths = cleaningTimes.flatMap((cleaningTime) => cleaningTime.noCleaningMonths)



  const allMoveDays = cleaningTimes.map((cleaningTime) => {


    assert(cleaningTime.startHour >= 0 && cleaningTime.startHour <= 23, 'Start hour out of range')
    assert(cleaningTime.endHour >= 0 && cleaningTime.endHour <= 23, 'End hour out of range')
    assert(cleaningTime.startHour < cleaningTime.endHour, 'Start hour after end hour')


    // Only considering day of the week (not odd/even weeks)
    let dayOffset = cleaningTime.day - currentDay

    const hourOffsetStart = cleaningTime.startHour - currentHour
    const hourOffsetEnd = cleaningTime.endHour - currentHour

    const cleaningThisWeek = (currentlyEvenWeek && cleaningTime.appliesToEvenWeeks) || (!currentlyEvenWeek && cleaningTime.appliesToOddWeeks)

    // if location currently does not have a cleaning holiday
    if (!noCleaningMonths.includes(currentTime.month)) {
      //cleaning currently ongoing
      if (dayOffset === 0 && hourOffsetStart <= 0 && hourOffsetEnd > 0 && cleaningThisWeek) {
        return currentTime
      }
      if (dayOffset < 0 || (dayOffset === 0 && hourOffsetEnd <= 0)) {
        dayOffset = 7 + dayOffset
      }
    }

    let nextCleaningWeekday = currentTime.plus({ days: dayOffset }).set({ hour: cleaningTime.startHour, minute: 0, second: 0, millisecond: 0 })
    // checking if location currently has a cleaning holiday, and if so, adds a week to the cleaning time, thereby trying to find next time the location is being cleaned
    if (noCleaningMonths.includes(nextCleaningWeekday.month)) {
      for (let weekOffset = 1; weekOffset <= WEEKS_PER_YEAR; weekOffset++) {
        nextCleaningWeekday = nextCleaningWeekday.plus({ days: 7 })
        if (!noCleaningMonths.includes(nextCleaningWeekday.month)) {
          break
        }
        //Default for special cases that have no cleaning 
        if (weekOffset === WEEKS_PER_YEAR) {
          return null
        }
      }
    }


    // Consider odd/even weeks
    const isEvenWeek = nextCleaningWeekday.weekNumber % 2 === 0
    if (isEvenWeek && cleaningTime.appliesToEvenWeeks) {
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