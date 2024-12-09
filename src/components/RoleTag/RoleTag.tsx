import {Tag} from "antd";
import * as React from "react";
import {useTranslation} from "react-i18next";

interface Props {
  role: number
}

const colors: string[] = [
  "red", "gold", "green", "cyan"
]

export const RoleTag: React.FC<Props> = ({ role }) => {
  const {t} = useTranslation()

  const roles: string[] = [
    t("TEAM_MEMBER_ROLE.OWNER"),
    t("TEAM_MEMBER_ROLE.ADMIN"),
    t("TEAM_MEMBER_ROLE.MEMBER"),
    t("TEAM_MEMBER_ROLE.RESERVED"),
  ]

  return (
    <Tag
      color={colors[role]}
    >
      {roles[role]}
    </Tag>
  )
}