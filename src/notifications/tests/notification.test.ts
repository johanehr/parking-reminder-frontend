import { DateTime } from "luxon";
import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../app/constants";
import { handleOngoingCleaningStateUpdate } from "../helper-functions/handleOngoingCleaningStateUpdate";
import { isUnsocialHour } from "../helper-functions/unsocialHoursCalculationHelpers";


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