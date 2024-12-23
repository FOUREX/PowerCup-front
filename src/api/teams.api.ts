import {HttpStatusCode} from "axios";
import {
  AcceptInvite,
  AcceptRequest,
  CancelInvite,
  CreateTeam, RejectInvite,
  RejectRequest,
  SendInvite,
  SendRequest,
  Team, TeamInvitation,
  TeamJoinRequestType
} from "./types.ts";

import {instance} from "./base.api.ts";

export const fetchTeams = async (): Promise<Array<Team>> => {
  const response = await instance.get<Team[]>("/teams");

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail)
  }

  return response.data.map((team: Team) => ({
    id: team.id,
    name: team.name,
    avatar_url: team.avatar_url,
    members: team.members,
    join_requests: team.join_requests
  }))
}

export const fetchMyTeams = async (): Promise<Array<Team>> => {
  const response = await instance.get<Team[]>("/teams/my");

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail)
  }

  return response.data.map((team: Team) => ({
    id: team.id,
    name: team.name,
    avatar_url: team.avatar_url,
    members: team.members,
    join_requests: team.join_requests
  }))
}

export const createTeam = async (data: CreateTeam): Promise<Team> => {
  const response = await instance.post<Team>("/team", data);

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail)
  }

  return {
    id: response.data.id,
    name: response.data.name,
    avatar_url: response.data.avatar_url,
    members: response.data.members,
    join_requests: response.data.join_requests
  }
}

export const fetchInvitations = async (): Promise<TeamInvitation[]> => {
  const response = await instance.get<TeamInvitation[]>("/team/join/invitations");

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail)
  }

  return response.data
    .filter((invitation: TeamInvitation) => invitation.type == TeamJoinRequestType.Invite)
    .map((invitation : TeamInvitation) => ({
      team: invitation.team,
      type: invitation.type
    }))
}

export const sendJoinInvite = async (data: SendInvite) => {
  const response = await instance.post("/team/join/invite", data);

  if (response.status !== HttpStatusCode.NoContent) {
    throw new Error(response.data.detail)
  }
}

export const acceptJoinInvite = async (data: AcceptInvite) => {
  const response = await instance.patch("/team/join/invite", data);

  if (response.status !== HttpStatusCode.NoContent) {
    throw new Error(response.data.detail)
  }
}

export const rejectJoinInvite = async (data: RejectInvite) => {
  // noinspection JSAnnotator
  const response = await instance.delete("/team/join/invite", { data: data });

  if (response.status !== HttpStatusCode.NoContent) {
    throw new Error(response.data.detail)
  }
}

export const cancelJoinInvite = async (data: CancelInvite) => {
  // noinspection JSAnnotator
  const response = await instance.delete<Team>("/team/join/invite", { data: data });

  if (response.status !== HttpStatusCode.NoContent) {
    throw new Error(response.data.detail)
  }
}

export const sendJoinRequest = async (data: SendRequest) => {
  const response = await instance.post("/team/join/request", data);

  if (response.status !== HttpStatusCode.NoContent) {
    throw new Error(response.data.detail)
  }
}

export const acceptJoinRequest = async (data: AcceptRequest) => {
  const response = await instance.patch("/team/join/request", data);

  if (response.status !== HttpStatusCode.NoContent) {
    throw new Error(response.data.detail)
  }
}

export const rejectJoinRequest = async (data: RejectRequest) => {
  // noinspection JSAnnotator
  const response = await instance.delete("/team/join/request", { data: data });

  if (response.status !== HttpStatusCode.NoContent) {
    throw new Error(response.data.detail)
  }
}
