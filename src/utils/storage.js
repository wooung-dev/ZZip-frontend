import * as SecureStore from "expo-secure-store";

export const storageKeys = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
};

export const saveToStorage = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
};

export const getFromStorage = async (key) => {
  let result = await SecureStore.getItemAsync(key);
  // if (result) {
  //   console.log("🔐 Here's your value 🔐 \n" + result);
  // } else {
  //   alert("No values stored under that key.");
  // }

  return result;
};

export const deleteFromStorage = async (key) => {
  await SecureStore.deleteItemAsync(key);
};
