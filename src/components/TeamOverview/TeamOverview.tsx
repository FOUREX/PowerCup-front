import { SettingOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import {Avatar, Button, Divider, notification, Tag} from "antd";
import { Team, TeamMemberRole } from "api/types.ts";
import {useEffect, useState} from "react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {sendJoinRequest} from "../../api/teams.api.ts";
import { CurrentUser } from "../../utils";
import { UserTag } from "../UserTag/UserTag.tsx";

interface Props {
  team: Team;
}

export const TeamOverview: React.FC<Props> = ({
  team
}) => {
  const { t }: { t: (key: string, options?: object) => string } =
    useTranslation();
  const [api, contextHolder] = notification.useNotification()

  const currentUser = CurrentUser.get();
  const currentMember = team.members.find(
    (member) => member.user.id === currentUser?.id,
  );

  const leader = team.members.find((member) => member.role == 0);

  const [joinRequestSent, setJoinRequestSent] = useState<boolean>(false)

  const onSendJoinRequest = async () => {
    setJoinRequestSent(true)

    try {
      await sendJoinRequest({
        team_id: team.id
      });

      api.success({
        message: t("COMPONENT.TEAM_OVERVIEW.NOTIFICATION.SUCCESS"),
        description: t("COMPONENT.TEAM_OVERVIEW.NOTIFICATION.SUCCESS_DESCRIPTION"),
        placement: "bottomRight"
      })
    } catch (reason) {
      api.error({
        message: t("COMPONENT.TEAM_OVERVIEW.NOTIFICATION.ERROR"),
        description: reason.message,
        placement: "bottomRight"
      })
    }
  }

  return (
    <>
      {contextHolder}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="large" src={team.avatar_url} />
            <h1 className="m-0">{team.name}</h1>
          </div>

          {currentMember?.role in [TeamMemberRole.Leader, TeamMemberRole.Admin] ? (
            <Button
              className="right-auto"
              icon={<SettingOutlined />}

            />
          ) : currentMember ? (
            <></>
          ) : (
            <Button
              className="right-auto"
              icon={<UsergroupAddOutlined />}
              onClick={onSendJoinRequest}
              disabled={joinRequestSent}
            />
          )}
        </div>

        <Divider className="my-3" />

        <div className="flex flex-col font-semibold">
        <span>
          ID: <Tag>{team.id}</Tag>
        </span>
          <span>
          {t("TEAM_OVERVIEW.LEADER")}: <UserTag user={leader.user} />
        </span>
          <span>
          {t("TEAM_OVERVIEW.NUMBER_OF_MEMBERS")}: {team.members.length}
        </span>
        </div>
      </div>
    </>
  );
};