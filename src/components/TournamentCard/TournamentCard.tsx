import {Avatar, Button, Card, Form, FormProps, Modal, Select, SelectProps, Space, Tag} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import * as React from "react";
import {fetchMyTeams} from "../../api/teams.api.ts";
import {addTournamentMember} from "../../api/tournament.api.ts";
import {Team, Tournament, TournamentMember} from "../../api/types.ts";
import "./style.css"
import {CurrentUser} from "../../utils";
import {GameTag} from "../GameTag/GameTag.tsx";

interface Props {
  tournament: Tournament
}

type TeamFieldType = {
  team_id: number
}

export const TournamentCard: React.FC<Props> = ({ tournament }) => {
  const currentUser = CurrentUser.get()

  const [showSelectTeamModal, setShowSelectTeamModal] = useState<boolean>(false)
  const [currentUserTeams, setCurrentUserTeams] = useState<Team[] | undefined>([])
  const [selectTeamOptions, setSelectTeamOptions] = useState<SelectProps["options"]>([])

  const [form] = Form.useForm()

  const showModal = async () => {
    setShowSelectTeamModal(true)

    setSelectTeamOptions(currentUserTeams?.map((team: Team) => ({
      value: team.id,
      label: team.name,
      avatar: team.avatar_url
    })))
  }

  const onJoin: FormProps<TeamFieldType>["onFinish"] = async (values) => {
    await addTournamentMember({
      tournament_id: tournament.id,
      team_id: values.team_id
    })

    setShowSelectTeamModal(false)
    window.location.reload()
  }

  useEffect(() => {
    fetchMyTeams().then((teams) => {
      setCurrentUserTeams(teams)
    })
  }, []);

  return (
    <>
      <Modal
        title="Вибір команди"
        open={showSelectTeamModal}
        onOk={() => {
          form.submit()
        }}
        onCancel={() => setShowSelectTeamModal(false)}
      >
        <Form className="mt-8" form={form} onFinish={onJoin}>
          <Form.Item<TeamFieldType>
            name="team_id"
            rules={[{required: true}]}
          >
            <Select
              placeholder="Виберіть команду"
              options={selectTeamOptions}
              optionRender={(option: SelectProps[""]) => (
                <Space>
                  <Avatar size="small" src={option.data.avatar} />
                  {option.data.label}
                </Space>
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        className="w-full"
        styles={{ body: { display: "flex", gap: "1.5rem", padding: "24px" } }}
      >
        <img
          alt=""
          src={tournament.poster_url || ""}
          style={{
            width: "25%",
            objectFit: "cover",
            borderRadius: 8,
          }}
        />

        <div className="flex flex-col justify-between w-full">
          <div className="flex flex-col">
            <div>
              <Tag
                icon={
                  <span
                    role="img"
                    aria-label="clock-circle"
                    className="anticon anticon-clock-circle"
                  >
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      data-icon="clock-circle"
                      width="1em"
                      height="1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M 512 64 C 264.6 64 64 264.6 64 512 s 200.6 448 448 448 s 448 -200.6 448 -448 S 759.4 64 512 64 z z"></path>
                    </svg>
                  </span>
                }
                color="green"
              >
                Активний
              </Tag>
              <GameTag game={tournament.game} />
            </div>

            <h2 className="my-2">{tournament.name}</h2>
            <span className="my-2">{tournament.description}</span>
          </div>

          <div className="flex flex-row-reverse">
            <div className="flex gap-2">
              <Avatar.Group>
                {tournament.members.map((member: TournamentMember) => (
                  <Avatar key={member.team.id} src={member.team.avatar_url}/>
                ))}
              </Avatar.Group>

              <Button>Детальніше</Button>

              <Button
                disabled={!currentUser}
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
              >
                Приєднатися
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}