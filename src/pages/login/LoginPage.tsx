import { Card, Button, Form, Input } from "antd";
import type { FormProps } from "antd";
import {useNavigate} from "react-router";
import { login } from "../../api";
import { LOCALES } from "../../locales";
import {CurrentUser} from "../../utils";

type FieldType = {
  username?: string;
  password?: string;
};

export const LoginPage = () => {
  const navigate = useNavigate()

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const user = await login({
      login: values.username ?? "",
      password: values.password ?? "",
    });

    CurrentUser.set(user)

    navigate("/")
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex h-screen">
      <Card
        title={LOCALES.PAGES.LOGIN.AUTH}
        className="mx-auto my-auto"
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
            label={LOCALES.PAGES.LOGIN.USERNAME}
            name="username"
            rules={[
              {
                required: true,
                message: LOCALES.PAGES.LOGIN.ENTER_USERNAME,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label={LOCALES.PAGES.LOGIN.PASSWORD}
            name="password"
            rules={[
              { required: true, message: LOCALES.PAGES.LOGIN.ENTER_PASSWORD },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              {LOCALES.PAGES.LOGIN.LOGIN}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
