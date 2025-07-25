import { Button, Input, Space } from "antd";
import { EnterOutlined } from "@ant-design/icons";

export default function ChatRoom(): JSX.Element {
  return (
    <>
      <div className="friend-chat-title">Title</div>
      <div className="friend-chat-content">content</div>
      <div className="friend-chat-send">
        <Space.Compact block>
          <Input
            variant="borderless"
            placeholder="请输入消息"
            style={{
              borderBottom: "1px solid",
              borderRadius: 0,
              width: "100%",
              paddingLeft: 0,
              fontSize: 18,
              color: "var(--text-gray)",
            }}></Input>
        </Space.Compact>
        <Button
          icon={<EnterOutlined />}
          type="text"
          style={{ fontSize: 20 }}></Button>
      </div>
    </>
  );
}
