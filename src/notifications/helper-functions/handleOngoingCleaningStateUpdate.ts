import { DateTime } from "luxon"
import { CombinedState } from "../types/types"
import { calculateUnsocialHours } from "./unsocialHoursCalculationHelpers"
import { calculateReminderDate } from "./calculateReminderDate"

const handleOngoingCleaningStateUpdate = (
  nextCleaningTime: DateTime | null,
  notificationBuffer: number,
  setState: React.Dispatch<React.SetStateAction<CombinedState>>,
) => {
  if (nextCleaningTime) {
    const notificationDate = calculateReminderDate(nextCleaningTime, notificationBuffer)
    const now = DateTime.now()
    const isCleaningOngoing = nextCleaningTime <= now.plus({ minutes: notificationBuffer })
    
    setState((prevState) => {
      const updatedNotifUnsocHours = calculateUnsocialHours(notificationDate, prevState.notifUnsocHours)
      return {
        ...prevState,
        isCleaningOngoing,
        notifUnsocHours: updatedNotifUnsocHours,
        userInput: { ...prevState.userInput, notificationDate }
      }
    })
  } else {
    alert("We have no next cleaning time available for this parking spot.")
  }
}

export { handleOngoingCleaningStateUpdate }