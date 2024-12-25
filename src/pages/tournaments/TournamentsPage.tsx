import {PlusOutlined} from "@ant-design/icons";
import {
  Button,
  Form,
  FormProps,
  Input,
  List,
  Modal,
  notification,
  Select,
  SelectProps,
  Space, Splitter,
  Upload
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {fetchGames} from "../../api";
import {createTournament, fetchTournaments} from "../../api/tournament.api.ts";
import {Game, Tournament} from "../../api/types.ts";
import {Content, TournamentCard} from "../../components";
import {CurrentAdministrator} from "../../utils";

type TournamentFieldType = {
  name: string
  description: string
  game: number
  poster: never
}

export const TournamentsPage = () => {
  const { t }: { t: (key: string, options?: object) => string } = useTranslation()
  const currentAdmin = CurrentAdministrator.get()
  const [api, contextHolder] = notification.useNotification();

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [form] = Form.useForm()

  const [games, setGames] = useState<Game[] | undefined>(undefined)
  const [gamesSelectOptions, setGamesSelectOptions] = useState<SelectProps["options"]>([])
  const [tournaments, setTournaments] = useState<Tournament[] | undefined>(undefined)

  const showModal = () => {
    setModalOpen(true)

    setGamesSelectOptions(games?.map((game: Game) => ({
      value: game.id,
      label: game.name,
      emoji: game.short_name
    })))
  }

  const handleCancel = () => {
    setModalOpen(false)
  }

  const onStartTournament: FormProps<TournamentFieldType>["onFinish"] = async (
    values,
  ) => {
    try {
      await createTournament({
        name: values.name,
        description: values.description,
        game_id: values.game,
        poster: values.poster[0].originFileObj,
      });

      setModalOpen(false);
      window.location.reload();
    } catch (reason) {
      api.error({
        message: "Не вдалося створити турнір",
        description: reason.message,
        placement: "bottomRight",
      })
    }
  };

  useEffect(() => {
    fetchGames().then((games) => {
      setGames(games)
    }).catch(reason => {
      api.error({
        message: "Error",
        description: reason.message,
        placement: "bottomRight",
      })
    })

    fetchTournaments().then((tournaments) => {
      setTournaments(tournaments)
    })
  }, [api]);

  useEffect(() => {

  }, [games]);

  return (
    <>
      {contextHolder}
      <Modal
        title="Створення турніру"
        width="400px"
        open={modalOpen}
        onOk={() => {
          form.submit();
        }}
        onCancel={handleCancel}
        okText="Створити"
        cancelText="Відмінити"
      >
        <Form
          form={form}
          className="mt-8"
          labelCol={{ span: 6 }}
          onFinish={onStartTournament}
        >
          <Form.Item<TournamentFieldType> name="name" label="Назва">
            <Input placeholder="Введіть назву турніру" />
          </Form.Item>

          <Form.Item<TournamentFieldType>
            name="description"
            label="Description"
          >
            <TextArea placeholder="Введіть опис турніру" />
          </Form.Item>

          <Form.Item<TournamentFieldType> name="game" label="Гра">
            <Select
              placeholder="Виберіть гру"
              options={gamesSelectOptions}
              optionRender={(option: SelectProps[""]) => (
                <Space>
                  <span role="img" aria-label={option.data.label}>
                    {option.data.emoji}
                  </span>
                  {option.data.label}
                </Space>
              )}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Button className="w-full my-1" icon={<PlusOutlined />}>Додати</Button>
                </>
              )}
            />
          </Form.Item>

          <Form.Item<TournamentFieldType>
            name="poster"
            label="Постер"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList || null}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<PlusOutlined />}>Виберіть файл</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Content>
        <div className="flex w-full justify-between items-center">
          <h1 className="m-0">{t("PAGES.TOURNAMENTS.ACTIVE_TOURNAMENTS")}</h1>

          {currentAdmin ? (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={showModal}
              style={{
                boxShadow:
                  "0 0 7px 4px rgba(from var(--color-primary) r g b / .5",
              }}
            >
              {t("PAGES.TOURNAMENTS.CREATE_TOURNAMENT")}
            </Button>
          ) : (
            <></>
          )}
        </div>
        <List
          split=""
          dataSource={tournaments}
          renderItem={(tournament: Tournament) => (
            <List.Item>
              {<TournamentCard tournament={tournament} />}
            </List.Item>
          )}
        >

        </List>
      </Content>
    </>
  );
}
