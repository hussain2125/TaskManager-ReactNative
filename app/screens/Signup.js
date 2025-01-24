import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import { firebase } from "../../firebaseConfig";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    setLoading(true);
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await firebase.firestore().collection('users').doc(user.uid).set({ username });
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigation.navigate("Login");
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
        textStyle: { fontSize: 16 },
      });
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text === confirmPassword) {
      setPasswordsMatch(true);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text === password) {
      setPasswordsMatch(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Image style={styles.image} source={require("../assets/signup.png")} />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.heading}>Sign Up</Text>
      <Text style={styles.inputTitle}>Username</Text>
      <TextInput
        placeholder="JohnDoe"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, styles.inputNeobrutalism]}
      />
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
          onChangeText={handlePasswordChange}
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
      <Text style={styles.inputTitle}>Confirm Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="********"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          style={[
            styles.input,
            styles.inputNeobrutalism,
            styles.passwordInput,
            !passwordsMatch && styles.inputError,
          ]}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="#333" />
        </TouchableOpacity>
      </View>
      {!passwordsMatch && (
        <Text style={styles.errorText}>Passwords do not match</Text>
      )}
      <TouchableOpacity onPress={handleSignup} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? <Text style={styles.loginText}>Login</Text></Text>
      </TouchableOpacity>
      <Toast />
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
    marginBottom: 10,
  },
  heading: {
    fontSize: 32,
    fontFamily: "ProductSans-Bold",
    marginBottom: 15,
    textAlign: "center",
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
  loginText: {
    color: "blue",
    fontFamily: "ProductSans-Bold",
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
  inputTitle: {
    fontSize: 16,
    fontFamily: "ProductSans-Bold",
    marginBottom: 5,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontFamily: "ProductSans",
  },
});

export default Signup;
