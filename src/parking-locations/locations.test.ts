import { DateTime } from "luxon";
import ParkingLocationHelpers from "./locations";
import { DayOfWeek, ParkingLocationData } from "./types";

beforeEach(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  jest.clearAllMocks()
})

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
    expect(ParkingLocationHelpers.getAppropriateDisplayColor(hours)).toBe(color)
  })
})

describe('calculateMaximumTime', () => {
  it('Returns correct maximum time', () => {
    expect(ParkingLocationHelpers.calculateMaximumTime(7, DateTime.fromISO('2024-01-01T12:34:56.000Z'))).toEqual(DateTime.fromISO('2024-01-08T12:34:56.000Z'))
  })
})

describe('calculateNextCleaningTime', () => {

  it('Currently on-going', () => {
    const currentTime = DateTime.local(2023, 12, 4, 12) // Monday noon of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 0, endHour: 23, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    expect(ParkingLocationHelpers.calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toBe(DateTime.local(2023, 12, 4, 12).toISO())
  })

  it('Later today', () => {
    const currentTime = DateTime.local(2023, 12, 4, 8) // Monday morning of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 15, endHour: 18, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    expect(ParkingLocationHelpers.calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toBe(DateTime.local(2023, 12, 4, 15).toISO())
  })

  it('This week', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true }]
    expect(ParkingLocationHelpers.calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 6, 8).toISO())
  })

  it('Next week (due to passed weekday)', () => {
    const currentTime = DateTime.local(2023, 12, 5, 23) // Tuesday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 10, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    expect(ParkingLocationHelpers.calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 11, 10).toISO())
  })

  it('Next week (due to passed time earlier today)', () => {
    const currentTime = DateTime.local(2023, 12, 4, 15) // Monday afternoon of odd week
    const cleaningTimes = [{ day: DayOfWeek.MONDAY, startHour: 10, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true }]
    expect(ParkingLocationHelpers.calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 11, 10).toISO())
  })

  it('Next week (due to odd week number)', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false }]
    expect(ParkingLocationHelpers.calculateNextCleaningTime(cleaningTimes, currentTime)?.toISO()).toEqual(DateTime.local(2023, 12, 13, 8).toISO())
  })

  it('No match', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const cleaningTimes = [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: false }]
    expect(ParkingLocationHelpers.calculateNextCleaningTime(cleaningTimes, currentTime)).toEqual(null)
  })
})