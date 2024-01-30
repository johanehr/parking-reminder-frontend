import { DateTime } from "luxon"

export function compareLuxonDates(a: DateTime, b: DateTime) {
  return a.toMillis() - b.toMillis()
}

