import { HttpStatusCode } from "axios";

import {User} from "./types.ts";
import {instance} from "./base.api.ts";


export const getMe = async (): Promise<User> => {
  const response = await instance.get<User>("/me");

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail);
  }

  return {
    id: response.data.id,
    name: response.data.name,
    created_at: response.data.created_at,
    avatar_url: response.data.avatar_url,
    personal_data: {
      first_name: response.data.personal_data.first_name,
      last_name: response.data.personal_data.last_name
    }
  };
};


export const fetchUsers = async (): Promise<User[]> => {
  const response = await instance.get<User>("/users")

  if (response.status !== HttpStatusCode.Ok) {
    throw new Error(response.data.detail);
  }

  return response.data.map((user: User) => ({
    id: user.id,
    name: user.name,
    created_at: user.created_at,
    avatar_url: user.avatar_url,
    personal_data: {
      first_name: user.personal_data.first_name,
      last_name: user.personal_data.last_name
    }
  }))
}
