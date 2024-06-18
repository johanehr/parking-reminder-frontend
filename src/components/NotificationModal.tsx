import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { AugmentedParkingLocationData, ReminderDataForBackend } from "@/parking-locations/types"
import { Toggle } from "./Toggle"
import { useEffect, useState } from "react"

interface INotificationModalProps {
  location: AugmentedParkingLocationData
}

function calculateReminderDate(hoursUntilMove: number): Date {
  const notificationDate = new Date();
  notificationDate.setHours(notificationDate.getHours() + hoursUntilMove);
  return notificationDate;
}

function calculateAdjustedReminderDate(originalEventDate: Date, minutesBefore: number): Date {
  const reminderDate = new Date(originalEventDate.getTime())
  reminderDate.setMinutes(reminderDate.getMinutes() - minutesBefore);
  return reminderDate;
}

class NotifDayBefore {
  constructor(
    public suggestNotifDayBefore: boolean,
    public acceptedNotifDayBefore: boolean
  ) { }
}

export default function NotificationModal({ location }: INotificationModalProps) {
  const originalEventDate = calculateReminderDate(location.hoursUntilMove)
  const [notificationBuffer, setNotificationBuffer] = useState(60)
  const [notifDayBefore, setNotifDayBefore] = useState(new NotifDayBefore(false, false))
  const [reminderDataForBackend, setReminderDataForBackend] = useState(new ReminderDataForBackend(
    "",
    location.hoursUntilMove,
    originalEventDate,
    originalEventDate, //Create a "default" case, where notification date is set for 2 hours before?
    "",
    ""
  ))



  const handleNotificationBufferChange = (value: string) => {
    setNotificationBuffer(parseInt(value));
  };



  useEffect(() => {
    const notificationDate = calculateAdjustedReminderDate(reminderDataForBackend.originalEventDate, notificationBuffer);
    const reminderHour = notificationDate.getHours();
    if (reminderHour < 6 || reminderHour >= 21) {
      setNotifDayBefore(prev => ({ ...prev, suggestNotifDayBefore: true }));
    } else {
      setNotifDayBefore(prev => ({ ...prev, suggestNotifDayBefore: false }));
    }
    setReminderDataForBackend(prev => ({
      ...prev,
      notificationDate: notificationDate
    }));
  }, [notificationBuffer]);





  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Set reminder</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="grid gap-6">
          <div className="space-y-2">
            <DialogHeader>
              <DialogTitle>Parking Location</DialogTitle>
              <DialogDescription>Set a reminder for: <span className="text-black">{location.name}</span></DialogDescription>
              <DialogDescription>You will recieve a notification to move on: <span className="text-black">{reminderDataForBackend.notificationDate.toLocaleDateString()}{reminderDataForBackend.notificationDate.toLocaleTimeString()}</span></DialogDescription>

            </DialogHeader>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="car-nickname">Car Nickname</Label>
              <Input id="car-nickname" placeholder="Enter car nickname" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notification-time">Notification Time</Label>
              <Select name="notification-time" defaultValue="120" onValueChange={handleNotificationBufferChange}>
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
              {notifDayBefore.suggestNotifDayBefore && (
                <div className="grid gap-2">
                  <p>Your requested notification time lands in unsociable hours {reminderDataForBackend.notificationDate.toLocaleTimeString()}, do you want it the day before at 20:00?</p>
                  <Toggle id="unSociableHoursToggle" text="Notify me the evening before"/>
                </div>
              )}
            </div>
            <Toggle id="aggreeToTermsToggle" text={`Agree to terms`} />

          </div>
          <DialogFooter className="flex space-y-4">
            <Button type="submit">Set Reminder</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}