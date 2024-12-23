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

export enum TournamentMemberStatus {
  Pending,
  Accepted,
  Rejected
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

export interface TeamInvitation {
  team: Team
  type: TeamJoinRequestType
}

export interface CreateTeam {
  name: string
  members: {user_id: number, role: number}[]
}

export interface SendInvite {
  team_id: number
  user_id: number
}

export interface AcceptInvite {
  team_id: number
}

export interface RejectInvite {
  team_id: number
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

export interface CreateGame {
  name: string
  short_name: string
}

export interface Game {
  id: number
  name: string
  short_name: string
}

export interface TournamentMember {
  team: Team
  status: TournamentMemberStatus
}

export interface CreateTournament {
  name: string
  description: string | null
  poster: File
  game_id: number
}

export interface Tournament {
  id: number
  name: string
  description: string | null
  poster_url: string | null
  status: number
  game: Game
  members: TournamentMember[]
}

export interface AddTournamentMember {
  tournament_id: number
  team_id: number
}
