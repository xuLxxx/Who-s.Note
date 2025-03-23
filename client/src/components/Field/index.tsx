import React, { useEffect } from "react";
import { Button } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import "./index.less";

import Avatar from "@/assets/avatar.jpg";
import UploadBox from "@/components/Upload";

import * as api from "@/api/file";
import { useLocation, useNavigate } from "react-router";

interface List {
  id: number;
  userId: number;
  title: string;
  pic: string;
  fileUrl: string;
}

export default function FieldCom(): JSX.Element {
  const [visible, setVisible] = React.useState(false);
  const [fileList, setFileList] = React.useState<List[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const openModal = () => {
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };

  const getMarkdown = () => {
    api.getMarkdown().then((res) => {
      setFileList(res.data);
    });
  };

  const openMarkdown = (id: number) => () => {
    navigate(`/home?id=${id}`);
  };

  useEffect(() => {
    getMarkdown();
  }, [location.pathname]);

  return (
    <>
      <div className="field">
        <div className="model">
          {fileList.map((item) => {
            return (
              <div
                className="box"
                key={item.id}
                onClick={openMarkdown(item.id)}>
                <img src={item.pic} alt=""></img>
                {/* <div className="title">{item.title}</div> */}
              </div>
            );
          })}

          <Button
            className="button"
            shape="circle"
            onClick={openModal}
            size="large"
            icon={<PlusCircleFilled />}></Button>
        </div>
      </div>
      <UploadBox
        visible={visible}
        multiple={false}
        maxCount={1}
        inModal={true}
        type={"file"}
        FileType={"text/markdown"}
        onClose={closeModal}></UploadBox>
    </>
  );
}
