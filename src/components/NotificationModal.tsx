import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { AugmentedParkingLocationData, NotifUnsocialHours, UserInput } from "@/parking-locations/types"
import { useEffect, useState } from "react"
import { DateTime } from "luxon"
import { Switch } from "./ui/switch"
import { calculateReminderDate } from "@/parking-locations/helper-functions/calculateReminderDate"
import { handleChange, handleSelectionChange, handleToggleChange } from "@/parking-locations/helper-functions/formHelpers"
import { z } from 'zod';
import axios from 'axios';
import { formSchema } from "@/models/formSchema"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Link } from "lucide-react"

interface INotificationModalProps {
  location: AugmentedParkingLocationData
}

export default function NotificationModal({ location }: INotificationModalProps) {
  const [notificationBuffer, setNotificationBuffer] = useState(1440)
  const [notifUnsocHours, setNotifUnsocHours] = useState(new NotifUnsocialHours(false, false, undefined))
  const [userInput, setUserInput] = useState(new UserInput(
    "",
    "",
    false,
    location.nextCleaningTime
  ))
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [isCleaningOngoing, setIsCleaningOngoing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      email: userInput.email,
      carNickname: userInput.carNickname,
      acceptTerms: userInput.acceptTerms,
      notificationDate: userInput.notificationDate?.toISO(),
    };

    const zodResult = formSchema.safeParse(data);
    if (!zodResult.success) {
      setErrors(zodResult.error.issues);
      console.log(errors)

      return;
    }

    setErrors([]);
    /*  const res = await axios.post('https://your-gcp-backend-url/api/submitForm', { data });
     console.log(res.data) */
  };

  const calculateSameDayOrDayBefore = () => {
    if (userInput.notificationDate) {
      if (userInput.notificationDate.hour >= 0 && userInput.notificationDate.hour <= 6) {
        setNotifUnsocHours((prev) => ({ ...prev, dayBefore: true }))
      } else if (userInput.notificationDate.hour >= 22) {
        setNotifUnsocHours((prev) => ({ ...prev, dayBefore: false }))
      }
    }
  }

  const resetNotificationSettings = () => {
    setNotifUnsocHours(new NotifUnsocialHours(false, false, undefined));
    setUserInput(new UserInput(
      "",
      "",
      false,
      location.nextCleaningTime
    ));
    setNotificationBuffer(1440); 
    setErrors([]);
    setIsCleaningOngoing(false);
  };

  const calculateNotifUnsocialHours = () => {
    if (notifUnsocHours.acceptedUnsocialHours && userInput.notificationDate) {
      if (notifUnsocHours.dayBefore) {
        let cleaningTimeDayBefore = userInput.notificationDate.minus({ days: 1 }).set({ hour: 20, minute: 0, second: 0, millisecond: 0 });
        setUserInput((prev) => ({ ...prev, notificationDate: cleaningTimeDayBefore }))
      } else if (!notifUnsocHours.dayBefore) {
        let cleaningTimeSameDay = userInput.notificationDate.set({ hour: 20, minute: 0, second: 0, millisecond: 0 });
        setUserInput((prev) => ({ ...prev, notificationDate: cleaningTimeSameDay }))
      }
    } else if (!notifUnsocHours.acceptedUnsocialHours) {
      setUserInput((prev) => ({ ...prev, notificationDate: location.nextCleaningTime }))
      setNotificationBuffer(1440)
    }
  }

  useEffect(() => {calculateNotifUnsocialHours()},[notifUnsocHours.acceptedUnsocialHours])

  useEffect(() => {
    calculateSameDayOrDayBefore();
  }, [notificationBuffer, userInput.notificationDate]);



  useEffect(() => {
    if (location.nextCleaningTime) {
      const notificationDate = calculateReminderDate(location.nextCleaningTime, notificationBuffer);
      const now = DateTime.now();
      if (notificationDate <= now) {
        setIsCleaningOngoing(true);
      } else {
        setIsCleaningOngoing(false);
      }


      const reminderHour = notificationDate.hour;
      if (reminderHour < 6 || reminderHour >= 21) {
        setNotifUnsocHours(prev => ({ ...prev, suggestUnsocialHours: true }));
      } else {
        setNotifUnsocHours(prev => ({ ...prev, suggestUnsocialHours: false }));
      }
      setUserInput(prev => ({
        ...prev,
        notificationDate: notificationDate
      }));

    }
    else {
      alert("we have no next cleaning time available for this parking spot")
    }
  }, [notificationBuffer]);

  const getErrorMessage = (path: string) => {
    const error = errors.find(error => error.path.includes(path));
    return error ? error.message : null;
  };



  useEffect(() => { console.log(userInput) }, [userInput])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Set reminder</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="space-y-2">
              <DialogHeader>
                <DialogTitle>Parking Location</DialogTitle>
                <DialogDescription>Set a reminder for: <span className="text-black">{location.name}</span></DialogDescription>
                <DialogDescription>You need to move your car by: <span className="text-black"> {location.nextCleaningTime?.toLocaleString(DateTime.DATETIME_MED)}</span></DialogDescription>
              </DialogHeader>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input onChange={(e) => handleChange(e, setUserInput, userInput)} name="email" id="email" placeholder="Enter email" />
                {errors.find(error => error.path.includes('email')) && <p className="text-xs text-red-500">{getErrorMessage('email')}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="car-nickname">Car Nickname</Label>
                <Input onChange={(e) => handleChange(e, setUserInput, userInput)} name="carNickname" id="car-nickname" placeholder="Enter car nickname" />
                {errors.find(error => error.path.includes('carNickname')) && <p className="text-xs text-red-500">{getErrorMessage('carNickname')}</p>}
              </div>
              <div className="grid gap-2">
                {!notifUnsocHours.acceptedUnsocialHours &&
                  <>
                    <Label htmlFor="notification-time">Notification Time</Label>
                    <Select name="notification-time" defaultValue="1440" onValueChange={
                      (e) => {
                        calculateSameDayOrDayBefore()
                        handleSelectionChange(e, setNotificationBuffer)
                      }
                    }>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">1 hour before</SelectItem>
                        <SelectItem value="180">3 hours before</SelectItem>
                        <SelectItem value="720">12 hours before</SelectItem>
                        <SelectItem value="1440">24 hours before</SelectItem>
                        <SelectItem value="2000">day before test hours before</SelectItem>

                        <SelectItem value="2880">48 hours before</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                }
                {notifUnsocHours.suggestUnsocialHours && (
                  <div className="flex space-x-2 items-center">
                    {!notifUnsocHours.acceptedUnsocialHours &&
                      <><div className="text-xs my-2">Your requested notification time lands during unsociable hours, on the <span className="font-bold">{userInput.notificationDate?.toLocaleString(DateTime.DATETIME_MED)}</span>, shall we notify you at <span className="font-bold">20:00</span> instead on the {notifUnsocHours.dayBefore ? "day before" : "same day"}?</div>
                        <Switch
                          id="unsocialHours"
                          defaultChecked={notifUnsocHours.acceptedUnsocialHours}
                          onCheckedChange={(e: boolean) => handleToggleChange(setNotifUnsocHours, e, "notif")}
                        />

                        <Label htmlFor="termsToggle">Accept {notifUnsocHours.dayBefore ? "reminder on the day before" : "early reminder"}</Label>
                      </>
                    }
                  </div>
                )}
              </div>

              {isCleaningOngoing ?
                <Alert variant="destructive">
                  <div className="h-4 w-4" />
                  <AlertTitle>Cleaning in Progress</AlertTitle>
                  <AlertDescription>
                    Cleaning is currently ongoing at the chosen location. A notification cannot be set at this time.
                  </AlertDescription>
                </Alert> :
                <DialogDescription className="mx-2">You will recieve your notification on:<br /> <div className="flex items-center justify-content"><span className="text-black">{userInput.notificationDate?.toLocaleString(DateTime.DATETIME_MED)}</span>
                    {notifUnsocHours.acceptedUnsocialHours &&
                      <Button onClick={resetNotificationSettings} variant={"outline"} className="text-red-600 ml-auto">
                        Reset
                      </Button>
                    }
                  </div>
                </DialogDescription>
              }
            </div>
            <DialogFooter className="flex items-center justify-content ">
              <h4 className="text-xs mr-auto">By continuing you are accepting the <br /><a className= "text-blue-500" href="/">terms and conditions</a></h4>
              <Button className="mb-4" disabled={isCleaningOngoing} type="submit">Set Reminder</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}