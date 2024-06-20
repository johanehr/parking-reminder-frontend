import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { AugmentedParkingLocationData, NotifDayBefore, UserInput } from "@/parking-locations/types"
import { useEffect, useState } from "react"
import { DateTime } from "luxon"
import { Switch } from "./ui/switch"
import { calculateReminderDate } from "@/parking-locations/helper-functions/calculateReminderDate"
import { handleChange, handleSelectionChange, handleToggleChange } from "@/parking-locations/helper-functions/formHelpers"
import { z } from 'zod';
import axios from 'axios';

import { formSchema } from "@/models/formSchema"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface INotificationModalProps {
  location: AugmentedParkingLocationData
}

export default function NotificationModal({ location }: INotificationModalProps) {
  const [notificationBuffer, setNotificationBuffer] = useState(30)
  const [notifDayBefore, setNotifDayBefore] = useState(new NotifDayBefore(false, false))
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



  //TODO look at edge cases where cleaning is ongoing. 

  const calculateNotifToDayBefore = () => {
    if (notifDayBefore.acceptedNotifDayBefore && userInput.notificationDate) {
      let cleaningTimeDayBefore = userInput.notificationDate.minus({ days: 1 }).set({ hour: 20, minute: 0, second: 0, millisecond: 0 });
      setUserInput((prev) => ({ ...prev, notificationDate: cleaningTimeDayBefore }))
    } else if (!notifDayBefore.acceptedNotifDayBefore) {
      setUserInput((prev) => ({ ...prev, notificationDate: location.nextCleaningTime }))
      setNotificationBuffer(30)
    }
  }

  useEffect(() => { calculateNotifToDayBefore() }, [notifDayBefore.acceptedNotifDayBefore])

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
        setNotifDayBefore(prev => ({ ...prev, suggestNotifDayBefore: true }));
      } else {
        setNotifDayBefore(prev => ({ ...prev, suggestNotifDayBefore: false }));
      }
      setUserInput(prev => ({
        ...prev,
        notificationDate: notificationDate
      }));

    }
    else {
      alert("we have no next cleaning time available for this parking spot") //TODO FJ FIX EDGECASE LOGIC NEXTCLEANING TIME IS NULL
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
                {!notifDayBefore.acceptedNotifDayBefore &&
                  <>
                    < Label htmlFor="notification-time">Notification Time</Label>
                    <Select name="notification-time" defaultValue="30" onValueChange={(e) => handleSelectionChange(e, setNotificationBuffer)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes before</SelectItem>
                        <SelectItem value="30">30 minutes before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                        <SelectItem value="120">2 hours before</SelectItem>
                        <SelectItem value="360">6 hours before</SelectItem>
                        <SelectItem value="720">12 hours before</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                }
                {notifDayBefore.suggestNotifDayBefore && (
                  <div className="flex space-x-2 items-center">
                    {notifDayBefore.acceptedNotifDayBefore ? <p className="text-xs my-2"> We will notify you the day before you need to move, <span className="font-bold">at 20:00 on the {location.nextCleaningTime?.toLocaleString(DateTime.DATE_SHORT)}</span> as requested </p> : <p className="text-xs my-2">Your requested notification time lands is in unsociable hours, on the <span className="font-bold">{userInput.notificationDate?.toLocaleString(DateTime.DATETIME_MED)}</span>, shall we notify you the day before at 20:00 instead?</p>}
                    <Switch
                      id="notifDayBefore"
                      defaultChecked={notifDayBefore.acceptedNotifDayBefore}
                      onCheckedChange={(e: boolean) => handleToggleChange(setNotifDayBefore, e, "notif")}
                    />
                    <Label htmlFor="termsToggle">Accept day before reminder</Label>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 items-center">
                <Switch
                  id="acceptTerms"
                  defaultChecked={userInput.acceptTerms}
                  onCheckedChange={(e: boolean) => handleToggleChange(setUserInput, e, "terms")}
                />
                <Label htmlFor="termsToggle">Accept terms</Label>
                {errors.find(error => error.path.includes('acceptTerms')) && <p className="text-xs text-red-500">{getErrorMessage('acceptTerms')}</p>}
              </div>
              {isCleaningOngoing ?
                <Alert variant="destructive">
                  <div className="h-4 w-4" />
                  <AlertTitle>Cleaning in Progress</AlertTitle>
                  <AlertDescription>
                    Cleaning is currently ongoing at the chosen location. A notification cannot be set at this time.
                  </AlertDescription>
                </Alert> :
                <DialogDescription className="mx-2">You will recieve a notification to move on:<br /><span className="text-black">{userInput.notificationDate?.toLocaleString(DateTime.DATETIME_MED)}</span></DialogDescription>
              }
            </div>
            <DialogFooter className="flex space-y-4 items-center">
              <Button disabled={isCleaningOngoing} type="submit">Set Reminder</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}