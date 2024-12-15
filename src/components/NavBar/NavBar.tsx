import "../../index.css";
import "./style.css";
import {InboxOutlined} from "@ant-design/icons";

import {Badge, Button} from "antd";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router";
import {CurrentUser} from "../../utils";


function NavBar() {
  const { t }: { t: (key: string, options?: object) => string } = useTranslation()

  const navigate = useNavigate()
  const current_user = CurrentUser.get()
  const is_logged = current_user != undefined

  const on_logout_button_click = () => {
    CurrentUser.del()
    navigate("/")
  }

  return (
    <header className="z-50 flex justify-center fixed w-full top-0 text-lg h-17 font-medium mb-28">
      <div
        className="flex justify-between rounded-md p-2 m-3 h-full items-center box-border"
        style={{
          width: 1200,
          maxWidth: 1200,
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
          <Link to="/teams">{t("NAVBAR.TEAMS")}</Link>
          <Link to="/matches">{t("NAVBAR.MATCHES")}</Link>
          <Link to="/tournaments">{t("NAVBAR.TOURNAMENTS")}</Link>
        </div>
        <div className="flex gap-x-2" style={{ textAlign: "justify" }}>
          {is_logged ? (
            <>
              <span>{current_user?.name}</span>

              <Badge count={0} size="small">
                <Button
                  type="default"
                  icon={<InboxOutlined />}
                />
              </Badge>

              <Button
                onClick={on_logout_button_click}
              >
                {t("NAVBAR.LOGOUT")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button>{t("NAVBAR.LOGIN")}</Button>
              </Link>

              <Link to="/register">
                <Button type="primary">{t("NAVBAR.REGISTER")}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
