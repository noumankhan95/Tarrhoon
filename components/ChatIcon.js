import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useContext } from "react";
import { Userctx } from "../store/userContext";
import { useRoute } from "@react-navigation/native";
const ChatIcon = (props) => {
  const { navigate, replace } = useNavigation();

  const ctx = useContext(Userctx);
  const navigateTochat = useCallback(() => {
    console.log("ICON", props.data);
    if (ctx.userInfo.c_status) {
      return navigate("ChatScreen", {
        s_id: props.data.s_id,
        s_title: props.data.s_title,
        c_id: props.data.cat_id,
        c_title: props.data.cat_name,
      });
    }
    replace("Authentication", {
      s_id: props.data.s_id,
      s_title: props.data.s_title,
      c_id: props.data.cat_id,
      c_title: props.data.cat_name,
    });
  }, [navigate, props, ctx]);

  return (
    <View
      style={{
        width: "100%",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 50,
          overflow: "hidden", // Ensure the content is clipped to the border radius
        }}
        onPress={navigateTochat}
      >
        <Entypo name="chat" size={54} color="rgba(115,105,239,255)" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatIcon;
