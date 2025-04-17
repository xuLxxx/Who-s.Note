import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { useDispatch } from "react-redux";
import type { FormProps } from "antd";
import { Dispatch } from "@/store";
import { replace, useNavigate } from "react-router";

import "./index.less";

export type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

function LoginContainer(): JSX.Element {
  const form = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const [loading, setLoading] = React.useState(false);
  const onFinish: FormProps<FieldType>["onFinish"] = (values: FieldType) => {
    setLoading(true);
    dispatch.user
      .login(values)
      .then(() => {
        // console.log(res);
        dispatch.setting.getMenu().then((res) => {
          dispatch.setting.saveMenu(res.data);
          navigate("/home", { replace: true });
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  const goRegister = () => {
    navigate("/register");
  };
  return (
    <>
      <div className="mask"></div>
      <div className="page-login">
        <div className="model-login">
          <Flex
            gap="small"
            justify="space-evenly"
            align="center"
            className="form-login">
            <Flex className="title" vertical>
              <div>Who's note</div>
              <div style={{ fontSize: 12 }}>个人学习笔记网站</div>
            </Flex>
            <div>
              <Form
                name="basic"
                className="login-form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                labelCol={{ span: 8 }}
                style={{ marginTop: 20 }}
                initialValues={{ remember: true }}>
                <Form.Item<FieldType>
                  label="用户名"
                  name="username"
                  rules={[{ required: true, message: "请输入用户名!" }]}>
                  <Input />
                </Form.Item>
                <Form.Item<FieldType>
                  label="密码"
                  name="password"
                  rules={[{ required: true, message: "请输入密码!" }]}>
                  <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                  name="remember"
                  valuePropName="checked"
                  wrapperCol={{ offset: 8, span: 16 }}>
                  <Checkbox className="auto-login">自动登录</Checkbox>
                </Form.Item>
                <Form.Item label={null}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="button-login">
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Flex>
          <div className="footer">
            <Flex
              justify="end"
              gap="middle"
              align="center"
              className="foot-bar">
              {/* <div>忘记密码？</div> */}
              <Button color="default" variant="text" onClick={goRegister}>
                扫码登录
              </Button>
              <Button color="default" variant="text" onClick={goRegister}>
                注册
              </Button>
            </Flex>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginContainer;
