import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Moon, SunMedium, LogOut } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

interface HeaderProps {
  subtitle?: string;
  showThemeToggle?: boolean;
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  subtitle,
  showThemeToggle = true,
  showLogout = true,
}) => {
  const { mode, colors, toggleTheme } = useTheme();
  const { user, logout } = useContext(AuthContext)!;

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.titleContainer}>
        <View style={styles.brandRow}>
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
            TaskFlow
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle || (user ? `Hello, ${user.name}` : 'Organize your productivity')}
        </Text>
      </View>

      <View style={styles.actions}>
        {showThemeToggle && (
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: colors.surfaceLight }]}
            activeOpacity={0.7}
          >
            {mode === 'dark' ? (
              <SunMedium size={18} color="#F59E0B" />
            ) : (
              <Moon size={18} color="#6366F1" />
            )}
          </TouchableOpacity>
        )}

        {showLogout && user && (
          <TouchableOpacity
            onPress={logout}
            style={[styles.iconButton, { backgroundColor: colors.surfaceLight, marginLeft: 8 }]}
            activeOpacity={0.7}
          >
            <LogOut size={18} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
