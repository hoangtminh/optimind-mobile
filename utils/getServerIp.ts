import Constants from "expo-constants";
import { Platform } from "react-native";

export const getServerIp = () => {
  // debuggerHost sẽ có dạng "192.168.1.9:8081"
  const debuggerHost = Constants.expoConfig?.hostUri;
  console.log("Host: ", debuggerHost);
  if (debuggerHost) {
    return debuggerHost.split(":")[0]; // Lấy phần "192.168.1.9"
  }
  return Platform.OS === "android" ? "10.0.2.2" : "localhost"; // Fallback cho Android Emulator
};
