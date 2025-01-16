// Import necessary modules and components
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CalenderView = () => {
  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Display a "Coming Soon" message */}
        <Text style={styles.message}>Coming Soon</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default CalenderView;
