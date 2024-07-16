import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { AugmentedParkingLocationData } from "@/parking-locations/types"
import { useEffect, useState } from "react"
import { DateTime, DateTimeFormatOptions } from "luxon"
import { handleChange, handleSelectionChange } from "@/notifications/helper-functions/formHelpers"
import { z } from 'zod'
import { formSchema } from "@/models/formSchema"
import NicknameModal from "./NicknameModal"
import { NotifUnsocialHours, UserInput } from "@/notifications/types/types"
import { handleOngoingCleaningStateUpdate } from "@/notifications/helper-functions/handleOngoingCleaningStateUpdate"
import ReminderSummary from "./ReminderSummary"
import OngoingCleaningAlert from "./OngoingCleaningAlert"

interface INotificationModalProps {
  location: AugmentedParkingLocationData
}

export default function NotificationModal({ location }: INotificationModalProps) {
  const [notificationBuffer, setNotificationBuffer] = useState(1440)
  const [notifUnsocHours, setNotifUnsocHours] = useState(new NotifUnsocialHours({
    suggestUnsocialHours: false,
    acceptedUnsocialHours: false,
    dayBefore: undefined
  }))
  const [userInput, setUserInput] = useState(new UserInput({
    email: "",
    carNickname: "My car",
    notificationDate: location.nextCleaningTime
  }
  ))
  const [errors, setErrors] = useState<z.ZodIssue[]>([])
  const [isCleaningOngoing, setIsCleaningOngoing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const data = {
      email: userInput.email,
      carNickname: userInput.carNickname,
      notificationDate: userInput.notificationDate?.toISO(),
    }

    const zodResult = formSchema.safeParse(data)
    if (!zodResult.success) {
      setErrors(zodResult.error.issues)
      console.log(errors)
      return
    }

    setErrors([])
    console.log(data, "here is the data for backend >>>>>>")
    /*  const res = await axios.post('https://your-gcp-backend-url/api/submitForm', { data });
     console.log(res.data) */
  }

  const calculateSameDayOrDayBefore = (notificationDate: DateTime<boolean> | null) => {
    if (notificationDate) {
      if (notificationDate.hour >= 0 && notificationDate.hour <= 6) {
        setNotifUnsocHours((prev) => ({ ...prev, dayBefore: true }))
      } else if (notificationDate.hour >= 22) {
        setNotifUnsocHours((prev) => ({ ...prev, dayBefore: false }))
      }
    }
  }

  const resetNotificationSettings = () => {
    setNotifUnsocHours(new NotifUnsocialHours({
      suggestUnsocialHours: false,
      acceptedUnsocialHours: false,
      dayBefore: undefined
    }))
    setUserInput(new UserInput(
      {
        email: "",
        carNickname: "",
        notificationDate: location.nextCleaningTime
      }
    ))
    setNotificationBuffer(1440)
    setErrors([])
    setIsCleaningOngoing(false)
  }
  const calculateNotifUnsocialHours = (
    notifUnsocHours: NotifUnsocialHours,
    notifDate: DateTime<boolean> | null,
    cleanDate: DateTime<boolean> | null
  ) => {
    if (notifUnsocHours.acceptedUnsocialHours && notifDate) {
      if (notifUnsocHours.dayBefore) {
        const cleaningTimeDayBefore = notifDate.minus({ days: 1 }).set({ hour: 20, minute: 0, second: 0, millisecond: 0 })
        setUserInput((prev) => ({ ...prev, notificationDate: cleaningTimeDayBefore }))
      } else if (!notifUnsocHours.dayBefore) {
        const cleaningTimeSameDay = notifDate.set({ hour: 20, minute: 0, second: 0, millisecond: 0 })
        setUserInput((prev) => ({ ...prev, notificationDate: cleaningTimeSameDay }))
      }
    } else if (!notifUnsocHours.acceptedUnsocialHours) {
      setUserInput((prev) => ({ ...prev, notificationDate: cleanDate }));
      setNotificationBuffer(1440);
    }
  };

  useEffect(() => {
    calculateNotifUnsocialHours(notifUnsocHours, userInput.notificationDate, location.nextCleaningTime);
  }, [notifUnsocHours.acceptedUnsocialHours]);

  useEffect(() => {
    calculateSameDayOrDayBefore(userInput.notificationDate);
  }, [notificationBuffer, userInput.notificationDate]);


  useEffect(() => {
    handleOngoingCleaningStateUpdate(location.nextCleaningTime, notificationBuffer, setIsCleaningOngoing, setNotifUnsocHours, setUserInput)
  }, [notificationBuffer, location.nextCleaningTime])

  const getErrorMessage = (path: string) => {
    const error = errors.find(error => error.path.includes(path))
    return error ? error.message : null
  }

  const timestampFormatOpts: DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hourCycle: 'h23'
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="m-2" variant="outline">Set reminder</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="space-y-2">
              <DialogHeader>
                <DialogTitle>{location.name}</DialogTitle>
                <DialogDescription>Move your car by: <span className="text"> {location.nextCleaningTime?.toLocaleString(timestampFormatOpts)}</span></DialogDescription>
              </DialogHeader>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input onChange={(e) => handleChange(e, setUserInput, userInput)} name="email" id="email" placeholder="Enter email" />
                {errors.find(error => error.path.includes('email')) && <p className="text-xs text-red-500">{getErrorMessage('email')}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="car-nickname">Car Nickname (optional)<NicknameModal /></Label>
                <Input onChange={(e) => handleChange(e, setUserInput, userInput)} name="carNickname" id="car-nickname" value={userInput.carNickname} placeholder="Enter car nickname" />
                {errors.find(error => error.path.includes('carNickname')) && <p className="text-xs text-red-500">{getErrorMessage('carNickname')}</p>}
              </div>
              <div className="grid gap-2">
                {!notifUnsocHours.acceptedUnsocialHours &&
                  <>
                    <Label htmlFor="notification-time">Notification Time</Label>
                    <Select name="notification-time" defaultValue="1440" onValueChange={
                      (e) => {
                        calculateSameDayOrDayBefore(userInput.notificationDate)
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
                        <SelectItem value="2880">48 hours before</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                }
                {notifUnsocHours.suggestUnsocialHours && (
                  <div className={`flex space-x-2 items-center ${!notifUnsocHours.acceptedUnsocialHours ? 'bg-red-100 p-2 rounded-sm' : ''}`}>
                    {!notifUnsocHours.acceptedUnsocialHours &&
                      <>
                        <div className="text-xs m-2 text-black">
                          Your requested notification time lands during unsociable hours, on <span className="font-bold">{
                            userInput.notificationDate?.toLocaleString(timestampFormatOpts)
                          }</span>. Shall we notify you at <span className="font-bold">20:00</span> instead on the {notifUnsocHours.dayBefore ? "day before" : "same day"}?
                        </div>

                        <Button
                          id="unsocialHours"
                          onClick={() => {
                            setNotifUnsocHours(prev => ({ ...prev, acceptedUnsocialHours: true }))
                          }}
                        >
                          Sure!
                        </Button>
                      </>
                    }
                  </div>
                )}
              </div>


              {isCleaningOngoing ?
                <OngoingCleaningAlert /> :
                <ReminderSummary
                  notificationDate={userInput.notificationDate}
                  notifUnsocHours={notifUnsocHours}
                  resetNotificationSettings={resetNotificationSettings}
                  timestampFormatOpts={timestampFormatOpts}
                />
              }

            </div>
            <DialogFooter className="flex items-center justify-content ">
              <h4 className="text-xs mr-auto">By continuing you are accepting the <br /><a className="text-blue-500" href="/">terms and conditions</a></h4>
              <Button className="mb-4" disabled={isCleaningOngoing} type="submit">Set Reminder</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}
