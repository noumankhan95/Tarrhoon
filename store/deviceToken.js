import { createContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
export const TokenContext = createContext({
  DeviceToken: "",
  setToken: () => {},
  navigateChat: () => {},
});

const TokenContextProvider = (props) => {
  const [token, choosetoken] = useState();
  const { navigate } = useNavigation();
  const setToken = () => {
    choosetoken((p) => p);
  };
  const navigateChat = () => {
    navigate("ChatScreen");
  };
  const tokenctx = { token, setToken, navigateChat };
  return (
    <TokenContext.Provider value={tokenctx}>
      {props.children}
    </TokenContext.Provider>
  );
};

export default TokenContextProvider;
