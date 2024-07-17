import React from 'react'
import { Button } from './ui/button'
import { NotifUnsocialHours } from '@/notifications/types/types'
import { DateTime } from 'luxon'

interface IReminderSummaryProps {
  notificationDate: DateTime | null;
  notifUnsocHours: NotifUnsocialHours;
  resetNotificationSettings: () => void;
  timestampFormatOpts: Intl.DateTimeFormatOptions;
}
const ReminderSummary = ({
  notificationDate,
  notifUnsocHours,
  resetNotificationSettings,
  timestampFormatOpts
}: IReminderSummaryProps) => {
  return (
    <div className="mx-2">
            You will receive your notification on:<br />
      <div className="flex items-center justify-content">
        <span className="text">
          {notificationDate?.toLocaleString(timestampFormatOpts)}
        </span>
        {notifUnsocHours.acceptedUnsocialHours &&
                    <Button onClick={resetNotificationSettings} variant={"outline"} className="text-red-600 ml-auto">
                        Reset
                    </Button>
        }
      </div>
    </div>
  )
}

export default ReminderSummary