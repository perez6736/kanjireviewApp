import { PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen
          name="welcome"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
