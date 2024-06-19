import { DateTime } from "luxon";

export function calculateReminderDate(nextCleaningTime: DateTime, notificationBuffer: number): DateTime {
  const reminderDate = nextCleaningTime.minus({ minutes: notificationBuffer });
  return reminderDate;
}