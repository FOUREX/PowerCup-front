export interface LoginRequest {
  login: string
  password: string
}

export interface User {
  id: number
  name: string
  created_at: string
}
