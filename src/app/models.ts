export type Shop = {
  _id: string,
  name: string,
  link: string,
  items: any[]
  users: User[],
  managers: User[]
}

export type User = {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  balance?: number,
  isManager?: boolean,
  hide?: boolean
}