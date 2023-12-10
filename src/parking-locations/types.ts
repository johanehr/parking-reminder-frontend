export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7
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

export type AugmentedParkingLocationData = ParkingLocationData & { color: string }

export type CleaningTime = {
  day: DayOfWeek
  startHour: number,
  endHour: number,
  appliesToEvenWeeks: boolean,
  appliesToOddWeeks: boolean
}