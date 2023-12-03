export function getParkingLocationData() {

  // TODO: This should probably come from a database in the future, for crowd-sourced data

  return [
    {
      name: "Gamla vägen (kort)",
      color: "green", // TODO: Augment based on allowed parking times
      allowedParking: {
        cleaningTimes: [
          { day: 'Thursday', start: 10, end: 14, evenWeeks: false, oddWeeks: true  }, // TODO: Specific parts of the year, e.g. not summer
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
      color: "red",
      allowedParking: {
        cleaningTimes: [
          { day: 'Tuesday', start: 10, end: 14, evenWeeks: false, oddWeeks: true  },
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
      color: "orange",
      allowedParking: {
        cleaningTimes: [
          { day: 'Wednesday', start: 10, end: 14, evenWeeks: true, oddWeeks: false  },
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
}