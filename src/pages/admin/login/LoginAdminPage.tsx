import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Card, Form, FormProps, Input, notification} from "antd";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {admin} from "../../../api";
import {CurrentAdministrator} from "../../../utils";

type FieldType = {
  username?: string;
  password?: string;
};

export const LoginAdminPage = () => {
  const { t }: { t: (key: string, options?: object) => string } = useTranslation()
  const [api, contextHolder] = notification.useNotification()
  const navigate = useNavigate()

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const user = await admin.login({
        login: values.username ?? "",
        password: values.password ?? "",
      });

      CurrentAdministrator.set(user);
      navigate("/");
    } catch (reason) {
      api.error({
        message: t("PAGES.LOGIN.NOTIFICATION.LOGIN_FAILED"),
        description: reason.message,
        placement: "bottomRight"
      })
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex h-screen">
        <Card
          title={t("PAGES.LOGIN.AUTH")}
          className="mx-auto my-auto"
        >
          <Form
            name="basic"
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

            <Form.Item label={null}>
              <Button className="w-full" type="primary" htmlType="submit">
                {t("PAGES.LOGIN.LOGIN")}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}