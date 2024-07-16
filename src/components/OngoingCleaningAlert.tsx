import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const OngoingCleaningAlert = () => {
    return (
        <Alert variant="destructive">
            <div className="h-4 w-4" />
            <AlertTitle>Cleaning Alert</AlertTitle>
            <AlertDescription>
                Cleaning is currently ongoing or scheduled within the next 24 hours. A notification cannot be set for this location.
            </AlertDescription>
        </Alert>
    )
}

export default OngoingCleaningAlert