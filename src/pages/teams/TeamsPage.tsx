import {Button, Card, Menu, MenuProps, Spin} from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import {useEffect, useState} from "react";
import {Link} from "react-router";
import {fetchTeams} from "../../api";
import type {Team, TeamMember, User} from "../../api/types.ts";
import {LOCALES} from "../../locales";
import {PlusOutlined} from "@ant-design/icons"
import {CurrentUser} from "../../utils";


const memberRole = [
  LOCALES.TEAM_MEMBER_ROLE.OWNER,
  LOCALES.TEAM_MEMBER_ROLE.ADMIN,
  LOCALES.TEAM_MEMBER_ROLE.MEMBER,
  LOCALES.TEAM_MEMBER_ROLE.RESERVED,
]
type MenuItem = Required<MenuProps>['items'][number];


export const TeamsPage = () => {
  const currentUser: User | undefined = CurrentUser.get()

  const [state, setState] = useState<null | "view" | "edit" | "create">(null)

  const [teams, setTeams] = useState<Team[] | undefined>(undefined)
  const [items, setItems] = useState<MenuItem[] | undefined>(undefined)

  const [currentTeam, setCurrentTeam] = useState<Team | undefined>(undefined)


  useEffect(() => {
    if (!teams) {
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
      }))
    }
  }, [currentUser, teams])

  const onTeamCreate = () => {
    
  }

  const onTeamSelected = (key) => {
    if (!teams) return

    setState("view")
    setCurrentTeam(teams.find(team => team.id === Math.abs(Number(key.key))))
  }

  return (
    <div className="content flex h-screen">
      <div className="flex flex-col w-56 gap-3">
        <Button
          type="primary"
          disabled={currentUser == undefined}
          size="large"
          icon={<PlusOutlined />}
          onClick={onTeamCreate}
        >
          {LOCALES.PAGES.TEAMS.CREATE_TEAM}
        </Button>

        {items ? (
          <Menu items={items} onClick={onTeamSelected} className="w-full" />
        ) : (
          <Spin size="large" />
        )}
      </div>

      {currentTeam ? (
        <div className="mx-auto my-auto">
          <Card className="w-72" title={currentTeam.name}>
            <h3 className="m-0">{LOCALES.PAGES.TEAMS.MEMBERS}</h3>
            {currentTeam.members.map((teamMember: TeamMember) => (
              <Link
                className="flex flex-row gap-3 ps-1.5"
                to={`/user?id=${teamMember.user.id}`}
              >
                {teamMember.user.name}
                <span>|</span>
                <span>{memberRole[teamMember.role]}</span>
              </Link>
            ))}
          </Card>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
