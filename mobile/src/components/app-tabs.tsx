
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

type AppTabsProps = {
  isAdmin: boolean;
};

export default function AppTabs({ isAdmin }: AppTabsProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="fundraising"
        options={{
          title: 'Fundraising',
        }}
      />

      <Tabs.Screen
        name="adminfunds"
        options={{
          title: 'Admin Funds',
          href: isAdmin ? undefined : null,
        }}
      />
    </Tabs>
  );
}
