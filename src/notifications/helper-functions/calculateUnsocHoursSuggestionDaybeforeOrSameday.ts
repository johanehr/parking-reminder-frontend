import { DateTime } from "luxon"
import { NotifUnsocialHours } from "../types/types"
import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../app/constants"
import { calculateReminderDate } from "./calculateReminderDate"
import { AugmentedParkingLocationData } from "@/parking-locations/types"


export const calculateUnsociableHoursSuggestionDaybeforeOrSameday = (
  value: string,
  currentState: NotifUnsocialHours,
  location: AugmentedParkingLocationData
): NotifUnsocialHours => {
  const newBuffer = parseInt(value)
  if (location.nextCleaningTime) {
    const notificationDate = calculateReminderDate(location.nextCleaningTime, newBuffer)
    let dayBefore = currentState.dayBefore

    if (notificationDate.hour <= UNSOCIAL_HOUR_END) {
      dayBefore = true

    } else if (notificationDate.hour >= UNSOCIAL_HOUR_START) {
      dayBefore = false
    }
    return {
      ...currentState,
      dayBefore
    }
  } else {
    return currentState;
  }
}
