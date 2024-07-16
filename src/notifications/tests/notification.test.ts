import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../app/constants";
import { isUnsocialHour } from "../helper-functions/unsocialHoursCalculationHelpers";


describe("Tests unsocialhours definition", () => {
  it("should return true for unsocial hours", () => {
    expect(isUnsocialHour(5)).toBe(true);
    expect(isUnsocialHour(UNSOCIAL_HOUR_START)).toBe(true);
  });

  it("should return false for social hours", () => {
    expect(isUnsocialHour(7)).toBe(false);
    expect(isUnsocialHour(UNSOCIAL_HOUR_END)).toBe(false);
  });
});