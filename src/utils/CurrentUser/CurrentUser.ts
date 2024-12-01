import {User} from "../../api/types.ts"


export const CurrentUser = {
  get: (): User | undefined => {
    const data = localStorage.getItem("user")

    return data == undefined ? data : JSON.parse(data)
  },

  set: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user))
  },

  del: () => {
    localStorage.removeItem("user")
  }
}
