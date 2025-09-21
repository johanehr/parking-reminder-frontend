import { generateUniqueTaskIdentifier, TriggerReminderInput } from "../helper-functions/gcpTaskHelpers"

describe('generateUniqueTaskIdentifier', () => {
  it('identifier is hexadecimal', () => {
    const input: TriggerReminderInput = {
      to_email: 'john.smith@example.com',
      vehicle_nickname: 'ABC123',
      location: {
        name: 'Cool Street 123',
        lat: 12.34,
        lng: 56.78,
      },
      move_by_timestamp: '2024-05-02T16:10:18Z'
    }

    const id = generateUniqueTaskIdentifier(input)

    expect(typeof id).toBe('string')

    const hexRegex = /^[0-9A-Fa-f]+$/
    expect(hexRegex.test(id)).toBe(true)
  })
})
