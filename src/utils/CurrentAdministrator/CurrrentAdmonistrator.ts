import {User} from "../../api/types.ts"


export const CurrentAdministrator = {
  get: (): User | undefined => {
    const data = localStorage.getItem("administrator")

    return data == undefined ? data : JSON.parse(data)
  },

  set: (user: User) => {
    localStorage.setItem("administrator", JSON.stringify(user))
  },

  del: () => {
    localStorage.removeItem("administrator")
  }
}
