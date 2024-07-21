import crypto from 'crypto'

/**
 * Helpers to generate a unique task identifier that can be used to cancel any previously existing identifiers for the same vehicle and recipient.
 * Note that @ and . had to be stripped! "letters ([A-Za-z]), numbers ([0-9]), hyphens (-), or underscores (_). Task ID must between 1 and 500 characters."
 * This function ensures (supposed) uniqueness by hashing the full string, so that first.lastname and firstlastname doesn't become the same, by e.g. stripping any specific characters.
 * Note that the hashing is only to meet the criteria above, since hashing would only obscure any sensitive info, and this is sent along with the request anyway.
 * @param body 
 * @returns unique hash hex digest (containing only 0-9, a-f)
 */
export const generateUniqueTaskIdentifier = (body: TriggerReminderInput) => {
  const method = 'EMAIL'
  const unique_id = `${method}_${body.to_email}_${body.vehicle_nickname}`
  const hashed_unique_id = crypto.createHash('sha1').update(unique_id).digest('hex')
  
  return hashed_unique_id
}

export interface TriggerReminderInput {
  to_email: string
  vehicle_nickname: string
  location: {
    name: string
    lat: number
    lng: number
  },
  move_by_timestamp: string // e.g. '2024-05-02T16:10:18Z'
}
