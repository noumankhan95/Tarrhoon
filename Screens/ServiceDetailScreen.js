import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from "react-native";
import ChatIcon from "../components/ChatIcon";
import Modal from "../components/Modal";
import { useNavigation, useRoute } from "@react-navigation/native";
import HandlePayment from "../components/HandlePayment";
import GameBanner from "../components/Ads/GameBannderAd";
export default function ServiceScreen() {
  const { params } = useRoute();
  const { data } = params;
  const { navigate } = useNavigation();
  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "space-between",
        paddingBottom: 10,
      }}
      style={{ flex: 1 }}
    >
      <GameBanner />
      <View>
        <Modal>
          <View style={{ margin: 4 }}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 20,
                  textDecorationLine: "underline",
                  alignSelf: "center",
                  marginVertical: 5,
                },
              ]}
            >
              {data[0].s_title}
            </Text>
            <Text style={[styles.text, { fontSize: 20 }]}>
              Sales Tax <Text>: {data[0].s_tax}</Text>
            </Text>
            <Text style={[styles.text, { fontSize: 20, marginVertical: 10 }]}>
              Service Fee : {data[0].s_fee}
            </Text>
            <Text
              style={[styles.text, { fontSize: 16, marginVertical: 10 }]}
            >{`Description:  \n ${data[0].s_desc}`}</Text>
          </View>
        </Modal>
      </View>
      <TouchableOpacity
        style={styles.payButton}
        onPress={() => {
          navigate("Payment", { amount: data[0].s_fee });
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Pay Now
        </Text>
      </TouchableOpacity>

      <ChatIcon data={data[0]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: { color: "black" },
  payButton: {
    backgroundColor: "cornflowerblue",
    padding: 15,
    alignSelf: "center",
    width: "60%",
    marginVertical: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
});
