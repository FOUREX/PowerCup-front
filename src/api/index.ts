import { login } from './auth.api.ts'
import { fetchTeams, createTeam } from "./teams.api.ts"
import { getMe } from "./users.api.ts"
import {fetchGames} from "./tournament.api.ts";
import * as admin from "./admin.api.ts"

export { login, fetchTeams, createTeam, getMe, fetchGames, admin }

