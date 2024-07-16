import { DateTime } from "luxon";
import { calculateReminderDate } from "./calculateReminderDate";
import { calculateUnsocialHours } from "./unsocialHoursCalculationHelpers";
import { NotifUnsocialHours, UserInput } from "../types/types";

const handleOngoingCleaningStateUpdate = (
    nextCleaningTime: DateTime | null,
    notificationBuffer: number,
    setIsCleaningOngoing: React.Dispatch<React.SetStateAction<boolean>>,
    setNotifUnsocHours: React.Dispatch<React.SetStateAction<NotifUnsocialHours>>,
    setUserInput: React.Dispatch<React.SetStateAction<UserInput>>
) => {
    if (nextCleaningTime) {
        const notificationDate = calculateReminderDate(nextCleaningTime, notificationBuffer);
        const now = DateTime.now();
        const isCleaningOngoing = nextCleaningTime <= now
        setIsCleaningOngoing(isCleaningOngoing);
        calculateUnsocialHours(notificationDate, setNotifUnsocHours);

        setUserInput(prev => ({
            ...prev,
            notificationDate: notificationDate
        }));
    } else {
        alert("We have no next cleaning time available for this parking spot.");
    }
};

export { handleOngoingCleaningStateUpdate }