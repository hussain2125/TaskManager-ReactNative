import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, StatusBar, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import { firebase } from "../../firebaseConfig";
import toastConfig from "../../toastconfig";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Image style={styles.image} source={require("../assets/login.png")} />
      <Text style={styles.heading}>Login</Text>
      <Text style={styles.inputTitle}>Email</Text>
      <TextInput
        placeholder="example@example.com"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, styles.inputNeobrutalism]}
      />
      <Text style={styles.inputTitle}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          style={[styles.input, styles.inputNeobrutalism, styles.passwordInput]}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.linkText}>
            <Text style={styles.noAccountText}>Don't have an account? </Text>
            <Text style={styles.signupText}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <Toast config={toastConfig}/>
    </KeyboardAvoidingView>
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
    left: 10,
  },
  heading: {
    fontSize: 38,
    fontFamily: "ProductSans-Bold",
    marginBottom: 20,
    textAlign: "left",
    bottom: 30,
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
    textAlign: "center",
    marginVertical: 5,
    fontFamily: "ProductSans",
  },
  noAccountText: {
    color: "black",
    fontFamily: "ProductSans",
  },
  signupText: {
    color: "blue",
    fontFamily: "ProductSans-Bold",
  },
  forgotPasswordText: {
    color: "black",
    fontFamily: "ProductSans-Bold",
    textAlign: "center",
    marginVertical: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 45, // Add padding to prevent overlap with eye icon
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 22,
  },
  inputTitle: {
    fontSize: 16,
    fontFamily: "ProductSans-Bold",
    marginBottom: 5,
  },
  signupContainer: {
    marginTop: 20,
  },
});

export default Login;
