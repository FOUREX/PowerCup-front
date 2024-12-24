import {
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  LeftOutlined
} from "@ant-design/icons";

import {
  Badge,
  Button,
  Collapse,
  Form,
  FormProps,
  Input,
  Menu,
  MenuProps,
  Modal,
  notification,
  Spin,
} from "antd";
import MenuItem from "antd/es/menu/MenuItem";

import { createTeam, fetchTeams } from "api";
import {
  Team,
  TeamJoinRequestType,
  TeamMember,
  TeamMemberRole,
  User,
} from "api/types";
import {use} from "i18next";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { CurrentUser } from "utils";
import { TeamMembers, TeamOverview } from "../../components";

import "./style.css";

type MenuItem = Required<MenuProps>["items"][number];
type State = null | "view" | "edit" | "create";
type CreateTeamFieldType = {
  name: string;
  members: [];
};

const icons: { [key in State] } = {
  view: <TeamOutlined />,
  edit: <EditOutlined />,
  create: <UsergroupAddOutlined />,
  null: null,
};

export const TeamsPage = () => {
  const { t }: { t: (key: string, options?: object) => string } =
    useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlTeamId = searchParams.get("team_id");
  const selectedFromMenu = useRef<boolean>(false); // Супер мега костиль щоб не викликати перерендер
  // при виборі команди через меню
  const [api, contextHolder] = notification.useNotification();
  const currentUser: User | undefined = CurrentUser.get();

  const teamsFetchedRef = useRef<boolean>(false);

  const [teamCreate, setTeamCreate] = useState<boolean>(false);
  const [teamCreating, setTeamCreating] = useState<boolean>(false);

  const [teams, setTeams] = useState<Team[] | undefined>(undefined);
  const [newTeams, setNewTeams] = useState<Team[] | undefined>(undefined);
  const [items, setItems] = useState<MenuItem[] | undefined>(undefined);
  const [selectedKey, setSelectedKey] = useState<string>();

  const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined);
  const [isTeamAdmin, setIsTeamAdmin] = useState<boolean>(false);

  const [hideMenu, setHideMenu] = useState<boolean>(false)

  const createMenuItems = useCallback(
    (teams: Team[]) => {
      if (currentUser) {
        setItems([
          {
            key: "my_teams",
            label: t("PAGES.TEAMS.MY_TEAMS"),
            type: "group",
            children: teams.map((team: Team) => {
              if (
                team.members.find(
                  (member: TeamMember) => member.user.id === currentUser.id,
                )
              ) {
                return {
                  key: -team.id,
                  label: (
                    <Badge
                      size="small"
                      offset={[10, 0]}
                      count={
                        team.members.some(
                          (member) => member.role <= TeamMemberRole.Admin,
                        )
                          ? team.join_requests.filter(
                            (request) =>
                              request.type == TeamJoinRequestType.Request,
                            ).length
                          : 0
                      }
                    >
                      {team.name}
                    </Badge>
                  ),
                };
              }
            }),
          },
        ]);
      }

      setItems((prevItems) => [
        ...(Array.isArray(prevItems) ? prevItems : []),
        {
          key: "all_teams",
          label: t("PAGES.TEAMS.ALL_TEAMS"),
          type: "group",
          children: teams.map((team: Team) => {
            return { key: team.id, label: team.name };
          }),
        },
      ]);
    },
    [currentUser, t],
  );

  const findTeam = useCallback(
    (key): Team | undefined => {
      if (!teams) return undefined;
      return teams.find((team) => team.id === Math.abs(Number(key)));
    },
    [teams],
  );

  useEffect(() => {
    if (!teamsFetchedRef.current) {
      teamsFetchedRef.current = true;

      fetchTeams().then((teams: Team[]) => {
        setTeams(teams);
        createMenuItems(teams);
      });
    }
  }, [createMenuItems]);

  useEffect(() => {
    if (newTeams) {
      createMenuItems(newTeams);
      setTeams(newTeams);
      setNewTeams(undefined);
    }
  }, [createMenuItems, newTeams]);

  const onTeamCreate: FormProps<CreateTeamFieldType>["onFinish"] = async (
    values,
  ) => {
    setTeamCreating(true);
    createTeam(values)
      .then((createdTeam) => {
        setNewTeams([...(Array.isArray(teams) ? teams : []), createdTeam]);
        setCurrentTeam(createdTeam);
        setTeamCreate(false);
        setTeamCreating(false);
        setIsTeamAdmin(true);
        setSelectedKey((-createdTeam.id).toString());

        const params = new URLSearchParams(searchParams);
        params.set("team_id", createdTeam.id.toString());

        setSearchParams(params);

        selectedFromMenu.current = true;

        api.success({
          message: t("NOTIFICATION.SUCCESS"),
          description: t("TEAMS.NOTIFICATION.TEAM_CREATED_SUCCESS", {
            team_name: createdTeam.name,
          }),
          placement: "bottomRight",
        });
      })
      .catch((reason) => {
        setTeamCreating(false);
        api.error({
          message: t("NOTIFICATION.SUCCESS"),
          description: reason.message,
          placement: "bottomRight",
        });
      });
  };

  const onTeamSelected = (key) => {
    const team: Team | undefined = findTeam(key.key);
    setCurrentTeam(team);
    setSelectedKey(team?.id.toString())

    if (!team) return;

    const params = new URLSearchParams(searchParams);
    params.set("team_id", team.id.toString());

    setSearchParams(params);

    selectedFromMenu.current = true;

    if (
      currentUser &&
      team.members.find(
        (member) => member.user.id == currentUser.id && member.role <= 1,
      )
    ) {
      setIsTeamAdmin(true);
    } else {
      setIsTeamAdmin(false);
    }
  };

  useEffect(() => {
    // Я забороняю вам читати цей код.
    if (selectedFromMenu.current) {
      selectedFromMenu.current = false;
      return;
    }

    if (urlTeamId) {
      const team = findTeam(urlTeamId);
      const member =
        team && currentUser
          ? team.members.find((member) => member.user.id == currentUser.id)
          : undefined;
      const isAdmin = member?.role <= 1;

      if (team) {
        setCurrentTeam(team);
        setSelectedKey(member ? (-team.id).toString() : team.id.toString());

        if (isAdmin) {
          setIsTeamAdmin(true);
        } else {
          setIsTeamAdmin(false);
        }
      }
    }
  }, [currentUser, findTeam, urlTeamId]);

  return (
    <>
      {contextHolder}
      <Modal
        wrapClassName="modal-background-blur"
        width="300px"
        title={
          <div className="flex gap-2">
            {icons.create}
            <span>{t("PAGES.TEAMS.CREATE_TEAM")}</span>
          </div>
        }
        footer=""
        open={teamCreate}
        onCancel={() => setTeamCreate(false)}
      >
        <Form className="mt-8" layout="vertical" onFinish={onTeamCreate}>
          <Form.Item<CreateTeamFieldType>
            label={t("PAGES.TEAMS.NAME")}
            name="name"
            rules={[
              {
                required: true,
                message: t("PAGES.TEAMS.ENTER_TEAM_NAME"),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<CreateTeamFieldType>
            label={t("PAGES.TEAMS.MEMBERS")}
            name="members"
          >
            <Button
              className="w-full"
              type="dashed"
              onClick={() => {}}
              icon={<PlusOutlined />}
            >
              {t("PAGES.TEAMS.ADD_MEMBER")}
            </Button>
          </Form.Item>

          <Form.Item label={null}>
            {teamCreating ? (
              <div className="w-full flex">
                <Spin className="mx-auto" size="default" />
              </div>
            ) : (
              <Button className="w-full" type="primary" htmlType="submit">
                {t("PAGES.TEAMS.CREATE_TEAM")}
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
      <div className="content flex box-border gap-3">
        <div className={currentTeam ? "show" : ""}>
          <div className="flex flex-col max-w-56 w-full gap-3">
            <Button
              type="primary"
              disabled={currentUser == undefined}
              size="large"
              icon={<UsergroupAddOutlined />}
              onClick={() => setTeamCreate(true)}
              style={
                currentUser
                  ? {
                      boxShadow:
                        "0 0 7px 4px rgba(from var(--color-primary) r g b / .5",
                    }
                  : {}
              }
            >
              {t("PAGES.TEAMS.CREATE_TEAM")}
            </Button>

            {items ? (
              <Menu
                items={items}
                selectedKeys={[selectedKey]}
                onClick={onTeamSelected}
                className="w-full"
              />
            ) : (
              <Spin size="large" />
            )}
          </div>
        </div>

        {currentTeam ? (
          <div className="flex flex-col gap-3">
            <Button
              className="w-min hide"
              icon={<LeftOutlined />}
              onClick={() => {
                setHideMenu(!hideMenu)
                setCurrentTeam(undefined)
                setSelectedKey("")
              }}
            >
              Повернутися
            </Button>
            <div className="flex gap-3 w-full flex-wrap content-start">
              <Collapse
                className="h-min min-w-96 flex-1"
                defaultActiveKey={["overview"]}
                items={[
                  {
                    key: "overview",
                    label: t("PAGES.TEAMS.OVERVIEW"),
                    children: <TeamOverview team={currentTeam} />,
                  },
                ]}
              />

              <Collapse
                className="h-min min-w-96 flex-1"
                defaultActiveKey={["members"]}
                items={[
                  {
                    key: "members",
                    label: t("PAGES.TEAMS.MEMBERS"),
                    children: <TeamMembers team={currentTeam} />,
                  },
                ]}
              />

              <Collapse
                className="h-min min-w-96 w-full"
                items={[
                  {
                    key: "members",
                    label: t("PAGES.TEAMS.MATCHES"),
                  },
                ]}
              />

              <Collapse
                className="h-min min-w-96 w-full"
                items={[
                  {
                    key: "members",
                    label: t("PAGES.TEAMS.TOURNAMENTS"),
                  },
                ]}
              />
            </div>
          </div>
        ) : (
          <span
            className="mx-auto my-auto"
            style={{ color: "var(--color-background-secondary)" }}
          >
            {t("PAGES.TEAMS.TEAM_NOT_SELECTED")}
          </span>
        )}
      </div>
    </>
  );
};
