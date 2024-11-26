import axios from "axios";
import {SERVER} from "./config.ts";

export const api = axios.create({
  baseURL: SERVER,
  withCredentials: true
})