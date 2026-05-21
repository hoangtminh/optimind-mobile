import { PremiumAlertDialog } from "@/components/common/PremiumAlertDialog";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";
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
import { useAuth } from "../../hooks/useAuth";

// ── Separated sub-components (better re-render isolation) ──────────────────
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import { AuthCheckbox, AuthDivider } from "@/components/auth/AuthUtils";
import { AuthPrimaryButton, AuthSocialButton } from "@/components/auth/AuthButtons";

// ─── Design tokens (StudyFlow / Focused Academic System) ──────────────────────
const T = {
  surface: "#fdf7ff",
  surfaceContainerLow: "#f8f2fa",
  surfaceContainerHighest: "#e6e0e9",
  primary: "#4f378a",
  onSurface: "#1d1b20",
  onSurfaceVariant: "#494551",
  outline: "#7a7582",
  outlineVariant: "#cbc4d2",
} as const;

// Google icon (inline SVG path rendered via AntDesign fallback)
function GoogleIcon() {
  return <AntDesign name="google" size={18} color="#1d1b20" />;
}

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
      router.replace("/(main)/(tabs)/study");
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ────────────────────────────────────────────────────── */}
          <AuthHeader
            title="Welcome back"
            subtitle="Sign in to continue to Optimind"
          />

          {/* ── Form card ────────────────────────────────────────────────── */}
          <View style={styles.card}>
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

            {/* Password */}
            <View style={styles.passwordGroup}>
              <AuthInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                textContentType="password"
              />
              {/* Forgot password — positioned below input label row */}
              <Link screen="forgot-password" params={{}}>
                <Text style={styles.forgotLink}>Forgot password?</Text>
              </Link>
            </View>

            {/* Remember me */}
            <View style={styles.rememberRow}>
              <AuthCheckbox
                checked={remember}
                onToggle={() => setRemember((v) => !v)}
              >
                <Text style={styles.rememberLabel}>Remember me</Text>
              </AuthCheckbox>
            </View>

            {/* CTA */}
            <View style={styles.cta}>
              <AuthPrimaryButton
                label="Sign In"
                loading={loading}
                onPress={handleSignIn}
              />
            </View>

            {/* Divider */}
            <AuthDivider />

            {/* Social */}
            <AuthSocialButton
              label="Continue with Google"
              icon={<GoogleIcon />}
            />
          </View>

          {/* ── Footer link ──────────────────────────────────────────────── */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-up")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Copyright */}
          <Text style={styles.copyright}>Optimind © 2026</Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <PremiumAlertDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        title={dialog.title}
        description={dialog.description}
        type={dialog.type}
      />
    </SafeAreaView>
  );
}

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
    paddingBottom: 40,
  },
  // Form card — surface-container-low tonal lift
  card: {
    backgroundColor: T.surfaceContainerLow,
    borderRadius: 20,
    padding: 24,
    // Ambient shadow
    shadowColor: "#1d1b20",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    gap: 16,
  },
  passwordGroup: { gap: 6 },
  forgotLink: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    letterSpacing: 0.1,
    color: T.primary,
    textAlign: "right",
  },
  rememberRow: {
    paddingHorizontal: 2,
  },
  rememberLabel: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: T.onSurfaceVariant,
  },
  cta: { marginTop: 4 },
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
  copyright: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10,
    letterSpacing: 1.5,
    color: T.outline,
    textAlign: "center",
    marginTop: 32,
    opacity: 0.5,
    textTransform: "uppercase",
  },
});
