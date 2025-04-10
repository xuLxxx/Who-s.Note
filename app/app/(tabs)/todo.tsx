import { SpeedDial } from "@rneui/themed";
import { useState } from "react";
import { Image, StyleSheet, Platform, Text, View } from "react-native";

export default function TodoScreen() {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Text>Todo View Flex: 1 </Text>
      <SpeedDial
        isOpen={open}
        icon={{ name: "edit", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        style={styles.button}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          icon={{ name: "add", color: "#fff" }}
          title="Add"
          onPress={() => console.log("Add Something")}
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "#fff" }}
          title="Delete"
          onPress={() => console.log("Delete Something")}
        />
      </SpeedDial>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  button: {
    position: "fixed",
    bottom: 16,
    right: 16,
  },
});
