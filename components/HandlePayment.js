import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Button,
  TextInput,
  Platform,
} from "react-native";

import { useConfirmPayment, CardField, CardForm } from "@stripe/stripe-react-native";
import { useContext } from "react";
import { Userctx } from "../store/userContext";
import { useRoute } from "@react-navigation/native";
const Payment = (props) => {
  const { confirmPayment, loading } = useConfirmPayment();
  const uctx = useContext(Userctx);
  const [cardDetails, setcardDetails] = useState("");
  const { params } = useRoute();
  const [issubmitting, setissubmitting] = useState(false);
  const [feeAmount, setfeeAmount] = useState("");
  console.log(params.amount);
  const getFetchstrtoken = async () => {
    try {
      const res = await fetch(
        "https://us-central1-tarrhoon.cloudfunctions.net/stripeEndpoint",
        // "http://192.168.10.3:3000/data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseInt(feeAmount) || params?.amount,
          }),
        }
      );
      if (!res.ok) throw "Something Went Wrong";

      const { client_secret, error } = await res.json();

      if (error) console.log("error in here", error);
      return { client_secret, error };
    } catch (e) {
      return Alert.alert("Internal Server Error", "Please Try Again");
    }
  };
  const buyWithCardHandler = async () => {
    try {
      if (!cardDetails?.complete || feeAmount.length <= 0)
        return Alert.alert("Error", "Please Provide Correct Details");
      setissubmitting((p) => true);
      const { client_secret, error } = await getFetchstrtoken();
      if (error) {
        console.log("error:<", error);
        throw "Token Error";
      }
      const { paymentIntent, error: er } = await confirmPayment(client_secret, {
        paymentMethodType: "Card",
        paymentMethodData: {
          billingDetails: {
            name: uctx.userInfo.c_name,
            email: uctx.userInfo.c_email,
            address: { city: uctx.userInfo.c_address },
            phone: uctx.userInfo.c_contact,
          },
        },
      });

      // console.log("er", er);
      if (er) {
        return Alert.alert(
          "Internal Error",
          // "Please Make Sure You Have Enough Funds."
          er.message
        );
      }
      if (paymentIntent) {
        console.log("done", paymentIntent);
        return Alert.alert("Success", "Transaction Completed Successfully");
      }
    } catch (e) {
      return Alert.alert("Internal Server Error", "Please Try Again");
    } finally {
      // setcardDisable((p) => false);
      setissubmitting((p) => false);
    }
  };
  const AmountChange = useCallback((t) => {
    setfeeAmount(t);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "white",
        padding: 5,
      }}
    >
      {/* <Modal visible={true} animationType={"fade"} transparent> */}
      <Text
        style={{
          marginVertical: 10,
          alignSelf: "center",
          fontSize: 20,
          fontWeight: "600",
        }}
      >
        Enter Payment Information
      </Text>
      <CardField
        postalCodeEnabled={false}
        onCardChange={(details) => {
          setcardDetails((p) => details);
        }}
        style={[
          {
            flex: 0.2,
            width: "90%"
          },
          Platform.OS === "ios"
            ? { backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 5 }
            : {},
        ]}
        placeholders={{ number: "4242 4242 4242 4242" }}
      />

      {/* </Modal> */}
      {/* <TouchableOpacity onPress={buyWithCardHandler} style={styles.btnCon}>
        <Text>Pay Now</Text>
      </TouchableOpacity> */}
      <TextInput
        placeholder="Enter Amount in Euros"
        value={feeAmount}
        onChangeText={AmountChange}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          borderRadius: 3,
          marginVertical: 10,
          fontSize: 20,
        }}
      />
      <Button
        title="Pay Now"
        disabled={issubmitting || loading}
        onPress={buyWithCardHandler}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  btnCon: {
    height: 45,
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    backgroundColor: "orange",
  },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTxt: {
    color: "#fff",
    fontSize: 18,
  },
  webViewCon: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wbHead: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    zIndex: 25,
    elevation: 2,
  },
});
export default Payment;
