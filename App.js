import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Alert } from "react-native";
import Home from "./Screens/Home";
import LangaugeContextProvider from "./store/languageContext";
import UserContextProvider from "./store/userContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { setNavigator } from "./extra/NavigationService";
import * as TaskManager from "expo-task-manager";
const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";
import * as NewNavigate from "./extra/NavigationService";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
// TaskManager.defineTask(
//   BACKGROUND_NOTIFICATION_TASK,
//   ({ data, error, executionInfo }) => {
//     console.log("here");
//     if (error) {
//       console.log("Error in background task:", error);
//       return;
//     }

//     NewNavigate.navigate("ChatScreen", {
//       nexists: true,
//     });
//   }
// );
// Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
export default function App() {
  const Stack = createNativeStackNavigator();
  // useEffect(() => {
  //   registerBackgroundTask();
  // }, []);
  // const registerBackgroundTask = async () => {
  //   // Check if the background task is already registered
  //   const isRegistered = await TaskManager.isTaskRegisteredAsync(
  //     BACKGROUND_NOTIFICATION_TASK
  //   );
  //   console.log("registered", isRegistered);
  //   if (!isRegistered) {
  //     await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  //   }
  // };
  return (
    <StripeProvider publishableKey={process.env.STRIPE_KEY_PRODUCTION}>
      <UserContextProvider>
        <LangaugeContextProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            {/* <Text style={{ marginTop: 60 }}>{expoPushToken}</Text> */}
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name="HomeScreen"
                  component={Home}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </LangaugeContextProvider>
      </UserContextProvider>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
