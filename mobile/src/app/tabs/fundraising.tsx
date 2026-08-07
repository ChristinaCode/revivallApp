import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function FundraisingScreen() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Fundraising</ThemedText>

      <ThemedText>
        Track your fundraising progress here.
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