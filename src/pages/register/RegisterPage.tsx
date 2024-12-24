import {Card, Button, Form, Input, notification} from "antd";
import {UserOutlined, LockOutlined} from "@ant-design/icons"
import type { FormProps } from "antd";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import { login } from "../../api";
import {register} from "../../api/auth.api.ts";
import {CurrentUser} from "../../utils";

type FieldType = {
  username?: string;
  password?: string;
  password_2?: string;
};

export const RegisterPage = () => {
  const { t }: { t: (key: string, options?: object) => string } = useTranslation()
  const [api, contextHolder] = notification.useNotification()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const user = await register({
        login: values.username ?? "",
        password: values.password ?? "",
      });

      api.success({
        message: t("PAGES.REGISTER.NOTIFICATION.REGISTRATION_SUCCESS"),
          description: t(
            "PAGES.REGISTER.NOTIFICATION.REGISTRATION_SUCCESS_MESSAGE",
            {user_name: user.name}
          ),
        placement: "bottomRight"
      })

      setTimeout(() => {
        navigate("/login");
      }, 3000)

    } catch (reason) {
      api.error({
        message: t("PAGES.REGISTER.NOTIFICATION.REGISTRATION_FAILED"),
        description: reason.message,
        placement: "bottomRight"
      })
    }
  };

  // noinspection TypeScriptValidateTypes
  return (
    <>
      {contextHolder}
      <div className="flex h-screen">
        <Card
          title={t("PAGES.REGISTER.REGISTRATION")}
          className="mx-auto my-auto"
        >
          <Form
            form={form}
            style={{maxWidth: 600}}
            initialValues={{remember: true}}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              name="username"
              rules={[
                {
                  required: true,
                  message: t("PAGES.LOGIN.ENTER_USERNAME"),
                },
                {
                  pattern: /^[A-Za-z0-9_]+$/,
                  message: t("PAGES.LOGIN.INVALID_USERNAME")
                }
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder={t("PAGES.LOGIN.USERNAME")} />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                {required: true, message: t("PAGES.LOGIN.ENTER_PASSWORD")},
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder={t("PAGES.LOGIN.PASSWORD")} />
            </Form.Item>

            <Form.Item<FieldType>
              name="password_2"
              dependencies={["password"]}
              rules={[
                { required: true, message: t("PAGES.LOGIN.ENTER_PASSWORD") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    // noinspection TypeScriptValidateTypes
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("PAGES.REGISTER.PASSWORDS_MUST_MATCH")));
                  },
                }),
              ]}
            >
              <Input.Password visibilityToggle="" prefix={<LockOutlined />} placeholder={t("PAGES.REGISTER.CONFIRM_PASSWORD")} />
            </Form.Item>

            <Form.Item label={null}>
              <Button className="w-full" type="primary" htmlType="submit">
                {t("PAGES.REGISTER.REGISTER")}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};
