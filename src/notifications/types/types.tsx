import { DateTime } from "luxon"


export interface UserInput {
  email: string;
  carNickname: string;
  notificationDate: DateTime | null;
}
export interface NotifUnsocialHours {
  suggestUnsocialHours: boolean;
  acceptedUnsocialHours: boolean;
  dayBefore?: boolean;
}
export interface CombinedState {
  notificationBuffer: number;
  notifUnsocHours: NotifUnsocialHours;
  userInput: UserInput;
  notificationFiltered: boolean;
  notificationNotPossible: boolean;
}