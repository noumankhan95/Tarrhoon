import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AboutScreen from "./AboutScreen";
import MainCategoriesScreen from "./MainCategoriesScreen";
import SingleCategoryScreen from "./SingleCategoryScreen";
import ServiceScreen from "./ServiceDetailScreen";
import ChatScreen from "./ChatScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as TaskManager from "expo-task-manager";
import {
  useEffect,
  useState,
  useLayoutEffect,
  useContext,
  useRef,
} from "react";
import * as Notifications from "expo-notifications";
import Authentication from "./Authentication";
import NetInfo from "@react-native-community/netinfo";
import { Userctx } from "../store/userContext";
import Payment from "../components/HandlePayment";
import * as NewNavigate from "../extra/NavigationService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("You Must Enable Notifications For Updates.");
      return;
    }
    Notifications.getDevicePushTokenAsync;
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    Alert.alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const Home = (props) => {
  const Stack = createNativeStackNavigator();
  const [showAboutScreen, setShowAboutScreen] = useState();
  const [isConnected, setisConnected] = useState();
  const uctx = useContext(Userctx);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { navigate } = useNavigation();
  const [isloading, setisloading] = useState(false)
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token);
        return AsyncStorage.setItem("DeviceToken", token);
      })
      .catch((e) => console.log("token Error", e));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);

        setNotification(notification);
        NewNavigate.navigate("ChatScreen", {
          nexists: true,
        });
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
        NewNavigate.navigate("ChatScreen", {
          nexists: response.notification.request.identifier,
        });
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  useEffect(() => {
    const checkInternetConnection = async () => {
      const netInfoState = await NetInfo.fetch();
      setisConnected(netInfoState.isConnected);
    };

    const unsubscribe = NetInfo.addEventListener((state) => {
      setisConnected(state.isConnected);
    });

    checkInternetConnection();

    // Clean up the event listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);
  // useLayoutEffect(() => {
  //   AsyncStorage.removeItem("aboutScreenShown", () => {
  //     console.log("removed");
  //     setShowAboutScreen(true);
  //   });
  //   AsyncStorage.removeItem("user", () => {
  //     console.log("removed user");
  //   });
  //   AsyncStorage.removeItem("DeviceToken", () => {
  //     console.log("removed token");
  //   });
  // }, []);
  useLayoutEffect(() => {
    setisloading(p => true)
    AsyncStorage.getItem("user")
      .then((value) => {
        if (value === null) {
        } else {
          const data = JSON.parse(value);
          uctx.setuserInfo(data);
        }
      })
      .catch((error) => {
        console.log("Error retrieving local storage value:", error);
      }).finally(f => setisloading(p => false));
  }, []);
  useEffect(() => {
    // Check local storage value to determine if the "About" screen has been shown before
    setisloading(p => true)

    AsyncStorage.getItem("aboutScreenShown")
      .then((value) => {
        console.log("first Time View", value);
        if (value === null) {
          // If the value is null, it means the "About" screen has not been shown before
          setShowAboutScreen(true);
          // Update local storage value to indicate that the "About" screen has been shown
          AsyncStorage.setItem("aboutScreenShown", "true");
        } else {
          console.log("Available");
          setShowAboutScreen(false);
        }
      })
      .catch((error) => {
        console.log("Error retrieving local storage value:", error);
      }).finally(f => setisloading(p => false));;
  }, []);
  if (!isConnected)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20 }}>Not Connected To Internet</Text>
        <ActivityIndicator
          size={60}
          color="red"
          style={{ marginVertical: 30 }}
        />
      </View>
    );
  if (isloading) return <ActivityIndicator
    size={60}
    color="green"
    style={{ marginVertical: 30 }}
  />
  return (
    <SafeAreaView style={styles.maincontainer}>
      {/* <NavigationContainer> */}
      <Stack.Navigator
        initialRouteName={showAboutScreen ? "About" : "MainCategories"}

      // initialRouteName={"Payment"}
      >
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainCategories"
          component={MainCategoriesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SingleCategory"
          component={SingleCategoryScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="SingleService"
          component={ServiceScreen}
          options={{ headerShown: true, headerTitle: "Service Details" }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Authentication"
          component={Authentication}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
      {/* </NavigationContainer> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  maincontainer: { flex: 1 },
});
export default Home;

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}
