import { DateTime } from "luxon";

interface UserInputParams {
    email: string;
    carNickname: string;
    notificationDate: DateTime | null;
  }
  
  export class UserInput {
    public email: string;
    public carNickname: string;
    public notificationDate: DateTime | null;
  
    constructor({ email, carNickname, notificationDate }: UserInputParams) {
      this.email = email;
      this.carNickname = carNickname;
      this.notificationDate = notificationDate
  
    }
  }
  
  interface NotifUnsocialHoursParams {
    suggestUnsocialHours: boolean;
    acceptedUnsocialHours: boolean;
    dayBefore?: boolean;
  }
  
  export class NotifUnsocialHours {
    public suggestUnsocialHours: boolean;
    public acceptedUnsocialHours: boolean;
    public dayBefore?: boolean;
  
    constructor({ suggestUnsocialHours, acceptedUnsocialHours, dayBefore }: NotifUnsocialHoursParams) {
      this.suggestUnsocialHours = suggestUnsocialHours;
      this.acceptedUnsocialHours = acceptedUnsocialHours;
      this.dayBefore = dayBefore;
    }
  }