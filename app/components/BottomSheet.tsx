import React, { useState } from "react";
import { BottomSheet, Button, ListItem } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

type ListItemProps = {
  title: string | React.JSX.Element;
  onPress?: () => void;
  containerStyle?: any;
  titleStyle?: any;
};

interface Props {
  list: ListItemProps[];
  isVisible: boolean;
  onClose: () => void;
}

export function BottomSheetCom(prop: Props): JSX.Element {
  const { list, isVisible, onClose } = prop;
  return (
    <>
      <BottomSheet
        modalProps={{}}
        isVisible={isVisible}
        onBackdropPress={onClose}>
        {list.map((l: ListItemProps, i: number) => (
          <ListItem
            key={i}
            containerStyle={l.containerStyle}
            onPress={l.onPress}>
            <ListItem.Content>
              <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </>
  );
}
