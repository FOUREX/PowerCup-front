import { HttpStatusCode } from "axios";

import { User } from "./types.ts";
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
    personal_data: {
      first_name: response.data.personal_data.first_name,
      last_name: response.data.personal_data.last_name
    }
  };
};
