import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Moon, SunMedium } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { api } from '../api/apiClient';
import { borderRadius, typography } from '../theme/typography';
import { LoginCredentials, RegisterCredentials } from '../types/auth.types';
import { authApi } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const { mode, colors, toggleTheme } = useTheme();
  const { setUserData } = useContext(AuthContext)!;

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async () => {
    setError(null);
    if (isRegisterMode) {
      if (!name.trim()) return;
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    } else {
      await login({
        email: email.trim(),
        password,
      });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      if (response.token && response.user) {
        api.defaults.headers.common.Authorization = `Bearer ${response.token}`;
        setUserData(response.user, response.token);
        setIsLoading(false);
        return true;
      }
      throw new Error(response.message || 'Login failed');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(credentials);
      if (response.token && response.user) {
        api.defaults.headers.common.Authorization = `Bearer ${response.token}`;
        setUserData(response.user, response.token);

        setIsLoading(false);
        return true;
      }
      throw new Error(response.message || 'Registration failed');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      setIsLoading(false);
      return false;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top bar with theme toggle */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeButton, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            {mode === 'dark' ? (
              <SunMedium size={18} color="#F59E0B" />
            ) : (
              <Moon size={18} color="#6366F1" />
            )}
          </TouchableOpacity>
        </View>

        {/* Hero Branding */}
        <View style={styles.heroSection}>
          <Image
            source={require('../assets/taskflow-splash.png')}
            style={styles.logo}
          />
          <Text style={[styles.appTagline, typography.body, { color: colors.textSecondary }]}>
            Plan. Prioritize. Get Things Done.
          </Text>
        </View>

        {/* Auth Form Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Mode Tabs */}
          <View style={[styles.tabBar, { backgroundColor: colors.surfaceLight }]}>
            <TouchableOpacity
              onPress={() => {
                setIsRegisterMode(false);
                setError(null);
              }}
              style={[
                styles.tab,
                !isRegisterMode && { backgroundColor: colors.primary },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  typography.caption,
                  {
                    color: !isRegisterMode ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: !isRegisterMode ? '700' : '500',
                  },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsRegisterMode(true);
                setError(null);
              }}
              style={[
                styles.tab,
                isRegisterMode && { backgroundColor: colors.primary },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  typography.caption,
                  {
                    color: isRegisterMode ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isRegisterMode ? '700' : '500',
                  },
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          {isRegisterMode && (
            <Input
              label="Full Name"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}

          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          {error && (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: `${colors.error}15`, borderColor: colors.error },
              ]}
            >
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            </View>
          )}

          <Button
            title={isRegisterMode ? 'Sign Up' : 'Sign In'}
            onPress={handleSubmit}
            loading={isLoading}
            size="lg"
            style={{ marginTop: 8 }}
          />

          {/* Demo account hint */}
          <View style={styles.demoSection}>
            <Text style={[styles.demoHint, { color: colors.textMuted }]}>
              {isRegisterMode
                ? 'Already registered? Switch to Sign In tab above.'
                : 'Need an account? Register with any email & password.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    marginBottom: 20,
  },
  themeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  appTagline: {
    textAlign: 'center',
    maxWidth: 280,
    fontSize: 13,
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabText: {
    fontSize: 13,
  },
  errorBox: {
    borderWidth: 1,
    padding: 10,
    borderRadius: borderRadius.sm,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  demoSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  demoHint: {
    fontSize: 12,
    textAlign: 'center',
  },
  configToggle: {
    marginTop: 20,
    alignItems: 'center',
  },
  configToggleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  configBox: {
    marginTop: 12,
    padding: 16,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  configHelp: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
});
