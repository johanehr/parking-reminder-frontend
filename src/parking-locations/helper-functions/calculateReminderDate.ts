export function calculateReminderDate(hoursUntilMove: number): Date {
    const reminderDate = new Date()
    reminderDate.setHours(reminderDate.getHours() + hoursUntilMove)
    console.log(reminderDate)
    return reminderDate; 
  }