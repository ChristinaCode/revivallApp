import { View, Text, StyleSheet } from "react-native";

export default function Fundraising() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fundraising</Text>

      <Text>Recent Donations</Text>

      <Text>• Grandma - $100</Text>

      <Text>• Lawrence Church - $500</Text>

      <Text>• Bake Sale - $1,025</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#f4f6fb",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 25,
  },
});