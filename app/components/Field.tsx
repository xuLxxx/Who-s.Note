import React, { useRef, useState } from "react";
import { useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  ScrollView,
  Text,
  Animated,
  RefreshControl,
} from "react-native";

import { SpeedDial } from "@rneui/themed";
import { store } from "@/store";

import Icons from "./Icons";
import { BottomSheetCom } from "./BottomSheet";

type ListItemProps = {
  title: string | React.JSX.Element;
  onPress?: () => void;
  containerStyle?: any;
  titleStyle?: any;
};

interface Props {
  list: ListItemProps[];
  onClose: () => void;
  onOpen: () => void;
  open: boolean;
}

export const FieldCom = React.forwardRef((prop: Props, ref: any) => {
  const [nums, setNums] = useState(-1);
  const username = store.getState().user.username;
  const [rotate, setRotate] = useState<boolean>(prop.open);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const rotateUp = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotateDown = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(rotateAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // const openMarkdown = (id: number) => () => {
  //   console.log(id);
  //   setNums(id);
  //   store.dispatch({ type: "markdown/setId", payload: id });
  // };

  // React.useImperativeHandle(ref, () => ({
  //   openMarkdown,
  // }));

  //   const openModal = () => {
  //     setVisible(true);
  //   };
  //   const closeModal = () => {
  //     setVisible(false);
  //   };

  //   const getMarkdown = useCallback(() => {
  //     api.getMarkdown().then((res) => {
  //       setFileList(res.data);
  //       if (temp.length === 0) {
  //         res.data.map((item: any) => {
  //           temp.push(item.id);
  //         });
  //         sessionStorage.setItem("temp", JSON.stringify(temp));
  //       }
  //     });
  //   }, [location.pathname]);

  //   const openMarkdown = (id: number) => () => {
  //     navigate(`/home?id=${id}`);
  //   };

  useEffect(() => {
    // getMarkdown();
    console.log(prop.open);
    setRotate(prop.open);
    rotate ? rotateUp() : rotateDown();
  }, [prop]);

  return (
    <>
      <View style={styles.list}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <View>
            <Text style={styles.text}>{username || "Who"}'s Notes </Text>
          </View>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["180deg", "0deg"], // 0 : 150, 0.5 : 75, 1 : 0
                  }),
                },
              ],
            }}>
            <Icons.AntDesign
              name="downcircleo"
              size={24}
              onPress={() => prop.onOpen()}></Icons.AntDesign>
          </Animated.View>
        </View>
        <BottomSheetCom
          list={prop.list}
          isVisible={prop.open}
          onClose={() => prop.onClose()}></BottomSheetCom>
        {/* {!rotate ? (
            <ScrollView
              horizontal={true}
              style={{ height: rotate ? 0 : 80, overflow: "visible" }}>
              {prop.list &&
                prop.list.map((item) => {
                  return (
                    <Image
                      source={{ uri: item.pic }}
                      containerStyle={styles.item}
                      key={item.id}
                      onPress={openMarkdown(item.id)}
                    />
                  );
                })}
            </ScrollView>
          ) : (
            ""
          )} */}
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  list: {
    backgroundColor: "#fff",
    width: "100%",
    zIndex: 11,
  },
  item: {
    width: 80,
    height: 80,
    marginHorizontal: 2,
    borderRadius: 10,
    aspectRatio: 1,
  },
  text: {
    fontSize: 22,
    fontWeight: 800,
    color: "#000",
  },
});
