import React from "react";

type ListItemProps = {
  title: string | React.JSX.Element;
  onPress?: () => void;
  containerStyle?: any;
  titleStyle?: any;
};

interface List {
  id: number;
  userId: number;
  title: string;
  pic: string;
  fileUrl: string;
}
