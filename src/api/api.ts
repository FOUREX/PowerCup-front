import axios, { HttpStatusCode } from "axios";
import { SERVER } from "./config";
import { LoginRequest, Team, User } from "./types.ts";

const instance = axios.create({
  baseURL: SERVER,
  withCredentials: true,
  validateStatus: () => true,
});

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await instance.post("/auth/login", {
    name: data.login,
    password: data.password,
  });

  if (response.status === HttpStatusCode.NoContent) {
    throw new Error(response.data.detail);
  }

  const user = await instance.get<User>("/me");

  return {
    id: user.data.id,
    name: user.data.name,
    created_at: user.data.created_at,
    personal_data: {
      first_name: user.data.personal_data.first_name,
      last_name: user.data.personal_data.last_name
    }
  };
};

export const get_teams = async (): Promise<Array<Team>> => {
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
