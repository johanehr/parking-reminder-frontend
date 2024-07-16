import { DateTime } from "luxon";
import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../app/constants";
import { handleOngoingCleaningStateUpdate } from "../helper-functions/handleOngoingCleaningStateUpdate";
import { isUnsocialHour } from "../helper-functions/unsocialHoursCalculationHelpers";
import { calculateUnsociableHoursSuggestionDaybeforeOrSameday } from "../helper-functions/calculateUnsocHoursSuggestionDaybeforeOrSameday";
import { NotifUnsocialHours } from "../types/types";


describe("Tests unsocialhours definition", () => {
  it("should return true for unsocial hours", () => {
    expect(isUnsocialHour(5)).toBe(true);
  });

  it("should return true for unsocial hours", () => {
    expect(isUnsocialHour(22)).toBe(true);
  });

  it("should return false for unsocial hours", () => {
    expect(isUnsocialHour(7)).toBe(false);
  });

  it("should return false for UNSOCIAL_HOUR_END", () => {
    expect(isUnsocialHour(UNSOCIAL_HOUR_END)).toBe(false); // 6am should be social
  });
  it("should return true for UNSOCIAL_HOUR_START", () => {
    expect(isUnsocialHour(UNSOCIAL_HOUR_START)).toBe(true); // 10pm should be unsocial
  });
})

describe("Tests whether the unsociable hours suggestion state is set to day before or after, or remains undefined", () => {
  let setNotifUnsocHours: jest.Mock;

  beforeEach(() => {
    setNotifUnsocHours = jest.fn();
  });

  it("should set dayBefore to true, as intial notif time is early morning", () => {
    const notificationDate = DateTime.now().plus({ days: 2 }).set({ hour: 3 }); // inital notif date is early morning unsociable hour

    calculateUnsociableHoursSuggestionDaybeforeOrSameday(notificationDate, setNotifUnsocHours);

    expect(setNotifUnsocHours).toHaveBeenCalledWith(expect.any(Function));

    const stateUpdater = setNotifUnsocHours.mock.calls[0][0];
    const prevState: NotifUnsocialHours = { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined };
    const newState = stateUpdater(prevState);

    expect(newState).toEqual(expect.objectContaining({ dayBefore: true }));
  });

  it("should set day before to false, as inital notif time is late evening", () => {
    const notificationDate = DateTime.now().plus({ days: 2 }).set({ hour: 22 }); // inital notif time is late evening, unsociable hour

    calculateUnsociableHoursSuggestionDaybeforeOrSameday(notificationDate, setNotifUnsocHours);

    expect(setNotifUnsocHours).toHaveBeenCalledWith(expect.any(Function));

    const stateUpdater = setNotifUnsocHours.mock.calls[0][0];
    const prevState: NotifUnsocialHours = { suggestUnsocialHours: false, acceptedUnsocialHours: false, dayBefore: undefined };
    const newState = stateUpdater(prevState);

    expect(newState).toEqual(expect.objectContaining({ dayBefore: false }));
  });

  it("should not update dayBefore as inital notif time is sociable", () => {
    const notificationDate = DateTime.now().plus({ days: 2 }).set({ hour: 12 }); // Sociable hour!

    calculateUnsociableHoursSuggestionDaybeforeOrSameday(notificationDate, setNotifUnsocHours);

    expect(setNotifUnsocHours).not.toHaveBeenCalled();
  });
});



describe("Tests if cleaning is ongoing, or within next 24h, and updates state accordingly", () => {
  //testing to see if the state updaters are being called with the correct value.
  let setIsCleaningOngoing: jest.Mock;
  let setNotifUnsocHours: jest.Mock;
  let setUserInput: jest.Mock;

  beforeEach(() => {
    setIsCleaningOngoing = jest.fn();
    setNotifUnsocHours = jest.fn();
    setUserInput = jest.fn();
  });

  it("should set isCleaningOngoing to true when notification date is in the past, and false when cleaning time in future", () => {
    const cleaningTime = DateTime.now().minus({ days: 1 }); // Past cleaning time
    const notificationBuffer = 1440;

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setIsCleaningOngoing, setNotifUnsocHours, setUserInput);

    // Checks to see state updater is called correctly (true in this case)    
    expect(setIsCleaningOngoing).toHaveBeenCalledWith(true);
  });

  it("should set isCleaningOngoing to true when notification date is in the past", () => {
    const cleaningTime = DateTime.now(); // Cleaning time same as current time
    const notificationBuffer = 1440;

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setIsCleaningOngoing, setNotifUnsocHours, setUserInput);
    expect(setIsCleaningOngoing).toHaveBeenCalledWith(true);
  });




  it("should set isCleaningOngoing to true when notification date is in the future, however within the next 24h", () => {
    const cleaningTime = DateTime.now().plus({ days: 1 }); // Future cleaning time, however within the next 24h, therefore leaving the notif obsolete.
    const notificationBuffer = 1440;

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setIsCleaningOngoing, setNotifUnsocHours, setUserInput);
    expect(setIsCleaningOngoing).toHaveBeenCalledWith(true);
  });

  it("should set isCleaningOngoing to false when notification date is in the future", () => {
    const cleaningTime = DateTime.now().plus({ days: 2 }); // Future cleaning time, allow notification to be set.
    const notificationBuffer = 1440;

    handleOngoingCleaningStateUpdate(cleaningTime, notificationBuffer, setIsCleaningOngoing, setNotifUnsocHours, setUserInput);
    expect(setIsCleaningOngoing).toHaveBeenCalledWith(false);
  });
});