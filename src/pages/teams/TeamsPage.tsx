import {Button, Card, Form, FormProps, Input, Menu, MenuProps, Spin} from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router";
import {fetchTeams} from "../../api";
import type {Team, TeamMember, User} from "../../api/types.ts";
import {LOCALES} from "../../locales";
import {UsergroupAddOutlined, EditOutlined, TeamOutlined, PlusOutlined} from "@ant-design/icons"
import {CurrentUser} from "../../utils";


type MenuItem = Required<MenuProps>['items'][number];
type State = null | "view" | "edit" | "create"
type FieldType = {
  name: string;
};

const memberRole: string[] = [
  LOCALES.TEAM_MEMBER_ROLE.OWNER,
  LOCALES.TEAM_MEMBER_ROLE.ADMIN,
  LOCALES.TEAM_MEMBER_ROLE.MEMBER,
  LOCALES.TEAM_MEMBER_ROLE.RESERVED,
]

const icons: {[key in State]} = {
  view: <TeamOutlined />,
  edit: <EditOutlined />,
  create: <UsergroupAddOutlined />,
  null: null
}

export const TeamsPage = () => {
  const currentUser: User | undefined = CurrentUser.get()

  const [state, setState] = useState<State>(null)
  const teamsFetchedRef = useRef<boolean>(false)

  const [teams, setTeams] = useState<Team[] | undefined>(undefined)
  const [items, setItems] = useState<MenuItem[] | undefined>(undefined)

  const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined)


  useEffect(() => {
    if (!teamsFetchedRef.current) {
      teamsFetchedRef.current = true

      fetchTeams().then(((teams: Team[]) => {
        setTeams(teams)

        if (currentUser) {
          setItems([{
            key: "my_teams",
            label: LOCALES.PAGES.TEAMS.MY_TEAMS,
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
          label: LOCALES.PAGES.TEAMS.ALL_TEAMS,
          type: "group",
          children: teams.map((team: Team) => {
            return{key: team.id, label: team.name}
          })
        }])
      }))
    }
  }, [teamsFetchedRef])

  const onTeamCreate: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log(values)
  }

  const onTeamSelected = (key) => {
    if (!teams) return

    const team: Team = teams.find(team => team.id === Math.abs(Number(key.key)))

    setCurrentTeam(team)
    setState(team.members.find((member: TeamMember) => (
      member.user.id == currentUser?.id && member.role <= 1
    )) ? "edit" : "view")
  }

  return (
    <div className="content flex h-screen box-border">
      <div className="flex flex-col w-56 gap-3">
        <Button
          type="primary"
          disabled={currentUser == undefined}
          size="large"
          icon={<UsergroupAddOutlined />}
          onClick={() => setState("create")}
          style={currentUser ? {
            boxShadow: "0 0 7px 4px rgba(from var(--color-primary) r g b / .5",
          } : {}}
        >
          {LOCALES.PAGES.TEAMS.CREATE_TEAM}
        </Button>

        {items ? (
          <Menu items={items} onClick={onTeamSelected} className="w-full" />
        ) : (
          <Spin size="large" />
        )}
      </div>

      <div className="mx-auto my-auto">
        {state == "view" && currentTeam ? (
          <Card
            className="w-72"
            title={
              <div className="flex gap-2">
                {icons[state]}
                {currentTeam.name}
              </div>
            }
          >
            <h3 className="m-0">{LOCALES.PAGES.TEAMS.MEMBERS}</h3>
            {currentTeam.members.map((teamMember: TeamMember) => (
              <Link
                className="flex flex-row gap-3 ps-1.5"
                to={`/user?id=${teamMember.user.id}`}
                key={teamMember.user.id}
              >
                {teamMember.user.name}
                <span>|</span>
                <span>{memberRole[teamMember.role]}</span>
              </Link>
            ))}
          </Card>
        ) : state == "edit" && currentTeam ? (
          <Card
            className="w-72"
            title={
              <div className="flex gap-2">
                {icons[state]}
                {currentTeam.name}
              </div>
            }
          >
            <h3 className="m-0">{LOCALES.PAGES.TEAMS.MEMBERS}</h3>
            {currentTeam.members.map((teamMember: TeamMember) => (
              <Link
                className="flex flex-row gap-3 ps-1.5"
                to={`/user?id=${teamMember.user.id}`}
                key={teamMember.user.id}
              >
                {teamMember.user.name}
                <span>|</span>
                <span>{memberRole[teamMember.role]}</span>
              </Link>
            ))}
          </Card>
        ) : state == "create" ? (
          <Card
            className="w-72"
            title={
              <div className="flex gap-2">
                {icons[state]}
                <span>{LOCALES.PAGES.TEAMS.CREATE_TEAM}</span>
              </div>
            }
          >
            <Form
              layout="vertical"
              onFinish={onTeamCreate}
            >
              <Form.Item<FieldType>
                label={LOCALES.PAGES.TEAMS.NAME}
                name="name"
                rules={[
                  {
                    required: true,
                    message: LOCALES.PAGES.TEAMS.ENTER_TEAM_NAME,
                  }]
                }
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label={LOCALES.PAGES.TEAMS.MEMBERS}
                name="members"
              >
                <Button
                  className="w-full"
                  type="dashed"
                  onClick={() => {}}
                  icon={<PlusOutlined />}
                >
                  {LOCALES.PAGES.TEAMS.ADD_MEMBER}
                </Button>
              </Form.Item>

              <Form.Item label={null}>
                <Button className="w-full" type="primary" htmlType="submit">
                  {LOCALES.PAGES.TEAMS.CREATE_TEAM}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <span style={{ color: "var(--color-background-secondary)" }}>
            {LOCALES.PAGES.TEAMS.TEAM_NOT_SELECTED}
          </span>
        )}
      </div>
    </div>
  );
}
