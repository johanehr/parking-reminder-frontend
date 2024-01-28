import { DateTime } from 'luxon'

export function calculateMaximumTime(maximumDays: number, currentTime: DateTime): DateTime {
  return currentTime.plus({ days: maximumDays })
}