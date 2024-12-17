import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {Avatar, Button, notification, Space, Spin, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {useCallback, useEffect, useRef, useState} from "react";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {acceptJoinInvite, fetchInvitations, rejectJoinInvite} from "../../api/teams.api.ts";
import {Team, TeamInvitation} from "../../api/types.ts";
import {TeamTag} from "../TeamTag/TeamTag.tsx";

type TableItem = {
  key: number;
  avatar: React.ReactNode;
  team: React.ReactNode;
  actions: React.ReactNode;
}

export const InvitationsList: React.FC = () => {
  const { t }: { t: (key: string, options?: object) => string } = useTranslation();
  const [api, contextHolder] = notification.useNotification();

  const [invitations, setInvitations] = useState<TeamInvitation[] | undefined>(undefined)
  const invitationsFetched = useRef<boolean>(false)

  const [tableItems, setTableItems] = useState<TableItem[]>()

  const columns: ColumnsType<TableItem> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 1,
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      align: "right",
    }
  ];

  const deleteMenuItem = useCallback((team_id: number) => {
    setTableItems(
      (prevItems) => prevItems ? prevItems.filter(item => item.key !== team_id) : []
    )
  }, [])

  const onAcceptJoinInvitation = useCallback(async (team: Team) => {
    try {
      await acceptJoinInvite({
        team_id: team.id,
      });

      api.success({
        message: t("COMPONENT.INVITATIONS_LIST.NOTIFICATION.INVITATION_ACCEPTED"),
        description: t(
          "COMPONENT.INVITATIONS_LIST.NOTIFICATION.INVITATION_ACCEPTED_DESCRIPTION",
          {team_name: team.name}
        ),
        placement: "bottomRight",
      })

      deleteMenuItem(team.id)
    } catch (reason) {
      api.error({
          message: t("COMPONENT.INVITATIONS_LIST.NOTIFICATION.INVITATION_ACCEPTED_ERROR"),
          description: reason.message,
          placement: "bottomRight",
      })
    }
  }, [api, deleteMenuItem, t]);

  const onRejectJoinInvitation = useCallback(async (team: Team) => {
    try {
      await rejectJoinInvite({
        team_id: team.id,
      });

      api.success({
        message: t("COMPONENT.INVITATIONS_LIST.NOTIFICATION.INVITATION_REJECTED"),
        description: t(
          "COMPONENT.INVITATIONS_LIST.NOTIFICATION.INVITATION_REJECTED_DESCRIPTION",
          {team_name: team.name}
        ),
        placement: "bottomRight",
      })

      deleteMenuItem(team.id)
    } catch (reason) {
      api.error({
          message: t("COMPONENT.INVITATIONS_LIST.NOTIFICATION.INVITATION_REJECTED_ERROR"),
          description: reason.message,
          placement: "bottomRight",
      })
    }
  }, [api, deleteMenuItem, t]);

  useEffect(() => {
    if (invitationsFetched.current) return
    invitationsFetched.current = true

    fetchInvitations().then((invitations: TeamInvitation[]) => {
      setInvitations(invitations)
    })
  }, []);

  useEffect(() => {
    if (!invitations) return

    setTableItems(
      invitations.map((invitation: TeamInvitation) => ({
          key: invitation.team.id,
          avatar: <Avatar src={invitation.team.avatar_url} />,
          team: <TeamTag team={invitation.team} />,
          actions: (
            <Space.Compact>
              <Button
                icon={<CheckOutlined />}
                onClick={() => onAcceptJoinInvitation(invitation.team)}
              />
              <Button
                icon={<CloseOutlined />}
                onClick={() => onRejectJoinInvitation(invitation.team)}
              />
            </Space.Compact>
          )
        }
      )))
  }, [invitations, onAcceptJoinInvitation, deleteMenuItem, onRejectJoinInvitation]);

  return (
    <>
      {contextHolder}
      <div className="flex gap-3 flex-col">
        <span>Запрошення в команди</span>
        {tableItems ? (
            <Table
              columns={columns}
              dataSource={tableItems}
              showHeader={false}
              pagination={false}
              locale={{
                emptyText: (
                  <span>{t("COMPONENT.TEAM_MEMBERS.NO_JOIN_REQUESTS")}</span>
                ),
              }}
            />
          ) : (
            <Spin size="large"></Spin>
        )
        }
      </div>
    </>
  );
}
