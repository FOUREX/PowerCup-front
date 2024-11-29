import {User} from "api/types.ts"


export const CurrentUser = {
  get: (): User | null => {
    const data = localStorage.getItem("user")

    return typeof data === "undefined" ? null : JSON.parse(data)
  },

  set: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user))
  },

  del: () => {
    localStorage.removeItem("user")
  }
}
