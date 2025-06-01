import { Stack } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import * as api from "@/api/user";
import { getUser } from "@/store/slices/user.slice";
import { store } from "@/store";
import React from "react";

export default function NoteScreen() {
  const user = getUser(store.getState());
  // const user = store.getState().user;
  // console.log(user);
  const [username, setUsername] = React.useState<string>("zxl666");
  const [password, setPassword] = React.useState<string>("123456");
  const submitLogin = () => {
    api
      .login({ username, password })
      .then((res) => {
        if (res.code === 200) {
          store.dispatch({ type: "user/login", payload: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Who's Note</Text>
        <Text style={styles.subTitle}>个人笔记</Text>
        <Input
          placeholder="请输入您的账号"
          label="账号"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.inputContainer}></Input>
        <Input
          label="密码"
          placeholder="请输入您的密码"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.inputContainer}></Input>
        <Button
          title={"登陆"}
          onPress={submitLogin}
          containerStyle={styles.buttonStyle}></Button>
        <Text>去注册</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginTop: 40,
  },
  inputContainer: {
    width: 100,
    height: 50,
    boxSizing: "border-box",
  },
  buttonStyle: {
    width: 100,
    height: 40,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
  },
  subTitle: {
    fontSize: 16,
    color: "#666",
  },
});
