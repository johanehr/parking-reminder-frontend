import { DateTime } from "luxon"
import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../app/constants"
import { handleOngoingCleaningStateUpdate } from "../helper-functions/handleOngoingCleaningStateUpdate"
import { isUnsocialHour } from "../helper-functions/unsocialHoursCalculationHelpers"
import { calculateUnsociableHoursSuggestionDaybeforeOrSameday } from "../helper-functions/calculateUnsocHoursSuggestionDaybeforeOrSameday"
import { CombinedState, NotifUnsocialHours } from "../types/types"
import { calculateNotifUnsocialHours } from "../helper-functions/calculateNotifTimeUnsocHours"
import { AugmentedParkingLocationData, DayOfWeek, MonthOfYear } from "../../parking-locations/types"


describe("Tests unsocialhours definition", () => {
  it("should return true for unsocial hours", () => {
    expect(isUnsocialHour(5)).toBe(true)
  })

  it("should return true for unsocial hours", () => {
    expect(isUnsocialHour(22)).toBe(true)
  })

  it("should return false for unsocial hours", () => {
    expect(isUnsocialHour(7)).toBe(false)
  })

  it("should return false for UNSOCIAL_HOUR_END", () => {
    expect(isUnsocialHour(UNSOCIAL_HOUR_END)).toBe(false) // 6am should be social
  })
  it("should return true for UNSOCIAL_HOUR_START", () => {
    expect(isUnsocialHour(UNSOCIAL_HOUR_START)).toBe(true) // 10pm should be unsocial
  })
})

describe("calculateUnsociableHoursSuggestionDaybeforeOrSameday", () => {
  const mockLocation: AugmentedParkingLocationData = {
    name: "Test Location",
    parkingRules: {
      cleaningTimes: [
        { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
      ],
      maximum: { days: 14 }
    },
    path: [
      { "lat": 59.382017, "lng": 18.027133 },
      { "lat": 59.382043, "lng": 18.027234 },
      { "lat": 59.382087, "lng": 18.027425 },
      { "lat": 59.382130, "lng": 18.027687 },
      { "lat": 59.382115, "lng": 18.027763 },
      { "lat": 59.382078, "lng": 18.027576 },
      { "lat": 59.382022, "lng": 18.027316 },
      { "lat": 59.381963, "lng": 18.027213 },
    ],
    nextCleaningTime: DateTime.now().plus({ days: 2 }),
    color: "Test"
  }

  it("should set dayBefore to true when notification time is early morning", () => {
    const notificationDate = DateTime.now().set({ hour: UNSOCIAL_HOUR_END - 1 })
    const currentState: NotifUnsocialHours = { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined }

    const newState = calculateUnsociableHoursSuggestionDaybeforeOrSameday(notificationDate, currentState, mockLocation)

    expect(newState).toEqual(expect.objectContaining({ dayBefore: true }))
  })

  it("should set dayBefore to false when notification time is late evening", () => {
    const notificationDate = DateTime.now().set({ hour: UNSOCIAL_HOUR_START + 1 })
    const currentState: NotifUnsocialHours = { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined }

    const newState = calculateUnsociableHoursSuggestionDaybeforeOrSameday(notificationDate, currentState, mockLocation)

    expect(newState).toEqual(expect.objectContaining({ dayBefore: false }))
  })

  it("should not update dayBefore when notification time is during sociable hours", () => {
    const notificationDate = DateTime.now().set({hour: 12})
    const currentState: NotifUnsocialHours = { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined }

    const newState = calculateUnsociableHoursSuggestionDaybeforeOrSameday(notificationDate, currentState, mockLocation)

    expect(newState).toEqual(currentState)
  })
})


describe("Tests if cleaning is ongoing and updates the two different accordingly", () => {
  let setState: jest.Mock

  beforeEach(() => {
    setState = jest.fn()
  })

  it("should set notificationNotPossible to true when nextCleaningTime is in the past", () => {
    const cleaningTime = DateTime.now().minus({ days: 1 }) // Past cleaning time
    const notificationBuffer = 1440

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setState)

    expect(setState).toHaveBeenCalledWith(expect.any(Function))
    const stateUpdater = setState.mock.calls[0][0]
    const prevState: CombinedState = {
      notificationBuffer: 1440,
      notifUnsocHours: { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined },
      userInput: { email: "", carNickname: "", notificationDate: DateTime.now() },
      notificationFiltered: false,
      notificationNotPossible: false,
    }
    const newState = stateUpdater(prevState)

    expect(newState).toEqual(expect.objectContaining({ notificationNotPossible: true }))
  })

  it("should set notificationFiltered to true when nextCleaningTime is within the next 24 hours", () => {
    const cleaningTime = DateTime.now().plus({ hours: 12 }) // Cleaning time within the next 24 hours
    const notificationBuffer = 1440

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setState)

    expect(setState).toHaveBeenCalledWith(expect.any(Function))
    const stateUpdater = setState.mock.calls[0][0]
    const prevState: CombinedState = {
      notificationBuffer: 1440,
      notifUnsocHours: { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined },
      userInput: { email: "", carNickname: "", notificationDate: DateTime.now() },
      notificationFiltered: false,
      notificationNotPossible: false,
    }
    const newState = stateUpdater(prevState)

    expect(newState).toEqual(expect.objectContaining({ notificationFiltered: true }))
  })

  it("should set both notificationNotPossible and notificationFiltered to false when nextCleaningTime is in the future (more than 24 hours)", () => {
    const cleaningTime = DateTime.now().plus({ days: 2 }) // Future cleaning time, more than 24 hours
    const notificationBuffer = 1440

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setState)

    expect(setState).toHaveBeenCalledWith(expect.any(Function))
    const stateUpdater = setState.mock.calls[0][0]
    const prevState: CombinedState = {
      notificationBuffer: 1440,
      notifUnsocHours: { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined },
      userInput: { email: "", carNickname: "", notificationDate: DateTime.now() },
      notificationFiltered: false,
      notificationNotPossible: false,
    }
    const newState = stateUpdater(prevState)

    expect(newState).toEqual(expect.objectContaining({ notificationFiltered: false, notificationNotPossible: false }))
  })
})


