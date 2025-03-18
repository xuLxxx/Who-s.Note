import React, { useEffect, useRef } from "react";
import { Button, Card } from "antd";

import "./index.less";

import Icon from "@/components/Icon";
import MarkdownPage from "@/components/Markdown";
import UploadBox from "@/components/Upload";

function HomeContainer(): JSX.Element {
  const [visible, setVisible] = React.useState<boolean>(false);
  const openModal = (): void => {
    setVisible(true);
  };
  const closeModal = (): void => {
    setVisible(false);
  };
  return (
    <>
      <div className="page-home">
        <MarkdownPage></MarkdownPage>
        <Button className="button-upload" onClick={openModal}>
          上传MarkDown
        </Button>

        <UploadBox
          visible={visible}
          multiple={false}
          maxCount={1}
          inModal={true}
          type={"file"}
          onClose={closeModal}></UploadBox>
      </div>
    </>
  );
}

export default HomeContainer;
