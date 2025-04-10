import { Link } from "expo-router";
import { StyleSheet, Image, Platform, View, Text } from "react-native";

const propsLogin: any = {
  href: "/login",
};

export default function UserScreen() {
  return (
    <View>
      <Text>User Page</Text>
      <Link {...propsLogin}>去登陆</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