describe("calculateNotifUnsocialHours", () => {
  it("should return notification date set to 20:00 the day before if dayBefore is true and acceptedUnsocialHours is true", () => {
    const notifUnsocHours: NotifUnsocialHours = { acceptedUnsocialHours: true, dayBefore: true, suggestUnsocialHours: true }
    const notifDate = DateTime.now().plus({ days: 3 }).set({ hour: 23 }) // Unsociable hour for clarity although doesn't affect test
    const cleanDate = DateTime.now().plus({ days: 4 }).set({ hour: 10 }) // Cleaning date the day after scheduled notif

    const { newNotificationDate, resetBuffer } = calculateNotifUnsocialHours(notifUnsocHours, notifDate, cleanDate)

    const expectedDate = notifDate.minus({ days: 1 }).set({ hour: 20, minute: 0, second: 0, millisecond: 0 })

    expect(newNotificationDate).toEqual(expectedDate)
    expect(resetBuffer).toBe(false)
  })

  it("should return notification date set to 20:00 the same day if dayBefore is false and acceptedUnsocialHours is true", () => {
    const notifUnsocHours: NotifUnsocialHours = { acceptedUnsocialHours: true, dayBefore: false, suggestUnsocialHours: true }
    const notifDate = DateTime.now().plus({ days: 3 }).set({ hour: 23 })
    const cleanDate = DateTime.now().plus({ days: 4 }).set({ hour: 10 })

    const { newNotificationDate, resetBuffer } = calculateNotifUnsocialHours(notifUnsocHours, notifDate, cleanDate)

    const expectedDate = notifDate.set({ hour: 20, minute: 0, second: 0, millisecond: 0 })

    expect(newNotificationDate).toEqual(expectedDate)
    expect(resetBuffer).toBe(false)
  })

  it("should return cleanDate and resetBuffer as true if acceptedUnsocialHours is false", () => {
    const notifUnsocHours: NotifUnsocialHours = { acceptedUnsocialHours: false, dayBefore: false, suggestUnsocialHours: false }
    const notifDate = DateTime.now().plus({ days: 3 }).set({ hour: 23 })
    const cleanDate = DateTime.now().plus({ days: 4 }).set({ hour: 10 })

    const { newNotificationDate, resetBuffer } = calculateNotifUnsocialHours(notifUnsocHours, notifDate, cleanDate)

    expect(newNotificationDate).toEqual(cleanDate)
    expect(resetBuffer).toBe(true) // resets to 24h before the cleaning time, and therefore resets UI for notif setting.
  })
})