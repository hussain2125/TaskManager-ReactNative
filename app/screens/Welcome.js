// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, TextInput, StatusBar } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { firebase } from "../../firebaseConfig";

const Welcome = ({ navigation }) => {
  // State variables for user name and modal visibility
  const [name, setName] = useState("User");
  const [modalVisible, setModalVisible] = useState(false);

  // Load user name from Firebase when the component mounts
  useEffect(() => {
    const fetchName = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setName(userDoc.data().username);
        }
      }
    };
    fetchName();
  }, []);

  // Function to handle saving the user name
  const handleSaveName = async () => {
    if (name.trim() !== "") {
      const user = firebase.auth().currentUser;
      if (user) {
        await firebase.firestore().collection('users').doc(user.uid).update({ username: name });
        setModalVisible(false);
      }
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header with logout and settings icons */}
      <View style={styles.header}>
        <Ionicons
          name="log-out-outline"
          size={30}
          color="#000"
          onPress={handleLogout}
          style={styles.logoutIcon}
        />
        <Ionicons
          name="settings-outline"
          size={30}
          color="#000" // Ensure the icon color is visible
          onPress={() => setModalVisible(true)}
        />
      </View>
      <View style={styles.container}>
        
        {/* Welcome image */}
        <Image style={styles.image} source={require("../assets/welcome.png")} />
        <View style={styles.subContainer}>
          <Text style={styles.welcomeText}>Welcome to the</Text>
          <Text style={styles.taskManagerText}>Task Manager</Text>
        </View>
        
        {/* Navigate to Tasks screen */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Tasks", { name });
          }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Tasks</Text>
        </TouchableOpacity>
      </View>
      
      {/* Modal for editing user name */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Name</Text>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            maxLength={15}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleSaveName}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  logoutIcon: {
    marginRight: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "contain",
  },
  subContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  welcomeText: {
    fontSize: 25,
    fontFamily: 'ProductSans-Bold',
    color: "#000",
    textAlign: "center",
  },
  taskManagerText: {
    fontSize: 32,
    fontFamily: 'ProductSans-Bold',
    color: "#000",
    textAlign: "center",
  },
  btn: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 5,
    marginTop: 20,
  },
  btnText: {
    fontSize: 18,
    fontFamily: 'ProductSans-Bold',
    color: "#fff",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontFamily: 'ProductSans-Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
    fontFamily: 'ProductSans',
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 5,
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: 'ProductSans-Bold',
  },
});

export default Welcome;
