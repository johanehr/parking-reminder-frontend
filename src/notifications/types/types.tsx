import { DateTime } from "luxon"


export interface UserInput {
  phone: string;
  carNickname: string;
  notificationDate: DateTime | null;
  acceptTerms: boolean;
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
