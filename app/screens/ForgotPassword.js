import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import { firebase } from "../../firebaseConfig";
import toastConfig from "../../toastconfig";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset email sent!',
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigation.navigate("Login");
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Image style={styles.image} source={require("../assets/forgot.png")} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.heading}>Forgot Password</Text>
      <Text style={styles.inputTitle}>Email</Text>
      <TextInput
        placeholder="example@example.com"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, styles.inputNeobrutalism]}
      />
      <TouchableOpacity onPress={handleForgotPassword} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
      <Toast config={toastConfig}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#f2f2f2",
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  heading: {
    fontSize: 32,
    fontFamily: "ProductSans-Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputTitle: {
    fontSize: 16,
    fontFamily: "ProductSans-Bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontFamily: "ProductSans",
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 12,
  },
  inputNeobrutalism: {
    borderBottomWidth: 5, // Bolder bottom border for neobrutalism effect
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "ProductSans-Bold",
  },
  linkText: {
    color: "black",
    textAlign: "center",
    marginVertical: 5,
    fontFamily: "ProductSans-Bold",
  },
});

export default ForgotPassword;
