import React, { useCallback, useEffect } from "react";
import { Button } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import "./index.less";

import Avatar from "@/assets/avatar.jpg";
import UploadBox from "@/components/Upload";

import * as api from "@/api/file";
import { useLocation, useNavigate } from "react-router";
import useQuery from "@/shared/hooks/useQuery";

interface List {
  id: number;
  userId: number;
  title: string;
  pic: string;
  fileUrl: string;
}

export default function FieldCom(): JSX.Element {
  const query = useQuery();
  const [visible, setVisible] = React.useState(false);
  const [fileList, setFileList] = React.useState<List[]>([]);
  const temp: number[] = JSON.parse(sessionStorage.getItem("temp") || "[]");
  const [nums, setNums] = React.useState(-1);
  const location = useLocation();
  const navigate = useNavigate();

  const openModal = () => {
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };

  const getMarkdown = useCallback(() => {
    api.getMarkdown().then((res) => {
      setFileList(res.data);
      if (temp.length === 0) {
        res.data.map((item: any) => {
          temp.push(item.id);
        });
        sessionStorage.setItem("temp", JSON.stringify(temp));
      }
    });
  }, [location.pathname]);

  const openMarkdown = (id: number) => () => {
    navigate(`/home?id=${id}`);
  };

  useEffect(() => {
    getMarkdown();
    if (query.get("id") && temp) {
      console.log(temp.indexOf(Number(query.get("id"))));
      setNums(temp.indexOf(Number(query.get("id"))));
    }
    return () => setNums(-1);
  }, [location.pathname, location.search]);

  return (
    <>
      <div className="field">
        <div className="model">
          {nums !== -1 ? (
            <div
              className="animation-tab"
              style={{
                marginBottom: (temp.length - nums - 1) * 65 + 15,
              }}></div>
          ) : null}
          {fileList.map((item) => {
            return (
              <div
                className="box"
                key={item.id}
                onClick={openMarkdown(item.id)}>
                <img src={item.pic} alt="笔记封面"></img>
                {/* <div className="title">{item.title}</div> */}
              </div>
            );
          })}
          <Button
            className="button"
            shape="circle"
            onClick={openModal}
            size="large"
            style={{ marginLeft: fileList.length ? 0 : "50%" }}
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
