import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { supabase } from '@/lib/supabase';

export default function HomeScreen() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('firstName')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    setName(data.firstName);
  }

  return (
    <ThemedView style={styles.container}>
      <View>
        <ThemedText type="title">
          Welcome{name ? `, ${name}` : ''}! 👋
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Welcome to the RevivALL app.
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },

  subtitle: {
    marginTop: 8,
  },
});