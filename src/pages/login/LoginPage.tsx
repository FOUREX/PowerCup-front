import {Card, Button, Checkbox, Form, Input} from "antd";
import type { FormProps } from 'antd';
import axios from "axios";

import NavBar from "../../components/NavBar/NavBar.tsx";

import "../../index.css"
import {SERVER} from "../../config.ts";

type FieldType = {
  username?: string;
  password?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
  const instance = axios.create({
    baseURL: SERVER,
    withCredentials: true
  })

  instance.post(
    "/auth/login",
    {
      "name": values["login"],
      "password": values["password"]
    }
  ).then(r => {
    if (r.status != 204) {
      alert("Pizdec!")
    }
  })
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

function LoginPage() {
  return (
    <>
      <NavBar />
      <div className="flex h-screen">
        <Card
          title="Авторизація"
          className="mx-auto my-auto"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-primary)",
            color: "white"
          }}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Логін"
              name="login"
              rules={[
                { required: true, message: 'Введіть логін!' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Пароль"
              name="password"
              rules={[{ required: true, message: 'Введіть пароль!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Увійти
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default LoginPage
