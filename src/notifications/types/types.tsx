import { DateTime } from "luxon";

export interface UserInput {
  email: string;
  carNickname: string;
  notificationDate: DateTime | null;
}

export const initialUserInput = (nextCleaningTime: DateTime | null): UserInput => ({
  email: "",
  carNickname: "",
  notificationDate: nextCleaningTime
});
  
  export interface NotifUnsocialHours {
    suggestUnsocialHours: boolean;
    acceptedUnsocialHours: boolean;
    dayBefore?: boolean;
  }

  export const initialNotifUnsocHours: NotifUnsocialHours = {
    suggestUnsocialHours: false,
    acceptedUnsocialHours: false,
    dayBefore: undefined
  };
