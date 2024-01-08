import { DateTime } from "luxon";
import { DayOfWeek, ParkingLocationData } from "./types";
import { calculateNextCleaningTime } from "./location-helpers";
import { calculateMaximumTime } from "./helper-functions/calculateMaximumTime";
import { getAppropriateDisplayColor } from "./helper-functions/getAppropriateDisplayColor";


const fakeParkingData: ParkingLocationData = {
  name: "Name",
  parkingRules: {
    cleaningTimes: [{ day: DayOfWeek.TUESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [7], }],
    maximum: {
      days: 14
    },
  },
  path: []
}


describe('getAppropriateDisplayColor', () => {
  it.each([
    [1, "red"],
    [6, "orangered"],
    [18, "orange"],
    [36, "yellow"],
    [80, "yellowgreen"],
    [150, "limegreen"],
    [1337, "green"],
  ])('When %i hours left, use display color %s', (hours, color) => {
    expect(getAppropriateDisplayColor(hours)).toBe(color)
  })
})

describe('calculateMaximumTime', () => {
  it('Returns correct maximum time', () => {
    expect(calculateMaximumTime(7, DateTime.fromISO('2024-01-01T12:34:56.000Z'))).toEqual(DateTime.fromISO('2024-01-08T12:34:56.000Z'))
  })
})


describe('No match', () => {
  it('returns no match, and null', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const parkingRules = {
      cleaningTimes:[{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: false, noCleaningMonths: [7] }],
      maximum: { days: 14 }
    }
    expect(calculateNextCleaningTime(parkingRules, currentTime)).toEqual(null)
  })
})

describe('all months have no cleaning', () => {
  it('tests special case with endless cleaning break', () => {
    const currentTime = DateTime.local(2023, 12, 4, 23) // Monday evening of odd week
    const parkingRules = {
      cleaningTimes:[{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: false, noCleaningMonths: [1,2,3,4,5,6,7,8,9,10,11,12] }],
      maximum: { days: 14 }
    }
    expect(calculateNextCleaningTime(parkingRules, currentTime)).toEqual(null)
  })
})


describe('Should provoke second if block to be hit', () => {
  it('should apply both adjustments', () => {
    const currentTime = DateTime.local(2023, 12, 4, 14); // Monday afternoon of odd week, BEFORE cleaning time, AND in a no cleaning month
    const parkingRules = {
      cleaningTimes: [{ day: DayOfWeek.MONDAY, startHour: 12, endHour: 16, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [12] }],
      maximum: { days: 14 }
    };
    // Set up the function call
    expect(calculateNextCleaningTime(parkingRules, currentTime)).toEqual((DateTime.local(2023, 8, 1, 8).toISO()))
  });
});

