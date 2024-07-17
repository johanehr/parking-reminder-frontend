import { DateTime } from "luxon"
import { NotifUnsocialHours } from "../types/types"
import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../app/constants"

export const isUnsocialHour = (hour: number): boolean => {
  return hour < UNSOCIAL_HOUR_END || hour >= UNSOCIAL_HOUR_START
}

export const calculateUnsocialHours = (
  notificationDate: DateTime,
  notifUnsocHours: NotifUnsocialHours
): NotifUnsocialHours => {
  const reminderHour = notificationDate.hour
  const updatedNotifUnsocHours = { ...notifUnsocHours }
  if (isUnsocialHour(reminderHour)) {
    updatedNotifUnsocHours.suggestUnsocialHours = true
  } else {
    updatedNotifUnsocHours.suggestUnsocialHours = false
  }
  return updatedNotifUnsocHours
}