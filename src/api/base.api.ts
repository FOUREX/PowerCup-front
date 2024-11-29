import axios from "axios";
import {SERVER} from "./config.ts";

export const instance = axios.create({
  baseURL: SERVER,
  withCredentials: true,
  validateStatus: () => true,
});
