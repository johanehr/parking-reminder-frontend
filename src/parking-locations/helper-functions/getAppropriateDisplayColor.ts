export function getAppropriateDisplayColor(hoursUntilMove: number ): string {
    if (hoursUntilMove > 7 * 24 ) { return 'green' }
    if (hoursUntilMove > 5 * 24 ) { return 'limegreen' }
    if (hoursUntilMove > 3 * 24 ) { return 'yellowgreen' }
    if (hoursUntilMove > 1 * 24 ) { return 'yellow' }
    if (hoursUntilMove > 12 ) { return 'orange' }
    if (hoursUntilMove > 3 ) { return 'orangered' }
    return 'red'
  }