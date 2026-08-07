import { View, Text, StyleSheet } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MissionPrep</Text>

      <Text style={styles.subtitle}>
        Welcome, Christina!
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fundraising</Text>
        <Text>$8,450 / $13,000</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budget</Text>
        <Text>$2,350 Remaining</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming</Text>
        <Text>✔ Send Thank You Cards</Text>
        <Text>✔ Update Budget</Text>
      </View>
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
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 20,
    marginBottom: 30,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
});