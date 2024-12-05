import {Avatar, Button, Table} from "antd";
import {UserOutlined, UserDeleteOutlined} from "@ant-design/icons"
import * as React from "react";
import {TeamMember} from "../../api/types.ts";
import {LOCALES} from "../../locales";
import {RoleTag} from "../RoleTag/RoleTag.tsx";
import {UserTag} from "../UserTag/UserTag.tsx";

interface Props {
  members: TeamMember[]
}

const columns = [
  {
    title: LOCALES.TEAM_MEMBERS.USER,
    dataIndex: "avatar",
    key: "avatar",
    width: 1
  },
  {
    title: LOCALES.TEAM_MEMBERS.USER,
    dataIndex: "user",
    key: "user"
  },
  {
    title: LOCALES.TEAM_MEMBERS.ROLE,
    dataIndex: "role",
    key: "role"
  },
  {
    title: LOCALES.TEAM_MEMBERS.ACTIONS,
    dataIndex: "actions",
    key: "actions",
    align: "right"
  },
]

export const TeamMembers: React.FC<Props> = ({members}) => {
  const rows = members.map((member: TeamMember) => {
    return {
      key: member.user.id,
      avatar: <Avatar icon={<UserOutlined />}/>,
      user: <UserTag user={member.user} />,
      role: <RoleTag role={member.role} />,
      actions: <Button icon={<UserDeleteOutlined />} />
    }
  })

  return (
    <>
      <Table
        showHeader={false}
        pagination={false}
        size="small"
        columns={columns}
        dataSource={rows}
      />
    </>
  );
}