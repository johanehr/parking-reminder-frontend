import { DateTime } from "luxon"
import { NotifUnsocialHours } from "../types/types"
import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../app/constants"


export const calculateUnsociableHoursSuggestionDaybeforeOrSameday = (
  notificationDate: DateTime | null,
  currentState: NotifUnsocialHours
): NotifUnsocialHours => {
  if (!notificationDate) {
    return currentState
  }
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
}
