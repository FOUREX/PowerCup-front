import {Avatar, Button, Table} from "antd";
import {UserOutlined, UserDeleteOutlined} from "@ant-design/icons"
import {ColumnsType} from "antd/es/table";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {TeamMember} from "../../api/types.ts";
import {RoleTag} from "../RoleTag/RoleTag.tsx";
import {UserTag} from "../UserTag/UserTag.tsx";

interface Props {
  members: TeamMember[],
  adminView?: boolean
}

export const TeamMembers: React.FC<Props> = ({members, adminView }) => {
  const { t }: { t: (key: string, options?: object) => string } = useTranslation()

  const columns: ColumnsType = [
    {
      title: t("TEAM_MEMBERS.USER"),
      dataIndex: "avatar",
      key: "avatar",
      width: 1
    },
    {
      title: t("TEAM_MEMBERS.USER"),
      dataIndex: "user",
      key: "user"
    },
    {
      title: t("TEAM_MEMBERS.ROLE"),
      dataIndex: "role",
      key: "role"
    },
    adminView ? {
      title: t("TEAM_MEMBERS.ACTIONS"),
      dataIndex: "actions",
      key: "actions",
      align: "right"
    } : {},
  ]

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