import { DayOfWeek, MonthOfYear, ParkingLocationData } from "../types"

export function getRawParkingLocationData(): ParkingLocationData[] {
  // TODO: This should probably come from a database in the future, for crowd-sourced data

  return [
    {
      name: "Gamla vägen (kort, södra sidan)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY] },
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
      name: "Gamla vägen (lång, norra sidan)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377966, "lng": 18.041108 },
        { "lat": 59.377978, "lng": 18.041221 },
        { "lat": 59.377575, "lng": 18.041462 },
        { "lat": 59.377554, "lng": 18.041365 },
      ]
    },
    {
      name: "Gamla vägen (södra sidan, utanför gul villa)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.TUESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377206, "lng": 18.041788 },
        { "lat": 59.376925, "lng": 18.043562 },
        { "lat": 59.376879, "lng": 18.043547 },
        { "lat": 59.377159, "lng": 18.041738 },
      ]
    },
    {
      name: "Björnstigen (svängen)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.TUESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
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
    },
    {
      name: "Ripstigen (vid bron)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.TUESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.378461, "lng": 18.041792 },
        { "lat": 59.378692, "lng": 18.042349 },
        { "lat": 59.378630, "lng": 18.042451 },
        { "lat": 59.378410, "lng": 18.041877 },
      ]
    },
    {
      name: "Bockholmsvägen (västra)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.WEDNESDAY, startHour: 7, endHour: 10, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.376407, "lng": 18.049888 },
        { "lat": 59.376416, "lng": 18.049750 },
        { "lat": 59.377539, "lng": 18.049959 },
        { "lat": 59.377386, "lng": 18.050336 },
      ]
    },
    {
      name: "Bockholmsvägen (vid bron)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 7, endHour: 10, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377367, "lng": 18.050386 },
        { "lat": 59.377018, "lng": 18.050181 },
        { "lat": 59.377195, "lng": 18.050621 },
      ]
    },
    {
      name: "Stocksundstorpsvägen (mot Bockholmen)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 7, endHour: 10, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377525, "lng": 18.050377 },
        { "lat": 59.377487, "lng": 18.050110 },
        { "lat": 59.378043, "lng": 18.049440 },
        { "lat": 59.378097, "lng": 18.049707 },
      ]
    },
    {
      name: "Stocksundstorpsvägen (villaområdet)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.379509, "lng": 18.046031 },
        { "lat": 59.379464, "lng": 18.045999 },
        { "lat": 59.379330, "lng": 18.046605 },
        { "lat": 59.379392, "lng": 18.046632 },
      ]
    },
    {
      name: "Pipers väg (östra)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.WEDNESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377517, "lng": 18.030680 },
        { "lat": 59.377581, "lng": 18.030698 },
        { "lat": 59.377660, "lng": 18.029811 },
        { "lat": 59.377747, "lng": 18.029400 },
        { "lat": 59.377682, "lng": 18.029361 },
        { "lat": 59.377598, "lng": 18.029790 },
      ]
    },
    {
      name: "Pipers väg (västra)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.377956, "lng": 18.028728 },
        { "lat": 59.377904, "lng": 18.028642 },
        { "lat": 59.378283, "lng": 18.027840 },
        { "lat": 59.378326, "lng": 18.027958 },
      ]
    },
    {
      name: "Barks väg (IF)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.TUESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.379339, "lng": 18.031222 },
        { "lat": 59.379244, "lng": 18.031272 },
        { "lat": 59.379299, "lng": 18.031655 },
        { "lat": 59.379393, "lng": 18.031588 },
      ]
    },
    {
      name: "Björnstigen (kring äldreboendet)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.FRIDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.381671, "lng": 18.038917 },
        { "lat": 59.381741, "lng": 18.038365 },
        { "lat": 59.382348, "lng": 18.038665 },
        { "lat": 59.382237, "lng": 18.039334 },
      ]
    },
    {
      name: "Björnstigen - Hjortstigen",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY]  },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.382017, "lng": 18.027133 },
        { "lat":  59.382043, "lng": 18.027234 },
        { "lat": 59.382087, "lng": 18.027425 },
        { "lat": 59.382130, "lng": 18.027687 },
        { "lat": 59.382115, "lng": 18.027763 },
        { "lat": 59.382078, "lng": 18.027576 },
        { "lat": 59.382022, "lng": 18.027316 },
        { "lat": 59.381963, "lng": 18.027213 },
      ]
    },
    {
      name: "Hjortstigens parkering",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.WEDNESDAY, startHour: 18, endHour: 22, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.383297, "lng": 18.028984 },
        { "lat": 59.383464, "lng": 18.029092 },
        { "lat": 59.383280, "lng": 18.029371 },
        { "lat": 59.383195, "lng": 18.029312 },
      ]
    },
    {
      name: "Hjortstigen (gatuparkering)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 18, endHour: 22, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.382960, "lng": 18.029246 },
        { "lat": 59.382929, "lng": 18.029456 },
        { "lat": 59.383129, "lng": 18.029592 },
        { "lat": 59.383154, "lng": 18.029403 },
      ]
    },
    {
      name: "Björnstigen (mellan Hjortstigen ner till skolan)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 14, endHour: 18, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY]  },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.382122, "lng": 18.029231},
        { "lat": 59.382195, "lng": 18.029280},
        { "lat": 59.382152, "lng": 18.030114 },
        { "lat": 59.382092, "lng": 18.030121 },
      ]
    },
    {
      name: "Björnstigen (skolparkering)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 14, endHour: 18, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY]  },
          // 15 minutes during school hours
          { day: DayOfWeek.MONDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY]  },
          { day: DayOfWeek.TUESDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY]  },
          { day: DayOfWeek.WEDNESDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY]  },
          { day: DayOfWeek.THURSDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY]  },
          { day: DayOfWeek.FRIDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [MonthOfYear.JULY]  },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.382095, "lng": 18.030265 },
        { "lat": 59.382130, "lng": 18.030276 },
        { "lat": 59.382136, "lng": 18.030852 },
        { "lat": 59.382083, "lng": 18.030850 },
      ]
    },

    {
      name: "Hjortstigen (skolparkering)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 18, endHour: 22, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
          // 15 minutes during school hours
          { day: DayOfWeek.MONDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [] },
          { day: DayOfWeek.TUESDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [] },
          { day: DayOfWeek.WEDNESDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [] },
          { day: DayOfWeek.THURSDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [] },
          { day: DayOfWeek.FRIDAY, startHour: 7, endHour: 17, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.382960, "lng": 18.029246 },
        { "lat": 59.382929, "lng": 18.029456 },
        { "lat": 59.382810, "lng": 18.029348 },
        { "lat": 59.382840, "lng": 18.029167 },
      ]
    },
    {
      name: "Hjortstigen (norra)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.THURSDAY, startHour: 18, endHour: 22, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.383570, "lng": 18.029059 },
        { "lat": 59.383492, "lng": 18.029017 },
        { "lat": 59.383597, "lng": 18.028406 },
        { "lat": 59.383649, "lng": 18.028440 },
      ]
    },
    {
      name: "Illerstigen (inre/västra)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.MONDAY, startHour: 14, endHour: 18, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.383530, "lng": 18.024689 },
        { "lat": 59.383590, "lng": 18.024761 },
        { "lat": 59.383067, "lng": 18.027168 },
        { "lat": 59.382990, "lng": 18.027124 },
      ]
    },
    {
      name: "Illerstigen (yttre/östra)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.TUESDAY, startHour: 14, endHour: 18, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.382904, "lng": 18.028686 },
        { "lat": 59.383069, "lng": 18.027859 },
        { "lat": 59.382968, "lng": 18.027792 },
        { "lat": 59.383054, "lng": 18.027277 },
        { "lat": 59.382990, "lng": 18.027237 },
        { "lat": 59.382731, "lng": 18.028602 },
      ]
    },
    {
      name: "Björnstigen (utanför Kungshamra)",
      parkingRules: {
        cleaningTimes: [
          { day: DayOfWeek.TUESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [MonthOfYear.JULY] },
        ],
        maximum: { days: 14 }
      },
      path: [
        { "lat": 59.380615, "lng": 18.026204 },
        { "lat": 59.380616, "lng": 18.026084 },
        { "lat": 59.381169, "lng": 18.026122 },
        { "lat": 59.381454, "lng": 18.026276 },
        { "lat": 59.381732, "lng": 18.026581 },
        { "lat": 59.381694, "lng": 18.026681 },
        { "lat": 59.381495, "lng": 18.026457 },
        { "lat": 59.381011, "lng": 18.026243 },
      ]
    },
  ]
}