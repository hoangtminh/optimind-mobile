import Constants from "expo-constants";

export const getServerIp = () => {
	// debuggerHost sẽ có dạng "192.168.1.9:8081"
	const debuggerHost = Constants.expoConfig?.hostUri;
	if (debuggerHost) {
		return debuggerHost.split(":")[0]; // Lấy phần "192.168.1.9"
	}
	return "localhost"; // Fallback cho môi trường web
};
