import { DateTime } from "luxon";
import { NotifUnsocialHours } from "../types/types";
import { UNSOCIAL_HOUR_END, UNSOCIAL_HOUR_START } from "../../../app/constants";

const isUnsocialHour = (hour: number): boolean => {
    return hour < UNSOCIAL_HOUR_END || hour >= UNSOCIAL_HOUR_START;
};

const calculateUnsocialHours = (
    notificationDate: DateTime,
    setNotifUnsocHours: React.Dispatch<React.SetStateAction<NotifUnsocialHours>>
) => {
    const reminderHour = notificationDate.hour;
    if (isUnsocialHour(reminderHour)) {
        setNotifUnsocHours((prev) => ({ ...prev, suggestUnsocialHours: true }));
    } else {
        setNotifUnsocHours((prev) => ({ ...prev, suggestUnsocialHours: false }));
    }
};

export { isUnsocialHour, calculateUnsocialHours }