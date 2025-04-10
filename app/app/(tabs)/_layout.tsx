import { Tabs } from "expo-router";
import Icons from "@/components/Icons";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Note",
          tabBarIcon: ({ color }) => (
            <Icons.Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: "Todo",
          tabBarIcon: ({ color }) => (
            <Icons.AntDesign name="checksquare" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friend"
        options={{
          title: "Friend",
          tabBarIcon: ({ color }) => (
            <Icons.MaterialIcons name="group" size={30} color={color} />
      
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "User",
          tabBarIcon: ({ color }) => (
            <Icons.FontAwesome name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
