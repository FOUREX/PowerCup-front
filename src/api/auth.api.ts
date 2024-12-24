import { HttpStatusCode } from "axios";

import {LoginRequest, RegisterData, User} from "./types.ts";
import {instance} from "./base.api.ts";


export const login = async (data: LoginRequest): Promise<User> => {
  const response = await instance.post("/auth/login", {
    name: data.login,
    password: data.password,
  });

  if (response.status !== HttpStatusCode.NoContent) {
    throw new Error(response.data.detail);
  }

  const user = await instance.get<User>("/me");

  return {
    id: user.data.id,
    name: user.data.name,
    created_at: user.data.created_at,
    avatar_url: user.data.avatar_url,
    personal_data: {
      first_name: user.data.personal_data.first_name,
      last_name: user.data.personal_data.last_name
    }
  };
};


export const register = async (data: RegisterData) => {
  const response = await instance.post<User>("/auth/register", {
    name: data.login,
    password: data.password,
  });

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
