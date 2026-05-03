import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	Dimensions,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Checkbox } from "tamagui";
import { useAuth } from "../../hooks/useAuth";

const { width } = Dimensions.get("window");

export default function SignInScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);
	const { signIn } = useAuth();
	const router = useRouter();

	const [dialog, setDialog] = useState({
		open: false,
		title: "",
		description: "",
		type: "error" as const,
	});

	const handleSignIn = async () => {
		try {
			setLoading(true);
			await signIn(email, password, remember);
			router.replace("/(main)/(tabs)/home");
		} catch (error: any) {
			setDialog({
				open: true,
				title: "Sign In Failed",
				description: error.message,
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<View className="flex-1 bg-[#f8f9fb]">
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
					padding: 20,
				}}
			>
				{/* Branding Header (Mobile optimized) */}
				<View className="items-center mb-8 flex-row justify-center gap-2">
					<Text className="text-xl font-extrabold tracking-tighter text-[#0058be]">
						Optimind App
					</Text>
				</View>

				<View className="w-full max-w-[1100px] self-center bg-white rounded-[32px] overflow-hidden shadow-sm border border-[#c2c6d6]/20">
					<View className="flex-row">
						{/* Left Side: Branding/Visual (Hidden on small screens like the HTML) */}
						{width > 768 && (
							<View className="flex-1 bg-[#f3f4f6] p-12 justify-between">
								<View>
									<Text className="text-4xl font-extrabold tracking-tighter text-[#0058be] leading-tight mb-4">
										Focus on your{"\n"}academic growth.
									</Text>
									<Text className="text-[#424754] text-lg max-w-xs leading-relaxed">
										Join a sanctuary designed for focused
										research, quiet study, and elite
										collaboration.
									</Text>
								</View>

								{/* Resource Card */}
								<View className="bg-white/60 p-6 rounded-2xl border border-white/40">
									<View className="flex-row items-center gap-4 mb-3">
										<View className="w-10 h-10 rounded-full bg-[#6cf8bb] items-center justify-center">
											<Text style={{ color: "#00714d" }}>
												verified
											</Text>
										</View>
										<View>
											<Text className="text-sm font-bold text-[#191c1e]">
												Curated Resources
											</Text>
											<Text className="text-xs text-[#424754]">
												Access 2M+ peer-reviewed
												journals
											</Text>
										</View>
									</View>
									<View className="w-full bg-[#e1e2e4] h-2 rounded-full overflow-hidden">
										<View className="bg-[#006c49] h-full w-3/4" />
									</View>
								</View>
							</View>
						)}

						{/* Right Side: Form Section */}
						<View
							className={`flex-1 p-8 ${width > 768 ? "md:p-16" : "p-8"}`}
						>
							<View className="mb-10">
								<Text className="text-2xl font-bold text-[#191c1e] mb-2">
									Welcome Back
								</Text>
								<Text className="text-[#424754]">
									Continue your journey in the sanctuary.
								</Text>
							</View>

							<View className="space-y-4">
								{/* Email */}
								<View>
									<Text className="text-sm font-medium text-[#424754] ml-1 mb-2">
										Email Address
									</Text>
									<TextInput
										className="w-full px-4 py-4 bg-[#e7e8ea] rounded-xl text-[#191c1e]"
										placeholder="name@university.edu"
										placeholderTextColor="#727785"
										value={email}
										onChangeText={setEmail}
										autoCapitalize="none"
										keyboardType="email-address"
									/>
								</View>

								{/* Password */}
								<View>
									<View className="flex-row justify-between items-center px-1 mb-2">
										<Text className="text-sm font-medium text-[#424754]">
											Password
										</Text>
										<Link
											screen={"forgot-password"}
											params={{}}
										>
											<Text className="text-xs font-semibold text-[#0058be]">
												Forgot Password?
											</Text>
										</Link>
									</View>
									<TextInput
										className="w-full px-4 py-4 bg-[#e7e8ea] rounded-xl text-[#191c1e]"
										placeholder="••••••••"
										placeholderTextColor="#727785"
										value={password}
										onChangeText={setPassword}
										secureTextEntry
									/>
								</View>
								{/* Remember me */}
								<View>
									<Text className="text-sm font-medium text-[#424754] ml-1 mb-2">
										Remember for later sign-in
									</Text>
									<Checkbox />
								</View>

								{/* Sign In Button */}
								<TouchableOpacity
									className="w-full py-4 bg-[#0058be] items-center justify-center rounded-xl shadow-lg shadow-blue-900/20 mt-4"
									onPress={handleSignIn}
									disabled={loading}
								>
									{loading ? (
										<ActivityIndicator color="#fff" />
									) : (
										<Text className="text-white font-bold text-lg">
											Sign In
										</Text>
									)}
								</TouchableOpacity>
							</View>

							{/* Divider */}
							<View className="relative my-8 items-center justify-center">
								<View className="absolute w-full border-t border-[#c2c6d6]/30" />
								<Text className="bg-white px-4 text-[#727785] text-xs font-medium tracking-widest uppercase">
									Or continue with
								</Text>
							</View>

							{/* Social Buttons */}
							<View className="flex-row ">
								<TouchableOpacity
									style={{
										flex: 1,
										flexDirection: "row",
										height: 50,
										borderWidth: 1,
										borderColor: "#c2c6d6",
										borderRadius: 16,
										justifyContent: "center",
										alignItems: "center",
										backgroundColor: "#fff",
									}}
								>
									<AntDesign
										name="google"
										size={18}
										color="#191c1e"
									/>
									<Text
										style={{
											marginLeft: 8,
											fontSize: 14,
											fontWeight: "600",
											color: "#191c1e",
										}}
									>
										Google
									</Text>
								</TouchableOpacity>
							</View>

							<View className="flex flex-row justify-center mt-16">
								<Text className="text-neural-600 text-base">
									Don't have an account?
								</Text>
								<TouchableOpacity
									onPress={() =>
										router.replace("/(auth)/sign-up")
									}
								>
									<Text className="text-blue-700 font-bold text-base">
										{" "}
										Sign Up
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>

				<View className="mt-8 items-center opacity-40">
					<Text className="text-[10px] text-[#727785] font-medium tracking-widest uppercase">
						Optimind © 2026
					</Text>
				</View>
			</ScrollView>

			<PremiumAlertDialog
				open={dialog.open}
				onOpenChange={(open) =>
					setDialog((prev) => ({ ...prev, open }))
				}
				title={dialog.title}
				description={dialog.description}
				type={dialog.type}
			/>
		</View>
	);
}
