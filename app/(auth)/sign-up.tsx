import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import { useAuth } from "@/hooks/useAuth";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Separated sub-components (better re-render isolation) ──────────────────
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import { AuthCheckbox, AuthDivider } from "@/components/auth/AuthUtils";
import { AuthSocialButton } from "@/components/auth/AuthButtons";

// ─── Design tokens (StudyFlow / Focused Academic System) ──────────────────────
const T = {
  surface: "#fdf7ff",
  surfaceContainerLow: "#f8f2fa",
  primary: "#4f378a",
  primaryContainer: "#6750a4",
  onPrimary: "#ffffff",
  onSurface: "#1d1b20",
  onSurfaceVariant: "#494551",
  outline: "#7a7582",
  outlineVariant: "#cbc4d2",
} as const;

function GoogleIcon() {
  return <AntDesign name="google" size={18} color="#1d1b20" />;
}

const SignUpScreen = () => {
  const router = useRouter();
  const { signUp } = useAuth();

  // Form state
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ────────────────────────────────────────────────────── */}
          <AuthHeader
            title="Create Account"
            subtitle="Join Optimind to enhance your academic focus."
          />

          {/* ── Form card ────────────────────────────────────────────────── */}
          <View style={styles.card}>
            {/* Username */}
            <AuthInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoComplete="username"
              textContentType="username"
            />

            {/* Email */}
            <AuthInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />

            {/* Passwords row */}
            <View style={styles.passwordRow}>
              <View style={styles.halfField}>
                <AuthInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="new-password"
                  textContentType="newPassword"
                />
              </View>
              <View style={styles.halfField}>
                <AuthInput
                  label="Confirm"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoComplete="new-password"
                  textContentType="newPassword"
                />
              </View>
            </View>

            {/* Terms */}
            <AuthCheckbox checked={agree} onToggle={() => setAgree((v) => !v)}>
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {" "}and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </AuthCheckbox>

            {/* CTA — gradient pill */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.85}
              style={styles.ctaWrapper}
            >
              <LinearGradient
                colors={[T.primary, T.primaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.ctaGradient, loading && styles.disabled]}
              >
                {loading ? (
                  <Text style={styles.ctaText}>Creating…</Text>
                ) : (
                  <>
                    <Text style={styles.ctaText}>Create Account</Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={18}
                      color="#fff"
                      style={styles.ctaIcon}
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <AuthDivider label="Or sign up with" />

            {/* Social */}
            <AuthSocialButton
              label="Continue with Google"
              icon={<GoogleIcon />}
            />
          </View>

          {/* ── Footer link ──────────────────────────────────────────────── */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-in")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <PremiumAlertDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        title={dialog.title}
        description={dialog.description}
        type={dialog.type as any}
        onConfirm={dialog.onConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: T.surface,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  // Card
  card: {
    backgroundColor: T.surfaceContainerLow,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#1d1b20",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    gap: 16,
  },
  passwordRow: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: { flex: 1 },
  // Terms
  termsText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: T.onSurfaceVariant,
  },
  termsLink: {
    fontFamily: "Manrope_600SemiBold",
    color: T.primary,
  },
  // Gradient CTA
  ctaWrapper: {
    marginTop: 4,
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: T.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaGradient: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.55 },
  ctaText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 14,
    letterSpacing: 0.1,
    color: T.onPrimary,
  },
  ctaIcon: { marginLeft: 8 },
  // Footer
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  footerText: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    color: T.onSurfaceVariant,
  },
  footerLink: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: T.primary,
  },
});

export default SignUpScreen;
