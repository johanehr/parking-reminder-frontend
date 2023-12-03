import { DateTime } from "luxon";
import * as locations from "./locations";
import { DayOfWeek, ParkingLocationData } from "./types";

beforeEach(() => {
  jest.resetAllMocks()
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

  // TODO: Mock isn't used in call
  it('getAppropriateDisplayColor - short time', () => {
    jest.spyOn(locations, 'calculateNextCleaningTime').mockReturnValue(DateTime.fromISO('2023-12-05T10:00:00.000Z'))
    const time = DateTime.fromISO('2023-12-04T23:00:00.000Z'); // Monday evening of odd week

    expect(locations.getAppropriateDisplayColor(fakeParkingData, time)).toBe('red')
  })

  // TODO: Mock isn't used in call
  it.skip('getAppropriateDisplayColor - long time', () => {
    jest.spyOn(locations, 'calculateNextCleaningTime').mockReturnValue(DateTime.fromISO('2024-12-04T23:00:00.000Z'))
    const time = DateTime.fromISO('2023-12-04T23:00:00.000Z'); // Monday evening of odd week

    expect(locations.getAppropriateDisplayColor(fakeParkingData, time)).toBe('green')
  })
})

describe('calculateNextCleaningTime', () => {

  it('Next day', () => {
    const time = DateTime.fromISO('2023-12-04T23:00:00.000Z'); // Monday evening of odd week
    expect(locations.calculateNextCleaningTime(fakeParkingData.parkingRules.cleaningTimes, time)).toBe(DateTime.fromISO('2023-12-05T10:00:00.000Z'))
  })

  it.todo('Next week')
  it.todo('Earlier this week')
  it.todo('Later today')
  it.todo('Earlier today')
})