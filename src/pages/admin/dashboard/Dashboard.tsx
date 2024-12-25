import {Button, Card, Form, FormProps, Select, SelectProps, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons"
import {Content} from "../../../components";
import {CurrentAdministrator} from "../../../utils";

type FieldType = {
  game: number
}

export const Dashboard = () => {
  const currentAdmin = true // CurrentAdministrator.get()

  const selectItems = [
    {
      value: 1,
      label: "one",
      emoji: "one",
    },
    {
      value: 2,
      label: "two",
      emoji: "two",
    },
    {
      value: 3,
      label: "three",
      emoji: "three",
    },
  ]

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log(values)
  }

  return (
    <Content>
      <Card>
        <Form
          onFinish={onFinish}
        >
          <Space.Compact>
            <Form.Item<FieldType> name="game">
              <Select
                options={selectItems}
                optionRender={(option: SelectProps[""]) => (
                  <Space>
                    <span role="img" aria-label={option.data.label}>
                      {option.data.emoji}
                    </span>
                    {option.data.label}
                  </Space>
                )}
              />
            </Form.Item>
            <Button icon={<PlusOutlined />} />
          </Space.Compact>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Content>
  )
}