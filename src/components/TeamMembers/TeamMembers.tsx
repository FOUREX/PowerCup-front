  // Отут вже код дещо краще
 // Вже не так страшно читати його
// Враховуємо минулі помилки

import {
  CheckOutlined,
  CloseOutlined,
  InboxOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  AutoCompleteProps,
  Avatar,
  Badge,
  Button,
  notification,
  Space,
  Table,
  Tag,
} from "antd";
import {ArgsProps} from "antd/es/notification";
import { ColumnsType } from "antd/es/table";
import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import {useSearchParams} from "react-router";
import {acceptJoinRequest, cancelJoinInvite, rejectJoinRequest, sendJoinInvite} from "../../api/teams.api.ts";
import {
  Team,
  TeamJoinRequest,
  TeamJoinRequestType,
  TeamMember, TeamMemberRole,
  User,
} from "../../api/types.ts";
import { fetchUsers } from "../../api/users.api.ts";
import {CurrentUser} from "../../utils";
import { RoleTag } from "../RoleTag/RoleTag.tsx";
import { UserTag } from "../UserTag/UserTag.tsx";

interface Props {
  team: Team;
}

type autocompleteOption = {
  key: string;
  value: string;
};

type Notification = {
  type: "success" | "info" | "error" | "warning",
  data: ArgsProps
}

type Tabs = "members" | "join_requests"

