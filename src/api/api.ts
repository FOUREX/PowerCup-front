import axios, {AxiosResponse, HttpStatusCode} from "axios";
import {SERVER} from "../config.ts";
import {LoginRequest, User} from "./type.ts";

const instance = axios.create({
  baseURL: SERVER,
  withCredentials: true,
  validateStatus: (status) => {return true}
})

export const API = {
  login: async (data: LoginRequest): Promise<User> => {
    const response = await instance.post("/auth/login", {
      name: data.login,
      password: data.password
    })

    if (response.status !== HttpStatusCode.NoContent) {
      throw new Error(`${response.status} ${response.data["detail"]}}`)
    }

    const user: AxiosResponse<User> = await instance.get("/me")

    return user.data
  }
}
