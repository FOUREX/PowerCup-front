import {Tag} from "antd";
import * as React from "react";
import {LOCALES} from "../../locales";

interface Props {
  role: number
}

const roles: string[] = [
  LOCALES.TEAM_MEMBER_ROLE.OWNER,
  LOCALES.TEAM_MEMBER_ROLE.ADMIN,
  LOCALES.TEAM_MEMBER_ROLE.MEMBER,
  LOCALES.TEAM_MEMBER_ROLE.RESERVED,
]

const colors: string[] = [
  "red", "gold", "green", "cyan"
]

export const RoleTag: React.FC<Props> = ({ role }) => {
  return (
    <Tag
      color={colors[role]}
    >
      {roles[role]}
    </Tag>
  )
}