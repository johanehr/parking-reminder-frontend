import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const FilteredOptionsAlert = () => {
  return (
    <Alert variant="destructive">
      <div className="h-4 w-4" />
      <AlertTitle>Cleaning Alert</AlertTitle>
      <AlertDescription>
                Cleaning is within the next 24h, we have filtered notification times accordingly.
      </AlertDescription>
    </Alert>
  )
}

export default FilteredOptionsAlert