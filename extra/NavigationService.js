import { CommonActions, StackActions } from "@react-navigation/native";

let navigator;

export function setNavigator(ref) {
  navigator = ref;
}

export function navigate(routeName, params) {
  navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params: params,
    })
  );
}

export function reset(routeName, params) {
  const resetAction = CommonActions.reset({
    index: 0,
  });
  navigator.dispatch(resetAction);
}
