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

export type ParkingLocationData = {
  name: string;
  parkingRules: ParkingRules
  path: { lat: number, lng: number }[];
}

export type ParkingRules = {
  cleaningTimes: CleaningTime[],
  maximum: { days: number }
}

export type AugmentedParkingLocationData = ParkingLocationData & {
  color: string;
  nextCleaningTime: DateTime | null;
}

export type CleaningTime = {
  day: DayOfWeek
  startHour: number,
  endHour: number,
  appliesToEvenWeeks: boolean,
  appliesToOddWeeks: boolean,
  noCleaningMonths: MonthOfYear[]
}

interface UserInputParams {
  email: string;
  carNickname: string;
  notificationDate: DateTime | null;
}

export class UserInput {
  public email: string;
  public carNickname: string;
  public notificationDate: DateTime | null;

  constructor({ email, carNickname, notificationDate }: UserInputParams) {
    this.email = email;
    this.carNickname = carNickname;
    this.notificationDate = notificationDate

  }
}

interface NotifUnsocialHoursParams {
  suggestUnsocialHours: boolean;
  acceptedUnsocialHours: boolean;
  dayBefore?: boolean;
}

export class NotifUnsocialHours {
  public suggestUnsocialHours: boolean;
  public acceptedUnsocialHours: boolean;
  public dayBefore?: boolean;

  constructor({ suggestUnsocialHours, acceptedUnsocialHours, dayBefore }: NotifUnsocialHoursParams) {
    this.suggestUnsocialHours = suggestUnsocialHours;
    this.acceptedUnsocialHours = acceptedUnsocialHours;
    this.dayBefore = dayBefore;
  }
}