describe('calculateNextCleaningTime', () => {
  const testCases = [
    {
      description: 'Currently on-going',
      currentTime: DateTime.local(2023, 12, 4, 12), // Monday noon of odd week
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.MONDAY, startHour: 0, endHour: 23, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [7]  }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 4, 12),
    },
    {
      description: 'Just started',
      currentTime: DateTime.local(2023, 12, 4, 0), // Monday early morning of odd week
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.MONDAY, startHour: 0, endHour: 23, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 4, 0),
    },
    {
      description: 'Just ended',
      currentTime: DateTime.local(2023, 12, 4, 23), // Monday evening of odd week
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.MONDAY, startHour: 0, endHour: 23, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 18, 0)
    },
    {
      description: 'Later today',
      currentTime: DateTime.local(2023, 12, 4, 8), // Monday morning of odd week
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.MONDAY, startHour: 15, endHour: 18, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 4, 15)
    },
    {
      description: 'Tomorrow (new week starting)',
      currentTime: DateTime.local(2023, 12, 10, 22), // Sunday even of odd week
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.MONDAY, startHour: 8, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 11, 8)
    },
    {
      description: 'This week',
      currentTime: DateTime.local(2023, 12, 4, 23), // Monday evening of odd week
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 6, 8)
    },
    {
      description: 'Next week (due to passed weekday)',
      currentTime: DateTime.local(2023, 12, 5, 23),// Tuesday evening of odd week
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.MONDAY, startHour: 10, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 11, 10)
    },
    {
      description: 'Next week (due to passed time earlier today)',
      currentTime: DateTime.local(2023, 12, 4, 15), // Monday afternoon of odd week
      parkingRules: {
      cleaningTimes:[{ day: DayOfWeek.MONDAY, startHour: 10, endHour: 12, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 11, 10)
    },
    {
      description: 'Next week (due to odd week number)',
      currentTime: DateTime.local(2023, 12, 4, 23),// Monday evening of odd week
      parkingRules: {
      cleaningTimes:[{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 13, 8)
    },
    {
      description: 'Multiple cleaning times',
      currentTime: DateTime.local(2023, 12, 4, 23),// Monday evening of odd week
      parkingRules: {
         cleaningTimes : [
          { day: DayOfWeek.TUESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [7] },  // Next week
          { day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: true, noCleaningMonths: [7] }, // This week <---
          { day: DayOfWeek.THURSDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [7] }  // Next week
        ],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 6, 8)
    },
    {
      description: 'Current time, but next week',
      currentTime: DateTime.local(2023, 12, 6, 21),// Wednesday evening of odd week
      parkingRules: {
      cleaningTimes:[{ day: DayOfWeek.WEDNESDAY, startHour: 18, endHour: 22, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 13, 18)
    },
    {
      description: 'Cleaning completed recently',
      currentTime: DateTime.local(2023, 12, 6, 21),// Wednesday evening of odd week
      parkingRules: {
      cleaningTimes:[{ day: DayOfWeek.WEDNESDAY, startHour: 10, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [7] }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 12, 13, 10)
    },

  ];

  test.each(testCases)('(%s)', ({ currentTime, parkingRules, expected }) => {
    const result = calculateNextCleaningTime(parkingRules, currentTime);
    expect(result?.toISO()).toEqual(expected.toISO());
  });

  });




describe('calculateCleaning function tests with July as no cleaning month', () => {
  const testCases = [
    {
      description: 'Finds next cleaning time after month of cleaning-break, currently in month before cleaning break',
      currentTime: DateTime.local(2023, 6, 30, 21),
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [7], }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 8, 2, 8),
    },
    {
      description: 'Finds next cleaning time after cleaning break, currently in cleaning break',
      currentTime: DateTime.local(2023, 7, 10, 21),
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.FRIDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [7], }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 8, 11, 8),
    },
    {
      description: 'Returns to normal checks after cleaning-break',
      currentTime: DateTime.local(2023, 7, 26, 21),
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.TUESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [7], }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 8, 8, 8),
    },
    {
      description: 'During cleaning break, is not affected by cleaning "ongoing"',
      currentTime: DateTime.local(2023, 7, 19, 10),
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [7], }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 8, 2, 8),
    },
    {
      description: 'During cleaning break, is not affected by cleaning "earlier in the same day"',
      currentTime: DateTime.local(2023, 7, 20, 18),
      parkingRules: {
      cleaningTimes: [{ day: DayOfWeek.THURSDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [7], }],
      maximum: { days: 14 }
      },
      expected: DateTime.local(2023, 8, 3, 8),
    },
  ];

  test.each(testCases)('(%s)', ({ currentTime, parkingRules, expected }) => {
    const result = calculateNextCleaningTime(parkingRules, currentTime);
    expect(result?.toISO()).toEqual(expected.toISO());
  });
});




describe('calculateCleaning function tests with different months as no cleaning month', () => {
  const testCases = [
{
  description: 'Finds next cleaning time, with cleaning break August',
  currentTime: DateTime.local(2023, 7, 28, 8),
  parkingRules: {
  cleaningTimes: [{ day: DayOfWeek.THURSDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [8], }],
  maximum: { days: 14 }
  },
  expected: DateTime.local(2023, 9, 14, 8),
},
{
  description: 'Finds next cleaning time, with cleaning break June',
  currentTime: DateTime.local(2023, 6, 23, 8),
  parkingRules: {
  cleaningTimes: [{ day: DayOfWeek.WEDNESDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: true, appliesToOddWeeks: false, noCleaningMonths: [6], }],
  maximum: { days: 14 }
  },
  expected: DateTime.local(2023, 7, 12, 8),
}, 
  ];
test.each(testCases)('(%s)', ({ currentTime, parkingRules, expected }) => {
  const result = calculateNextCleaningTime(parkingRules, currentTime);
  expect(result?.toISO()).toEqual(expected.toISO());
});
});

describe('calculateCleaning tests with consecutive months as no cleaning months', () => {
  const testCases = [
{
  description: 'Finds next cleaning time, in first half of two-month break',
  currentTime: DateTime.local(2023, 2, 9, 8), //during first month of cleaning break thursday morning
  parkingRules: {
  cleaningTimes: [{ day: DayOfWeek.MONDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [2,3], }],
  maximum: { days: 14 }
  },
  expected: DateTime.local(2023, 4, 10, 8),
},
{
  description: 'Finds next cleaning time, before three-month break, also checks crossing year-end',
  currentTime: DateTime.local(2023, 9, 28, 8), //just before three-month break thursday morning
  parkingRules: {
  cleaningTimes: [{ day: DayOfWeek.MONDAY, startHour: 8, endHour: 14, appliesToEvenWeeks: false, appliesToOddWeeks: true, noCleaningMonths: [10,11,12], }],
  maximum: { days: 14 }
  },
  expected: DateTime.local(2024, 1, 1, 8),
}, 
  ];
test.each(testCases)('(%s)', ({ currentTime, parkingRules, expected }) => {
  const result = calculateNextCleaningTime(parkingRules, currentTime);
  expect(result?.toISO()).toEqual(expected.toISO());
});
});

