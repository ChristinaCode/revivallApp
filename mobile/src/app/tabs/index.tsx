import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Welcome!</ThemedText>

      <ThemedText>
        Welcome to the RevivALL fundraising app.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});