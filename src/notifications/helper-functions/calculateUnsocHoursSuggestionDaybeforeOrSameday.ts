import { DateTime } from "luxon"
import { NotifUnsocialHours } from "../types/types"

export const calculateUnsociableHoursSuggestionDaybeforeOrSameday = (notificationDate: DateTime<boolean> | null, setNotifUnsocHours: React.Dispatch<React.SetStateAction<NotifUnsocialHours>>) => {
    if (notificationDate) {
        if (notificationDate.hour >= 0 && notificationDate.hour <= 6) {
            setNotifUnsocHours((prev) => ({ ...prev, dayBefore: true }))
        } else if (notificationDate.hour >= 22) {
            setNotifUnsocHours((prev) => ({ ...prev, dayBefore: false }))
        }
    }
}