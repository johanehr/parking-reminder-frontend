import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const OngoingCleaningAlert = () => {
  return (
    <Alert variant="destructive">
      <div className="h-4 w-4" />
      <AlertTitle>Cleaning Alert</AlertTitle>
      <AlertDescription>
                Cleaning is ongoing, notifications are not currently possible for this location.
      </AlertDescription>
    </Alert>
  )
}

export default OngoingCleaningAlert