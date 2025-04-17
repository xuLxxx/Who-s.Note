import { Stack } from "expo-router/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { StyleSheet, useColorScheme } from "react-native";
import { createTheme, ThemeProvider } from "@rneui/themed";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";

declare module "@rneui/themed" {
  export interface Colors {
    fontColor: string;
    accent: string;
    surface: string;
  }
}

import { store } from "@/store";

const persistor = persistStore(store);

export default function RootLayout() {
  const colorTheme = useColorScheme();
  console.log(colorTheme);

  const theme = createTheme({
    lightColors: {
      background: "#FFFFFF",
      fontColor: "#000000",
    },
    darkColors: {
      background: "#303133",
      fontColor: "#FFFFFF",
    },
    components: {
      Button: {
        raised: true,
      },
    },
    mode: colorTheme === "light" ? "light" : "dark",
  });
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <SafeAreaProvider>
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
                getId={({ params }: Record<string, any>) => params.id}
              />
              <Stack.Screen name="(user)/login" options={{ title: "登陆" }} />
            </Stack>
            <Toast />
          </SafeAreaProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({});
