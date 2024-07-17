import { NotifUnsocialHours } from "../types/types"
import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../app/constants"
import { calculateReminderDate } from "./calculateReminderDate"
import { AugmentedParkingLocationData } from "@/parking-locations/types"
import { DateTime } from "luxon"


export const calculateUnsociableHoursSuggestionDaybeforeOrSameday = (
  notificationDate: DateTime,
  currentState: NotifUnsocialHours,
  location: AugmentedParkingLocationData
): NotifUnsocialHours => {
  if (location.nextCleaningTime) {

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
    return currentState
  }
}
