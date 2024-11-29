import { HttpStatusCode } from "axios";
import { Team } from "./types.ts";

import {instance} from "./base.api.ts";

export const fetchTeams = async (): Promise<Array<Team>> => {
  const response = await instance.get<Team[]>("/teams");

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail);
  }

  return response.data.map((team: Team) => ({
    id: team.id,
    name: team.name,
    members: team.members,
  }));
};
