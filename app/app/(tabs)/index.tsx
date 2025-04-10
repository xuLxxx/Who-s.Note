import { StyleSheet, View, FlatList, SafeAreaView, Text } from "react-native";
import { Button, FAB } from "react-native-elements";

import * as api from "@/api/markdown";
import { useEffect } from "react";
import React from "react";

import { FieldCom } from "@/components/Field";
import MarkdownCom from "@/components/Markdown";
import { SpeedDial } from "@rneui/themed";
import { BottomSheetCom } from "@/components/BottomSheet";
import { Image } from "react-native-elements";
import { store } from "@/store";

type ListItemProps = {
  title: string | React.JSX.Element;
  onPress?: () => void;
  containerStyle?: any;
  titleStyle?: any;
};

export default function NoteScreen() {
  const [fileList, setFileList] = React.useState<ListItemProps[]>([]);
  const FieldRef = React.useRef<any>();
  const [refs, setRefs] = React.useState<any>();
  const [open, setOpen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const getMarkdown = () => {
    api
      .getMarkdown()
      .then((res) => {
        if (res.code === 200) {
          const list: ListItemProps[] = [];
          res.data.map((item: any) => {
            const newfileUrl =
              process.env["EXPO_PUBLIC_API_URL"] +
              "/uploads" +
              item.fileUrl.split("/uploads")[1];
            const newPic =
              process.env["EXPO_PUBLIC_API_URL"] +
              "/uploads" +
              item.pic.split("/uploads")[1];
            list.push({
              // id: item.id,
              // userId: item.userId,
              // title: item.title,
              // pic: newPic,
              // fileUrl: newfileUrl,
              title: (
                <>
                  <View style={styles.row}>
                    <Image
                      source={{ uri: newPic }}
                      containerStyle={styles.item}
                      key={item.id}></Image>
                    <Text style={{ color: "#fff" }}>{item.title}</Text>
                  </View>
                </>
              ),
              onPress: () => {
                // console.log(item.id, newfileUrl);
                store.dispatch({ type: "markdown/setId", payload: item.id });
                setVisible(false);
                // FieldRef.current?.openMarkdown(item.id);
              },
            });
          });
          list.push({
            title: "关闭",
            onPress: () => {
              setVisible(false);
            },
            containerStyle: { borderTopWidth: 1, borderTopColor: "#ccc" },
            titleStyle: { color: "#ccc" },
          });
          setFileList(list);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getMarkdown();
  }, []);
  return (
    <>
      <View>
        <FieldCom
          ref={FieldRef}
          list={fileList}
          onClose={() => setVisible(false)}
          onOpen={() => setVisible(true)}
          open={visible}></FieldCom>
      </View>
      <SafeAreaView style={styles.container}>
        <View>
          <MarkdownCom
            onRef={(refs: any) => {
              setRefs(refs);
            }}></MarkdownCom>
        </View>
        <View>{/* <AnchorCom></AnchorCom> */}</View>
        <View
          style={{
            position: "absolute",
            bottom: 10,
            right: 0,
          }}>
          <SpeedDial
            isOpen={open}
            overlayColor="rgba(0, 0, 0, 0)"
            icon={{ name: "edit", color: "#fff" }}
            openIcon={{ name: "close", color: "#fff" }}
            onOpen={() => setOpen(!open)}
            style={styles.button}
            onClose={() => setOpen(!open)}>
            <SpeedDial.Action
              icon={{ name: "add", color: "#fff" }}
              title="上传新笔记"
              onPress={() => console.log("Add Something")}
            />
            <SpeedDial.Action
              icon={{ name: "delete", color: "#fff" }}
              title="删除此笔记"
              onPress={() => console.log("Delete Something")}
            />
          </SpeedDial>
        </View>
        <View
          style={{
            position: "absolute",
            top: 60,
            left: 20,
          }}>
          {/* <FAB loading icon={{ name: "add", color: "white" }} size="small" /> */}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    position: "sticky",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  item: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 60,
  },
});
