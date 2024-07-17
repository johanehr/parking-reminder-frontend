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
import { CombinedState, NotifUnsocialHours, UserInput } from "@/notifications/types/types"
import { handleOngoingCleaningStateUpdate } from "@/notifications/helper-functions/handleOngoingCleaningStateUpdate"
import ReminderSummary from "./ReminderSummary"
import OngoingCleaningAlert from "./OngoingCleaningAlert"
import { calculateUnsociableHoursSuggestionDaybeforeOrSameday } from "@/notifications/helper-functions/calculateUnsocHoursSuggestionDaybeforeOrSameday"
import { calculateNotifUnsocialHours } from "@/notifications/helper-functions/calculateNotifTimeUnsocHours"
import FilteredOptionsAlert from "./FilteredOptionsAlert"
import { calculateReminderDate } from "@/notifications/helper-functions/calculateReminderDate"

interface INotificationModalProps {
  location: AugmentedParkingLocationData
}

const initialUserInput = (nextCleaningTime: DateTime | null): UserInput => ({
  email: "",
  carNickname: "",
  notificationDate: nextCleaningTime
})


const initialNotifUnsocHours: NotifUnsocialHours = {
  suggestUnsocialHours: false,
  acceptedUnsocialHours: false,
  dayBefore: undefined
}

export default function NotificationModal({ location }: INotificationModalProps) {
  const [state, setState] = useState<CombinedState>({
    notificationBuffer: 1440,
    notifUnsocHours: initialNotifUnsocHours,
    userInput: initialUserInput(location.nextCleaningTime),
    notificationFiltered: false,
    notificationNotPossible: false,
  })
  const [errors, setErrors] = useState<z.ZodIssue[]>([])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const data = {
      email: state.userInput.email,
      carNickname: state.userInput.carNickname,
      notificationDate: state.userInput.notificationDate?.toISO(),
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

  useEffect(() => {
    handleOngoingCleaningStateUpdate(location.nextCleaningTime, state.notificationBuffer, setState)
  }, [location.nextCleaningTime, state.notificationBuffer])

  const resetNotificationSettings = () => {
    setState((prevState) => ({
      ...prevState,
      notifUnsocHours: initialNotifUnsocHours,
      userInput: initialUserInput(location.nextCleaningTime),
      notificationBuffer: 1440,
      isCleaningOngoing: false,
    }))
    setErrors([])
  }

  const handleAcceptUnsocHours = () => {
    setState((prevState) => {
      const updatedNotifUnsocHours = { ...prevState.notifUnsocHours, acceptedUnsocialHours: true }
      const notificationDate = prevState.userInput.notificationDate
      if (notificationDate && location.nextCleaningTime) {
        const { newNotificationDate, resetBuffer } = calculateNotifUnsocialHours(updatedNotifUnsocHours, notificationDate, location.nextCleaningTime)

        return {
          ...prevState,
          notifUnsocHours: updatedNotifUnsocHours,
          userInput: { ...prevState.userInput, notificationDate: newNotificationDate },
          ...(resetBuffer && { notificationBuffer: 1440 }),
        }
      }
      return prevState
    })
  }

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

  const getFilteredOptions = () => {
    const now = DateTime.now()
    const options = [
      { value: "60", label: "1 hour before" },
      { value: "180", label: "3 hours before" },
      { value: "720", label: "12 hours before" },
      { value: "1440", label: "24 hours before" },
      { value: "2880", label: "48 hours before" },
    ]

    return options.filter(option => {
      if (location.nextCleaningTime) {
        const notificationTime = location.nextCleaningTime.minus({ minutes: parseInt(option.value) })
        return notificationTime > now
      }
    })
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
              {!state.notificationNotPossible &&
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input onChange={(e) => handleChange(e, setState)} name="email" value={state.userInput.email} id="email" placeholder="Enter email" />
                    {errors.find(error => error.path.includes('email')) && <p className="text-xs text-red-500">{getErrorMessage('email')}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="car-nickname">Car Nickname (optional)<NicknameModal /></Label>
                    <Input onChange={(e) => handleChange(e, setState)} name="carNickname" id="car-nickname" value={state.userInput.carNickname} placeholder="Enter car nickname" />
                    {errors.find(error => error.path.includes('carNickname')) && <p className="text-xs text-red-500">{getErrorMessage('carNickname')}</p>}
                  </div>
                  <div className="grid gap-2">
                    {!state.notifUnsocHours.acceptedUnsocialHours &&
                      <>
                        <Label htmlFor="notification-time">Notification Time</Label>

                        <Select name="notification-time" defaultValue="1440" onValueChange={
                          (e) => {
                            if (location.nextCleaningTime) {
                              const notificationDate = calculateReminderDate(location.nextCleaningTime, parseInt(e))

                              const updatedNotifUnsocHours = calculateUnsociableHoursSuggestionDaybeforeOrSameday(
                                notificationDate,
                                state.notifUnsocHours,
                                location
                              )
                              setState(prev => ({
                                ...prev,
                                notifUnsocHours: updatedNotifUnsocHours
                              }))
                              handleSelectionChange(e, setState, location)
                            }
                          }
                        }>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {getFilteredOptions().map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    }
                    {state.notifUnsocHours.suggestUnsocialHours && !state.notificationFiltered && (
                      <div className={`flex space-x-2 items-center ${!state.notifUnsocHours.acceptedUnsocialHours ? 'bg-red-100 p-2 rounded-sm' : ''}`}>
                        {!state.notifUnsocHours.acceptedUnsocialHours &&
                          <>
                            <div className="text-xs m-2 text-black">
                              Your requested notification time lands during unsociable hours, on <span className="font-bold">{
                                state.userInput.notificationDate?.toLocaleString(timestampFormatOpts)
                              }</span>. Shall we notify you at <span className="font-bold">20:00</span> instead on the {state.notifUnsocHours.dayBefore ? "day before" : "same day"}?
                            </div>

                            <Button
                              id="unsocialHours"
                              onClick={handleAcceptUnsocHours}
                            >
                              Sure!
                            </Button>
                          </>
                        }
                      </div>
                    )}
                  </div>
                </>
              }

              {state.notificationNotPossible &&
                <OngoingCleaningAlert />
              }
              {state.notificationFiltered &&
                <FilteredOptionsAlert />
              }

              {!state.notificationNotPossible &&
                <ReminderSummary
                  notificationDate={state.userInput.notificationDate}
                  notifUnsocHours={state.notifUnsocHours}
                  resetNotificationSettings={resetNotificationSettings}
                  timestampFormatOpts={timestampFormatOpts}
                />
              }

            </div>
            <DialogFooter className="flex items-center justify-content ">
              <h4 className="text-xs mr-auto">By continuing you are accepting the <br /><a className="text-blue-500" href="/">terms and conditions</a></h4>
              <Button className="mb-4" disabled={state.notificationNotPossible} type="submit">Set Reminder</Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}
