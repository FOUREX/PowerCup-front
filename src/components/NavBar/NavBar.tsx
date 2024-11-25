import "../../index.css"
import "./style.css"

import MenuItem from "antd/es/menu/MenuItem";

import {Button, MenuProps} from "antd";
import {Link} from "react-router";

type MenuItem = Required<MenuProps>["items"][number]

const items: MenuItem[] = [
  {
    label: "PowerCup",
    key: "title",
  },
  {
    label: "Teams",
    key: "teams"
  },
  {
    label: "Matches",
    key: "matches"
  }
]

function NavBar() {
  return (
    <>
      <header
        className="flex justify-center fixed w-full text-lg h-17 font-medium"
      >
        <div
          className="flex justify-between rounded-md p-2 m-3 h-full items-center box-border"
          style={{
            width: 1200,
            maxWidth: 1200,
            boxShadow: "0 0 10px 10px rgba(from var(--color-primary) r g b / .1)",
            border: "1px solid var(--color-primary)",
            backgroundColor: "var(--color-bg-secondary)"
          }}
        >
          <div>
            <Link to="/">
              <b>
                Power
                <span
                  style={{
                    color: "var(--color-primary)"
                }}
                >
                  Cup
                </span>
              </b>
            </Link>

          </div>
          <div className="flex gap-3">
            <a href="">
              Команди
            </a>
            <a href="">
              Матчі
            </a>
            <a href="">
              Турніри
            </a>
          </div>
          <div className="flex gap-x-3" style={{textAlign: "justify"}}>
            <Link
              to="/login"
            >
              <Button>
                Увійти
              </Button>
            </Link>

            <Link
              to="/register"
            >
              <Button>
                Зареєструватися
              </Button>
            </Link>


          </div>
        </div>
      </header>
    </>
  )
}

export default NavBar
