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
import { Theme } from "@/constants/Theme";

// ── Separated sub-components (better re-render isolation) ──────────────────
import AuthHeader from "@/components/auth/AuthHeader";
import AuthInput from "@/components/auth/AuthInput";
import { AuthCheckbox, AuthDivider } from "@/components/auth/AuthUtils";
import { AuthPrimaryButton, AuthSocialButton } from "@/components/auth/AuthButtons";

function GoogleIcon() {
  return <AntDesign name="google" size={18} color={Theme.text} />;
}

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, startGoogleLogin } = useAuth();
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

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await startGoogleLogin();
    } catch (error: any) {
      setDialog({
        open: true,
        title: "Google Sign In Failed",
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
              {/* Forgot password */}
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
              label={loading ? "Connecting..." : "Continue with Google"}
              icon={<GoogleIcon />}
              onPress={handleGoogleSignIn}
              disabled={loading}
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
    backgroundColor: Theme.background,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 40,
  },
  // Card
  card: {
    backgroundColor: Theme.surface,
    borderRadius: 8, // Crisp minimalist corners
    borderWidth: 1,
    borderColor: Theme.border,
    padding: 24,
    gap: 16,
  },
  passwordGroup: { gap: 6 },
  forgotLink: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: Theme.textMuted,
    textAlign: "right",
  },
  rememberRow: {
    paddingHorizontal: 2,
  },
  rememberLabel: {
    fontFamily: "Manrope_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: Theme.textMuted,
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
    color: Theme.textMuted,
  },
  footerLink: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: Theme.text,
  },
  copyright: {
    fontFamily: "Manrope_500Medium",
    fontSize: 10,
    letterSpacing: 1.5,
    color: Theme.textMuted,
    textAlign: "center",
    marginTop: 32,
    opacity: 0.5,
    textTransform: "uppercase",
  },
});
