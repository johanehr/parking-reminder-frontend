import { AugmentedParkingLocationData } from "@/parking-locations/types"
import { CombinedState } from "../types/types"
import { handleOngoingCleaningStateUpdate } from "./handleOngoingCleaningStateUpdate"

export const handleSelectionChange = (value: string, setState: React.Dispatch<React.SetStateAction<CombinedState>>, location: AugmentedParkingLocationData) => {
  const newBuffer = parseInt(value)
  setState(prevState => ({
    ...prevState,
    notificationBuffer: newBuffer,
  }))
  handleOngoingCleaningStateUpdate(location.nextCleaningTime, newBuffer, setState)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<CombinedState>>) => {
  const { name, value } = e.target
  setState(prevState => ({
    ...prevState,
    userInput: {
      ...prevState.userInput,
      [name]: value,
    }
  }))
}