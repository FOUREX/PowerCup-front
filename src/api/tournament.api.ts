import {HttpStatusCode} from "axios";
import { instance } from "./base.api.ts";
import {AddTournamentMember, CreateTournament, Game, Tournament, TournamentMember} from "./types.ts";

export const createTournament = async (data: CreateTournament): Promise<Tournament> => {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("description", data.description || "")
  formData.append("poster", data.poster)
  formData.append("game_id", data.game_id.toString())

  // noinspection JSAnnotator
  const response = await instance.post<Tournament>(
    "/tournament",
    formData,
    {headers: {"Content-Type": "multipart/form-data"}}
  )

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail);
  }

  console.log(response.data)
}

export const fetchTournaments = async (): Promise<Tournament[]> => {
  // noinspection JSAnnotator
  const response = await instance.get<Tournament[]>("/tournaments")

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail);
  }

  return response.data.map((tournament: Tournament) => ({
    id: tournament.id,
    name: tournament.name,
    description: tournament.description,
    poster_url: tournament.poster_url,
    status: tournament.status,
    game: {
      id: tournament.game.id,
      name: tournament.game.name,
      short_name: tournament.game.short_name
    },
    members: tournament.members.map((member: TournamentMember) => ({
      team: member.team,
      status: member.status
    })),
  }))
}

export const fetchGames = async (): Promise<Game[]> => {
  const response = await instance.get<Game[]>("/tournament/games")

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail);
  }

  return response.data.map((game: Game) => ({
    id: game.id,
    name: game.name,
    short_name: game.short_name
  }))
}

export const addTournamentMember = async (data: AddTournamentMember) => {
  const response = await instance.post("/tournament/member", data)

  if (response.status !== HttpStatusCode.NoContent) {
    throw new Error(response.data.detail);
  }
}
