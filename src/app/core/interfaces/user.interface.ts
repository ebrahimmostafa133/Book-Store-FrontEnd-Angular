export interface UserProfile {
  _id?: string
  email: string
  firstName: string
  lastName: string
  dob: string | Date
  role?: string
}
