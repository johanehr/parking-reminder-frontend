import { DateTime } from "luxon";
import { NotifUnsocialHours } from "../types/types";

interface IcalculateNotifUnsocialHours {
    newNotificationDate: DateTime | null,
    resetBuffer: boolean
}

export const calculateNotifUnsocialHours = (notifUnsocHours: NotifUnsocialHours, notifDate: DateTime | null, cleanDate: DateTime | null): IcalculateNotifUnsocialHours => {
    let newNotificationDate: DateTime | null = cleanDate;
    let resetBuffer = false;

    if (notifUnsocHours.acceptedUnsocialHours && notifDate) {
        if (notifUnsocHours.dayBefore) {
            newNotificationDate = notifDate.minus({ days: 1 }).set({ hour: 20, minute: 0, second: 0, millisecond: 0 });
        } else {
            newNotificationDate = notifDate.set({ hour: 20, minute: 0, second: 0, millisecond: 0 });
        }
    } else {
        resetBuffer = true;
    }

    return { newNotificationDate, resetBuffer };
};