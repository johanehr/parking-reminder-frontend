import { DateTime } from "luxon";
import { DayOfWeek, ParkingLocationData } from "./types";
import { calculateNextCleaningTime } from "./location-helpers";
import { calculateMaximumTime } from "./helper-functions/calculateMaximumTime";
import { getAppropriateDisplayColor } from "./helper-functions/getAppropriateDisplayColor";


const fakeParkingData: ParkingLocationData = {
  name: "Name",
  parkingRules: {
    cleaningTimes: [{ day: DayOfWeek.TUESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true }],
    maximum: {
      days: 14
    },
    noCleaningMonths: [7],
  },
  path: []
}


describe('getAppropriateDisplayColor', () => {
  it.each([
    [1, "red"],
    [6, "orangered"],
    [18, "orange"],
    [36, "yellow"],
    [80, "yellowgreen"],
    [150, "limegreen"],
    [1337, "green"],
  ])('When %i hours left, use display color %s', (hours, color) => {
    expect(getAppropriateDisplayColor(hours)).toBe(color)
  })
})

describe('calculateMaximumTime', () => {
  it('Returns correct maximum time', () => {
    expect(calculateMaximumTime(7, DateTime.fromISO('2024-01-01T12:34:56.000Z'))).toEqual(DateTime.fromISO('2024-01-08T12:34:56.000Z'))
  })
})

describe('calculateNextCleaningTime', () => {

  it('Currently on-going', () => {
    const currentTime = DateTime.local(2023, 12, 4, 12) // Monday noon of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 0, endHour: 23, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toBe(DateTime.local(2023, 12, 4, 12).toISO())
  })

  it('Just started', () => {
    const currentTime = DateTime.local(2023, 12, 4, 0) // Monday early morning of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 0, endHour: 23, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toBe(DateTime.local(2023, 12, 4, 0).toISO())
  })

  it('Just ended', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 0, endHour: 23, appliesToEvenWeeks: false, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toBe(DateTime.local(2023, 12, 18, 0).toISO()) // Optimal!
  })

  it('Later today', () => {
    const currentTime = DateTime.local(2023, 12, 4, 8) // Monday morning of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 15, endHour: 18, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toBe(DateTime.local(2023, 12, 4, 15).toISO())
  })

  it('Tomorrow (new week starting)', () => {
    const currentTime = DateTime.local(2023, 12, 10, 22) // Sunday even of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 8, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toBe(DateTime.local(2023, 12, 11, 8).toISO())
  })

  it('This week', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 12, 6, 8).toISO())
  })

  it('Next week (due to passed weekday)', () => {
    const currentTime = DateTime.local(2023, 12, 5, 23) // Tuesday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 10, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 12, 11, 10).toISO())
  })

  it('Next week (due to passed time earlier today)', () => {
    const currentTime = DateTime.local(2023, 12, 4, 15) // Monday afternoon of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 10, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 12, 11, 10).toISO())
  })

  it('Next week (due to odd week number)', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 12, 13, 8).toISO())
  })

  it('Multiple cleaning times', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [
      { day: DayOfWeek.TUESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false },  // Next week
      { day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: true }, // This week <---
      { day: DayOfWeek.THURSDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false }  // Next week
    ]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 12, 6, 8).toISO())
  })

  it('No match', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: false }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)).toEqual(null)
  })

  it('Current time, but next week', () => {
    const currentTime = DateTime.local(2023, 12, 6, 21) // Wednesday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 18, endHour: 22, appliesToEvenWeeks: true, appliesToOddWeeks: false }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 12, 13, 18).toISO())
  })

  it('Cleaning completed recently', () => {
    const currentTime = DateTime.local(2023, 12, 6, 21) // Wednesday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 12, 13, 10).toISO())
  })

  it('Finds next cleaning time after month of cleaning-break, currently in month before cleaning break', () => {
    const currentTime = DateTime.local(2023, 6, 30, 21) // Friday evening, end of June. Cleaning break example July. 
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 8, 2, 8).toISO())

  })

  it('Finds next cleaning time after cleaning break, currently in cleaning break', () => {
    const currentTime = DateTime.local(2023, 7, 10, 21) // Monday lunch, middle of July. Cleaning break example July.
    const cleaningTimes = [{ day: DayOfWeek.FRIDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 8, 11, 8).toISO())
  })

  it('Returns to normal checks after cleaning-break', () => {
    const currentTime = DateTime.local(2023, 7, 26, 21) // Wednesday evening, end of July. Cleaning break example July.
    const cleaningTimes = [{ day: DayOfWeek.TUESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 8, 8, 8).toISO())
  })
  
  it('Finds next cleaning time, with cleaning break different month', () => {
    const currentTime = DateTime.local(2023, 7, 28, 8) // Friday morning, end of July. Cleaning break example August.
    const cleaningTimes = [{ day: DayOfWeek.THURSDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true }]
    const noCleaningMonths = [8]
  
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 9, 14, 8).toISO())
  })

  it('During cleaning break, is not affected by cleaning "ongoing"', () => {
    const currentTime = DateTime.local(2023, 7, 19, 10) // Wednesday morning, mid july cleaning "ongoing cleaning".
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 8, 2, 8).toISO())
  })

  it('During cleaning break, is not affected by cleaning "earlier in the same day"', () => {
    const currentTime = DateTime.local(2023, 7, 20, 18) // Wednesday morning, mid july cleaning "ongoing cleaning".
    const cleaningTimes = [{ day: DayOfWeek.THURSDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true }]
    const noCleaningMonths = [7]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime, noCleaningMonths)?.toISO()).toEqual(DateTime.local(2023, 8, 3, 8).toISO())
  })

})