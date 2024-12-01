import "../../index.css";
import { LOCALES } from "../../locales";
import "./style.css";

import { Button } from "antd";
import {Link, useNavigate} from "react-router";
import {CurrentUser} from "../../utils";


function NavBar() {
  const navigate = useNavigate()
  const current_user = CurrentUser.get()
  const is_logged = current_user != undefined

  const on_logout_button_click = () => {
    CurrentUser.del()
    navigate("/")
  }

  return (
    <header className="z-50 flex justify-center fixed w-full text-lg h-17 font-medium mb-28">
      <div
        className="flex justify-between rounded-md p-2 m-3 h-full items-center box-border"
        style={{
          width: 1200,
          maxWidth: 1200,
          // boxShadow: "0 0 10px 10px rgba(from var(--color-primary) r g b / .1)",
          // border: "1px solid var(--color-primary)",
          backgroundColor: "rgba(from var(--color-background-secondary) r g b / .1)",
          backdropFilter: "blur(5px)"
        }}
      >
        <div>
          <Link to="/">
            <b>
              Power
              <span
                style={{
                  color: "var(--color-primary)",
                }}
              >
                Cup
              </span>
            </b>
          </Link>
        </div>
        <div className="flex gap-3">
          <Link to="/teams">{LOCALES.NAVBAR.TEAMS}</Link>
          <Link to="/matches">{LOCALES.NAVBAR.MATCHES}</Link>
          <Link to="/tournaments">{LOCALES.NAVBAR.TOURNAMENTS}</Link>
        </div>
        <div className="flex gap-x-3" style={{ textAlign: "justify" }}>
          {is_logged ? (
            <>
              <span>{current_user?.name}</span>
              <Button
                onClick={on_logout_button_click}
              >
                Вийти
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button>{LOCALES.NAVBAR.LOGIN}</Button>
              </Link>

              <Link to="/register">
                <Button type="primary">{LOCALES.NAVBAR.REGISTER}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
