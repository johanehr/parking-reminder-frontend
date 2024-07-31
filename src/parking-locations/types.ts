import { DateTime } from "luxon"

export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7
}

export enum MonthOfYear {
  JANUARY = 1,
  FEBRUARY = 2,
  MARCH = 3,
  APRIL = 4,
  MAY = 5,
  JUNE = 6,
  JULY = 7,
  AUGUST = 8,
  SEPTEMBER = 9,
  OCTOBER = 10,
  NOVEMBER = 11,
  DECEMBER = 12
}
export type AugmentedParkingLocationData = ParkingLocationData & {
  color: string;
  nextCleaningTime: DateTime | null;
}

export type ParkingLocationData = {
  name: string;
  parkingRules: ParkingRules
  path: { lat: number, lng: number }[];
}

export type ParkingRules = {
  cleaningTimes: CleaningTime[],
  maximum: { days: number }
}


export type CleaningTime = {
  day: DayOfWeek
  startHour: number,
  endHour: number,
  appliesToEvenWeeks: boolean,
  appliesToOddWeeks: boolean,
  noCleaningMonths: MonthOfYear[]
}


export type RecievedParkingLocationData = {
  name: string;
  parkingRules: RecievedParkingRules
  path: { lat: number, lng: number }[];
}

export type RecievedParkingRules = {
  cleaningTimes: RecievedCleaningTime[],
  maximum: { days: number }
}

export type RecievedCleaningTime = {
  day: string,
  startHour: number,
  endHour: number,
  appliesToEvenWeeks: boolean,
  appliesToOddWeeks: boolean,
  noCleaningMonths: string[]
}


