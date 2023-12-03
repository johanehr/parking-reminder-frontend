import { DateTime } from "luxon";

type ParkingLocationData = {
  name: string;
  allowedParking: {
    cleaningTimes: CleaningTime[],
    maximum: { days: number }},
  path: { lat: number, lng: number }[];
}

type CleaningTime = {
  day: string, // TODO: Consider enum?
  startHour: number,
  endHour: number,
  appliesToEvenWeeks: boolean,
  appliesToOddWeeks: boolean
}

export function getParkingLocationData() {

  // TODO: This should probably come from a database in the future, for crowd-sourced data
  const rawData: ParkingLocationData[] = [
    {
      name: "Gamla vägen (kort)",
      allowedParking: {
        cleaningTimes: [
          { day: 'Thursday', startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true  }, // TODO: Specific parts of the year, e.g. not summer
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377882, "lng": 18.040977 },
        { "lat": 59.377689, "lng": 18.041092 },
        { "lat": 59.377712, "lng": 18.041240 },
        { "lat": 59.377887, "lng": 18.041116 },
      ]
    },
    {
      name: "Gamla vägen (utanför gul villa)",
      allowedParking: {
        cleaningTimes: [
          { day: 'Tuesday', startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true  },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377177, "lng": 18.041602 },
        { "lat": 59.377065, "lng": 18.042051 },
        { "lat": 59.377122, "lng": 18.042130 },
        { "lat": 59.377232, "lng": 18.041778 },
      ]
    },
    {
      name: "Björnstigen vid äldreboendet",
      allowedParking: {
        cleaningTimes: [
          { day: 'Wednesday', startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false  },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.380511, "lng": 18.039990 },
        { "lat": 59.380514, "lng": 18.040109 },
        { "lat": 59.381119, "lng": 18.040168 },
        { "lat": 59.381412, "lng": 18.040050 },
        { "lat": 59.381596, "lng": 18.039722 },
        { "lat": 59.381538, "lng": 18.039619 },
        { "lat": 59.381339, "lng": 18.039921 },
        { "lat": 59.381162, "lng": 18.040013 },
      ]
    }
  ]

  return rawData.map( (parkingLocation) => { return { ...parkingLocation, color: getAppropriateDisplayColor(parkingLocation)} })
}

function getNextCleaningTime(cleaningTimes: CleaningTime[]): DateTime {
  return DateTime.now().plus({ days: 1 })
}

function getAppropriateDisplayColor(parkingLocation: any): string {
  const now = DateTime.now()
  const nextCleaningTime = getNextCleaningTime(parkingLocation.cleaningTimes)
  const maximumTime = DateTime.now().plus({ days: parkingLocation.allowedParking.maximum.days })

  function compareLuxonDates(a: DateTime, b: DateTime) {
    return a.toMillis() - b.toMillis()
  }
  const lastTimeToMove = [nextCleaningTime, maximumTime].sort(compareLuxonDates)[0]
  const hoursUntilMove = lastTimeToMove.diffNow(['hours']).hours
  console.log('Hours until move: ', hoursUntilMove)

  if (hoursUntilMove > 7 * 24 ) { return 'green' }
  if (hoursUntilMove > 3 * 24 ) { return 'yellow' }
  if (hoursUntilMove > 12 ) { return 'orange' }

  return 'red'
}