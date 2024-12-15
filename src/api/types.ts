export enum TeamJoinRequestType {
  Invite,
  Request
}

export enum TeamMemberRole {
  Leader,
  Admin,
  Member,
  Reserved
}

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
  avatar_url: string
  personal_data: PersonalData
  created_at: string
}

export interface TeamMember {
  user: User
  role: TeamMemberRole
}

export interface TeamJoinRequest {
  user: User
  type: TeamJoinRequestType
}

export interface Team {
  id: number
  name: string
  avatar_url: string
  members: TeamMember[],
  join_requests: TeamJoinRequest[]
}

export interface CreateTeam {
  name: string
  members: {user_id: number, role: number}[]
}

export interface SendInvite {
  team_id: number
  user_id: number
}

export interface CancelInvite {
  team_id: number
  user_id: number
}

export interface SendRequest {
  team_id: number
}

export interface AcceptRequest {
  team_id: number
  user_id: number
}

export interface RejectRequest {
  team_id: number
  user_id: number
}
