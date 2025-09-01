import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ToggleSettingItem = {
  label: string;
  toggle: true;
  value: boolean;
  onToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

type ButtonSettingItem = {
  label: string;
  toggle?: false;
  onPress: () => void;
  danger?: boolean;
};

type SettingItem = ToggleSettingItem | ButtonSettingItem;

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const settingsSections: Array<{
    title: string;
    items: SettingItem[];
  }> = [
    {
      title: 'アカウント',
      items: [
        { label: 'プロフィール編集', onPress: () => {} },
        { label: 'パスワード変更', onPress: () => {} },
      ],
    },
    {
      title: '通知設定',
      items: [
        {
          label: '通知を受け取る',
          toggle: true,
          value: notifications,
          onToggle: setNotifications,
        },
      ],
    },
    {
      title: '表示設定',
      items: [
        {
          label: 'ダークモード',
          toggle: true,
          value: darkMode,
          onToggle: setDarkMode,
        },
      ],
    },
    {
      title: 'その他',
      items: [
        { label: 'ヘルプ', onPress: () => {} },
        { label: 'プライバシーポリシー', onPress: () => {} },
        { label: '利用規約', onPress: () => {} },
        { label: 'ログアウト', onPress: () => {}, danger: true },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder,
                  ]}
                  onPress={item.toggle ? undefined : item.onPress}
                  disabled={item.toggle === true}
                >
                  <Text
                    style={[
                      styles.settingLabel,
                      !item.toggle && 'danger' in item && item.danger && styles.dangerText,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#e5e7eb', true: '#E07A5F' }}
                      thumbColor="#ffffff"
                    />
                  ) : (
                    <Text style={styles.chevron}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.version}>バージョン 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    marginHorizontal: 16,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1e293b',
  },
  dangerText: {
    color: '#dc2626',
  },
  chevron: {
    fontSize: 20,
    color: '#9ca3af',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  version: {
    fontSize: 14,
    color: '#9ca3af',
  },
});