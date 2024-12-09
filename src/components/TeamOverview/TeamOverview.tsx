import * as React from "react";
import {Avatar, Button, Divider} from "antd";
import {SettingOutlined} from "@ant-design/icons"
import {Team} from "api/types.ts";
import {useTranslation} from "react-i18next";
import {UserTag} from "../UserTag/UserTag.tsx";


interface Props {
  team: Team
}


export const TeamOverview: React.FC<Props> = ({ team }) => {
  const { t }: { t: (key: string) => string } = useTranslation()
  const leader = team.members.find((member) => (member.role == 0))

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          <h1 className="m-0">{team.name}</h1>

        </div>
        <Button
          className="right-auto"
          icon={<SettingOutlined />}
        /></div>

      <Divider className="my-3" />

      <div className="flex flex-col font-semibold">
        <span>{t("TEAM_OVERVIEW.LEADER")}: <UserTag user={leader.user} /></span>
        <span>{t("TEAM_OVERVIEW.NUMBER_OF_MEMBERS")}: {team.members.length}</span>
      </div>
    </div>
  );
};