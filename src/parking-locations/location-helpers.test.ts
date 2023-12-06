import { DateTime } from "luxon";
import { DayOfWeek, ParkingLocationData } from "./types";
import { calculateMaximumTime, calculateNextCleaningTime, getAppropriateDisplayColor } from "./location-helpers";

const fakeParkingData: ParkingLocationData = {
  name: "Name",
  parkingRules: {
    cleaningTimes: [{ day: DayOfWeek.TUESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true }],
    maximum: {
      days: 14
    }
  },
  path: []
}

describe('getAppropriateDisplayColor', () => {
  it.each([
    [1, "red"],
    [24, "orange"],
    [100, "yellow"],
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
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toBe(DateTime.local(2023, 12, 4, 12).toISO())
  })

  it('Just started', () => {
    const currentTime = DateTime.local(2023, 12, 4, 0) // Monday early morning of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 0, endHour: 23, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toBe(DateTime.local(2023, 12, 4, 0).toISO())
  })

  it('Just ended', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 0, endHour: 23, appliesToEvenWeeks: false, appliesToOddWeeks: true }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toBe(DateTime.local(2023, 12, 18, 0).toISO()) // Optimal!
  })

  it('Later today', () => {
    const currentTime = DateTime.local(2023, 12, 4, 8) // Monday morning of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 15, endHour: 18, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toBe(DateTime.local(2023, 12, 4, 15).toISO())
  })

  it('Tomorrow (new week starting)', () => {
    const currentTime = DateTime.local(2023, 12, 10, 22) // Sunday even of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 8, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toBe(DateTime.local(2023, 12, 11, 8).toISO())
  })

  it('This week', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 6, 8).toISO())
  })

  it('Next week (due to passed weekday)', () => {
    const currentTime = DateTime.local(2023, 12, 5, 23) // Tuesday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 10, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 11, 10).toISO())
  })

  it('Next week (due to passed time earlier today)', () => {
    const currentTime = DateTime.local(2023, 12, 4, 15) // Monday afternoon of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 10, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 11, 10).toISO())
  })

  it('Next week (due to odd week number)', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 13, 8).toISO())
  })

  it('Multiple cleaning times', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [
      { day: DayOfWeek.TUESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false },  // Next week
      { day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: true }, // This week <---
      { day: DayOfWeek.THURSDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false }  // Next week
    ]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 6, 8).toISO())
  })

  it('No match', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: false }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)).toEqual(null)
  })

  it('Current time, but next week', () => {
    const currentTime = DateTime.local(2023, 12, 6, 21) // Wednesday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 18, endHour: 22, appliesToEvenWeeks: true, appliesToOddWeeks: false }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 13, 18).toISO())
  })

  it('Cleaning completed recently', () => {
    const currentTime = DateTime.local(2023, 12, 6, 21) // Wednesday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false }]
    expect(calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 13, 10).toISO())
  })

})