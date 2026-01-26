import React, { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function CheckinScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [party, setParty] = useState("");
  const [order, setOrder] = useState("");
  const [customers, setCustomers] = useState<
    Array<{
      id: number;
      name: string;
      phone: string;
      party: string;
      order: string;
      time: string;
    }>
  >([]);

  const handleCheckin = () => {
    if (!name.trim() || !phone.trim() || !party.trim()) {
      Alert.alert("Error", "Please fill required fields");
      return;
    }

    setCustomers([
      {
        id: Date.now(),
        name,
        phone,
        party,
        order: order || "No order",
        time: new Date().toLocaleTimeString(),
      },
      ...customers,
    ]);
    Alert.alert("Success", `${name} checked in!`);
    setName("");
    setPhone("");
    setParty("");
    setOrder("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>☕ CafeQueue</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsBox}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{customers.length}</Text>
            <Text style={styles.statLabel}>In Queue</Text>
          </View>
          <View style={styles.dividerV} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {customers.length > 0 ? `~${customers.length * 3}min` : "-"}
            </Text>
            <Text style={styles.statLabel}>Est. Wait</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Check In Customer</Text>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Text style={styles.label}>Party Size *</Text>
          <TextInput
            style={styles.input}
            placeholder="Number"
            keyboardType="number-pad"
            value={party}
            onChangeText={setParty}
          />
          <Text style={styles.label}>Order (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Order details"
            multiline
            numberOfLines={3}
            value={order}
            onChangeText={setOrder}
          />
          <Pressable style={styles.button} onPress={handleCheckin}>
            <Text style={styles.buttonText}>Check In</Text>
          </Pressable>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.cardTitle}>Customers ({customers.length})</Text>
          {customers.length === 0 ? (
            <Text style={styles.empty}>No customers yet</Text>
          ) : (
            customers.map((c, i) => (
              <View key={c.id} style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.position}>#{i + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{c.name}</Text>
                    <Text style={styles.meta}>{c.phone}</Text>
                  </View>
                  <Text style={styles.time}>{c.time}</Text>
                </View>
                <View style={styles.divider} />
                <Text style={styles.detail}>
                  Party: <Text style={styles.bold}>{c.party}</Text>
                </Text>
                <Text style={styles.detail}>
                  Order: <Text style={styles.bold}>{c.order}</Text>
                </Text>
                <Pressable
                  style={styles.removeBtn}
                  onPress={() =>
                    setCustomers(customers.filter((x) => x.id !== c.id))
                  }
                >
                  <Text style={styles.removeBtnText}>Remove</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#0a7ea4",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  content: { flex: 1, paddingHorizontal: 20, paddingVertical: 10 },
  statsBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "bold", color: "#0a7ea4" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  dividerV: { width: 1, backgroundColor: "#ddd" },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 4,
  },
  textarea: { minHeight: 80, textAlignVertical: "top" },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  listCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    elevation: 3,
  },
  empty: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingVertical: 30,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0a7ea4",
    padding: 12,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  position: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0a7ea4",
    marginRight: 10,
  },
  name: { fontSize: 14, fontWeight: "600", color: "#000" },
  meta: { fontSize: 12, color: "#666", marginTop: 2 },
  time: { fontSize: 12, color: "#999" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 10 },
  detail: { fontSize: 13, color: "#666", marginBottom: 4 },
  bold: { fontWeight: "600", color: "#000" },
  removeBtn: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  removeBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
