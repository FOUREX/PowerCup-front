import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

import {
  Button,
  Collapse,
  Form,
  FormProps,
  Input,
  Menu,
  MenuProps,
  Modal,
  Spin,
  notification
} from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import {
  UsergroupAddOutlined,
  EditOutlined,
  TeamOutlined,
  PlusOutlined,
  SettingOutlined,
  UserAddOutlined
} from "@ant-design/icons";

import {fetchTeams, createTeam} from "api";
import {Team, TeamMember, User} from "api/types";
import {useLocation} from "react-router";
import {CurrentUser} from "utils";
import {TeamMembers, TeamOverview} from "../../components";

import "./style.css"


type MenuItem = Required<MenuProps>['items'][number];
type State = null | "view" | "edit" | "create"
type CreateTeamFieldType = {
  name: string;
  members: []
};

const icons: {[key in State]} = {
  view: <TeamOutlined />,
  edit: <EditOutlined />,
  create: <UsergroupAddOutlined />,
  null: null
}

export const TeamsPage = () => {
  const { t }: { t: (key: string) => string } = useTranslation()

  const memberRole: string[] = [
    t("TEAM_MEMBER_ROLE.OWNER"),
    t("TEAM_MEMBER_ROLE.ADMIN"),
    t("TEAM_MEMBER_ROLE.MEMBER"),
    t("TEAM_MEMBER_ROLE.RESERVED"),
  ]

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const [api, contextHolder] = notification.useNotification()
  const currentUser: User | undefined = CurrentUser.get()

  const teamsFetchedRef = useRef<boolean>(false)

  const [teamCreate, setTeamCreate] = useState<boolean>(false)
  const [teamCreating, setTeamCreating] = useState<boolean>(false)

  const [teams, setTeams] = useState<Team[] | undefined>(undefined)
  const [items, setItems] = useState<MenuItem[] | undefined>(undefined)

  const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined)

  const findTeam = (key): Team | undefined => {
    if (!teams) return undefined
    return teams.find(team => team.id === Math.abs(Number(key)))
  }

  useEffect(() => {
    console.log(1)
    if (!teamsFetchedRef.current) {
      console.log(11111111111111)
      teamsFetchedRef.current = true

      fetchTeams().then(((teams: Team[]) => {
        setTeams(teams)

        if (currentUser) {
          setItems([{
            key: "my_teams",
            label: t("PAGES.TEAMS.MY_TEAMS"),
            type: "group",
            children: teams.map((team: Team) => {
              if (team.members.find((member: TeamMember) => member.user.id === currentUser.id)) {
                return{key: -team.id, label: team.name}
              }
            })
          }])
        }

        setItems((prevItems) => [...(Array.isArray(prevItems) ? prevItems : []), {
          key: "all_teams",
          label: t("PAGES.TEAMS.ALL_TEAMS"),
          type: "group",
          children: teams.map((team: Team) => {
            return{key: team.id, label: team.name}
          })
        }])
      }))
    }
  }, [queryParams, currentUser, teamsFetchedRef])

  const onTeamCreate: FormProps<CreateTeamFieldType>["onFinish"] = async (values) => {
    setTeamCreating(true)
    createTeam(values).then(
      createdTeam => {
        console.log(createdTeam)
        teamsFetchedRef.current = false
      }
    ).catch(reason => {
      setTeamCreating(false)
      api.error({
        message: "Error",
        description: reason.message,
        placement: "bottomRight"
      })
    })
  }

  const onTeamSelected = (key) => {
    const team: Team | undefined = findTeam(key.key)
    setCurrentTeam(team)
  }

  return (
    <>
      {contextHolder}
      <Modal
        wrapClassName="modal-background-blur"
        width="300px"
        title={
          <div className="flex gap-2">
            {icons.create}
            <span>{t('PAGES.TEAMS.CREATE_TEAM')}</span>
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
            <Menu items={items} onClick={onTeamSelected} className="w-full" />
          ) : (
            <Spin size="large" />
          )}
        </div>

        {currentTeam ? (
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
                  children: <TeamMembers members={currentTeam.members} />,
                },
              ]}
            />

            <Collapse
              className="h-min min-w-96 w-full"
              items={[
                {
                  key: "members",
                  label: "Матчі", // TODO: Add to locale
                },
              ]}
            />

            <Collapse
              className="h-min min-w-96 w-full"
              items={[
                {
                  key: "members",
                  label: "Турніри", // TODO: Add to locale
                },
              ]}
            />
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
}
