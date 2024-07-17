import { DateTime } from "luxon"
import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../app/constants"
import { handleOngoingCleaningStateUpdate } from "../helper-functions/handleOngoingCleaningStateUpdate"
import { isUnsocialHour } from "../helper-functions/unsocialHoursCalculationHelpers"
import { calculateUnsociableHoursSuggestionDaybeforeOrSameday } from "../helper-functions/calculateUnsocHoursSuggestionDaybeforeOrSameday"
import { NotifUnsocialHours } from "../types/types"
import { calculateNotifUnsocialHours } from "../helper-functions/calculateNotifTimeUnsocHours"


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

describe("Tests whether the unsociable hours suggestion state is set to day before or after, or remains undefined", () => {
  let setNotifUnsocHours: jest.Mock

  beforeEach(() => {
    setNotifUnsocHours = jest.fn()
  })

  it("should set dayBefore to true, as initial notif time is early morning", () => {
    const notificationDate = DateTime.now().plus({ days: 2 }).set({ hour: 3 }) // initial notif date is early morning unsociable hour
    const currentState: NotifUnsocialHours = { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined }

    const newState = calculateUnsociableHoursSuggestionDaybeforeOrSameday(notificationDate, currentState)

    expect(newState).toEqual(expect.objectContaining({ dayBefore: true }))
  })

  it("should set day before to false, as initial notif time is late evening", () => {
    const notificationDate = DateTime.now().plus({ days: 2 }).set({ hour: 22 }) // initial notif time is late evening, unsociable hour
    const currentState: NotifUnsocialHours = { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined }

    const newState = calculateUnsociableHoursSuggestionDaybeforeOrSameday(notificationDate, currentState)

    expect(newState).toEqual(expect.objectContaining({ dayBefore: false }))
  })

  it("should not update dayBefore as initial notif time is sociable", () => {
    const notificationDate = DateTime.now().plus({ days: 2 }).set({ hour: 12 }) // Sociable hour!
    const currentState: NotifUnsocialHours = { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined }

    const newState = calculateUnsociableHoursSuggestionDaybeforeOrSameday(notificationDate, currentState)

    expect(newState).toEqual(currentState)
  })
})


describe("Tests if cleaning is ongoing and updates state accordingly", () => {
  //testing to see if the state updaters are being called with the correct value.
  let setIsCleaningOngoing: jest.Mock
  let setNotifUnsocHours: jest.Mock
  let setUserInput: jest.Mock

  beforeEach(() => {
    setIsCleaningOngoing = jest.fn()
    setNotifUnsocHours = jest.fn()
    setUserInput = jest.fn()
  })

  it("should set isCleaningOngoing to true when notification date is in the past, and false when cleaning time in future", () => {
    const cleaningTime = DateTime.now().minus({ days: 1 }) // Past cleaning time
    const notificationBuffer = 1440

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setIsCleaningOngoing, setNotifUnsocHours, setUserInput)

    // Checks to see state updater is called correctly (true in this case)    
    expect(setIsCleaningOngoing).toHaveBeenCalledWith(true)
  })

  it("should set isCleaningOngoing to true when notification date is in the past", () => {
    const cleaningTime = DateTime.now() // Cleaning time same as current time
    const notificationBuffer = 1440

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setIsCleaningOngoing, setNotifUnsocHours, setUserInput)
    expect(setIsCleaningOngoing).toHaveBeenCalledWith(true)
  })




  describe("calculateNotif time for unsocial hours", () => {
    it("should return notification date set to 20:00 the day before if dayBefore is true and acceptedUnsocialHours is true", () => {
      const notifUnsocHours: NotifUnsocialHours = { acceptedUnsocialHours: true, dayBefore: true, suggestUnsocialHours: true }
      const notifDate = DateTime.now().plus({ days: 3 }).set({ hour: 23 }) // Unsociable hour for clarity although doesn't effect test
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
      expect(resetBuffer).toBe(true) //resets to 24h before the cleaning time, and therefore resets UI for notif setting.
    })
  })


  it("should set isCleaningOngoing to false when notification date is in the future", () => {
    const cleaningTime = DateTime.now().plus({ days: 2 }) // Future cleaning time, allow notification to be set.
    const notificationBuffer = 1440

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setIsCleaningOngoing, setNotifUnsocHours, setUserInput)
    expect(setIsCleaningOngoing).toHaveBeenCalledWith(false)
  })
})