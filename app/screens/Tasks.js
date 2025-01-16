// Import necessary modules and core components
import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar, ScrollView, Pressable, Alert, } from "react-native";

// Import TasksContext from context folder
import { TasksContext } from "../context/TasksContext";

// External Libraries that are used in this file:
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tasks component to display and manage tasks
const Tasks = ({ navigation, route }) => {
  
  // Get tasks and setTasks function from context
  const { tasks, setTasks } = useContext(TasksContext);
  
  // State variable for task filter
  const [filter, setFilter] = useState("all");
  
  // Get user name from route parameters or default to "User"
  const name = route.params?.name || "User";

  // Load tasks from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    };
    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever tasks state changes
  useEffect(() => {
    const saveTasks = async () => {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    };
    saveTasks();
  }, [tasks]);

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
  const handleDeleteTask = (task) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTasks((prevTasks) => prevTasks.filter((t) => t !== task));
          },
        },
      ],
      { cancelable: true }
    );
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
        onPress={() => handleDeleteTask(item)}
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
        <Text style={styles.greeting}>Hi, {name} 👋</Text>
        
        {/* Add Task button */}
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
      </View>
      
      {/* Filter buttons, horizontal (left-right) scrolling */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
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
      
      {/* Display tasks or a message if no tasks else show list item in using flatlist */}
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
  );
};

const styles = StyleSheet.create({
  safeArea: {
    padding: 20,
    // Ensure the container takes up the full height
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontFamily: "ProductSans-Bold",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  filterContent: {
    paddingBottom: 10, // Adjust padding to fix position and size
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
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
    paddingBottom: 100, // Adjusted to make space for the fixed Add Task button
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
});

export default Tasks;
