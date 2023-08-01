import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Alert, Platform } from "react-native";
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
import { useEffect, useState } from "react";
import mobileAds, {
  InterstitialAd,
  TestIds,
  AdEventType,
} from "react-native-google-mobile-ads";
import { AppOpenAd } from "react-native-google-mobile-ads";
// const appOpenAd = AppOpenAd.createForAdRequest(TestIds.APP_OPEN, {
//   requestNonPersonalizedAdsOnly: true,
//   keywords: ["fashion", "clothing"],
// });
TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("here");
    if (error) {
      console.log("Error in background task:", error);
      return;
    }

    NewNavigate.navigate("ChatScreen", {
      nexists: true,
    });
  }
);
Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
const interstitial = InterstitialAd.createForAdRequest(Platform.OS === "android" ? process.env.ANDROID_INTERSTITIAL : process.env.IOS_INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["fashion", "clothing"],
});
export default function App() {
  const Stack = createNativeStackNavigator();
  const [isInterstitialLoaded, setisInterstitialLoaded] = useState(false)
  useEffect(() => {
    registerBackgroundTask();
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        // Initialization complete!
      });
  }, []);
  useEffect(() => {
    const unsub = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setisInterstitialLoaded(p => true)
      interstitial.show();

    })
    const unsub2 = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setisInterstitialLoaded(p => false)

    })
    interstitial.load();
    return () => { unsub(); unsub2(); }
  }, []);
  // useEffect(() => {
  //   const unsub = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {

  //     appOpenAd.show();
  //   })
  //   appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
  //     setisInterstitialLoaded(p => false)

  //   })
  //   appOpenAd.load();
  //   return unsub
  // }, []);
  const registerBackgroundTask = async () => {
    // Check if the background task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_NOTIFICATION_TASK
    );
    console.log("registered", isRegistered);
    if (!isRegistered) {
      await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    }
  };
  return (
    <StripeProvider publishableKey={process.env.STRIPE_KEY_PRODUCTION}>
      <UserContextProvider>
        <LangaugeContextProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            {/* <Text style={{ marginTop: 60 }}>{expoPushToken}</Text> */}
            <NavigationContainer ref={NewNavigate.setNavigator}>
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
