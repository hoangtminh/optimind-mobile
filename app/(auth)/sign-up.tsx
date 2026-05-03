import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import { useAuth } from "@/hooks/useAuth"; // Hook của bạn
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"; // Sử dụng expo icons
import { LinearGradient } from "expo-linear-gradient"; // Đổi sang expo-linear-gradient cho đồng bộ
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpScreen = () => {
	const router = useRouter();
	const { signUp } = useAuth(); // Lấy hàm signUp từ context

	// States cho Form
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agree, setAgree] = useState(false);
	const [loading, setLoading] = useState(false);
	const [dialog, setDialog] = useState({
		open: false,
		title: "",
		description: "",
		type: "error",
		onConfirm: () => {},
	});

	const handleSignUp = async () => {
		if (!agree) {
			setDialog({
				open: true,
				title: "Error",
				description: "Please agree to the terms and conditions",
				type: "error",
				onConfirm: () => {},
			});
			return;
		}
		if (password !== confirmPassword) {
			setDialog({
				open: true,
				title: "Error",
				description: "Passwords do not match",
				type: "error",
				onConfirm: () => {},
			});
			return;
		}

		setLoading(true);
		try {
			await signUp(username, email, password);
			setDialog({
				open: true,
				title: "Success",
				description: "Account created! Please sign in.",
				type: "success",
				onConfirm: () => router.push("/(auth)/sign-in"),
			});
		} catch (error: any) {
			setDialog({
				open: true,
				title: "Sign Up Failed",
				description: error.message,
				type: "error",
				onConfirm: () => {},
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.headerSection}>
						<Text style={styles.title}>Create Your Profile</Text>
					</View>

					<View style={styles.form}>
						{/* Username */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>USERNAME</Text>
							<View style={styles.inputWrapper}>
								<MaterialCommunityIcons
									name="account-circle-outline"
									size={20}
									color="#727785"
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="julianto"
									value={username}
									onChangeText={setUsername}
									placeholderTextColor="#727785"
								/>
							</View>
						</View>

						{/* Email */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>EMAIL ADDRESS</Text>
							<View style={styles.inputWrapper}>
								<MaterialCommunityIcons
									name="email-outline"
									size={20}
									color="#727785"
									style={styles.inputIcon}
								/>
								<TextInput
									style={styles.input}
									placeholder="julian@sanctuary.edu"
									keyboardType="email-address"
									value={email}
									onChangeText={setEmail}
									placeholderTextColor="#727785"
									autoCapitalize="none"
								/>
							</View>
						</View>

						{/* Passwords */}
						<View style={styles.row}>
							<View
								style={[
									styles.inputGroup,
									{ flex: 1, marginRight: 8 },
								]}
							>
								<Text style={styles.label}>PASSWORD</Text>
								<View style={styles.inputWrapper}>
									<MaterialCommunityIcons
										name="lock-outline"
										size={20}
										color="#727785"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="••••••••"
										secureTextEntry
										value={password}
										onChangeText={setPassword}
									/>
								</View>
							</View>
							<View
								style={[
									styles.inputGroup,
									{ flex: 1, marginLeft: 8 },
								]}
							>
								<Text style={styles.label}>CONFIRM</Text>
								<View style={styles.inputWrapper}>
									<MaterialCommunityIcons
										name="shield-check-outline"
										size={20}
										color="#727785"
										style={styles.inputIcon}
									/>
									<TextInput
										style={styles.input}
										placeholder="••••••••"
										secureTextEntry
										value={confirmPassword}
										onChangeText={setConfirmPassword}
									/>
								</View>
							</View>
						</View>

						{/* Terms */}
						<TouchableOpacity
							style={styles.termsRow}
							onPress={() => setAgree(!agree)}
							activeOpacity={0.7}
						>
							<View
								style={[
									styles.checkbox,
									agree && styles.checkboxChecked,
								]}
							>
								{agree && (
									<MaterialCommunityIcons
										name="check"
										size={14}
										color="#fff"
									/>
								)}
							</View>
							<Text style={styles.termsText}>
								I agree to the{" "}
								<Text style={styles.linkText}>
									Terms of Service
								</Text>{" "}
								and{" "}
								<Text style={styles.linkText}>
									Privacy Policy
								</Text>
								.
							</Text>
						</TouchableOpacity>

						{/* Submit */}
						<TouchableOpacity
							disabled={loading}
							onPress={handleSignUp}
							activeOpacity={0.8}
							style={styles.submitBtnContainer}
						>
							<LinearGradient
								colors={["#0058be", "#2170e4"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={styles.submitBtn}
							>
								{loading ? (
									<ActivityIndicator color="#fff" />
								) : (
									<>
										<Text style={styles.submitBtnText}>
											Create Account
										</Text>
										<MaterialCommunityIcons
											name="arrow-right"
											size={20}
											color="#fff"
										/>
									</>
								)}
							</LinearGradient>
						</TouchableOpacity>

						<View style={styles.dividerContainer}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>
								OR SIGN UP WITH
							</Text>
							<View style={styles.dividerLine} />
						</View>

						<View style={styles.row}>
							<TouchableOpacity style={styles.socialBtn}>
								<AntDesign
									name="google"
									size={18}
									color="#191c1e"
								/>
								<Text style={styles.socialBtnText}>Google</Text>
							</TouchableOpacity>
						</View>

						<View style={styles.footer}>
							<Text style={styles.footerText}>
								Already have an account?
							</Text>
							<TouchableOpacity
								onPress={() =>
									router.replace("/(auth)/sign-in")
								}
							>
								<Text style={styles.footerLink}> Sign In</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<PremiumAlertDialog
				open={dialog.open}
				onOpenChange={(open) =>
					setDialog((prev) => ({ ...prev, open }))
				}
				title={dialog.title}
				description={dialog.description}
				type={dialog.type as any}
				onConfirm={dialog.onConfirm}
			/>
		</SafeAreaView>
	);
};

// ... Styles giữ nguyên như cũ ...
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#f8f9fb" },
	scrollContent: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
	headerSection: { marginBottom: 32 },
	title: {
		fontSize: 28,
		fontWeight: "800",
		color: "#191c1e",
		letterSpacing: -0.5,
	},
	subtitle: { fontSize: 15, color: "#424754", marginTop: 8 },
	form: {
		backgroundColor: "#ffffff",
		borderRadius: 32,
		padding: 24,
		elevation: 5,
		shadowColor: "#005ac2",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.05,
		shadowRadius: 20,
	},
	inputGroup: { marginBottom: 20 },
	label: {
		fontSize: 10,
		fontWeight: "700",
		color: "#727785",
		letterSpacing: 1.5,
		marginBottom: 8,
		marginLeft: 4,
	},
	inputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f3f4f6",
		borderRadius: 16,
		paddingHorizontal: 16,
		height: 56,
	},
	inputIcon: { marginRight: 12 },
	input: { flex: 1, color: "#191c1e", fontSize: 15 },
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	termsRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 24,
		paddingHorizontal: 4,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 6,
		backgroundColor: "#f3f4f6",
		marginRight: 12,
		marginTop: 2,
		justifyContent: "center",
		alignItems: "center",
	},
	checkboxChecked: { backgroundColor: "#0058be" },
	termsText: { fontSize: 13, color: "#424754", flex: 1, lineHeight: 18 },
	linkText: { color: "#0058be", fontWeight: "600" },
	submitBtnContainer: { marginBottom: 24 },
	submitBtn: {
		height: 56,
		borderRadius: 16,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	submitBtnText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "700",
		marginRight: 8,
	},
	dividerContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	dividerLine: { flex: 1, height: 1, backgroundColor: "#e1e2e4" },
	dividerText: {
		fontSize: 10,
		fontWeight: "800",
		color: "#727785",
		paddingHorizontal: 12,
	},
	socialBtn: {
		flex: 1,
		flexDirection: "row",
		height: 50,
		borderWidth: 1,
		borderColor: "#c2c6d6",
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	socialBtnText: {
		marginLeft: 8,
		fontSize: 14,
		fontWeight: "600",
		color: "#191c1e",
	},
	footer: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
	footerText: { color: "#424754", fontSize: 14 },
	footerLink: { color: "#0058be", fontWeight: "700", fontSize: 14 },
});

export default SignUpScreen;
