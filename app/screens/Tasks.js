// Import necessary modules and core components
import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar, ScrollView, Pressable, Modal } from "react-native";

// Import TasksContext from context folder
import { TasksContext } from "../context/TasksContext";

// External Libraries that are used in this file:
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "../../firebaseConfig";
import Toast from 'react-native-toast-message';

// Tasks component to display and manage tasks
const Tasks = ({ navigation, route }) => {
  
  // Get tasks and setTasks function from context
  const { tasks, setTasks } = useContext(TasksContext);
  
  // State variable for task filter
  const [filter, setFilter] = useState("all");
  
  // State variable for modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Get user name from route parameters or default to "User"
  const name = route.params?.name || "User";

  // Load tasks from Firebase when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        const tasksSnapshot = await firebase.firestore().collection('tasks').where('userId', '==', user.uid).get();
        const loadedTasks = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(loadedTasks);
      }
    };
    loadTasks();
  }, []);

  // Function to filter tasks based on selected filter
  const filterTasks = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (filter) {
      case "today":
        return tasks.filter(
          (task) => new Date(task.endDate).toDateString() === now.toDateString()
        );
      case "tomorrow":
        return tasks.filter(
          (task) =>
            new Date(task.endDate).toDateString() === tomorrow.toDateString()
        );
      case "high":
        return tasks.filter((task) => task.priority === "high");
      case "medium":
        return tasks.filter((task) => task.priority === "medium");
      case "low":
        return tasks.filter((task) => task.priority === "low");
      default:
        return tasks;
    }
  };

  // Function to handle deleting a task . ask for confirmation before deleting
  const handleDeleteTask = async () => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskToDelete.id));
    await firebase.firestore().collection('tasks').doc(taskToDelete.id).delete();
    setDeleteModalVisible(false);
    setTaskToDelete(null);
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Task deleted successfully.',
    });
  };

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  // Function to render each task item . Code for the task item is here
  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        onPress={() => navigation.navigate("TaskDetails", { task: item })}
        style={styles.taskContent}
      >
        <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <View
          style={[
            styles.priority,
            item.priority === "high" && styles.priorityHigh,
            item.priority === "medium" && styles.priorityMedium,
            item.priority === "low" && styles.priorityLow,
          ]}
        >
          <Text style={styles.priorityText}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#333" />
          <Text style={styles.dateText}>
            Due: {new Date(item.endDate).toDateString()}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setTaskToDelete(item);
          setDeleteModalVisible(true);
        }}
        style={styles.deleteIcon}
      >
        <Ionicons name="trash-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with greeting and Add Task button */}  
      <View style={styles.header}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text style={styles.greeting}>Hi, {name} 👋</Text>
        </Pressable>
        <Ionicons
          name="calendar-outline"
          size={30}
          color="#000"
          onPress={() => navigation.navigate("CalenderView")}
        />
      </View>
      
      {/* Filter buttons, horizontal (left-right) scrolling */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "all" && styles.filterButtonSelected,
            ]}
            onPress={() => setFilter("all")}
          >
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "today" && styles.filterButtonSelected,
            ]}
            onPress={() => setFilter("today")}
          >
            <Text style={styles.filterButtonText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "tomorrow" && styles.filterButtonSelected,
            ]}
            onPress={() => setFilter("tomorrow")}
          >
            <Text style={styles.filterButtonText}>Tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "high" && styles.filterButtonSelected,
            ]}
            onPress={() => setFilter("high")}
          >
            <Text style={styles.filterButtonText}>High</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "medium" && styles.filterButtonSelected,
            ]}
            onPress={() => setFilter("medium")}
          >
            <Text style={styles.filterButtonText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "low" && styles.filterButtonSelected,
            ]}
            onPress={() => setFilter("low")}
          >
            <Text style={styles.filterButtonText}>Low</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {/* Display tasks or a message if no tasks else show list item in using flatlist */}
      <View style={styles.taskcontainer}>
      {tasks.length === 0 ? (
        <View style={styles.noTasksContainer}>
          <Text style={styles.noTasksText}>No new tasks. Add a task to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={filterTasks()}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
      </View>
      <Pressable
        onPress={() => navigation.navigate("AddTask")}
        style={({ pressed }) => [
          {
            borderBottomWidth: pressed ? 1 : 4, // Change bottom border width when pressed
            borderRightWidth: pressed ? 1 : 4, // Change right border width when pressed
            backgroundColor: pressed ? "#f2f2f2" : "white", // Change background color when pressed
            transform: pressed ? [{ translateX: 3 }, { translateY: 3 }] : [], // Move button 2 pixels right and downward when pressed
          },
          styles.addButton,
        ]}
      >
        <Text style={styles.addButtonText}>Add Task</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Do you want to logout?</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => {
          setDeleteModalVisible(!deleteModalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Delete Task</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this task?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={handleDeleteTask}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
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
    alignItems: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontFamily: "ProductSans-Bold",
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterContent: {
    flexDirection: "row",
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10, // Rounded corners of filter button
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 4, // Added bottom border
  },
  filterButtonSelected: {
    backgroundColor: "#3cf4a6",
  },
  filterButtonText: {
    fontSize: 16,
    fontFamily: "ProductSans-Bold",
    lineHeight: 20, // Ensure the tails of letters are visible
  },
  listContent: {
    paddingBottom: 0, // Adjusted to make space for the fixed Add Task button and navigation button
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 5, // Bolder bottom border for neobrutalism effect
  },
  taskContent: {
    flex: 1,
    marginRight: 40, // Add margin to prevent overlap with delete icon
  },
  taskTitle: {
    fontSize: 20,
    fontFamily: "ProductSans-Bold",
    marginBottom: 10,
  },
  priority: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  priorityHigh: {
    backgroundColor: "#ffcccc",
  },
  priorityMedium: {
    backgroundColor: "#cce5ff",
  },
  priorityLow: {
    backgroundColor: "#d4edda",
  },
  priorityText: {
    fontSize: 14,
    fontFamily: "ProductSans-Bold",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "ProductSans",
    color: "#333",
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "white",
    paddingVertical: 10, // Decreased top and bottom padding
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4, // Added bottom border
    borderBottomColor: "black", // Border color
    borderColor: "black",
    borderWidth: 1,
    borderRightWidth: 4,
    borderRightColor: "black",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 5, // For Android shadow
  },
  addButtonText: {
    color: "black", // Changed text color to black
    fontSize: 18,
    fontFamily: "ProductSans-Bold",
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTasksText: {
    fontSize: 18,
    fontFamily: "ProductSans",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(87, 86, 86, 0.8)", // Low opacity white
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
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontFamily: 'ProductSans-Bold',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'ProductSans',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
    width: "45%",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: 'ProductSans-Bold',
  },
  taskcontainer:{
    flex: 1,
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
    margin: 10,       // margin of the last list container
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderRadius: 15,
  }
});

export default Tasks;