export const TeamMembers: React.FC<Props> = ({ team }) => {
  const members = team.members;

  const { t }: { t: (key: string, options?: object) => string } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentUser = CurrentUser.get()
  const currentMember = team.members.find(
    (member) => member.user.id === currentUser?.id,
  );
  const adminView = currentMember?.role in [TeamMemberRole.Leader, TeamMemberRole.Admin]

  const [api, contextHolder] = notification.useNotification();
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  const [value, setValue] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<
    autocompleteOption | undefined
  >(undefined);
  const [searchUserError, setSearchUserError] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<Tabs>("members");

  const columns: ColumnsType = [
    {
      title: t("TEAM_MEMBERS.USER"),
      dataIndex: "avatar",
      key: "avatar",
      width: 1,
    },
    {
      title: t("TEAM_MEMBERS.USER"),
      dataIndex: "user",
      key: "user",
    },
    {
      title: t("TEAM_MEMBERS.ROLE"),
      dataIndex: "role",
      key: "role",
    },
    adminView
      ? {
          title: t("TEAM_MEMBERS.ACTIONS"),
          dataIndex: "actions",
          key: "actions",
          align: "right",
        }
      : {},
  ];

  const onCancelJoinInvitation = async (team_id: number, user: User) => {
    try {
      await cancelJoinInvite({
        team_id: team_id,
        user_id: user.id
      })

      const notification: Notification = {
        type: "success",
        data: {
          message: t("COMPONENT.TEAM_MEMBERS.NOTIFICATION.INVITATION_CANCELLED"),
          description: t(
            "COMPONENT.TEAM_MEMBERS.NOTIFICATION.INVITATION_CANCEL_MESSAGE",
            {user_name: user.name}
          ),
          placement: "bottomRight",
        }
      }

      localStorage.setItem("notification", JSON.stringify(notification))

      window.location.reload()
    } catch (reason) {
      api.error({
        message: t("COMPONENT.TEAM_MEMBERS.NOTIFICATION.INVITATION_CANCEL_ERROR"),
        description: reason.message,
        placement: "bottomRight",
      });
    }
  }

  const onAcceptJoinRequest = async (team_id: number, user: User) => {
    try {
      await acceptJoinRequest({
        team_id: team_id,
        user_id: user.id
      })

      const notification: Notification = {
        type: "success",
        data: {
          message: t("COMPONENT.TEAM_MEMBERS.NOTIFICATION.REQUEST_ACCEPTED"),
          description: t(
            "COMPONENT.TEAM_MEMBERS.NOTIFICATION.REQUEST_ACCEPTED_MESSAGE",
            {user_name: user.name}
          ),
          placement: "bottomRight",
        }
      }

      localStorage.setItem("notification", JSON.stringify(notification))

      window.location.reload()
    } catch (reason) {
      api.error({
        message: t("COMPONENT.TEAM_MEMBERS.NOTIFICATION.REQUEST_ACCEPT_ERROR"),
        description: reason.message,
        placement: "bottomRight",
      });
    }
  }

  const onRejectJoinRequest = async (team_id: number, user: User) => {
    try {
      await rejectJoinRequest({
        team_id: team_id,
        user_id: user.id
      })

      const notification: Notification = {
        type: "success",
        data: {
          message: t("COMPONENT.TEAM_MEMBERS.NOTIFICATION.REQUEST_REJECTED"),
          description: t(
            "COMPONENT.TEAM_MEMBERS.NOTIFICATION.REQUEST_REJECTED_MESSAGE",
            {user_name: user.name}
          ),
          placement: "bottomRight",
        }
      }

      localStorage.setItem("notification", JSON.stringify(notification))

      window.location.reload()
    } catch (reason) {
      api.error({
        message: t("COMPONENT.TEAM_MEMBERS.NOTIFICATION.REQUEST_REJECTED_ERROR"),
        description: reason.message,
        placement: "bottomRight",
      });
    }
  }

  const membersRows = members
    .sort((a, b) => a.role - b.role)
    .map((member: TeamMember) => {
      return {
        key: member.user.id,
        avatar: <Avatar src={member.user.avatar_url} />,
        user: <UserTag user={member.user} />,
        role: <RoleTag role={member.role} />,
        actions: <Button disabled={member.role <= 1} icon={<UserDeleteOutlined />} />
      };
  });

  const invitationsRows = team.join_requests
    .filter((request) => request.type === TeamJoinRequestType.Invite)
    .map((request: TeamJoinRequest) => {
      return {
        key: request.user.id,
        avatar: <Avatar src={request.user.avatar_url} />,
        user: <UserTag user={request.user} />,
        role: <Tag>{t("COMPONENT.TEAM_MEMBERS.JOIN_REQUEST.INVITATION")}</Tag>,
        actions: <Button
          icon={<CloseOutlined/>}
          onClick={() => onCancelJoinInvitation(team.id, request.user)}
        />,
      };
    });

  const requestsRows = team.join_requests
    .filter((request) => request.type === TeamJoinRequestType.Request)
    .map((request: TeamJoinRequest) => {
      return {
        key: request.user.id,
        avatar: <Avatar src={request.user.avatar_url} />,
        user: <UserTag user={request.user} />,
        role: <Tag>{t("COMPONENT.TEAM_MEMBERS.JOIN_REQUEST.REQUEST")}</Tag>,
        actions: (
          <Space.Compact>
            <Button
              icon={<CheckOutlined />}
              onClick={() => onAcceptJoinRequest(team.id, request.user)}
            />
            <Button
              icon={<CloseOutlined />}
              onClick={() => onRejectJoinRequest(team.id, request.user)}
            />
          </Space.Compact>
        ),
      };
    });

  const handleTabChange = useCallback((tab: Tabs) => {
    const params = new URLSearchParams(searchParams)

    params.set("members_tab", tab)

    setSearchParams(params)
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!localStorage.getItem("notification")) return

    const notification: Notification = JSON.parse(localStorage.getItem("notification"))

    switch (notification.type) {
      case "success":
        api.success(notification.data)
        break
      case "error":
        api.error(notification.data)
        break
    }

    localStorage.removeItem("notification")
  }, [api]);

  useEffect(() => {
    const tab = searchParams.get("members_tab") as Tabs

    if (tab === "members" || tab === "join_requests") {
      if (adminView) {
        setCurrentTab(tab)
      } else {
        setCurrentTab("members")
      }
    }
  }, [handleTabChange, adminView, searchParams]);

  useEffect(() => {
    if (adminView) return;

    setCurrentTab("members")
  }, [adminView]);

  useEffect(() => {
    if (!searchUserError) return;

    const timer = setTimeout(() => {
      setSearchUserError(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchUserError]);
  
  const handleFocus = () => {
    setSearchUserError(false);

    if (!users) {
      fetchUsers().then((users) => setUsers(users));
    }
  };

  const validateInput = () => {
    if (!options) return;

    const option = options.find(
      (option: autocompleteOption) => option.value === value,
    );

    if (option && option.value && option.value === selectedUser?.value) {
      setSelectedUser({
        key: option.key.toString(),
        value: option.value.toString(),
      });
    } else {
      if (value === "") return;

      setValue("");
      setSearchUserError(true);
      setSelectedUser(undefined);

      api.warning({
        message: t("COMPONENT.TEAM_MEMBERS.NOTIFICATION.WRONG_INPUT"),
        description: t(
          "COMPONENT.TEAM_MEMBERS.NOTIFICATION.WRONG_INPUT_DESCRIPTION",
        ),
        placement: "bottomRight",
      });
    }
  };

  const handleSearch = (value: string) => {
    if (!users) return;

    setOptions(
      users
        .filter(
          (user: User) =>
            user.name.toLowerCase().includes(value.toLowerCase()) &&
            !members.find((member) => member.user.id === user.id),
        )
        .map((user: User) => ({
          key: user.id.toString(),
          value: user.name,
          label: (
            <div className="flex items-center gap-2">
              <Avatar size="small" src={user.avatar_url} />
              {user.name}
            </div>
          ),
        })),
    );
  };

  const handleSelect = (value, option) => {
    setSelectedUser(option);
  };

  const handleChange = (inputValue) => {
    setValue(inputValue);
  };

  const sendRequest = async () => {
    validateInput();

    if (!selectedUser) {
      setSearchUserError(true);
      return;
    }

    try {
      await sendJoinInvite({
        team_id: team.id,
        user_id: Number(selectedUser.key),
      });

      api.success({
        message: t("COMPONENT.TEAM_MEMBERS.NOTIFICATION.INVITATION_SENT"),
        description: t(
          "COMPONENT.TEAM_MEMBERS.NOTIFICATION.INVITATION_SENT_DESCRIPTION",
        ),
        placement: "bottomRight",
      });
    } catch (reason) {
      api.error({
        message: t("COMPONENT.TEAM_MEMBERS.NOTIFICATION.ERROR"),
        description: reason.message,
        placement: "bottomRight",
      });
    }
  };

  return (
    <>
      {contextHolder}
      {adminView ? (
        <div className="flex gap-2">
          <Badge
            count={
              team.join_requests.filter(
                (request) => request.type == TeamJoinRequestType.Request,
              ).length
            }
            style={{ zIndex: 2 }}
            size="small"
          >
            <Space.Compact>
              <Button
                type={currentTab == "members" ? "primary" : "default"}
                icon={<TeamOutlined />}
                onClick={() => {
                  handleTabChange("members")
                  setCurrentTab("members");
                }}
              />
              <Button
                type={currentTab == "join_requests" ? "primary" : "default"}
                icon={<InboxOutlined />}
                onClick={() => {
                  handleTabChange("join_requests")
                  setCurrentTab("join_requests");
                }}
              />
            </Space.Compact>
          </Badge>

          <Space.Compact className="mb-3" style={{ width: "100%" }}>
            <AutoComplete
              status={searchUserError ? "error" : ""}
              prefix={<UserOutlined />}
              placeholder={t("COMPONENT.TEAM_MEMBERS.USER")}
              options={options}
              value={value}
              onSearch={handleSearch}
              onSelect={handleSelect}
              onFocus={handleFocus}
              onChange={handleChange}
              style={{
                width: "100%",
              }}
            />
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={sendRequest}
            >
              {t("COMPONENT.TEAM_MEMBERS.INVITE")}
            </Button>
          </Space.Compact>
        </div>
      ) : (
        <></>
      )}

      <Table
        showHeader={false}
        pagination={false}
        size="small"
        columns={columns}
        dataSource={
          currentTab === "members"
            ? membersRows
            : [...invitationsRows, ...requestsRows]
        }
        locale={{
          emptyText: <span>{t("COMPONENT.TEAM_MEMBERS.NO_JOIN_REQUESTS")}</span>
        }}
      />
    </>
  );
};