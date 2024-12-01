export interface LoginRequest {
  login: string
  password: string
}

export interface PersonalData {
  first_name: string | null
  last_name: string | null
}

export interface User {
  id: number
  name: string
  personal_data: PersonalData
  created_at: string
}

export interface TeamMember {
  user: User
  role: number
}

export interface Team {
  id: number
  name: string
  members: Array<TeamMember>
}

export interface CreateTeam {
  name: string
  members: Array<{user_id: number, role: number}>
}
