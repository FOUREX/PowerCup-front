import "../../index.css";
import "./style.css";
import {InboxOutlined, MenuOutlined} from "@ant-design/icons";

import {Badge, Button, Popover, Space} from "antd";
import {Locale} from "antd/es/locale";
import {useEffect, useState} from "react";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router";
import {CurrentUser} from "../../utils";
import {InvitationsList} from "../InvitationsList/InvitationsList.tsx";


function NavBar() {
  const { t }: { t: (key: string, options?: object) => string } = useTranslation()

  const navigate = useNavigate()
  const current_user = CurrentUser.get()
  const is_logged = current_user != undefined

  const [selectedLanguage, setSelectedLanguage] = useState<Locale>()

  const on_logout_button_click = () => {
    CurrentUser.del()
    navigate("/")
  }

  const setLng = (lng: string) => {
    localStorage.setItem("lng", lng)
    setSelectedLanguage(lng as Locale)
    window.location.reload()
  }

  useEffect(() => {
    if (!localStorage.getItem("lng")) {
      localStorage.setItem("lng", "ua")
    }

    setSelectedLanguage(localStorage.getItem("lng") as Locale)
  }, []);

  // noinspection JSIncompatibleTypesComparison
  return (
    <header className="z-50 flex justify-center fixed w-full top-0 text-lg h-17 font-medium mb-28">
      <div
        className="flex justify-between rounded-md p-2 m-3 h-full items-center box-border"
        style={{
          width: 1200,
          maxWidth: 1200,
          backgroundColor:
            "rgba(from var(--color-background-secondary) r g b / .1)",
          backdropFilter: "blur(5px)",
        }}
      >
        <div>
          <Link to="/">
            <b>
              Power<span style={{ color: "var(--color-primary)" }}>Cup</span>
            </b>
          </Link>
        </div>

        <div className="flex gap-3 w-28 links">
          <Link to="/teams">{t("NAVBAR.TEAMS")}</Link>
          <Link to="/matches">{t("NAVBAR.MATCHES")}</Link>
          <Link to="/tournaments">{t("NAVBAR.TOURNAMENTS")}</Link>
        </div>

        <div className="flex gap-x-2" style={{ textAlign: "justify" }}>
          {is_logged ? (
            <>
              <span>{current_user?.name}</span>

              <Popover
                content={<InvitationsList />}
                overlayStyle={{ minWidth: 400 }}
                placement="bottomRight"
                trigger="click"
              >
                <Badge count={0} size="small">
                  <Button type="default" icon={<InboxOutlined />} />
                </Badge>
              </Popover>

              <Space.Compact>
                <Button
                  type={selectedLanguage === "ua" ? "primary" : "default"}
                  onClick={() => setLng("ua")}
                >
                  UA
                </Button>
                <Button
                  type={selectedLanguage === "en" ? "primary" : "default"}
                  onClick={() => setLng("en")}
                >
                  EN
                </Button>
              </Space.Compact>

              <Button className="links" onClick={on_logout_button_click}>
                {t("NAVBAR.LOGOUT")}
              </Button>
            </>
          ) : (
            <>
              <Space.Compact>
                <Button
                  type={selectedLanguage === "ua" ? "primary" : "default"}
                  onClick={() => setLng("ua")}
                >
                  UA
                </Button>
                <Button
                  type={selectedLanguage === "en" ? "primary" : "default"}
                  onClick={() => setLng("en")}
                >
                  EN
                </Button>
              </Space.Compact>

              <Link className="links" to="/login">
                <Button>{t("NAVBAR.LOGIN")}</Button>
              </Link>

              <Link className="links" to="/register">
                <Button type="primary">{t("NAVBAR.REGISTER")}</Button>
              </Link>
            </>
          )}

          <Popover
            className="menu"
            content={
              <div>
                <div className="flex flex-col items-end gap-3">
                  <Link to="/teams">{t("NAVBAR.TEAMS")}</Link>
                  <Link to="/matches">{t("NAVBAR.MATCHES")}</Link>
                  <Link to="/tournaments">{t("NAVBAR.TOURNAMENTS")}</Link>

                  {is_logged ? (
                    <Button onClick={on_logout_button_click}>
                      {t("NAVBAR.LOGOUT")}
                    </Button>
                    ) : (
                    <Space.Compact>
                      <Link to="/login">
                        <Button>{t("NAVBAR.LOGIN")}</Button>
                      </Link>

                      <Link to="/register">
                        <Button type="primary">{t("NAVBAR.REGISTER")}</Button>
                      </Link>
                    </Space.Compact>
                  )}
                </div>
              </div>
            }
            placement="bottomRight"
            trigger="click"
          >
            <Button className="menu" type="primary" icon={<MenuOutlined />} />
          </Popover>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
