import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons"
import {Content} from "../../../components";
import {CurrentAdministrator} from "../../../utils";

export const Dashboard = () => {
  const currentAdmin = true // CurrentAdministrator.get()

  const onStartTournament = () => {

  }

  return (
    <Content>
      <div className="flex w-full justify-between items-center">
        <h1 className="m-0">Активні турніри</h1>

        { currentAdmin ? (
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={onStartTournament}
            style={{
              boxShadow: "0 0 7px 4px rgba(from var(--color-primary) r g b / .5",
            }}
          >
            Почати турнір
          </Button>
        ) : (<></>)}

      </div>
    </Content>
  )
}